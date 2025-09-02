using LlmAssistantApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace LlmAssistantApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HealthController : ControllerBase
    {
        private readonly ReportService _report; //depeendency injection
        public HealthController(ReportService report) => _report = report; //reportservice alır report alanına atar

        [HttpGet("report")]
        public IActionResult GetReport()
        {
            var snapshot = _report.Snapshot();
            return Ok(snapshot);
        }
    }
}
