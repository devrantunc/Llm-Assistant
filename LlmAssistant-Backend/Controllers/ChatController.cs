using Microsoft.AspNetCore.Mvc;
using LlmAssistantApi.Models;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace LlmAssistantApi.Controllers;

[ApiController]
[Route("[controller]")]
public class ChatController : ControllerBase
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _config;

    public ChatController(HttpClient httpClient, IConfiguration config)
    {
        _httpClient = httpClient;
        _config = config;

        
        _httpClient.Timeout = TimeSpan.FromSeconds(60);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] ChatRequest? request) // HTTP body'deki parametreleri okur
    {
        // Null body kontrolü
        if (request is null)
            return BadRequest(new { error = "İstek gövdesi boş." });

        // Sağlayıcı seçimi: groq | openrouter
        var provider = (request.Provider ?? "groq").Trim().ToLowerInvariant();

        string baseUrl;
        string? apiKey;
        string defaultModel;

        switch (provider)
        {
            case "openrouter":
            
                baseUrl = "https://openrouter.ai/api/v1/chat/completions";
                apiKey  = Environment.GetEnvironmentVariable("OPENROUTER_API_KEY");
                defaultModel = "meta-llama/llama-3.1-8b-instruct:free";
                break;

            case "groq":
            default:
                baseUrl = "https://api.groq.com/openai/v1/chat/completions";
                apiKey  = Environment.GetEnvironmentVariable("GROQ_API_KEY");
                defaultModel = "llama-3.3-70b-versatile";
                break;
        }

        if (string.IsNullOrWhiteSpace(apiKey))
        {
            var which = provider == "openrouter" ? "OPENROUTER_API_KEY" : "GROQ_API_KEY";
            return StatusCode(500, new { error = $"{provider} için API anahtarı bulunamadı. {which} ortam değişkenini ayarla." });
        }

        var systemPrompt = string.IsNullOrWhiteSpace(request.SystemPrompt)
            ? "Sen çok nazik, kibar ve anlayışlı bir asistansın. Kullanıcıya saygılı bir dil kullanır, açıklayıcı ve yapıcı cevaplar verirsin. Gereksiz detaylardan kaçınır, sade ama net cevaplar sunarsın."
            : request.SystemPrompt;

        var systemMessage = new ChatMessage
        {
            Role = "system",
            Content = systemPrompt
        };

        var userMessages = request.Messages ?? new List<ChatMessage>();

        var messagesForApi = (new[] { systemMessage })
            .Concat(userMessages)
            .Select(m => new { role = m.Role, content = m.Content })
            .ToArray();

        // 3) OpenAI uyumlu istek gövdesi 
        var body = new
        {
            model = defaultModel,
            messages = messagesForApi,
            temperature = 0.7,
            top_p = 0.95,
            max_tokens = 1024
        };

        var json = JsonSerializer.Serialize(body);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        
        _httpClient.DefaultRequestHeaders.Clear();//oncekı headerları temızlıyor
        _httpClient.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", apiKey);
        _httpClient.DefaultRequestHeaders.Accept.Clear(); // JSON accept'leri temizle
        _httpClient.DefaultRequestHeaders.Accept.Add(     //sadece json cevaplarını kabul eden
            new MediaTypeWithQualityHeaderValue("application/json"));

        if (provider == "openrouter")
        {
            var referer = _config["OpenRouter:Referer"] ?? "http://localhost";//.env dosyasını arar
            var title   = _config["OpenRouter:AppTitle"] ?? "LLM Assistant";
            _httpClient.DefaultRequestHeaders.TryAddWithoutValidation("HTTP-Referer", referer);
            _httpClient.DefaultRequestHeaders.TryAddWithoutValidation("X-Title", title);
        }

        HttpResponseMessage response;
        string responseText;
        try
        {
            response = await _httpClient.PostAsync(baseUrl, content);
            responseText = await response.Content.ReadAsStringAsync();
        }
        catch (TaskCanceledException tex)
        {
            return StatusCode(504, new { error = "Sağlayıcı zaman aşımına uğradı.", detail = tex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(502, new { error = "Sağlayıcıya bağlanılamadı.", detail = ex.Message });
        }

        if (!response.IsSuccessStatusCode)
        {
            return StatusCode((int)response.StatusCode, new {
                error = "Sağlayıcı yanıtı hata döndürdü.",
                provider,
                status = (int)response.StatusCode,
                reason = response.ReasonPhrase,
                raw = responseText
            });
        }

        using var doc = JsonDocument.Parse(responseText);
        var root = doc.RootElement;

        string? reply = null;
        try
        {
            reply = root
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString();
        }
        catch
        {
            reply ??= responseText;
        }

        return Ok(new
        {
            message = new
            {
                role = "assistant",
                content = reply ?? ""
            }
        });
    }
}
