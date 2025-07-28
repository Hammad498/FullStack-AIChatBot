




import { useState } from "react";

function ChatInput({ onSend }) {
  const [input, setInput] = useState("");
  const [images, setImages] = useState([]);

  const handleSend = () => {
    if (!input.trim() && images.length === 0) return;
    onSend(input, images);
    setInput("");
    setImages([]);
    document.getElementById("image-upload").value = null; 
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  return (
    <div className="p-3 rounded-md w-[50%] mx-auto">
      <div className="max-w-2xl mx-auto flex gap-2">
        <div className="flex items-center gap-2 bg-[#343541] p-2 rounded-md">
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            id="image-upload"
            onChange={handleImageChange}
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer border-2 border-gray-600 p-2 rounded-md"
          >
            <span className="material-icons text-white px-0 items-center">➕</span>
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
          className="bg-[#10A37F] px-4 py-1 rounded-md text-white hover:opacity-90"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatInput;
