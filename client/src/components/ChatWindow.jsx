import { useEffect, useRef } from "react";

function ChatWindow({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const isEmpty = messages.length === 0;

  return (
    <div className="flex-1 overflow-y-auto flex flex-col px-4 py-4 sm:px-6 sm:py-6">
      {isEmpty ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-400 text-xl text-center">
            Hello, how can I help you buddy...?
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {messages.map((msg, index) =>
              msg.content === "<typing>" ? (
                <div key={index} className="flex justify-start items-center pl-4">
                  <div className="flex space-x-1">
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
                  </div>
                </div>
              ) : (
                <div
                  key={index}
                  className={`max-w-full w-fit px-4 py-3 rounded-lg break-words ${
                    msg.role === "user"
                      ? "bg-[#10A37F] text-white self-end ml-auto"
                      : "bg-[#40414F] text-[#D1D5DB] self-start mr-auto"
                  }`}
                >
                  {msg.content}
                </div>
              )
            )}
            <div ref={bottomRef} />
          </div>
        </>
      )}
    </div>
  );
}

export default ChatWindow;