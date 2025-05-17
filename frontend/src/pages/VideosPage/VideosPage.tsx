import React, { useState, useRef, useEffect } from 'react';
import { Play, ThumbsUp, MessageCircle, Share2, Bookmark, MoreVertical, Search, Settings, Youtube, Radio, Clapperboard, Rocket } from 'lucide-react';

interface VideoThumbnailProps {
  videoUrl: string;
  onThumbnailGenerated: (thumbnailUrl: string) => void;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ videoUrl, onThumbnailGenerated }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      video.addEventListener('loadeddata', () => {
        video.currentTime = 0;
      });

      video.addEventListener('seeked', () => {
        const context = canvas.getContext('2d');
        if (context) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbnailUrl = canvas.toDataURL('image/jpeg');
          onThumbnailGenerated(thumbnailUrl);
        }
      });
    }
  }, [videoUrl]);

  return (
    <div style={{ display: 'none' }}>
      <video ref={videoRef} src={videoUrl} crossOrigin="anonymous" />
      <canvas ref={canvasRef} />
    </div>
  );
};

const VideosPage = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'live' | 'reels' | 'shows' | 'explore'>('home');
  const [playingVideoId, setPlayingVideoId] = useState<number | null>(null);
  const [thumbnails, setThumbnails] = useState<{[key: number]: string}>({});

  const videos = [
    {
      id: 1,
      title: 'Video 1',
      videoUrl: '/videos/video1.mp4',
      author: {
        name: 'Con Ngố Nhố',
        avatar: '/avatars/con-ngo-nho.jpg',
        isFollowing: true
      },
      views: '1 triệu',
      timestamp: '4 Tháng 4',
      likes: '27K',
      comments: '806 bình luận',
      description: 'Thì ra không có ai là quá bận rộn hay vô tình mà không thèm để tâm đến. Chỉ là họ không muốn mà thôi'
    },
    {
      id: 2,
      title: 'Video 2',
      videoUrl: '/videos/video2.mp4',
      author: {
        name: 'Funny Moments',
        avatar: '/avatars/funny-moments.jpg',
        isFollowing: false
      },
      views: '500K',
      timestamp: '2 giờ trước',
      likes: '15K',
      comments: '300 bình luận',
      description: 'Tổng hợp những khoảnh khắc hài hước nhất tuần'
    },
    {
      id: 3,
      title: 'Video 3',
      videoUrl: '/videos/video3.mp4',
      author: {
        name: 'Daily Vlogs',
        avatar: '/avatars/daily-vlogs.jpg',
        isFollowing: true
      },
      views: '750K',
      timestamp: '1 ngày trước',
      likes: '20K',
      comments: '450 bình luận',
      description: 'Một ngày bình thường của tôi'
    },
    {
      id: 4,
      title: 'Video 4',
      videoUrl: '/videos/video4.mp4',
      author: {
        name: 'Travel Stories',
        avatar: '/avatars/travel-stories.jpg',
        isFollowing: false
      },
      views: '250K',
      timestamp: '3 ngày trước',
      likes: '12K',
      comments: '200 bình luận',
      description: 'Khám phá những địa điểm tuyệt vời'
    }
  ];

  const handleThumbnailGenerated = (videoId: number, thumbnailUrl: string) => {
    setThumbnails(prev => ({
      ...prev,
      [videoId]: thumbnailUrl
    }));
  };

  return (
    <div className="flex min-h-screen bg-[#F0F2F5]">
      {/* Left Sidebar */}
      <div className="w-[360px] bg-white h-screen overflow-y-auto fixed left-0 top-0 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Video</h2>
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100">
            <Settings className="w-5 h-5 text-[#606770]" />
          </button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#606770] w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm video"
            className="w-full pl-10 pr-4 py-2.5 bg-[#F0F2F5] rounded-full focus:outline-none text-sm"
          />
        </div>

        <nav className="space-y-1">
          <a href="#" className="flex items-center px-2 py-2.5 rounded-lg bg-[#E7F3FF] text-[#1B74E4]">
            <Youtube className="w-6 h-6 mr-3" />
            <span className="font-medium">Trang chủ</span>
          </a>
          <a href="#" className="flex items-center px-2 py-2.5 rounded-lg hover:bg-[#F2F2F2]">
            <Radio className="w-6 h-6 mr-3" />
            <span>Trực tiếp</span>
          </a>
          <a href="#" className="flex items-center px-2 py-2.5 rounded-lg hover:bg-[#F2F2F2]">
            <Clapperboard className="w-6 h-6 mr-3" />
            <span>Reels</span>
          </a>
          <a href="#" className="flex items-center px-2 py-2.5 rounded-lg hover:bg-[#F2F2F2]">
            <Play className="w-6 h-6 mr-3" />
            <span>Chương trình</span>
          </a>
          <a href="#" className="flex items-center px-2 py-2.5 rounded-lg hover:bg-[#F2F2F2]">
            <Rocket className="w-6 h-6 mr-3" />
            <span>Khám phá</span>
          </a>
          <a href="#" className="flex items-center px-2 py-2.5 rounded-lg hover:bg-[#F2F2F2]">
            <Bookmark className="w-6 h-6 mr-3" />
            <span>Video đã lưu</span>
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-[360px] flex-1 p-6">
        <div className="max-w-3xl mx-auto">
          {videos.map((video) => (
            <div key={video.id} className="bg-white rounded-lg shadow mb-6">
              {/* Video Header */}
              <div className="p-4 flex items-start justify-between">
                <div className="flex items-center">
                  <img
                    src={video.author.avatar}
                    alt={video.author.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="ml-3">
                    <div className="flex items-center">
                      <h3 className="font-medium text-gray-900">{video.author.name}</h3>
                      {video.author.isFollowing && (
                        <span className="ml-2 text-blue-600 text-sm">• Theo dõi</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{video.timestamp} • 🌐</p>
                  </div>
                </div>
                <button className="text-gray-500 hover:text-gray-700">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {/* Video Description */}
              <div className="px-4 pb-3">
                <p className="text-gray-900">{video.description}</p>
              </div>

              {/* Video Player */}
              <div className="relative" onClick={() => setPlayingVideoId(video.id === playingVideoId ? null : video.id)}>
                <VideoThumbnail 
                  videoUrl={video.videoUrl} 
                  onThumbnailGenerated={(url) => handleThumbnailGenerated(video.id, url)} 
                />
                {playingVideoId === video.id ? (
                  <video
                    src={video.videoUrl}
                    className="w-full aspect-video object-cover"
                    controls
                    autoPlay
                    poster={thumbnails[video.id]}
                  />
                ) : (
                  <div className="relative">
                    <img
                      src={thumbnails[video.id]}
                      alt={video.title}
                      className="w-full aspect-video object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Play className="w-16 h-16 text-white" />
                    </div>
                  </div>
                )}
              </div>

              {/* Video Stats & Actions */}
              <div className="p-4">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <span>👍 {video.likes}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span>{video.comments}</span>
                    <span>{video.views} lượt xem</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between border-t border-b py-1">
                  <button className="flex-1 flex items-center justify-center py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                    <ThumbsUp className="w-5 h-5 mr-2" />
                    <span>Thích</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    <span>Bình luận</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                    <Share2 className="w-5 h-5 mr-2" />
                    <span>Chia sẻ</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideosPage; 