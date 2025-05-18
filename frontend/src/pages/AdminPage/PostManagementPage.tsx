import axios, { AxiosError } from "axios";
import React, { useEffect, useRef, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  avatarUrl: string;
}

interface Comment {
  id: number;
  user: User;
  content: string;
  createdAt: string;
  post: Post;
}

interface Like {
  id: number;
  user: User;
  comment: Comment | null;
  createdAt: string;
  post: Post;
}

interface Post {
  id: number;
  user: User;
  content: string;
  imageUrl?: string;
  imageContentType: string;
  videoUrl?: string;
  status: string;
  createdAt: string;
  comments: Comment[];
  likes: Like[];
}

const PostManagementPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [showAddPostForm, setShowAddPostForm] = useState(false);
  const [showEditPostForm, setShowEditPostForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPostDetailForm, setShowPostDetailForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [activeTab, setActiveTab] = useState<"comments" | "likes">("comments");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [validateError, setValidateError] = useState<{ [key: string]: string }>({});

  // State cho form thêm bài đăng
  const [postContent, setPostContent] = useState<string>("");
  const [postImageUrl, setPostImageUrl] = useState<string>("");
  const [postVideoUrl, setPostVideoUrl] = useState<string>("");
  const [postImageContentType, setPostImageContentType] = useState<string>("");


  // State cho form sửa bài đăng
  const [editPostId, setEditPostId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [editImageUrl, setEditImageUrl] = useState<string>("");
  const [editVideoUrl, setEditVideoUrl] = useState<string>("");
  const [editStatus, setEditStatus] = useState<string>("");
  const [editImageContentType, setEditImageContentType] = useState<string>("");

  // State cho xóa bài đăng
  const [deletePostId, setDeletePostId] = useState<number | null>(null);

  // State cho bình luận
  const [newCommentContent, setNewCommentContent] = useState<string>("");
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [editCommentContent, setEditCommentContent] = useState<string>("");

  // State cho bộ lọc
  const [searchTermPost, setSearchTermPost] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterContentType, setFilterContentType] = useState("");

  useEffect(() => {}, [searchTermPost, filterStatus, startDate, endDate, filterContentType]);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.content && typeof post.content === "string"
        ? post.content.toLowerCase().includes((searchTermPost || "").toLowerCase())
        : true;
    const matchesStatus = filterStatus ? post.status === filterStatus : true;
    const matchesStartDate = !startDate || new Date(post.createdAt) >= new Date(startDate);
    const matchesEndDate = !endDate || new Date(post.createdAt) <= new Date(endDate);
    const matchesContentType = filterContentType
      ? (filterContentType === "image" && post.imageUrl) ||
        (filterContentType === "video" && post.videoUrl) ||
        (filterContentType === "none" && !post.imageUrl && !post.videoUrl)
      : true;
    return matchesSearch && matchesStatus && matchesStartDate && matchesEndDate && matchesContentType;
  });

  const getImageSrc = (post: Post): string => {
    // Check if base64 data (avatarImage) and content type are available from backend
    if (post.imageUrl && post.imageContentType) {
        // Correctly format the data URL
        return `data:${post.imageContentType};base64,${post.imageUrl}`;
    }
    
    // Fallback to a default placeholder image if no avatar data is available
    // Make sure you have a 'placeholder-avatar.png' in your public directory
    return 'placeholder-avatar.png';
};

  // Ref cho thẻ canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Kích thước tối đa mong muốn cho ảnh avatar
  const MAX_AVATAR_WIDTH = 200; // Ví dụ: chiều rộng tối đa 200px
  const MAX_AVATAR_HEIGHT = 200; // Ví dụ: chiều cao tối đa 200px
  const JPEG_QUALITY = 0.8; // Chất lượng nén cho JPEG (0.0 đến 1.0)
  // Hàm xử lý khi người dùng chọn file, bao gồm logic thu nhỏ ảnh
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null; // Lấy file đầu tiên

    // Reset state trước khi xử lý file mới hoặc nếu không có file
    setSelectedImageFile(null);
    // Clear validation error specifically for avatarFile

    if (!file) {
        console.log("No file selected.");
        return; // Dừng lại nếu không có file
    }

    // Kiểm tra loại file cơ bản
    if (file.type.startsWith('image/')) {
      // Kiểm tra kích thước file (ví dụ: max 10MB trước khi resize)
      const MAX_FILE_SIZE_BEFORE_RESIZE = 10 * 1024 * 1024; // 10MB
      if (file.size > MAX_FILE_SIZE_BEFORE_RESIZE) {
            setValidateError(prev => ({ ...prev, avatarFile: `Kích thước file ảnh quá lớn (${(file.size / 1024 / 1024).toFixed(2)}MB). Vui lòng chọn ảnh nhỏ hơn 10MB.` }));
            console.error("File size too large before resize.");
            // Reset input file
            if (e.target) e.target.value = '';
            return;
      }


      console.log("Original file selected:", file.name, file.type, (file.size / 1024).toFixed(2) + " KB");

      // Sử dụng FileReader để đọc file
      const reader = new FileReader();

      // Sử dụng Promise để đợi FileReader đọc xong
      const fileReadPromise = new Promise<string>((resolve, reject) => {
          reader.onload = (event) => resolve(event.target?.result as string);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file); // Đọc file dưới dạng Data URL (Base64)
      });

      try {
        const dataUrl = await fileReadPromise; // Đợi FileReader đọc xong, lấy Data URL

        // Tạo đối tượng Image để tải ảnh vào bộ nhớ
        const img = new Image();

        // Sử dụng Promise để đợi Image tải xong
        const imageLoadPromise = new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = (error) => reject(error);
            img.src = dataUrl; // Gán Data URL để Image tải ảnh
        });

        await imageLoadPromise; // Đợi Image tải xong

        // Lấy thẻ canvas từ ref
        const canvas = canvasRef.current;
        // Kiểm tra canvas element
        if (!canvas) {
              console.error("Canvas element not found. Ensure <canvas ref={canvasRef}> is in the DOM.");
              setError("Lỗi nội bộ: Không tìm thấy canvas xử lý ảnh.");
              // Reset input file
              if (e.target) e.target.value = '';
              return;
        }
        const ctx = canvas.getContext('2d');
          if (!ctx) {
              console.error("Canvas context not found.");
              setError("Lỗi nội bộ: Không lấy được context canvas.");
              // Reset input file
              if (e.target) e.target.value = '';
              return;
        }


        // Tính toán kích thước mới để giữ tỷ lệ khung hình
        let width = img.width;
        let height = img.height;

        // Chỉ thu nhỏ nếu ảnh lớn hơn kích thước tối đa
        if (width > MAX_AVATAR_WIDTH || height > MAX_AVATAR_HEIGHT) {
            if (width > height) {
                // Ảnh ngang
                height = Math.round(height * (MAX_AVATAR_WIDTH / width));
                width = MAX_AVATAR_WIDTH;
            } else {
                // Ảnh dọc hoặc vuông
                width = Math.round(width * (MAX_AVATAR_HEIGHT / height));
                height = MAX_AVATAR_HEIGHT;
            }
        }
        // Nếu ảnh nhỏ hơn kích thước tối đa, giữ nguyên kích thước
        else {
            width = img.width;
            height = img.height;
        }


        // Đặt kích thước cho canvas
        canvas.width = width;
        canvas.height = height;

        // Xóa nội dung canvas cũ (nếu có)
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Vẽ ảnh gốc lên canvas với kích thước mới (thu nhỏ/phóng to nếu cần)
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);

        // Xuất ảnh từ canvas dưới dạng Blob (định dạng file gốc nếu hỗ trợ, hoặc JPEG)
        // Sử dụng Promise để đợi toBlob xử lý xong
        const blobPromise = new Promise<Blob | null>((resolve) => {
            // Kiểm tra xem file gốc có phải là JPEG không để áp dụng chất lượng nén
            const outputMimeType = file.type === 'image/jpeg' ? 'image/jpeg' : 'image/png'; // Giữ nguyên định dạng gốc hoặc dùng png
            const quality = outputMimeType === 'image/jpeg' ? JPEG_QUALITY : undefined; // Áp dụng chất lượng chỉ cho JPEG

            canvas.toBlob((blob) => {
                resolve(blob);
            }, outputMimeType, quality);
        });

        const resizedBlob = await blobPromise; // Đợi Blob được tạo

        if (resizedBlob) {
          // Tạo một đối tượng File từ Blob để có tên file (tùy chọn nhưng hữu ích)
          // Blob không có tên file, File kế thừa từ Blob và có tên
          const resizedFile = new File([resizedBlob], file.name, { type: resizedBlob.type, lastModified: Date.now() });

          setSelectedImageFile(resizedFile); // Lưu File đã resize vào state
          console.log("Resized file created:", resizedFile.name, resizedFile.type, (resizedFile.size / 1024).toFixed(2) + " KB");

          // Có thể thêm validation kích thước file sau khi resize ở đây nếu cần
          const MAX_FILE_SIZE_AFTER_RESIZE = 5 * 1024 * 1024; // Ví dụ: max 5MB sau resize
          if (resizedFile.size > MAX_FILE_SIZE_AFTER_RESIZE) {
              setValidateError(prev => ({ ...prev, avatarFile: `Kích thước ảnh sau khi xử lý quá lớn (${(resizedFile.size / 1024 / 1024).toFixed(2)}MB).` }));
              console.error("File size too large after resize.");
              // Có thể reset selectedImageFile(null) ở đây nếu không cho phép upload ảnh lớn sau resize
          }
        } else {
            console.error("Failed to create resized image Blob.");
            setError("Lỗi xử lý ảnh: Không thể tạo file ảnh đã thu nhỏ.");
            setSelectedImageFile(null); // Đảm bảo state là null nếu xử lý thất bại
              // Reset input file
              if (e.target) e.target.value = '';
        }
      } catch (error) {
          console.error("Error during image processing:", error);
          setError("Có lỗi xảy ra khi xử lý ảnh.");
          setSelectedImageFile(null); // Đảm bảo state là null nếu có lỗi
            // Reset input file
            if (e.target) e.target.value = '';
      }
    } else if(file.type.startsWith('video/')) {
      // --- Kiểm tra kích thước file (Tùy chọn) ---
      // Ví dụ: Giới hạn kích thước video tối đa là 500MB
      const MAX_VIDEO_SIZE_BYTES = 500 * 1024 * 1024; // 500 MB
      if (file.size > MAX_VIDEO_SIZE_BYTES) {
          // Nếu file quá lớn, set lỗi validate
          setValidateError(prev => ({ ...prev, mediaFile: `Kích thước file video quá lớn (${(file.size / 1024 / 1024).toFixed(2)}MB). Vui lòng chọn file nhỏ hơn ${MAX_VIDEO_SIZE_BYTES / (1024 * 1024)}MB.` }));
          console.error("Video file size too large:", file.size);
          // Xóa file đã chọn trong input
          if (e.target) e.target.value = '';
          return;
      }

      // --- Lưu đối tượng File video đã chọn vào state ---
      // selectedVideoFile state sẽ giữ đối tượng File này, sẵn sàng để gửi lên backend sau
      setSelectedVideoFile(file);
      setPostVideoUrl(URL.createObjectURL(file));
      if(selectedVideoFile==null){
        console.log("hello no video sad");
      }
    }
  };


  const getStatusStyle = (status: string): React.CSSProperties => {
    if (status === "Đã xuất bản")
      return { color: "#28a745", fontWeight: "bold", padding: "2px 6px" };
    if (status === "Chặn")
      return { color: "#fd7e14", fontWeight: "bold", padding: "2px 6px" };
    if (status === "Đang chờ duyệt")
      return { color: "#007bff", fontWeight: "bold", padding: "2px 6px" };
    return { color: "#6c757d", fontWeight: "bold", padding: "2px 6px" };
  };

  const getAllPosts = async () => {
    try {
        const response = await axios.get<Post[]>("http://localhost:8080/api/posts/get-all-posts");
        setPosts(response.data);
        if (response.data.length === 0) {
            console.warn("Danh sách bài đăng rỗng!");
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Lỗi khi gọi API getAllPosts:", error.message);
            console.error("Chi tiết lỗi:", error.response?.data);
            console.error("Mã lỗi HTTP:", error.response?.status);
            setError(`Lỗi API: ${error.message} - Mã lỗi: ${error.response?.status}`);
        } else {
            console.error("Lỗi không xác định:", error);
            setError("Đã xảy ra lỗi không xác định. Vui lòng thử lại!");
        }
    }
  };

  const toggleAddPostForm = () => {
    setShowAddPostForm(!showAddPostForm);
    setError("");
    setSuccess("");
    setPostContent("");
    setPostImageUrl("");
    setPostVideoUrl("");
  };

  const toggleEditPostForm = (post?: Post) => {
    if (post) {
      setEditPostId(post.id);
      setEditContent(post.content || "");
      setEditImageUrl(post.imageUrl || "");
      setEditVideoUrl(post.videoUrl || "");
      setEditStatus(post.status || "Đang chờ duyệt");
      setShowEditPostForm(true);
    } else {
      setShowEditPostForm(false);
      setEditPostId(null);
      setEditContent("");
      setEditImageUrl("");
      setEditVideoUrl("");
      setEditStatus("");
    }
    setError("");
    setSuccess("");
  };

  const toggleDeleteConfirm = (postId?: number) => {
    if (postId) {
      setDeletePostId(postId);
      setShowDeleteConfirm(true);
    } else {
      setDeletePostId(null);
      setShowDeleteConfirm(false);
    }
  };

  const togglePostDetailForm = (post?: Post) => {
    if (post) {
      setSelectedPost(post);
      setShowPostDetailForm(true);
      setActiveTab("comments");
      // fetchComments(post.id);
    } else {
      setSelectedPost(null);
      setShowPostDetailForm(false);
      setActiveTab("comments");
      setNewCommentContent("");
      setEditCommentId(null);
      setEditCommentContent("");
    }
    setError("");
    setSuccess("");
  };

  const AddPost = async () => {
    if (!postContent.trim() && !selectedImageFile && !selectedVideoFile) {
      setError("Bài viết không được để trống.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    const addForm = new FormData();
    addForm.append('content', postContent);
    if(selectedImageFile) {
      addForm.append('imageFile', selectedImageFile, selectedImageFile?.name);
    }
    addForm.append('videoUrl', postVideoUrl);
    addForm.append('status', "Đang chờ duyệt");
    if(selectedVideoFile != null){
     addForm.append('videoFile', selectedVideoFile);
    }

    try {
      // const userId = 1; // TODO: Thay bằng ID người dùng đã xác thực
      const response = await axios.post(
        `http://localhost:8080/api/posts/create-post`,
        addForm
      );

      setSuccess("Bài đăng đã được tạo thành công!");
      toggleAddPostForm();
      setSearchTermPost("");
      setFilterStatus("");
      setStartDate("");
      setEndDate("");
      setFilterContentType("");
      await getAllPosts();
    } finally {
      setIsLoading(false);
    }
  };

  const EditPost = async () => {
    if (!editContent.trim() && !selectedImageFile && !selectedVideoFile) {
      setError("Bài viết không được để trống.");
      return;
    }
    if (!editStatus) {
      setError("Trạng thái bài viết không được để trống.");
      return;
    }

    if (!editPostId) {
      setError("Không tìm thấy ID bài đăng để sửa.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    const editForm = new FormData();
    editForm.append('content', editContent);
    editForm.append('videoUrl', editVideoUrl);
    editForm.append('status', editStatus);
    if(selectedImageFile) {
      editForm.append('imageFile', selectedImageFile);
    }
    if(selectedVideoFile) {
      editForm.append('videoFile', selectedVideoFile);
    }
    try {
      const response = await axios.put(
        `http://localhost:8080/api/posts/update-post/${editPostId}`,
        editForm
      );

      setSuccess("Bài đăng đã được sửa thành công!");
      toggleEditPostForm();
      await getAllPosts();
    } finally {
      setIsLoading(false);
    }
  };

  const DeletePost = async () => {
    if (!deletePostId) {
      setError("Không tìm thấy ID bài đăng để xóa.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.delete(
        `http://localhost:8080/api/posts/delete-post/${deletePostId}`
      );

      setSuccess("Bài đăng đã được xóa thành công!");
      toggleDeleteConfirm();
      await getAllPosts();
    } catch (err) {
      let errorMessage = "Xóa bài không thành công. Vui lòng thử lại!";
      if (err instanceof AxiosError) {
        const responseData = err.response?.data;
        console.error("Chi tiết lỗi từ server (DeletePost):", {
          status: err.response?.status,
          data: responseData,
          headers: err.response?.headers,
          message: err.message,
        });
        errorMessage = typeof responseData === "string"
          ? responseData
          : responseData && typeof responseData === "object"
            ? JSON.stringify(responseData)
            : errorMessage;
      } else {
        console.error("Lỗi không xác định (DeletePost):", err);
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // API cho bình luận
  const fetchComments = async (postId: number): Promise<Comment[]> => {
    console.log("Hello guyzzz");
    try {
      const response = await axios.get(`http://localhost:8080/api/comments/post/${postId}`);
      setComments(response.data);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy bình luận:", error);
      return [];
    }
  };

  const addComment = async () => {
    if (!newCommentContent.trim()) {
      setError("Nội dung bình luận không được để trống.");
      return;
    }
    if (!selectedPost) {
      setError("Không tìm thấy bài đăng để thêm bình luận.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      const commentData = {
        content: newCommentContent,
        post: { id: selectedPost.id },
        user: { id: 1 }, // TODO: Thay bằng ID người dùng đã xác thực
        createdAt: new Date().toISOString(),
      };
      await axios.post("http://localhost:8080/api/comments/createComment", commentData);
      setSuccess("Thêm bình luận thành công!");
      setNewCommentContent("");
      const updatedComments = await fetchComments(selectedPost.id);
      setSelectedPost({ ...selectedPost, comments: updatedComments });
    } catch (err) {
      let errorMessage = "Thêm bình luận không thành công. Vui lòng thử lại!";
      if (err instanceof AxiosError) {
        const responseData = err.response?.data;
        errorMessage = typeof responseData === "string" ? responseData : errorMessage;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const editComment = async () => {
    if (!editCommentContent.trim()) {
      setError("Nội dung bình luận không được để trống.");
      return;
    }
    if (!editCommentId || !selectedPost) {
      setError("Không tìm thấy bình luận hoặc bài đăng để sửa.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      const commentData = {
        content: editCommentContent,
        post: { id: selectedPost.id },
        user: { id: 1 }, // TODO: Thay bằng ID người dùng đã xác thực
      };
      await axios.put(`http://localhost:8080/api/comments/updateComment/${editCommentId}`, commentData);
      setSuccess("Sửa bình luận thành công!");
      setEditCommentId(null);
      setEditCommentContent("");
      const updatedComments = await fetchComments(selectedPost.id);
      setSelectedPost({ ...selectedPost, comments: updatedComments });
    } catch (err) {
      let errorMessage = "Sửa bình luận không thành công. Vui lòng thử lại!";
      if (err instanceof AxiosError) {
        const responseData = err.response?.data;
        errorMessage = typeof responseData === "string" ? responseData : errorMessage;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteComment = async (commentId: number) => {
    if (!selectedPost) {
      setError("Không tìm thấy bài đăng để xóa bình luận.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      await axios.delete(`http://localhost:8080/api/comments/deleteComment/${commentId}`);
      setSuccess("Xóa bình luận thành công!");
      const updatedComments = await fetchComments(selectedPost.id);
      setSelectedPost({ ...selectedPost, comments: updatedComments });
    } catch (err) {
      let errorMessage = "Xóa bình luận không thành công. Vui lòng thử lại!";
      if (err instanceof AxiosError) {
        const responseData = err.response?.data;
        errorMessage = typeof responseData === "string" ? responseData : errorMessage;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // API cho lượt thích
  const fetchLikes = async (postId: number): Promise<Like[]> => {
    try {
      const response = await axios.get(`http://localhost:8080/api/likes/post/${postId}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy lượt thích:", error);
      return [];
    }
  };

  const addLike = async () => {
    if (!selectedPost) {
      setError("Không tìm thấy bài đăng để thêm lượt thích.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      const likeData = {
        post: { id: selectedPost.id },
        user: { id: 1 }, // TODO: Thay bằng ID người dùng đã xác thực
        comment: null,
        createdAt: new Date().toISOString(),
      };
      await axios.post("http://localhost:8080/api/likes/createLike", likeData);
      setSuccess("Thêm lượt thích thành công!");
      const updatedLikes = await fetchLikes(selectedPost.id);
      setSelectedPost({ ...selectedPost, likes: updatedLikes });
    } catch (err) {
      let errorMessage = "Thêm lượt thích không thành công. Vui lòng thử lại!";
      if (err instanceof AxiosError) {
        const responseData = err.response?.data;
        errorMessage = typeof responseData === "string" ? responseData : errorMessage;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteLike = async (likeId: number) => {
    if (!selectedPost) {
      setError("Không tìm thấy bài đăng để xóa lượt thích.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      await axios.delete(`http://localhost:8080/api/likes/deleteLike/${likeId}`);
      setSuccess("Xóa lượt thích thành công!");
      const updatedLikes = await fetchLikes(selectedPost.id);
      setSelectedPost({ ...selectedPost, likes: updatedLikes });
    } catch (err) {
      let errorMessage = "Xóa lượt thích không thành công. Vui lòng thử lại!";
      if (err instanceof AxiosError) {
        const responseData = err.response?.data;
        errorMessage = typeof responseData === "string" ? responseData : errorMessage;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const blockComment = async (commentId: number) => {
    setSuccess("Chặn bình luận thành công!"); // TODO: Thêm logic chặn bình luận
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  useEffect(() => {
    if (showPostDetailForm && selectedPost) {
      if (activeTab === "comments") {
        fetchComments(selectedPost.id);
      } else if (activeTab === "likes") {
        fetchLikes(selectedPost.id).then((likes) => {
          setSelectedPost({ ...selectedPost, likes });
        });
      }
    }
  }, [showPostDetailForm, selectedPost, activeTab]);

  return (
    <div style={styles.container}>
      <div style={styles.panel}>
        <h2 style={styles.panelTitle}>Quản lý bài đăng</h2>
      </div>

      <div style={styles.postManagement}>
        <input
          type="text"
          placeholder="Tìm kiếm bài viết..."
          value={searchTermPost}
          onChange={(e) => setSearchTermPost(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="">-- Tất cả trạng thái --</option>
          <option value="Đã xuất bản">Đã xuất bản</option>
          <option value="Chặn">Chặn</option>
          <option value="Đang chờ duyệt">Đang chờ duyệt</option>
        </select>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={styles.filterSelect}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={styles.filterSelect}
        />
        <select
          value={filterContentType}
          onChange={(e) => setFilterContentType(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="">-- Loại nội dung --</option>
          <option value="image">Có ảnh</option>
          <option value="video">Có video</option>
          <option value="none">Không có ảnh và video</option>
        </select>
      </div>

      <div style={styles.PostButtonContainer}>
        <button style={styles.functionPostButton} onClick={toggleAddPostForm}>
          Thêm bài đăng
        </button>
      </div>

      <div style={styles.cardContainer}>
        {filteredPosts.length === 0 && (
          <p>Không có bài đăng nào để hiển thị. Hãy thử thay đổi bộ lọc.</p>
        )}
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            style={{ ...styles.card, cursor: "pointer" }}
            onClick={() => togglePostDetailForm(post)}
          >
            {post.imageUrl && (
              <img src={getImageSrc(post)} alt="Post" style={styles.cardImage} />
            )}
            {post.videoUrl && !post.imageUrl && (
              <video controls style={styles.cardImage}>
                <source src={post.videoUrl} type="video/mp4" />
                Trình duyệt không hỗ trợ video.
              </video>
            )}
            <div style={styles.cardContent}>
              <p>{post.content}</p>
              <p>
                <b>Tác giả:</b> {post.user.name}
              </p>
              <p>
                <b>Ngày đăng:</b> {new Date(post.createdAt).toLocaleString()}
              </p>
              <p>
                <b>Trạng thái:</b>{" "}
                <span style={getStatusStyle(post.status)}>{post.status}</span>
              </p>
              <div style={styles.cardActions}>
                <button style={styles.actionButton} onClick={(e) => { e.stopPropagation(); toggleEditPostForm(post); }}>
                  Sửa
                </button>
                <button style={styles.actionButton} onClick={(e) => { e.stopPropagation(); toggleDeleteConfirm(post.id); }}>
                  Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddPostForm && (
        <div style={styles.formOverlay}>
          <div style={styles.formContainer}>
            <button style={styles.closeButton} onClick={toggleAddPostForm}>
              X
            </button>
            <h1>Đăng bài</h1>
            {error && <p style={styles.validateErrors}>{error}</p>}
            {success && <p style={{ color: "green", marginBottom: "10px" }}>{success}</p>}
            <label>Nội dung bài:</label>
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Nội dung bài viết"
              style={{ width: "100%", minHeight: "100px", marginBottom: "10px" }}
            />
            <label>Đăng ảnh/video:</label>
            <input
              type="file"
              accept="image/*, video/*"
              onChange={handleFile}
              style={{ width: "100%", marginBottom: "10px" }}
            />
            <button style={styles.functionPostButton} onClick={AddPost} disabled={isLoading}>
              {isLoading ? "Đang đăng..." : "Đăng bài"}
            </button>
          </div>
        </div>
      )}

      {showEditPostForm && (
        <div style={styles.formOverlay}>
          <div style={styles.formContainer}>
            <button style={styles.closeButton} onClick={() => toggleEditPostForm()}>
              X
            </button>
            <h1>Sửa bài đăng</h1>
            {error && <p style={styles.validateErrors}>{error}</p>}
            {success && <p style={{ color: "green", marginBottom: "10px" }}>{success}</p>}
            <label>Nội dung bài:</label>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Nội dung bài viết"
              style={{ width: "100%", minHeight: "100px", marginBottom: "10px" }}
            />
            <label>Đăng ảnh/video:</label>
            <input
              type="file"
              accept="image/*, video/*"
              onChange={handleFile}
              style={{ width: "100%", marginBottom: "10px" }}
            />
            <label>Trạng thái:</label>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            >
              <option value="Đã xuất bản">Đã xuất bản</option>
              <option value="Chặn">Chặn</option>
              <option value="Đang chờ duyệt">Đang chờ duyệt</option>
            </select>
            <button style={styles.functionPostButton} onClick={EditPost} disabled={isLoading}>
              {isLoading ? "Đang sửa..." : "Lưu thay đổi"}
            </button>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div style={styles.formOverlay}>
          <div style={styles.formContainer}>
            <h1>Xác nhận xóa</h1>
            <p>Bạn có chắc chắn muốn xóa bài đăng này?</p>
            {error && <p style={styles.validateErrors}>{error}</p>}
            {success && <p style={{ color: "green", marginBottom: "10px" }}>{success}</p>}
            <div style={{ display: "flex", gap: "10px" }}>
              <button style={styles.functionPostButton} onClick={DeletePost} disabled={isLoading}>
                {isLoading ? "Đang xóa..." : "Xóa"}
              </button>
              <button
                style={{ ...styles.functionPostButton, backgroundColor: "#6c757d" }}
                onClick={() => toggleDeleteConfirm()}
                disabled={isLoading}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {showPostDetailForm && selectedPost && (
        <div style={styles.formOverlay}>
          <div style={{ ...styles.formContainer, width: "1000px", maxHeight: "90vh", display: "flex" }}>
            <button style={styles.closeButton} onClick={() => togglePostDetailForm()}>
              X
            </button>
            {/* Phần bên trái: Chi tiết bài đăng */}
            <div style={{ flex: 1, padding: "20px", overflowY: "auto", borderRight: "1px solid #ccc" }}>
              <h2>Chi tiết bài đăng</h2>
              {selectedPost.imageUrl && (
                <img src={getImageSrc(selectedPost)} alt="Post" style={{ ...styles.cardImage, width: "100%" }} />
              )}
              {selectedPost.videoUrl && !selectedPost.imageUrl && (
                <video controls style={{ ...styles.cardImage, width: "100%" }}>
                  <source src={selectedPost.videoUrl} type="video/mp4" />
                  Trình duyệt không hỗ trợ video.
                </video>
              )}
              <p><b>Nội dung:</b> {selectedPost.content}</p>
              <p><b>Tác giả:</b> {selectedPost.user.name}</p>
              <p><b>Email tác giả:</b> {selectedPost.user.email}</p>
              <p><b>Ngày đăng:</b> {new Date(selectedPost.createdAt).toLocaleString()}</p>
              <p><b>Trạng thái:</b> <span style={getStatusStyle(selectedPost.status)}>{selectedPost.status}</span></p>
            </div>
            {/* Phần bên phải: Quản lý bình luận/lượt thích */}
            <div style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <button
                  style={{
                    ...styles.tabButton,
                    backgroundColor: activeTab === "comments" ? "#007bff" : "#6c757d",
                  }}
                  onClick={() => setActiveTab("comments")}
                >
                  Bình luận
                </button>
                <button
                  style={{
                    ...styles.tabButton,
                    backgroundColor: activeTab === "likes" ? "#007bff" : "#6c757d",
                  }}
                  onClick={() => setActiveTab("likes")}
                >
                  Lượt thích
                </button>
              </div>
              <div style={{ flex: 1, overflowY: "auto", marginBottom: "20px" }}>
                {activeTab === "comments" && (
                  <div>
                    {editCommentId ? (
                      <div style={{ marginBottom: "20px" }}>
                        <textarea
                          value={editCommentContent}
                          onChange={(e) => setEditCommentContent(e.target.value)}
                          placeholder="Sửa nội dung bình luận"
                          style={{ width: "100%", minHeight: "80px", marginBottom: "10px" }}
                        />
                        <button style={styles.actionButton} onClick={editComment} disabled={isLoading}>
                          Lưu
                        </button>
                        <button
                          style={{ ...styles.actionButton, backgroundColor: "#6c757d", marginLeft: "10px" }}
                          onClick={() => { setEditCommentId(null); setEditCommentContent(""); }}
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <div style={{ marginBottom: "20px" }}>
                        <textarea
                          value={newCommentContent}
                          onChange={(e) => setNewCommentContent(e.target.value)}
                          placeholder="Thêm bình luận mới"
                          style={{ width: "100%", minHeight: "80px", marginBottom: "10px" }}
                        />
                        <button style={styles.actionButton} onClick={addComment} disabled={isLoading}>
                          Thêm bình luận
                        </button>
                      </div>
                    )}
                    {(comments || []).map((comment) => (
                      <div key={comment.id} style={styles.commentItem}>
                        <p>
                          <b>{comment.user.name}</b> ({new Date(comment.createdAt).toLocaleString()})
                        </p>
                        <p>{comment.content}</p>
                        {/* <p>Lượt thích: {comment.likes.length}</p> */}
                        <button
                          style={{ ...styles.actionButton, padding: "5px 10px", marginRight: "5px" }}
                          onClick={() => {
                            setEditCommentId(comment.id);
                            setEditCommentContent(comment.content);
                          }}
                        >
                          Sửa
                        </button>
                        <button
                          style={{ ...styles.actionButton, padding: "5px 10px", marginRight: "5px" }}
                          onClick={() => deleteComment(comment.id)}
                        >
                          Xóa
                        </button>
                        <button
                          style={{ ...styles.actionButton, padding: "5px 10px" }}
                          onClick={() => blockComment(comment.id)}
                        >
                          Chặn
                        </button>
                      </div>
                    ))}
                    {(!selectedPost.comments || selectedPost.comments.length === 0) && (
                      <p>Chưa có bình luận nào.</p>
                    )}
                  </div>
                )}
                {activeTab === "likes" && (
                  <div>
                    {(selectedPost.likes || []).map((like) => (
                      <div key={like.id} style={styles.commentItem}>
                        <p>
                          <b>{like.user.name}</b> đã thích bài đăng ({new Date(like.createdAt).toLocaleString()})
                        </p>
                        <button
                          style={{ ...styles.actionButton, padding: "5px 10px", marginRight: "5px" }}
                          onClick={() => deleteLike(like.id)}
                        >
                          Bỏ thích
                        </button>
                      </div>
                    ))}
                    {(!selectedPost.likes || selectedPost.likes.length === 0) && (
                      <p>Chưa có lượt thích nào.</p>
                    )}
                  </div>
                )}
              </div>
              {activeTab === "likes" && (
                <div style={{ display: "flex", gap: "10px" }}>
                  <button style={styles.actionButton} onClick={addLike} disabled={isLoading}>
                    Thích
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "20px",
    fontFamily: "'Arial', sans-serif",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  panel: {
    backgroundColor: "#f5f5f5",
    padding: "10px 20px",
    marginBottom: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  panelTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333",
  },
  postManagement: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  searchInput: {
    flex: 1,
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  filterSelect: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    transition: "0.3s",
    height: "300px",
  },
  cardImage: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
  },
  cardContent: {
    padding: "10px",
    fontSize: "12px",
  },
  cardActions: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  actionButton: {
    padding: "8px 12px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  tabButton: {
    padding: "8px 12px",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  PostButtonContainer: {
    marginBottom: "20px",
    textAlign: "right",
  },
  functionPostButton: {
    padding: "10px 15px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px",
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
    width: "400px",
    maxWidth: "90%",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "#dc3545",
    border: "none",
    color: "#fff",
    fontSize: "16px",
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
  },
  formOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  validateErrors: {
    color: "red",
    marginBottom: "10px",
  },
  commentItem: {
    padding: "10px",
    borderBottom: "1px solid #eee",
    marginBottom: "10px",
  },
};

export default PostManagementPage;