import { useState } from "react";

function ChatInput({ onSend }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="bg-[#40414F] p-4">
      <div className="max-w-2xl mx-auto flex gap-2">

        
        <div className="flex items-center gap-2 bg-[#343541] p-2 rounded-md">
          <input type="file" accept="image/*" multiple className="hidden" id="image-upload" />
          <label htmlFor="image-upload" className="cursor-pointer">
            <span className="material-icons  px-2 items-center"> ➕ </span>
          </label>
        </div>


        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Send a message..."
          className="flex-1 px-4 py-2 rounded-md bg-[#343541] text-white outline-none border border-gray-600"
        />
        <button
          onClick={handleSend}
          className="bg-[#10A37F] px-4 py-2 rounded-md text-white hover:opacity-90"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatInput;
