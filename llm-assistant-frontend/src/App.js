import React, { useState, useEffect } from "react";
import ChatWindow from "./components/ChatWindow";
import Sidebar from "./components/Sidebar";
import "./App.css";
import ReportPanel from "./components/ReportPanel"; 

function App() {
  const modes = [
    "Zeki Danışman",
    "Sade Öğretmen",
    "Diyetisyen",
    "Spor Koçu",
    "Kariyer Rehberi",
    "Seyahat Rehberi",
  ];

  // Her mod için ayrı sohbet listesi
  const [chatHistoryByMode, setChatHistoryByMode] = useState({});
  const [currentChat, setCurrentChat] = useState(null);
  const [mode, setMode] = useState("Zeki Danışman"); // Varsayılan mod

  // Kullanıcının seçtiği sağlayıcı
  const [provider, setProvider] = useState("groq");

  // Sayfa yüklendiğinde geçmiş sohbetleri getir
  useEffect(() => {
    const stored = localStorage.getItem("chatHistoryByMode");
    if (stored) {
      setChatHistoryByMode(JSON.parse(stored));
    } else {
      // İlk başta tüm modlar için boş liste oluştur
      const initialData = {};
      modes.forEach((m) => {
        initialData[m] = [];
      });
      setChatHistoryByMode(initialData);
    }
  }, []);

  // Sohbet seçme
  const handleSelectChat = (chat) => {
    setCurrentChat(chat);
  };

  // Sohbet başlığını değiştirme
  const handleRenameChat = (modeName, id, newTitle) => {
    const updatedModeChats = (chatHistoryByMode[modeName] || []).map((chat) =>
      chat.id === id ? { ...chat, title: newTitle } : chat
    );

    const updatedHistory = {
      ...chatHistoryByMode,
      [modeName]: updatedModeChats,
    };
    setChatHistoryByMode(updatedHistory);
    localStorage.setItem("chatHistoryByMode", JSON.stringify(updatedHistory));
  };

  // Sohbet silme
  const handleDeleteChat = (modeName, id) => {
    const updatedModeChats = (chatHistoryByMode[modeName] || []).filter(
      (chat) => chat.id !== id
    );

    const updatedHistory = {
      ...chatHistoryByMode,
      [modeName]: updatedModeChats,
    };
    setChatHistoryByMode(updatedHistory);
    localStorage.setItem("chatHistoryByMode", JSON.stringify(updatedHistory));

    if (currentChat?.id === id) {
      setCurrentChat(null);
    }
  };

  // ChatWindow’dan gelen sohbet güncellemelerini kaydet
  const updateChatHistoryForMode = (updatedChats) => {
    const updatedHistory = {
      ...chatHistoryByMode,
      [mode]: updatedChats,
    };
    setChatHistoryByMode(updatedHistory);
    localStorage.setItem("chatHistoryByMode", JSON.stringify(updatedHistory));
  };

  useEffect(() => {
    setCurrentChat(null);
  }, [mode]);

  return (
    <div className="app">
      <Sidebar
        chatHistoryByMode={chatHistoryByMode}
        onSelectChat={handleSelectChat}
        onRenameChat={handleRenameChat}
        onDeleteChat={handleDeleteChat}
        mode={mode}
        setMode={setMode}
        provider={provider}        
        setProvider={setProvider}  
      />
      <ChatWindow
        chatHistory={chatHistoryByMode[mode] || []}
        setChatHistory={updateChatHistoryForMode}
        currentChat={currentChat}
        setCurrentChat={setCurrentChat}
        mode={mode}
        provider={provider}        
      />
      <ReportPanel backendBase="http://localhost:5256" />
    </div>
  );
}

export default App;




