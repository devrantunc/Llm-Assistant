using System.Diagnostics; //tanımlama
using System.Threading.Tasks; //async- await
using LlmAssistantApi.Models;
using LlmAssistantApi.Services;
using Microsoft.AspNetCore.Http; //ASP.NET Coru'un HTTP context altyapısını kullanmak için

namespace LlmAssistantApi.Middleware
{
    public class ReportMiddleware
    {
        private readonly RequestDelegate _next;

        public ReportMiddleware(RequestDelegate next) => _next = next;

        public async Task Invoke(HttpContext ctx, ReportService report)
        {
            var sw = Stopwatch.StartNew();//isteğin işlenme kronometre tutat
            try
            {
                await _next(ctx);//isteği siradakı middleware gönderiyor
            }
            catch (System.Exception ex)
            {
                report.RecordError(ex.Message);//hata çıkarsa hata raporunu kaydedıyor
                throw;//hatayı tekrar atıyor
            }
            finally
            {
                sw.Stop();
                report.RecordRequest(new RecentRequest
                {
                    Utc = System.DateTime.UtcNow,
                    Method = ctx.Request.Method,
                    Path = ctx.Request.Path.Value ?? "/", //hangi endpointın çağırıldı
                    Status = ctx.Response?.StatusCode ?? 0, //yanıtın HTTP durumu
                    DurationMs = sw.ElapsedMilliseconds //isteğin kaç milisaniyede işlendiği
                });
            }
        }
    }
}
