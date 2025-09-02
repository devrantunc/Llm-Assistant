using System;
using System.Collections.Concurrent;//eşzamanlı koleksiyonlar (veri saklama)
using System.Diagnostics;//loglama ,zamanlama (zaman ölçmek)
using System.Linq; //veri çekme ,filtreleme ,sıralama  (liste uzerinde sorgu)
using LlmAssistantApi.Models;

namespace LlmAssistantApi.Services
{
    public class ReportService
    {
        public DateTime ServerStartUtc { get; } = DateTime.UtcNow;//server ne zaman çalışıyor bilgisi

        private long _totalRequests = 0; //toplam istek sayısı
        private long _success = 0; 
        private long _fail = 0;

        private readonly ConcurrentQueue<RecentRequest> _recent = new();//son yapılan isteklerı saklar(hangi endpoint hangı saatte çağırıldı)
        private readonly ConcurrentQueue<string> _errors = new();//hata mesajlarını saklar

        public void RecordRequest(RecentRequest rr)
        {
            System.Threading.Interlocked.Increment(ref _totalRequests);//toplam istek sayısını güvenlı sekılde 1 artırır
            if (rr.Status >= 200 && rr.Status < 400)
                System.Threading.Interlocked.Increment(ref _success);
            else
                System.Threading.Interlocked.Increment(ref _fail);

            _recent.Enqueue(rr);
            while (_recent.Count > 100) _recent.TryDequeue(out _);//son yapılan  istekler kuyruğuna ekler
        }

        public void RecordError(string message)
        {
            _errors.Enqueue($"{DateTime.UtcNow:o} — {message}");//hata oluştuğunda çağrılıyor (errors kuyğruguna eklenır)
            while (_errors.Count > 50) _errors.TryDequeue(out _);//50 den fazlaysa en eskılerı siler 
        }

        public HealthReport Snapshot()
        {
            var proc = Process.GetCurrentProcess();
            var wsMB = proc.WorkingSet64 / 1024.0 / 1024.0; //RAM kullanımını gosterır 
            var gcMB = GC.GetTotalMemory(false) / 1024.0 / 1024.0; //.NET çöp toplayıcısınını tuttugu bellek  miktarı

            return new HealthReport
            {
                ServerStartUtc = ServerStartUtc,
                UptimeSeconds = (long)(DateTime.UtcNow - ServerStartUtc).TotalSeconds,//kaç saniyedir çalıştığını
                TotalRequests = _totalRequests,
                SuccessfulRequests = _success,
                FailedRequests = _fail,
                WorkingSetMB = Math.Round(wsMB, 2),//RAM kullanımı
                GcMemoryMB = Math.Round(gcMB, 2), //.NET tuttuğu bellek mıktarı
                Framework = System.Runtime.InteropServices.RuntimeInformation.FrameworkDescription,//.NET sürüm bilgisi
                Os = System.Runtime.InteropServices.RuntimeInformation.OSDescription,//sunucunun işletim sistemı bilgisi
                RecentRequests = _recent.Reverse().Take(20).ToList(),//yapılan son 20 istek listesi
                LastErrors = _errors.Reverse().Take(10).ToList() //son 10 hatanın listesi
            };
        }
    }
}
