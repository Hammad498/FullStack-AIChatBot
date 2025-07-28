import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";


function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatSessions, setChatSessions] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const API_BASE = "http://localhost:3000/api/ai";

  useEffect(() => {
    if (!token) {
      alert("Please login first to access chats.");
      navigate("/login");
      return;
    }

    const fetchChats = async () => {
      try {
        const res = await fetch(`${API_BASE}/getUserAllChats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setChatSessions(data);
          if (data.length > 0) {
            setMessages(data[0].message);
            setCurrentChatId(data[0]._id);
          }
        } else {
          console.error("Error fetching chats:", data.error);
        }
      } catch (err) {
        console.error("Failed to load chats:", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, [token, navigate]);



  ///////////handle send on two condition 1.image+text-->text    2.only text-->text


const handleSend = async (message, imageFiles = []) => {
  if (!message.trim() && imageFiles.length === 0) return;

  // Show user message(s) in UI
  const updatedMessages = [...messages];
  if (message) updatedMessages.push({ role: "user", content: message });
  if (imageFiles.length > 0) {
    const imageNames = imageFiles.map(file => file.name).join(", ");
    updatedMessages.push({ role: "user", content: `The image(s) ${imageNames} has been uploaded` });
  }

  // Add typing indicator
  setMessages([...updatedMessages, { role: "bot", content: "<typing>" }]);

  try {
    let res, data;

    if (imageFiles.length > 0) {
      const formData = new FormData();
      imageFiles.forEach((file) => formData.append("images", file));
      if (message) formData.append("message", message);
      if (currentChatId) formData.append("chatId", currentChatId);

      res = await fetch(`${API_BASE}/uploadImageChat`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
    } else {
      res = await fetch(`${API_BASE}/createMsg`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message, chatId: currentChatId }),
      });
    }

    data = await res.json();

    if (res.ok && data.chat) {
      const newMessages = data.chat.message;

      //  Immediately show full message list
      setMessages(newMessages);

      //  Update sidebar chats
      if (currentChatId) {
        const updatedSessions = chatSessions.map((session) =>
          session._id === currentChatId
            ? { ...session, message: newMessages }
            : session
        );
        setChatSessions(updatedSessions);
      } else {
        setCurrentChatId(data.chat._id);
        setChatSessions((prev) => [...prev, data.chat]);
      }

      return { success: true };
    } else {
      setMessages([
        ...updatedMessages,
        { role: "bot", content: "⚠️ Failed to fetch response." },
      ]);
      return { success: false };
    }
  } catch (err) {
    console.error("Frontend error:", err.message);
    setMessages([
      ...updatedMessages,
      { role: "bot", content: "⚠️ Something went wrong!" },
    ]);
    return { success: false };
  }
};




  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setSidebarOpen(false);
  };

  const handleSelectChat = (id) => {
    const session = chatSessions.find((c) => c._id === id);
    if (session) {
      setMessages(session.message);
      setCurrentChatId(id);
    }
    setSidebarOpen(false);
  };


  const handleDeleteChat = async () => {
    if (!currentChatId) return;

    const updatedSessions = chatSessions.filter((c) => c._id !== currentChatId);
    setChatSessions(updatedSessions);
    setMessages([]);
    setCurrentChatId(null);

    try {
      await fetch(`${API_BASE}/deleteChat/${currentChatId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error("Delete failed:", err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#343541] text-white">
        <p>⏳ Loading your chats...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        chatSessions={chatSessions}
        currentChatId={currentChatId}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-col h-screen flex-1 bg-[#343541] text-white overflow-hidden">
        <TopBar
          onToggleSidebar={() => setSidebarOpen(true)}
          onDeleteChat={handleDeleteChat}
          messages={messages}
        />
        <div className="flex-1 overflow-y-auto">
          <ChatWindow messages={messages} />
        </div>
        <div className="p-2 sm:p-4">
          <ChatInput onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
