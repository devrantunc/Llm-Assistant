import React, { useState, useEffect, useRef } from "react";
import "./ChatWindow.css";

function ChatWindow({ chatHistory, setChatHistory, currentChat, setCurrentChat, mode, provider }) { // ← provider eklendi
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

const promptMap = {
  "Zeki Danışman":
    "Sen analitik düşünen, bilgiyi mantık zincirleriyle açıklayan bir danışmansın. Sorulara neden–sonuç ilişkisiyle cevap verirsin. Emin olmadığın yerde 'mantıksal olarak şöyle olabilir' diye not düşersin. \
Örnek: 'Bir ülkenin enflasyonu yükseldiğinde, genellikle para birimi değer kaybeder. Bunun nedeni arz–talep dengesinin bozulmasıdır.'",

  "Sade Öğretmen":
    "Sen sabırlı, basit örneklerle anlatan bir öğretmensin. Konuları günlük hayattan benzetmelerle sadeleştirirsin. Öğrenci anlamazsa farklı örneklerle tekrar açıklarsın. \
Örnek: 'Matematikte kesirler pizzaya benzer. 1/2, bir pizzanın yarısıdır. 1/4, dört dilimden bir tanesidir.'",

  "Diyetisyen":
    "Sen beslenme uzmanısın. Kullanıcıya günlük öğün düzeni, porsiyon önerisi veya pratik sağlıklı tarifler verebilirsin. Tıbbi teşhis koymazsın. \
Örnek: 'Kilo vermek isteyen biri için: Kahvaltıda 2 haşlanmış yumurta + 1 dilim tam buğday ekmek + salatalık–domates. Ara öğünde 1 elma. Öğle yemeğinde ızgara tavuk + bol salata. Akşam yemeğinde mercimek çorbası + 1 dilim ekmek.'",

  "Spor Koçu":
    "Sen motive eden, enerjik bir spor koçusun. Kullanıcıya moral verirsin ve evde/parkta uygulanabilir kısa antrenman programları hazırlarsın. \
Örnek: 'Başlangıç seviyesi için 20 dakikalık rutin: 3×(15 squat, 10 şınav, 20 mekik). Sonunda 5 dakika esneme yapmayı unutma. Eğer dışarı çıkabiliyorsan 2 km tempolu yürüyüş ekle.'",

  "Kariyer Rehberi":
    "Sen iş dünyasını bilen bir kariyer rehberisin. Kullanıcıya CV düzenleme, mülakat hazırlığı, sektör trendleri ve iş bulma stratejileri konusunda uygulanabilir tavsiyeler verirsin. \
Örnek: 'CV’nin en üstüne 4–5 satırlık güçlü bir özet ekle. Yazılım sektöründeysen GitHub linkini mutlaka koy. Mülakatlarda 'zayıf yönünüz nedir?' sorusuna dürüst ama gelişmeye açık bir yanıt ver: Örn. 'Zaman yönetiminde zorluk çekiyorum ama son aylarda takvim planlamasıyla bunu geliştiriyorum.''",

  "Seyahat Rehberi":
    "Sen deneyimli bir seyahat rehberisin. Kullanıcıya günlük gezi rotaları, uygun ulaşım yöntemleri, yerel yemek önerileri ve güvenlik ipuçları verebilirsin. \
Örnek: '3 günlük Paris planı: 1. Gün → Eyfel Kulesi, Seine Nehri tekne turu. 2. Gün → Louvre, Notre Dame, akşam Montmartre. 3. Gün → Versay Sarayı. Bütçen kısıtlıysa metro kullan, günlük bilet daha uygun olur.'"
};


  // yeni sohbet seçildiğinde o sohbetteki mesajları yükle
  useEffect(() => {
    if (currentChat) {
      setMessages(currentChat.messages || []);
    } else {
      setMessages([]); // Mod değişince sohbeti temizle
    }
  }, [currentChat, mode]);

  // scroll'u en alta kaydır
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // sesli okuma
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  // kopyalama
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Yanıt kopyalandı!");
  };

  // mesaj gönderme
  const handleSend = async () => {
    if (!input.trim()) return;

    const newUserMsg = { role: "user", content: input };
    const newMessages = [...messages, newUserMsg];
    setMessages(newMessages);

    const titleText = input; // yeni sohbet başlığı için input'u temizlemeden önce yakala
    setInput("");
    setIsTyping(true);//yazıyor animasyonunu başlatır

    try {
      const response = await fetch("http://localhost:5256/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider: provider,                //  seçilen sağlayıcıyı backend'e gönder
          messages: newMessages,
          systemPrompt: promptMap[mode], //  asistan moduna göre prompt
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Backend error:", errText);
        setIsTyping(false);
        return;
      }

      const raw = await response.text();
      console.log("HTTP Status:", response.status);
      console.log("Raw backend response:", raw);

      // 200 değilse kullanıcıya göster
      if (!response.ok) {
        setMessages(prev => [
          ...prev,
          { role: "assistant", content: `Hata ${response.status}: ${raw}` }
        ]);
        setIsTyping(false);
        return;
      }

      // 200 ise JSON'a çevir
      const data = JSON.parse(raw);
      const content =
        data?.message?.content ??
        data?.content ??
        "";

      // Eğer content boşsa log atalım
      if (!content) {
        console.warn("Boş asistan yanıtı:", data);
      }

      const assistantReply = {
        role: "assistant",
        content: content,
      };

      const updatedMessages = [...newMessages, assistantReply];
      setMessages(updatedMessages);
      setIsTyping(false);// ...yazıyor 

      //yeni sohbet
      if (currentChat) {
        const updatedHistory = chatHistory.map((chat) =>
          chat.id === currentChat.id
            ? { ...chat, messages: updatedMessages }
            : chat
        );
        setChatHistory(updatedHistory);
        // App.js'teki state yapısını güncelledikten sonra burada localStorage'a komple yaz
        const chatHistoryByMode = JSON.parse(localStorage.getItem("chatHistoryByMode")) || {};
        localStorage.setItem("chatHistoryByMode", JSON.stringify({
          ...chatHistoryByMode,
          [mode]: updatedHistory
        }));

      } else {
        const newChat = {
          id: Date.now(),
          title: titleText.slice(0, 20) || "Yeni Sohbet",
          messages: updatedMessages,
        };
        const updatedHistory = [...chatHistory, newChat];
        setChatHistory(updatedHistory);
        // tutarlılık için chatHistoryByMode altında sakla
        const chatHistoryByMode = JSON.parse(localStorage.getItem("chatHistoryByMode")) || {};
        localStorage.setItem("chatHistoryByMode", JSON.stringify({
          ...chatHistoryByMode,
          [mode]: updatedHistory
        }));
        setCurrentChat(newChat);
      }
    } catch (error) {
      console.error("Sunucu hatası:", error);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Sunucudan yanıt alınamadı. Lütfen tekrar deneyin.",
        },
      ]);
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.role === "user" ? "user" : "assistant"}`}
          >
            <div className="message-content">{msg.content}</div>
            {msg.role === "assistant" && (
              <div className="actions">
                <button onClick={() => copyToClipboard(msg.content)}>📋</button>
                <button onClick={() => speak(msg.content)}>🔊</button>
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="message assistant">
            <div className="message-content">
              Yazıyor<span className="dot">.</span>
              <span className="dot">.</span>
              <span className="dot">.</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <input
          type="text"
          placeholder="Mesaj yaz..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Gönder</button>
      </div>
    </div>
  );
}

export default ChatWindow;
