import React, { useState, useEffect } from "react";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPost: (content: string, image: string | null) => void;
}

const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose, onPost }) => {
  const [postContent, setPostContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // ✅ Reset khi mở lại modal
  useEffect(() => {
    if (isOpen) {
      setPostContent("");
      setSelectedImage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostContent(e.target.value);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setSelectedImage(imageURL);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-centergi bg-opacity-80 backdrop-blur-sm">
      <div className="bg-white rounded-lg w-full max-w-md p-4 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-black">✕</button>

        <h2 className="text-lg font-semibold text-center">Tạo bài viết</h2>

        <div className="flex items-center mt-4 gap-2">
          <img src="/images/dp1.png" alt="avatar" className="w-10 h-10 rounded-full" />
          <div>
            <p className="font-semibold">Tên người dùng</p>
          </div>
        </div>

        <textarea
          rows={4}
          value={postContent}
          onChange={handleChange}
          placeholder="Bạn đang nghĩ gì?"
          className="w-full mt-4 resize-none outline-none border-none placeholder-gray-500 text-lg"
        />

        {selectedImage && (
          <div className="mt-4">
            <img src={selectedImage} alt="Preview" className="max-h-60 rounded border" />
            <button onClick={() => setSelectedImage(null)} className="text-sm text-red-500 mt-2 hover:underline">
              Xóa ảnh
            </button>
          </div>
        )}

        <div className="mt-4 flex justify-between items-center border rounded p-2 text-sm text-gray-600">
          <span>Thêm vào bài viết của bạn</span>
          <div className="flex gap-2">
            <img src="/images/photo_video.png" alt="Ảnh" className="w-6 h-6 cursor-pointer" onClick={() => document.getElementById("fileInput")?.click()} />
            <img src="/images/groups.png" alt="Gắn nhóm" className="w-6 h-6 cursor-pointer" />
            <img src="/images/feeling_activity.png" alt="Cảm xúc" className="w-6 h-6 cursor-pointer" />
          </div>
        </div>

        <input type="file" accept="image/*" id="fileInput" className="hidden" onChange={handleImageSelect} />

        <button
          disabled={postContent.trim() === ""}
          onClick={() => {
            onPost(postContent, selectedImage);
            onClose();
          }}
          className={`w-full mt-4 py-2 rounded font-semibold ${
            postContent.trim() === "" ? "bg-gray-300 text-white cursor-not-allowed" : "bg-blue-600 text-white"
          }`}
        >
          Đăng
        </button>
      </div>
    </div>
  );
};

export default PostModal;
