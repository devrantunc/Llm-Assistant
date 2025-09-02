using System.Text.Json.Serialization;

namespace LlmAssistantApi.Models;
//OpenRouter API'sine gönderilecek veya ondan gelecek olan tek bir mesajı temsil eder
public class ChatMessage
{
    [JsonPropertyName("role")]
    public string Role { get; set; } = "";

    [JsonPropertyName("content")]
    public string Content { get; set; } = "";
}
