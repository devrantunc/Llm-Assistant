using DotNetEnv;
using LlmAssistantApi.Middleware;
using LlmAssistantApi.Services;

var builder = WebApplication.CreateBuilder(args);
Env.Load(); // .env dosyasını yükler

builder.Services.AddHttpClient();

builder.Services.AddControllers();
//gelen isteklere izin verip vermeyeceğini belirleyen güvenlık kuralı
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 1 tane nesne oluşturur ve her yerde aynı şekılde kullanılır
builder.Services.AddSingleton<ReportService>();

var app = builder.Build();

app.UseCors();

//Tüm istekleri ölçmek ve kaydetmek için ara katman oluşturur
app.UseMiddleware<ReportMiddleware>();

// API çağrılarını yönlendir
app.MapControllers();

app.Run();
