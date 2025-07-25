import { useEffect } from "react";

function Sidebar({ onNewChat, onSelectChat, chatSessions, isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static top-0 left-0 h-full w-64 bg-[#202123] text-[#E5E7EB]
          transform ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 transition-transform duration-300 ease-in-out
          z-40 flex flex-col justify-between
        `}
      >
        <div>
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <button
              onClick={onNewChat}
              className="w-full bg-[#40414F] hover:bg-[#4b4c5a] p-2 rounded text-left"
            >
              ➕ New Chat
            </button>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-400 ml-2 hover:text-white"
            >
              ✖️
            </button>
          </div>

          <div className="p-4 overflow-y-auto flex-1">
            <h2 className="text-sm text-gray-400 mb-2">Recent Chats</h2>
            <ul>
              {chatSessions.length === 0 ? (
                <p className="text-gray-500 text-sm">No chats yet.</p>
              ) : (
                chatSessions.map((chat) => (
                  <li
                    key={chat._id}
                    onClick={() => onSelectChat(chat._id)}
                    className="cursor-pointer px-3 py-2 rounded hover:bg-[#2A2B32] mb-2 truncate"
                    title={chat.title}
                  >
                    🗨️ {chat.title || "Untitled Chat"}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        {/* Footer message */}
        <div className="text-center text-gray-500 text-xs p-3 border-t border-gray-700">
          Developed by <span className="text-white font-semibold">RAHUL DRAVID</span>
        </div>
      </div>
    </>
  );
}

export default Sidebar;