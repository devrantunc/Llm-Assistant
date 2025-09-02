using System.Collections.Generic;

namespace LlmAssistantApi.Models
{
    // React frontend'den gelen mesajlar listesini tutar
    public class ChatRequest
    {
        public required List<ChatMessage> Messages { get; set; } = new();
        public string SystemPrompt { get; set; } = "";

        public string Provider { get; set; } = "groq";
    }
}
