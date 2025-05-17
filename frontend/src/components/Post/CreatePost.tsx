import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createPost } from '../../services/post.service';
import { X, Image, Video, Smile } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

interface CreatePostProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: any) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ isOpen, onClose, onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newMediaFiles = [...mediaFiles, ...files];
    setMediaFiles(newMediaFiles);

    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setMediaPreviews([...mediaPreviews, ...newPreviews]);
  };

  const removeMedia = (index: number) => {
    const newMediaFiles = mediaFiles.filter((_, i) => i !== index);
    const newPreviews = mediaPreviews.filter((_, i) => i !== index);
    setMediaFiles(newMediaFiles);
    setMediaPreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && mediaFiles.length === 0) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('content', content);
      mediaFiles.forEach(file => {
        formData.append('media', file);
      });

      const newPost = await createPost(formData);
      onPostCreated(newPost);
      setContent('');
      setMediaFiles([]);
      setMediaPreviews([]);
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onEmojiClick = (emojiObject: any) => {
    setContent(prevContent => prevContent + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg">
        <div className="border-b px-4 py-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Create Post</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center space-x-2 mb-4">
            <img
              src={user?.profilePicture || '/default-avatar.png'}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold">{user?.firstName} {user?.lastName}</p>
              <div className="bg-gray-100 rounded-md px-2 py-1 text-sm text-gray-600">
                Public
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[100px] resize-none border-none focus:ring-0 text-lg"
            />

            {mediaPreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                {mediaPreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    {preview.includes('video') ? (
                      <video src={preview} className="w-full rounded-lg" controls />
                    ) : (
                      <img src={preview} alt="Preview" className="w-full rounded-lg" />
                    )}
                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Add to your post</span>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <Image className="w-6 h-6 text-green-500" />
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <Video className="w-6 h-6 text-red-500" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <Smile className="w-6 h-6 text-yellow-500" />
                  </button>
                </div>
              </div>
              {showEmojiPicker && (
                <div className="absolute mt-2">
                  <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleMediaSelect}
              accept="image/*,video/*"
              multiple
              className="hidden"
            />

            <button
              type="submit"
              disabled={isSubmitting || (!content.trim() && mediaFiles.length === 0)}
              className={`w-full mt-4 py-2 px-4 rounded-lg font-semibold text-white ${
                isSubmitting || (!content.trim() && mediaFiles.length === 0)
                  ? 'bg-blue-300'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost; 