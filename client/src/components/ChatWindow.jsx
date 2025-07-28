






import { useEffect, useRef } from "react";

function ChatWindow({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (messages?.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const isEmpty = !Array.isArray(messages) || messages.length === 0;

  return (
    <div className="flex-1 overflow-y-auto flex flex-col px-4 py-4 sm:px-6 sm:py-6">
      {isEmpty ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-400 text-xl text-center">
            Hello!
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {messages.map((msg, index) => {
              if (!msg || typeof msg !== "object" || !msg.content || !msg.role) {
                console.warn("⚠️ Invalid message object at index", index, msg);
                return null;
              }

              if (msg.content === "<typing>") {
                return (
                  <div key={index} className="flex justify-start items-center pl-4">
                    <div className="flex space-x-1">
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={index}
                  className={`max-w-full w-fit px-4 py-3 rounded-lg break-words ${
                    msg.role === "user"
                      ? "bg-black text-white self-end ml-auto"
                      : "bg-gray-750 border border-gray-600 shadow-lg shadow-gray-500 text-white self-start mr-auto"
                  }`}
                >
                  {msg.content}
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        </>
      )}
    </div>
  );
}

export default ChatWindow;
