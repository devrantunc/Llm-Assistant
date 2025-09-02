import React, { useState, useEffect, useMemo } from "react";
import "./Sidebar.css";

/*proplar ve yerel durumlar */
function Sidebar({
  chatHistoryByMode,       
  onSelectChat,
  onRenameChat,
  onDeleteChat,
  mode,
  setMode,
  provider,       // ✅ Yeni prop
  setProvider     // ✅ Yeni prop
}) {
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  // Aktif modun sohbet listesi
  const chatsForCurrentMode = chatHistoryByMode[mode] || [];

  /*sidebar arama özelliği */
  const filteredChats = useMemo(() => {
    if (!search.trim()) return chatsForCurrentMode;
    return chatsForCurrentMode.filter((chat) =>
      (chat.title || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [chatsForCurrentMode, search]);

  /* başlığı yeniden adlandırma kısmı*/ 
  const handleRename = (e, id) => {
    e.preventDefault();
    if (editedTitle.trim()) {
      onRenameChat(mode, id, editedTitle.trim()); // aktif moda göre güncelle
      setEditId(null);
      setEditedTitle("");
    }
  };

  // Mod değişince aktif sohbeti temizle
  const handleModeChange = (e) => {
    const newMode = e.target.value;
    setMode(newMode);
    onSelectChat(null); // aktif sohbeti temizle
  };

  return (
    <div className="sidebar">
      <h2>Sohbetler</h2>
      <div className="mode-select-sidebar">
        <label htmlFor="mode">🎭 Asistan Modu:</label>
        <select id="mode" value={mode} onChange={handleModeChange}>
          <option value="Zeki Danışman">🧠Zeki Danışman</option>
          <option value="Sade Öğretmen">📚Öğretmen</option>
          <option value="Diyetisyen">🥗Diyetisyen</option>
          <option value="Spor Koçu">🏋️Spor Koçu</option>
          <option value="Kariyer Rehberi">💼Kariyer Rehberi</option>
          <option value="Seyahat Rehberi">🌍Seyahat Rehberi</option>
        </select>
      </div>

      <div className="mode-select-sidebar">
        <label htmlFor="provider">⚙️ API Sağlayıcı:</label>
        <select
          id="provider"
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
        >
          <option value="groq">🌐 Groq</option>
          <option value="openrouter">🤖OpenRouter</option>
        </select>
      </div>

      <input
        type="text"
        placeholder="Ara..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul>
        {filteredChats.map((chat) => (
          <li key={chat.id} className="chat-item">
            {editId === chat.id ? (
              <form onSubmit={(e) => handleRename(e, chat.id)}>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  autoFocus
                  onBlur={() => setEditId(null)}
                />
              </form>
            ) : (
              <>
                <span onClick={() => onSelectChat(chat)}>{chat.title}</span>
                <span
                  className="edit"
                  onClick={() => {
                    setEditId(chat.id);
                    setEditedTitle(chat.title);
                  }}
                >
                  ✏️
                </span>
                <span
                  className="delete"
                  onClick={() => onDeleteChat(mode, chat.id)} // aktif moddan sil
                >
                  🗑️
                </span>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
