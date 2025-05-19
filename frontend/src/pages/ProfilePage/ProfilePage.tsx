
import { useEffect, useRef, useState } from 'react';
import ProfileTabs from './ProfileTabs';
import ProfilePost from './ProfilePost';
import ProfileFriend from './ProfileFriend';
import ProfilePhoto from './ProfilePhoto';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Thêm useParams và useNavigate


const images = [
  '/images/dp1.png',
  '/images/dp2.png',
  '/images/dp3.png',
  '/images/dp4.png',
  '/images/dp1.png',
  '/images/dp2.png',
  '/images/dp3.png',
  '/images/dp4.png',
  '/images/dp1.png',
  '/images/dp2.png',
];


const friends = [
  { name: 'Friend 1', img: '/images/dp1.png' },
  { name: 'Friend 2', img: '/images/dp2.png' },
  { name: 'Friend 3', img: '/images/dp3.png' },
  { name: 'Friend 4', img: '/images/dp4.png' },
  { name: 'Friend 5', img: '/images/dp1.png' },
  { name: 'Friend 6', img: '/images/dp2.png' },
  { name: 'Friend 7', img: '/images/dp3.png' },
  { name: 'Friend 8', img: '/images/dp4.png' },
  { name: 'Friend 9', img: '/images/dp1.png' },
  { name: 'Friend 10', img: '/images/dp2.png' },
];

interface user {
  id: string;
  name: string;
  email: string;
  password: string;
  avatarImage: string;
  avatarContentType: string;
  coverImage: string;
  coverContentType: string;
  bio: string;
  status: string;
  avatarUrl: string;
};



const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>(); // Lấy userId từ URL
  const navigate = useNavigate();
  const [avatarPreview, setAvatarPreview] = useState('');
  const [coverPreview, setCoverPreview] = useState('');
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  const [activeMain, setActiveMain] = useState('Bài viết');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const JPEG_QUALITY = 0.8;

  const [userData, setUserData] = useState<user | null>(null);
  const [currentUser, setCurrentUser] = useState<user | null>(null); // Lưu currentUser để kiểm tra quyền chỉnh sửa
  const [userName, setUserName] = useState<string>('');
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null);

  // Lấy currentUser từ localStorage
  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      try {
        const parsedUser: user = JSON.parse(userData);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error('Lỗi khi phân tích JSON từ localStorage:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  // Fetch thông tin người dùng dựa trên userId từ URL
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        const response = await axios.get(`http://localhost:8080/api/users/${userId}`);
        if (response.status >= 200 && response.status < 300) {
          setUserData(response.data);
        } else {
          console.error('Lỗi khi tải thông tin người dùng:', response.status);
        }
      } catch (error) {
        console.error('Lỗi khi tải thông tin người dùng:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      const fileReadPromise = new Promise<string>((resolve, reject) => {
        reader.onload = (event) => resolve(event.target?.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });

      try {
        const dataUrl = await fileReadPromise;
        const img = new Image();
        const imageLoadPromise = new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = (error) => reject(error);
          img.src = dataUrl;
        });
        await imageLoadPromise;

        const canvas = canvasRef.current;
        if (!canvas || !canvas.getContext('2d')) {
          console.error('Canvas hoặc context không tồn tại.');
          return;
        }
        const ctx = canvas.getContext('2d')!;

        let width = img.width;
        let height = img.height;
        const MAX_AVATAR_WIDTH = 200;
        const MAX_AVATAR_HEIGHT = 200;

        if (width > MAX_AVATAR_WIDTH || height > MAX_AVATAR_HEIGHT) {
          if (width > height) {
            height = Math.round(height * (MAX_AVATAR_WIDTH / width));
            width = MAX_AVATAR_WIDTH;
          } else {
            width = Math.round(width * (MAX_AVATAR_HEIGHT / height));
            height = MAX_AVATAR_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const blobPromise = new Promise<Blob | null>((resolve) => {
          canvas.toBlob(
            (blob) => {
              resolve(blob);
            },
            file.type === 'image/jpeg' ? 'image/jpeg' : 'image/png',
            JPEG_QUALITY
          );
        });

        const resizedBlob = await blobPromise;

        if (resizedBlob) {
          const resizedFile = new File([resizedBlob], file.name, {
            type: resizedBlob.type,
            lastModified: Date.now(),
          });
          setSelectedAvatarFile(resizedFile);
          console.log('Resized file created:', resizedFile.name, resizedFile.type, (resizedFile.size / 1024).toFixed(2) + ' KB');
        } else {
          console.error('Failed to create resized image Blob.');
        }
      } catch (error) {
        console.error('Error during image processing:', error);

      }

      const newAvatar = URL.createObjectURL(file);
      setAvatarPreview(newAvatar);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedCoverFile(file);
      const newCover = URL.createObjectURL(file);
      setCoverPreview(newCover);
    }
  };

  const getAvatarSrc = (): string => {
    if (userData) {
      if (userData.avatarImage && userData.avatarContentType) {
        return `data:${userData.avatarContentType};base64,${userData.avatarImage}`;
      }
      if (userData.avatarUrl) {
        return userData.avatarUrl;
      }
    }
    return 'placeholder-avatar.png';
  };

  const handlePost = (postData: any) => {
    console.log('Bài viết mới:', postData);
  };

  const editProfile = async () => {
    const editProfileForm = new FormData();
    if (userData) {
      editProfileForm.append('name', userName);
      if (selectedAvatarFile) {
        editProfileForm.append('avatarFile', selectedAvatarFile);
      }
      if (selectedCoverFile) {
        editProfileForm.append('coverFile', selectedCoverFile);
      }
      editProfileForm.append('email', userData.email);
      editProfileForm.append('status', userData.status);

      try {
        const response = await axios.put(`http://localhost:8080/api/users/edit-user/${userData.id}`, editProfileForm);
        if (response.status >= 200 && response.status < 300) {
          setUserData(response.data);
          setIsEditFormOpen(false);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log('Lỗi chưa đăng nhập để có thông tin người dùng đăng nhập hiện tại');
    }
  };

  // Lấy avatar
    const getAvatarSrc = (user: user): string => {
      if(user) {
        // Check if base64 data (avatarImage) and content type are available from backend
        if (user.avatarImage && user.avatarContentType) {
            // Correctly format the data URL
            return `data:${user.avatarContentType};base64,${user.avatarImage}`;
        }
        // If no base64 data, check for a remote URL (less common with file uploads but kept for compatibility)
        if (user.avatarUrl) {
            return user.avatarUrl;
        }
      }
        // Fallback to a default placeholder image if no avatar data is available
        // Make sure you have a 'placeholder-avatar.png' in your public directory
        return 'placeholder-avatar.png';
    };

  const editProfile = async () => {
    const editProfileForm = new FormData();
    if(userData) {
      console.log(selectedAvatarFile);
      if (userName.trim() !== "") {
        editProfileForm.append('name', userName);
      } else {
        editProfileForm.append('name', userData.name); // fallback
      }

      if(selectedAvatarFile) {
        editProfileForm.append('avatarFile', selectedAvatarFile)
      }
      if(selectedCoverFile) {
        editProfileForm.append('coverFile', selectedCoverFile);
      }
      editProfileForm.append('email', userData.email);
      editProfileForm.append('status', userData.status);

      try {
        const response = await axios.put(`http://localhost:8080/api/users/edit-user/${userData.id}`, editProfileForm);
        if(response.status >= 200 && response.status < 300) {
          fetchUserData(userData.id);
          setIsEditFormOpen(false);
        }
      } catch(err) {
        console.log(err);
      }
    } else {
      console.log("Lỗi chưa đăng nhập để có thông tin người dùng đăng nhập hiện tại");
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-white-fff">
      {/* Header */}
      <div className="header bg-white w-full flex shadow-lg">
        {/* Phần bên trái (trống) */}
        <div className="w-1/5"></div>
        {/* Phần chính giữa (Center Side) */}
        <div className="w-3/5 rounded-xl">
          <div className="flex flex-col">
            {/* Phần ảnh bìa và ảnh đại diện */}
            <div className="relative">
              <img
                src={coverPreview || (userData?.coverImage && userData.coverContentType ? `data:${userData.coverContentType};base64,${userData.coverImage}` : '/default-cover.jpg')}
                alt="Cover"
                className="w-full h-96 object-cover rounded-b-xl shadow-md"
              />
              {/* Overlay + nút chỉnh sửa ảnh bìa */}
              {currentUser?.id === userId && (
                <label className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-white text-black rounded-md shadow-md cursor-pointer hover:bg-gray-100 transition">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7h2l2-3h10l2 3h2a1 1 0 011 1v11a2 2 0 01-2 2H4a2 2 0 01-2-2V8a1 1 0 011-1z"
                    />
                    <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                  <span className="text-sm font-semibold">Chỉnh sửa ảnh bìa</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </label>
              )}
              {/* Ảnh đại diện */}
              <div className="flex items-end justify-between mt-[-110px] px-6">
                <div className="flex items-end gap-4">
                  <div className="relative">

                    <img
                      src={getAvatarSrc()}
                      alt="Avatar"
                      className="w-[200px] h-[200px] rounded-full border-4 border-white shadow-lg object-cover"
                    />
                    {currentUser?.id === userId && (
                      <label className="absolute bottom-2 right-2 bg-gray-200 p-1 rounded-full cursor-pointer hover:bg-gray-300">
                        <img
                          src="/images/camera1.jpeg"
                          alt="Chọn ảnh đại diện"
                          className="h-5 w-5 object-contain"
                        />
                        <input type="file" className="hidden" onChange={handleAvatarChange} />
                      </label>
                    )}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">{userData?.name}</h1>
                    <p className="text-gray-500">10 người bạn</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  {currentUser?.id === userId && (
                    <button
                      className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg border border-gray-300 flex items-center gap-2 shadow-md hover:bg-gray-200 transition font-semibold"
                      onClick={() => setIsEditFormOpen(true)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                        />
                      </svg>
                      <span>Chỉnh sửa thông tin</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="px-6">
              <div className="mt-6">
                <ProfileTabs setActiveMain={setActiveMain} activeMain={activeMain} />
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/5"></div>
      </div>

      <div className="main w-full flex">
        <div className="w-1/5"></div>
        {activeMain === 'Bạn bè' ? (
          <ProfileFriend />
        ) : activeMain === 'Ảnh' ? (
          <ProfilePhoto />
        ) : (
          <div className="w-3/5 flex flex-row min-h-screen">
            <div className="w-2/5 p-2 rounded-lg">
              <div className="mb-4 rounded-lg p-4 shadow-md bg-white">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold">Ảnh</h2>
                  <button onClick={() => setActiveMain('Ảnh')} className="text-blue-500 hover:underline">
                    Xem tất cả ảnh
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {images.slice(0, 9).map((img, index) => (
                    <img key={index} src={img} className="w-full h-40 object-cover rounded-md" />
                  ))}
                </div>
              </div>
              <div className="mb-4 rounded-lg p-4 shadow-md bg-white">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold">Bạn bè</h2>
                  <button onClick={() => setActiveMain('Bạn bè')} className="text-blue-500 hover:underline">
                    Xem tất cả bạn bè
                  </button>
                </div>
                <p className="text-gray-500">{friends?.length} người bạn</p>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {friends?.slice(0, 9).map((friend, index) => (
                    <div key={index} className="text-center">
                      <img src={friend.requester.id === userData?.id ? getAvatarSrc(friend.receiver) || "/images/default-avatar.png" : getAvatarSrc(friend.requester) || "/images/default-avatar.png"} className="w-full h-30 object-cover rounded-md" />
                      <p className="text-xs font-semibold">{friend.requester.id === userData?.id ? friend.receiver.name : friend.requester.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-3/5 p-2">
              {isEditFormOpen && (
                <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
                  <div className="bg-white p-6 rounded-lg w-96 relative">
                    <button
                      className="absolute top-2 right-2 text-gray-600 hover:text-black"
                      onClick={() => setIsEditFormOpen(false)}
                    >
                      ✕
                    </button>
                    <h2 className="text-xl font-bold mb-4">Chỉnh sửa thông tin</h2>
                    <form className="flex flex-col gap-3">
                      <div>
                        <label className="block text-sm font-semibold">Tên người dùng</label>
                        <input
                          type="text"
                          defaultValue={userData?.name}
                          onChange={(e) => setUserName(e.target.value)}
                          className="w-full border px-3 py-2 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">Ảnh đại diện hiện tại</label>
                        <img
                          src={getAvatarSrc()}
                          alt="Avatar Preview"
                          className="w-24 h-24 rounded-full object-cover mb-2"
                        />
                        <input type="file" accept="image/*" className="w-full" onChange={handleAvatarChange} />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">Ảnh bìa hiện tại</label>
                        <img
                          src={
                            coverPreview ||
                            (userData?.coverImage && userData.coverContentType
                              ? `data:${userData.coverContentType};base64,${userData.coverImage}`
                              : '/default-cover.jpg')
                          }
                          alt="Cover Preview"
                          className="w-full h-32 object-cover mb-2 rounded"
                        />
                        <input type="file" accept="image/*" className="w-full" onChange={handleCoverChange} />
                      </div>
                      <button
                        type="button"
                        className="bg-blue-600 text-white px-4 py-2 mt-4 rounded-md hover:bg-blue-700"
                        onClick={editProfile}
                      >
                        Lưu thay đổi
                      </button>
                    </form>
                  </div>
                </div>
              )}
              <ProfilePost />
            </div>
          </div>
        )}
        <div className="w-1/5"></div>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
  );
};

export default ProfilePage;