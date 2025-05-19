import React, { useState, useEffect, useRef } from "react";
import { User } from "../../type/type.ts";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPost: (postData: {
    content: string;
    image: string | null;
    status: string;
  }) => void;
  currentUser: {
    name: string;
    avatar: string;
  };
}

const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose, onPost, currentUser }) => {
  const [postContent, setPostContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState("public");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const user: User = {
    id: 1,
    email: "",
    name: "Nguyen Van A",
    avatarUrl: "/images/avatar.png",
  };

  useEffect(() => {
    if (isOpen) {
      setPostContent("");
      setSelectedFile(null);
      setPreviewUrl(null);
      setStatus("public");
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File quá lớn. Tối đa là 10MB.");
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!postContent.trim()) return;

    setIsLoading(true);
    // Giả lập delay khi đăng bài
    setTimeout(() => {
      onPost({
        content: postContent,
        image: previewUrl,
        status
      });
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-4 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10">
            <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}
        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
          <h2 className="text-lg font-semibold">Tạo bài viết</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mt-4">
          <div className="flex items-center space-x-2">
            <img src={user.avatarUrl || "/images/avatar.png"} alt={user.name} className="h-10 w-10 rounded-full" />
            <span className="font-semibold">{user.name}</span>
          </div>
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="Bạn đang nghĩ gì?"
            className="w-full h-24 p-2 mt-4 border border-gray-300 rounded-md resize-none"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-2 w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="public">Public</option>
            <option value="friends">Friends</option>
            <option value="private">Private</option>
          </select>

          {previewUrl && (
            <div className="relative mt-4">
              {selectedFile?.type.startsWith("image/") ? (
                <img src={previewUrl} alt="Preview" className="max-h-64 w-full object-contain rounded-md" />
              ) : (
                <video src={previewUrl} controls className="max-h-64 w-full object-contain rounded-md" />
              )}
              <button
                onClick={handleRemoveFile}
                className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          <input
            type="file"
            accept="image/*,video/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 w-full bg-gray-100 p-2 rounded-md flex items-center justify-center space-x-2"
          >
            <img src="/images/photo_video.png" alt="" className="size-6" />
            <span>Thêm ảnh/video</span>
          </button>
          <button
            disabled={isLoading || !postContent.trim()}
            onClick={handleSubmit}
            className={`mt-4 w-full bg-blue-500 text-white p-2 rounded-md ${
              isLoading || !postContent.trim() ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
            }`}
          >
            {isLoading ? "Đang đăng..." : "Đăng"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
