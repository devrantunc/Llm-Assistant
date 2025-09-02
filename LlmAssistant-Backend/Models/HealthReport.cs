using System;
using System.Collections.Generic;

namespace LlmAssistantApi.Models
{
    public class RecentRequest
    {
        public DateTime Utc { get; set; }
        public string Method { get; set; } = "";
        public string Path { get; set; } = ""; //endpoint
        public int Status { get; set; } //yanıt kodu
        public long DurationMs { get; set; } //milisanıye
    }

    public class HealthReport
    {
        public DateTime ServerStartUtc { get; set; }
        public long UptimeSeconds { get; set; }

        public long TotalRequests { get; set; }
        public long SuccessfulRequests { get; set; }
        public long FailedRequests { get; set; }

        public double WorkingSetMB { get; set; }
        public double GcMemoryMB { get; set; }
        public string Framework { get; set; } = "";
        public string Os { get; set; } = "";

        public List<RecentRequest> RecentRequests { get; set; } = new();
        public List<string> LastErrors { get; set; } = new();
    }
}
