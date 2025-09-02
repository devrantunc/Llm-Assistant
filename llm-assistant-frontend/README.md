LLM Asistanı Sunum Özeti
LLM Asistanı - Fullstack Proje (React + .NET + OpenRouter)
==========================================================
Bu proje, Large Language Model (LLM) kullanarak yapay zekâ destekli bir sohbet asistanı oluşturmayı amaçlar. 
Frontend kısmı React.js ile, backend kısmı ise .NET 9 ile yazılmıştır. LLM yanıtları OpenRouter API'si üzerinden alınmaktadır.

Proje Yapısı
------------

llm-assistant/
├── client/         → React frontend uygulaması
│   ├── src/        → Bileşenler: App.jsx, ChatWindow.jsx, Sidebar.jsx
│   ├── public/     → index.html, ikonlar vb.
│   ├── package.json → React bağımlılıkları ve scriptler
│   └── .gitignore  → node_modules ve build dizinini dışlar
│
├── server/         → .NET backend API
│   ├── Program.cs  → Uygulama giriş noktası (HttpClient, CORS, Controller)
│   ├── Controllers/ → ChatController.cs (OpenRouter API entegrasyonu)
│   ├── Models/     → ChatRequest.cs, ChatMessage.cs
│   ├── appsettings.json → API Key burada tutulur
│   └── LlmAssistantApi.csproj → Proje yapılandırması

Kullanılan Teknolojiler
------------------------

- React 19
- .NET 9 (ASP.NET Core Minimal API)
- OpenRouter API (LLM erişimi için)
- Axios, LocalStorage, SpeechSynthesis
- CORS, HttpClient

Kurulum ve Çalıştırma
----------------------

### Frontend (client):

```bash
cd client
npm install
npm start
```

Tarayıcıda çalışır: http://localhost:3000

### Backend (server):

```bash
cd server
dotnet run
```

Çalışır port: http://localhost:5000

Not: `appsettings.json` içinde OpenRouter API anahtarınız tanımlı olmalıdır.

Yetenekler
-----------

- Yeni sohbet başlatma
- Sohbet geçmişi (localStorage)
- Başlık değiştirme ve silme
- Asistan cevabını kopyalama
- Sesli okuma (TTS)
- Yazma animasyonu (...)
