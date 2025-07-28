



import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

function ChatInput({ onSend }) {
  const [input, setInput] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleSend = async () => {
    if (!input.trim() && images.length === 0) return;

    const response = await onSend(input, images); 

    if (response?.success) {
      toast.success("✅ Uploaded successfully!");
    } else {
      toast.error("❌ Upload failed!");
    }

    setInput("");
    setImages([]);
    setImagePreviews([]);
    document.getElementById("image-upload").value = null;
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  return (
    <div className="p-1 rounded-md w-[50%] mx-auto">
      <div className="max-w-2xl mx-auto flex gap-2 mb-2">
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

      {/* Image Previews */}
      {imagePreviews.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-2">
          {imagePreviews.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`preview-${idx}`}
              className="h-24 rounded border border-gray-600"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ChatInput;
