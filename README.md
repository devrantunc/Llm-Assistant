# LLM-Assistant

React + .NET (ASP.NET Core) tabanlı, çok modlu ve çok sağlayıcılı (Groq / OpenRouter) bir sohbet asistanı.

> Modern, cam-efektli arayüz • Mod bazlı sohbet geçmişi • Sağlayıcı seçimi • Kopyala & Sesli Oku • “Rapor” butonu ile basit aktivite günlüğü

---

## 🎯 Özellikler

- **Asistan Modları:** Zeki Danışman, Sade Öğretmen, Diyetisyen, Spor Koçu, Kariyer Rehberi, Seyahat Rehberi  
- **Mod Bazlı Geçmiş:** Her mod için ayrı sohbet listesi ve başlık düzenleme/silme
- **Model Sağlayıcı Seçimi:** Yan panelden **Groq** veya **OpenRouter** seçimi
- **Kopyala & Sesli Oku:** Asistan yanıtını panoya kopyalama ve web speech ile seslendirme
- **Cam Efekti & Temalar:** Şık cam-efektli (glassmorphism) arayüz ve sıcak degrade arkaplan
- **Rapor Butonu:** Sağ altta, son işlemler ile ilgili basit bir **aktivite raporu** popup/indirme
- **Dayanıklı Hata Yakalama:** Backend ve UI hata mesajları, HTTP durum kodu ve ham cevap görüntüleme

---

## 🧱 Mimari
/LLM-Assistant
├─ frontend/ # React app
│ ├─ src/components/
│ │ ├─ Sidebar.jsx
│ │ └─ ChatWindow.jsx
│ ├─ App.jsx, App.css
│ └─ package.json
└─ backend/ # ASP.NET Core Web API
├─ Controllers/ChatController.cs
├─ Models/ChatRequest.cs, ChatMessage.cs
├─ appsettings.json
├─ .env # API anahtarları (VERSİYONA GİRMEZ)
└─ Program.cs

---

“Kodlara göz atmak ya da projeyi detaylı konuşmak isteyen olursa her zaman açığım. Güzel işler üretmek dileğiyle 🙌”
