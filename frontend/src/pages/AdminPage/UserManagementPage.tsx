import React, { useEffect, useRef, useState } from "react";
import axios, { AxiosError } from "axios";

// Define the structure for a User object based on backend response
// Make password and avatar fields optional or nullable as they might not always be present/returned
interface User {
    id: number;
    name: string;
    email: string;
    password?: string; // Password should not be returned by GET, make optional
    avatarUrl: string | null; // Can be null if using Base64/BLOB
    avatarImage: string | null; // Can be null if no avatar, or if backend returns Base64 string
    avatarContentType: string | null; // Can be null if no avatar
    bio?: string; // Bio is optional
    status: string;
    createdAt: string | null;
    updatedAt: string | null;
    // Add other potential fields returned by backend, e.g., posts, comments, but make them optional/nullable
    posts?: any[]; // Example: if backend returns posts, make it optional
}

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [showAddUserForm, setShowAddUserForm] = useState(false);
    const [showEditUserForm, setShowEditUserForm] = useState(false);
    // selectedAvatarFile now holds the resized Blob/File
    const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
    const [selectedUserForDetails, setSelectedUserForDetails] = useState<User | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const [error, setError] = useState<string>("");
    const [validateError, setValidateError] = useState<{ [key: string]: string }>({});

    const [id, setId] = useState<number | undefined>();
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [bio, setBio] = useState<string>("");
    // Password state should be empty for edit form initially
    const [password, setPassword] = useState<string>("");
    // avatarUrl state is likely not needed if using Base64/BLOB storage
    // const [avatarUrl, setAvatarUrl] = useState<string>(""); // Removed or keep if needed for other logic
    // Initialize status state with the default value "Active"
    const [status, setStatus] = useState<string>("Active");

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filterStatus, setFilterStatus] = useState<string>("All");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const usersPerPage = 5;

    // Lấy avatar
    const getAvatarSrc = (user: User): string => {
        // Check if base64 data (avatarImage) and content type are available from backend
        if (user.avatarImage && user.avatarContentType) {
            // Correctly format the data URL
            return `data:${user.avatarContentType};base64,${user.avatarImage}`;
        }
        // If no base64 data, check for a remote URL (less common with file uploads but kept for compatibility)
        if (user.avatarUrl) {
            return user.avatarUrl;
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

    // --- File Input Handling with Resize ---
    // Hàm xử lý khi người dùng chọn file, bao gồm logic thu nhỏ ảnh
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null; // Lấy file đầu tiên

        // Reset state trước khi xử lý file mới hoặc nếu không có file
        setSelectedAvatarFile(null);
        // Clear validation error specifically for avatarFile

        if (!file) {
            console.log("No file selected.");
            return; // Dừng lại nếu không có file
        }

        // Kiểm tra loại file cơ bản
        if (!file.type.startsWith('image/')) {
            setValidateError(prev => ({ ...prev, avatarFile: "File phải là định dạng ảnh." }));
            console.error("Selected file is not an image.");
            // Reset input file để người dùng có thể chọn lại
            if (e.target) e.target.value = '';
            return;
        }

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
            // else {
            //     // width = img.width;
            //     // height = img.height;
            // }


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

                setSelectedAvatarFile(resizedFile); // Lưu File đã resize vào state
                console.log("Resized file created:", resizedFile.name, resizedFile.type, (resizedFile.size / 1024).toFixed(2) + " KB");

                // Bạn có thể thêm validation kích thước file sau khi resize ở đây nếu cần
                 const MAX_FILE_SIZE_AFTER_RESIZE = 5 * 1024 * 1024; // Ví dụ: max 5MB sau resize
                 if (resizedFile.size > MAX_FILE_SIZE_AFTER_RESIZE) {
                      setValidateError(prev => ({ ...prev, avatarFile: `Kích thước ảnh sau khi xử lý quá lớn (${(resizedFile.size / 1024 / 1024).toFixed(2)}MB).` }));
                      console.error("File size too large after resize.");
                      // Có thể reset selectedAvatarFile(null) ở đây nếu không cho phép upload ảnh lớn sau resize
                 }


            } else {
                console.error("Failed to create resized image Blob.");
                setError("Lỗi xử lý ảnh: Không thể tạo file ảnh đã thu nhỏ.");
                setSelectedAvatarFile(null); // Đảm bảo state là null nếu xử lý thất bại
                 // Reset input file
                 if (e.target) e.target.value = '';
            }

        } catch (error) {
            console.error("Error during image processing:", error);
            setError("Có lỗi xảy ra khi xử lý ảnh.");
            setSelectedAvatarFile(null); // Đảm bảo state là null nếu có lỗi
             // Reset input file
             if (e.target) e.target.value = '';
        }
    };

    const openDetailModal = (user: User) => {
        setSelectedUserForDetails(user); // Set the user to display in the modal
        setShowDetailModal(true); // Show the modal
    };

    const closeDetailModal = () => {
        setSelectedUserForDetails(null); // Clear the selected user
        setShowDetailModal(false); // Hide the modal
    };

    const getAllUsers = async () => {
        setIsLoading(true);
        setError(""); // Clear previous errors
        try {
            // Adjusted type to expect User[] directly as per previous discussions
            const response = await axios.get<User[]>("http://localhost:8080/api/users/getAllUsers");
            // Ensure response data is an array and process it
            // Map to ensure 'posts' is an empty array if not provided by backend, to match interface
            const data = Array.isArray(response.data)
                ? response.data.map((user) => ({
                      ...user,
                      posts: user.posts || [], // Ensure posts is an array
                      // Ensure avatar fields are nullable if backend sends null
                      avatarImage: user.avatarImage || null,
                      avatarContentType: user.avatarContentType || null,
                      avatarUrl: user.avatarUrl || null,
                      password: user.password || undefined // Password should be optional/undefined
                  }))
                : [];
            console.log("Fetched and processed users:", data);
            setUsers(data); // Update users state
        } catch (error) {
            console.error("API error fetching users:", error);
            setError("Lỗi khi lấy danh sách người dùng."); // Set error message
            setUsers([]); // Ensure users state is an empty array on error
        } finally {
            setIsLoading(false);
        }
    };

    // --- Add User Function ---
    const AddUser = async () => {
        // Pass true to validateForm to indicate adding (password and avatar required)
        if (!validateForm(true)) {
            console.log("Validation failed for AddUser.");
            return;
        }
        console.log("Validation passed for AddUser.");

        const addForm = new FormData();
        addForm.append('name', name);
        addForm.append('email', email);
        // WARNING: Password should be hashed on backend, sending plain text is insecure.
        addForm.append('password', password);
        // Ensure bio is appended, handle if it's an empty string
        addForm.append('bio', bio || ''); // Send empty string if bio state is empty
        // --- Logging status value before appending ---
        console.log("Value of status state before appending to FormData (AddUser):", status);
        // --- End Logging ---
        addForm.append('status', status); // Append the current value of the 'status' state

        // Append the selected avatar file (đã resize/process) if it exists.
        // selectedAvatarFile is a File object created from the resized Blob
        if(selectedAvatarFile) {
            // Append File object to FormData. Backend expects 'avatarFile'.
            // The third argument is the filename, useful for backend.
            addForm.append('avatarFile', selectedAvatarFile, selectedAvatarFile.name);
            console.log("Avatar file appended to FormData (AddUser):", selectedAvatarFile.name, selectedAvatarFile.type, (selectedAvatarFile.size / 1024).toFixed(2) + " KB");
        } else {
            console.log("No avatar file selected or processed for AddUser.");
        }

        try {
            // Send POST request to the registration endpoint
            const response = await axios.post("http://localhost:8080/api/users/register", addForm);
            console.log("Backend response data (AddUser):", response.data); // Log entire response data

            // Check if the response contains a valid user object
            if (response.data && typeof response.data === "object" && "id" in response.data) {
                // Add the newly created user to the local state
                setUsers((prevUsers) => {
                    // Ensure prevUsers is treated as an array
                    const currentUsers = Array.isArray(prevUsers) ? prevUsers : [];
                     // Add the new user, ensuring it has the correct structure and default posts if missing
                    return [...currentUsers, { ...response.data, posts: (response.data as any).posts || [] } as User];
                });
                console.log("User added to local state successfully.");
            } else {
                console.error("Invalid response data after adding user:", response.data);
                setError("Dữ liệu người dùng trả về không hợp lệ.");
                // Do not close the form if response data is invalid
                return;
            }

            // If successful, close the form and reset input fields
            toggleAddUserForm(); // This calls emptyUser()
            console.log("AddUser successful, form closed and reset.");

        } catch (err) {
            console.error("AddUser API error:", err);
            let errorMessage = "Đăng ký không thành công. Vui lòng thử lại!";
             if (err instanceof AxiosError) {
                const responseData = err.response?.data;
                console.error("Axios error response data (AddUser):", responseData); // Log response data from Axios error
                if (responseData) {
                    if (typeof responseData === "string") {
                        errorMessage = responseData;
                    } else if (typeof responseData === "object" && (responseData as any).message) {
                        errorMessage = (responseData as any).message;
                    } else if ((responseData as any).errors) { // Handle backend validation errors
                        // Assuming backend returns errors in a specific format
                        errorMessage = Object.values((responseData as any).errors).join(", ");
                    } else {
                         // Fallback message if no specific message/errors from backend
                         errorMessage = `Lỗi từ server: ${err.response?.status}`;
                    }
                } else {
                     // Message for network errors or no response body
                     errorMessage = `Lỗi mạng hoặc server không phản hồi: ${err.message}`;
                }
            } else if (err instanceof Error) {
                 // Handle other types of JavaScript errors
                 errorMessage = `Lỗi JavaScript: ${err.message}`;
            }

            setError(errorMessage); // Set the error message to display on UI
             console.log("Error message set:", errorMessage);
        }
    };

    // --- Edit User Function ---
    const EditUser = async () => {
        // Pass false to validateForm to indicate editing (password and avatar are optional)
        if (!validateForm(false) || id === undefined) {
             console.log("Validation failed for EditUser or ID is missing.");
             return;
        }
         console.log("Validation passed for EditUser.");


        const editForm = new FormData();
        editForm.append('name', name);
        editForm.append('email', email);
        // Only include password in FormData if it's provided (user wants to change it)
        // WARNING: Password should be hashed on backend!
        if (password) { // Check if password state is not empty
             editForm.append('password', password);
             console.log("Password field included in FormData for EditUser.");
        } else {
             console.log("Password field excluded from FormData for EditUser (empty).");
        }

        // Ensure bio is appended, handle if it's an empty string
        editForm.append('bio', bio || ''); // Send empty string if bio state is empty

        // --- Logging status value before appending ---
        console.log("Value of status state before appending to FormData (EditUser):", status);
        // --- End Logging ---
        editForm.append('status', status); // Append the current value of the 'status' state

        // Append the selected avatar file (đã resize/process) if a new one is chosen
        // selectedAvatarFile is a File object created from the resized Blob
        if(selectedAvatarFile) {
             // Append File object to FormData. Backend expects 'avatarFile'.
             // The third argument is the filename, useful for backend.
            editForm.append('avatarFile', selectedAvatarFile, selectedAvatarFile.name);
             console.log("New avatar file appended to FormData (EditUser):", selectedAvatarFile.name, selectedAvatarFile.type, (selectedAvatarFile.size / 1024).toFixed(2) + " KB");
        } else {
             console.log("No new avatar file selected or processed for EditUser. Keeping existing avatar.");
             // If no new file, the backend should keep the old avatar based on its logic
        }

        try {
            // Send PUT request to update the user
            const response = await axios.put<User>(`http://localhost:8080/api/users/editUser/${id}`, editForm);
            console.log("Backend response data (EditUser):", response.data); // Log entire response data

            // Re-fetch all users to update the table with the edited user's data
            // This is a simple way to update the UI, more complex apps might update state directly
            getAllUsers();
            console.log("EditUser successful, re-fetching all users.");

            // Close the edit user form and reset input fields
            toggleEditUserForm(); // This calls emptyUser()

        } catch (err) {
            console.error("EditUser API error:", err);
            let errorMessage = "Chỉnh sửa không thành công. Vui lòng thử lại!";
             if (err instanceof AxiosError) {
                const responseData = err.response?.data;
                console.error("Axios error response data (EditUser):", responseData); // Log response data from Axios error
                if (responseData) {
                    if (typeof responseData === "string") {
                        errorMessage = responseData;
                    } else if (typeof responseData === "object" && (responseData as any).message) {
                        errorMessage = (responseData as any).message;
                    } else if ((responseData as any).errors) { // Handle backend validation errors
                        errorMessage = Object.values((responseData as any).errors).join(", ");
                    } else {
                         errorMessage = `Lỗi từ server: ${err.response?.status}`;
                    }
                } else {
                     errorMessage = `Lỗi mạng hoặc server không phản hồi: ${err.message}`;
                }
            } else if (err instanceof Error) {
                 errorMessage = `Lỗi JavaScript: ${err.message}`;
            }

            setError(errorMessage); // Set the error message to display
            console.log("Error message set:", errorMessage);
        }
    };

    const filteredUsers = Array.isArray(users)
        ? users.filter((user) => {
            const matchesSearch =
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = filterStatus === "All" || user.status === filterStatus;
            return matchesSearch && matchesStatus;
        })
        : [];

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage) || 1;
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    useEffect(() => {
        // Adjust current page if filtered users change (e.g., after search/filter)
        // If current page is greater than total pages, reset to 1
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        } else if (currentPage === 0 && totalPages > 0) {
             setCurrentPage(1); // Ensure page is at least 1 if there are users
        }
    }, [filteredUsers, totalPages, currentPage]); // Dependencies for the effect


    const toggleAddUserForm = () => {
        setShowAddUserForm(!showAddUserForm);
        // Clear form and errors when showing the form
        if (!showAddUserForm) {
             emptyUser(); // This now resets status to "Active"
        }
        // Clear general error and validation errors when toggling form visibility
        setError("");
        setValidateError({});
    };

    const toggleEditUserForm = () => {
        setShowEditUserForm(!showEditUserForm);
         // Clear form and errors when showing the form
        if (!showEditUserForm) {
             emptyUser(); // This now resets status to "Active"
        }
        // Clear general error and validation errors when toggling form visibility
        setError("");
        setValidateError({});
    };

    // Function to populate the edit form with selected user's data and show the modal
    const selectedEditUser = (user: User) => {
        // Do NOT call toggleEditUserForm() here first, as it calls emptyUser()
        // We want to populate the form *before* showing it.
        setId(user.id);
        setName(user.name);
        setEmail(user.email);
        setBio(user.bio || ''); // Set bio, default to empty string if null
        // Do NOT pre-fill password for security reasons. Set it to empty string.
        setPassword("");
        // Avatar file input will be empty initially for edit.
        // We don't set selectedAvatarFile here as the user needs to choose a *new* file to change it.
        setSelectedAvatarFile(null);
        // Set the status state to the user's current status
        setStatus(user.status);

        // Now show the edit form modal
        setShowEditUserForm(true);
         // Clear general error and validation errors when opening the form
        setError("");
        setValidateError({});
    };

    // Function to clear the form input fields and selected file
    const emptyUser = () => {
        setId(undefined);
        setName("");
        setEmail("");
        setBio("");
        setPassword(""); // Clear password field
        setSelectedAvatarFile(null); // Clear selected file (đã resize)
        // Reset status to the default value "Active"
        setStatus("Active");
        setValidateError({}); // Clear validation errors
        setError(""); // Clear general error
    };

    const deleteUser = async (id: number) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
            try {
                await axios.delete(`http://localhost:8080/api/users/deleteUser/${id}`);
                console.log("User deleted:", id);
                // Re-fetch users to update the table
                getAllUsers();
            } catch (err) {
                console.error("DeleteUser error:", err);
                 let errorMessage = "Xóa không thành công. Vui lòng thử lại!";
                 if (err instanceof AxiosError) {
                    const responseData = err.response?.data;
                    if (responseData) {
                        if (typeof responseData === "string") {
                            errorMessage = responseData;
                        } else if (typeof responseData === "object" && (responseData as any).message) {
                            errorMessage = (responseData as any).message;
                        } else if ((responseData as any).errors) {
                            errorMessage = Object.values((responseData as any).errors).join(", ");
                        }
                    }
                }
                setError(errorMessage);
            }
        }
    };

    // --- Validation ---
    // Function to validate form inputs
    // Added isAdding argument back
    const validateForm = (isAdding: boolean) => {
        const newErrors: { [key: string]: string } = {};

        if (!name.trim()) {
            newErrors.name = "Tên không được để trống";
        }
        if (!email.trim()) {
            newErrors.email = "Email không được để trống";
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            newErrors.email = "Email phải có dạng user@domain.com";
        }

        // Password validation is required only when adding a user or if password is provided during edit
        // Check if password is required (isAdding) OR if password field is not empty (for edit)
        if (isAdding || password.trim()) {
             if (!password.trim()) {
                newErrors.password = "Password không được để trống";
            } else if (password.trim().length < 6) { // Example: minimum password length
                 newErrors.password = "Password phải có ít nhất 6 ký tự";
            }
        }

        // Avatar file validation is required only when adding a user
        // selectedAvatarFile now holds the processed file (Blob/File)
        if (isAdding && !selectedAvatarFile) { // File is required when adding
             newErrors.avatarFile = "Vui lòng chọn ảnh đại diện";
        }
        // Validation for file type and size after resize is handled in handleFileChange
        // If handleFileChange sets an error in validateError.avatarFile, it will be displayed


        setValidateError(newErrors); // Update validation errors state
        // Return true if no errors AND no existing avatarFile validation error from handleFileChange
        // Need to check validateError.avatarFile directly from state as setValidateError is async
        // A simpler way is to check if newErrors has any keys OR if the specific avatarFile error exists
        const formHasErrors = Object.keys(newErrors).length > 0;
        const avatarFileErrorExists = validateError.avatarFile !== undefined; // Check the state directly

        // Return true if no form errors AND no avatar file error
        return !formHasErrors && !avatarFileErrorExists;
    };


    const goToPage = (page: number) => {
        setCurrentPage(page);
    };

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    // --- Initial Data Fetch ---
    useEffect(() => {
        getAllUsers();
    }, []); // Empty dependency array ensures this runs only once on mount

    // --- Rendering ---
    return (
        <div style={styles.container}>
            <div style={styles.panel}>
                <h2 style={styles.panelTitle}>Quản lý người dùng</h2>
            </div>
            <div style={styles.toolbar}>
                <div style={styles.searchFilterContainer}>
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên hoặc email..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        style={styles.searchInput}
                    />
                    <select
                        value={filterStatus}
                        onChange={(e) => {
                            setFilterStatus(e.target.value);
                            setCurrentPage(1);
                        }}
                        style={styles.selectFilter}
                    >
                        <option value="All">Tất cả</option>
                        <option value="Active">Active</option>
                        <option value="Locked">Locked</option>
                    </select>
                    <button
                        style={{ ...styles.addButton, backgroundColor: "#6c757d" }}
                        onClick={() => {
                            setSearchQuery("");
                            setFilterStatus("All");
                            setCurrentPage(1);
                        }}
                    >
                        Reset Lọc
                    </button>
                </div>
                <button style={styles.addButton} onClick={toggleAddUserForm}>
                    Thêm người dùng
                </button>
            </div>
            <div style={styles.tableWrapper}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.tableHeader}>ID</th>
                            <th style={styles.tableHeader}>Avatar</th>
                            <th style={styles.tableHeader}>Tên</th>
                            <th style={styles.tableHeader}>Email</th>
                            <th style={styles.tableHeader}>Trạng thái</th>
                            <th style={styles.tableHeader}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                {/* colSpan is 6 due to new Avatar column */}
                                <td colSpan={6} style={{textAlign: 'center', padding: '20px'}}>Đang tải dữ liệu...</td>
                            </tr>
                        ) : (currentUsers.length > 0 ? (
                            // Added index for conditional styling
                            currentUsers.map((user, index) => (
                                <tr key={user.id} style={styles.tableRow}>
                                     {/* Apply lastRowCell style if it's the last row */}
                                    <td style={{...styles.tableCell, ...(index === currentUsers.length - 1 ? styles.lastRowCell : {})}}>{user.id}</td>
                                     {/* Avatar Cell */}
                                     <td style={{ ...styles.tableCell, textAlign: 'center', ...(index === currentUsers.length - 1 ? styles.lastRowCell : {}) }}>
                                        <img
                                            src={getAvatarSrc(user)} // Use helper function to get image source
                                            alt={`${user.name}'s avatar`}
                                            style={styles.avatarIcon} // Apply avatar icon style
                                            // Handle image loading errors
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.onerror = null; // Prevent infinite loop
                                                target.src = 'placeholder-avatar.png'; // Set a default placeholder image
                                            }}
                                        />
                                    </td>
                                    <td style={{...styles.tableCell, ...(index === currentUsers.length - 1 ? styles.lastRowCell : {})}}>{user.name}</td>
                                    <td style={{...styles.tableCell, ...(index === currentUsers.length - 1 ? styles.lastRowCell : {})}}>{user.email}</td>
                                    {/* Status Cell with conditional color */}
                                    <td
                                        style={{
                                            ...styles.tableCell,
                                            color: user.status === "Locked" ? "#dc3545" : "#28a745",
                                            ...(index === currentUsers.length - 1 ? styles.lastRowCell : {})
                                        }}
                                    >
                                        {user.status}
                                    </td>
                                    {/* Actions Cell */}
                                    {/* Apply lastRowCell and lastCell styles to the last cell in the last row */}
                                    <td style={{
                                         ...styles.tableCell,
                                         ...(index === currentUsers.length - 1 ? styles.lastRowCell : {}),
                                         ...styles.lastCell // Apply lastCell style to the last <td> in every row
                                    }}>
                                        {/* View Details Button */}
                                         <button
                                            style={{ ...styles.actionButton, backgroundColor: "#17a2b8" }} // Info color
                                            onClick={() => openDetailModal(user)} // Open detail modal
                                         >
                                            Xem
                                         </button>
                                        {/* Edit Button */}
                                        <button
                                            style={styles.editButton}
                                            onClick={() => selectedEditUser(user)} // Populate form and show edit modal
                                        >
                                            Sửa
                                        </button>
                                        {/* Delete Button */}
                                        <button
                                            style={styles.deleteButton}
                                            onClick={() => deleteUser(user.id)} // Delete user
                                        >
                                            Xóa
                                        </button>
                                        {/* Lock Button (conditionally rendered) */}
                                        {user.status !== "Locked" && (
                                            // Add lock functionality here if needed
                                            <button style={styles.lockButton}>Khóa</button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            // No users found row if not loading and no users
                            <tr>
                                {/* colSpan is 6 */}
                                <td colSpan={6} style={styles.noResultText}>Không có người dùng nào.</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div style={styles.pagination}>
                <button
                    onClick={prevPage}
                    disabled={currentPage === 1 || isLoading}
                    style={styles.pageButton}
                >
                    Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                    <button
                        key={pageNumber}
                        onClick={() => goToPage(pageNumber)}
                        style={{
                            ...styles.pageButton,
                            backgroundColor: currentPage === pageNumber ? "#007bff" : "#fff",
                            color: currentPage === pageNumber ? "#fff" : "#007bff",
                            border: "1px solid #007bff",
                        }}
                        disabled={isLoading}
                    >
                        {pageNumber}
                    </button>
                ))}
                <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages || isLoading}
                    style={styles.pageButton}
                >
                    Sau
                </button>
            </div>

            {showAddUserForm && (
                <div style={styles.formOverlay}>
                    <div style={styles.formContainer}>
                        <button
                            style={styles.closeButton}
                            onClick={toggleAddUserForm}
                            aria-label="Đóng form thêm người dùng"
                        >
                            X
                        </button>
                        <div style={styles.formContent}>
                            <h1>Đăng ký</h1>
                            <label style={styles.formLabel}>Tên:</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nhập tên"
                                style={styles.formInput}
                            />
                            {validateError.name && (
                                <div style={styles.validateErrors}>{validateError.name}</div>
                            )}
                            <label style={styles.formLabel}>Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Nhập email"
                                style={styles.formInput}
                            />
                            {validateError.email && (
                                <div style={styles.validateErrors}>{validateError.email}</div>
                            )}
                            <label style={styles.formLabel}>Bio:</label>
                            <input
                                type="text"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Giới thiệu bản thân"
                                style={styles.formInput}
                            />
                            <label style={styles.formLabel}>Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Nhập password"
                                style={styles.formInput}
                            />
                            {validateError.password && (
                                <div style={styles.validateErrors}>{validateError.password}</div>
                            )}
                            <label style={styles.formLabel}>Avatar:</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange} // Using the updated handler
                                style={styles.formInput}
                            />
                            {/* Display the name and size of the processed file if selected */}
                            {selectedAvatarFile && <p style={{...styles.validateErrors, color: '#555', marginTop: '5px', marginBottom: '0'}}>Selected file: {selectedAvatarFile.name} ({(selectedAvatarFile.size / 1024).toFixed(2)} KB)</p>}
                            {/* Display validation error for avatar file */}
                            {validateError.avatarFile && (
                                <div style={styles.validateErrors}>{validateError.avatarFile}</div>
                            )}

                            <label style={styles.formLabel}>Status:</label>
                            <select
                                value={status} // Bound to status state
                                onChange={(e) => setStatus(e.target.value)} // Updates status state
                                style={styles.formSelect}>
                                <option value="Active">Active</option>
                                <option value="Locked">Locked</option>
                            </select>
                             {/* No validation error for status in validateForm, but could add one */}

                            <button style={{ ...styles.formButton, backgroundColor: '#28a745' }} onClick={AddUser}>
                                Register
                            </button>
                            {error && <p style={styles.validateErrors}>{error}</p>}
                        </div>
                    </div>
                </div>
            )}

            {showEditUserForm && (
                <div style={styles.formOverlay}>
                    <div style={styles.formContainer}>
                        <button
                            style={styles.closeButton}
                            onClick={toggleEditUserForm}
                            aria-label="Đóng form chỉnh sửa người dùng"
                        >
                            X
                        </button>
                        <div style={styles.formContent}>
                            <h1>Chỉnh sửa</h1>
                            <label style={styles.formLabel}>Tên:</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nhập tên"
                                style={styles.formInput}
                            />
                            {validateError.name && (
                                <div style={styles.validateErrors}>{validateError.name}</div>
                            )}
                            <label style={styles.formLabel}>Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Nhập email"
                                style={styles.formInput}
                            />
                            {validateError.email && (
                                <div style={styles.validateErrors}>{validateError.email}</div>
                            )}
                            <label style={styles.formLabel}>Bio:</label>
                            <input
                                type="text"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Giới thiệu bản thân"
                                style={styles.formInput}
                            />
                            <label style={styles.formLabel}>Password (Để trống nếu không đổi):</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Nhập password mới"
                                style={styles.formInput}
                            />
                            {validateError.password && (
                                <div style={styles.validateErrors}>{validateError.password}</div>
                            )}
                            <label style={styles.formLabel}>Avatar (Chọn file mới nếu muốn đổi):</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange} // Using the updated handler
                                style={styles.formInput}
                            />
                            {/* Display the name and size of the processed file if selected */}
                            {selectedAvatarFile && <p style={{...styles.validateErrors, color: '#555', marginTop: '5px', marginBottom: '0'}}>Selected file: {selectedAvatarFile.name} ({(selectedAvatarFile.size / 1024).toFixed(2)} KB)</p>}
                            {/* Display validation error for avatar file */}
                            {validateError.avatarFile && (
                                <div style={styles.validateErrors}>{validateError.avatarFile}</div>
                            )}

                            <label style={styles.formLabel}>Status:</label>
                            <select
                                value={status} // Bound to status state
                                onChange={(e) => setStatus(e.target.value)} // Updates status state
                                style={styles.formSelect}
                            >
                                <option value="Active">Active</option>
                                <option value="Locked">Locked</option>
                            </select>
                            {/* No validation error for status */}

                            <button style={{ ...styles.formButton, backgroundColor: '#ffc107' }} onClick={EditUser}>
                                Edit
                            </button>
                            {error && <p style={styles.validateErrors}>{error}</p>}
                        </div>
                    </div>
                </div>
            )}

            {/* User Detail Modal (conditionally rendered) */}
            {showDetailModal && selectedUserForDetails && (
                <div style={styles.formOverlay}> {/* Reusing formOverlay style for modal background */}
                    <div style={styles.formContainer}> {/* Reusing formContainer style for modal content box */}
                        {/* Close Button */}
                        <button
                            style={styles.closeButton}
                            onClick={closeDetailModal}
                            aria-label="Đóng chi tiết người dùng"
                        >
                            X
                        </button>
                        {/* Modal Content */}
                        <div style={styles.formContent}> {/* Reusing formContent style for inner padding/scrolling */}
                            <h1 style={{textAlign: 'center'}}>Chi tiết người dùng</h1>
                            {/* User Avatar in Modal */}
                            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                <img
                                    src={getAvatarSrc(selectedUserForDetails)} // Display avatar using helper function
                                    alt={`${selectedUserForDetails.name}'s avatar`}
                                    style={{
                                        width: '120px', // Larger avatar in modal
                                        height: '120px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '3px solid #007bff' // Highlight border
                                    }}
                                    // Handle image loading errors
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.onerror = null;
                                        target.src = 'placeholder-avatar.png';
                                    }}
                                />
                            </div>
                            {/* User Information */}
                            <p><strong>ID:</strong> {selectedUserForDetails.id}</p>
                            <p><strong>Tên:</strong> {selectedUserForDetails.name}</p>
                            <p><strong>Email:</strong> {selectedUserForDetails.email}</p>
                            {/* Password is not displayed for security */}
                            <p><strong>Trạng thái:</strong> {selectedUserForDetails.status}</p>
                            <p><strong>Bio:</strong> {selectedUserForDetails.bio || 'N/A'}</p> {/* Display bio or 'N/A' */}
                            <p><strong>Ngày tạo:</strong> {selectedUserForDetails.createdAt ? new Date(selectedUserForDetails.createdAt).toLocaleString() : 'N/A'}</p> {/* Format date */}
                            <p><strong>Ngày cập nhật:</strong> {selectedUserForDetails.updatedAt ? new Date(selectedUserForDetails.updatedAt).toLocaleString() : 'N/A'}</p> {/* Format date */}
                        </div>
                    </div>
                </div>
            )}

            {/* Thẻ canvas ẩn để xử lý ảnh */}
            {/* ĐẶT THẺ CANVAS Ở ĐÂY, BÊN NGOÀI CÁC KHỐI RENDER CÓ ĐIỀU KIỆN */}
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

        </div>
    );
};

// Styles (giữ nguyên như trước)
const styles: { [key: string]: React.CSSProperties } = {
    container: {
        maxWidth: "1200px",
        margin: "20px auto",
        padding: "0 20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
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
        fontSize: "22px",
        fontWeight: "bold",
        color: "#333",
    },
    toolbar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "20px",
        flexWrap: 'wrap',
        gap: '10px',
    },
    searchFilterContainer: {
        display: "flex",
        gap: "10px",
        alignItems: "center",
        flexWrap: 'wrap',
    },
    searchInput: {
        padding: "8px 12px",
        fontSize: "16px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        width: "250px",
        boxSizing: 'border-box',
    },
    selectFilter: {
        padding: "8px 12px",
        fontSize: "16px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        backgroundColor: "#fff",
        cursor: "pointer",
    },
    addButton: {
        backgroundColor: "#28a745",
        color: "#fff",
        border: "none",
        padding: "10px 20px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
         transition: 'background-color 0.3s ease',
        flexShrink: 0,
    },
    tableWrapper: {
        overflowX: "auto",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        minWidth: "700px", // Adjusted min-width
        display: "table",
    },
    tableHeader: {
        backgroundColor: "#007bff",
        color: "#fff",
        fontWeight: "bold",
        padding: "12px",
        textAlign: "left",
         border: '1px solid #007bff',
    },
    tableRow: {
        backgroundColor: "#fff",
         transition: "background-color 0.3s ease",
    },
     tableRowHover: {
        ':hover': {
            backgroundColor: '#f1f1f1',
        }
    } as React.CSSProperties,

    tableCell: {
        padding: "12px",
        borderBottom: "1px solid #ddd",
         borderRight: '1px solid #eee',
    } as React.CSSProperties,

    lastCell: {
         borderRight: 'none',
    } as React.CSSProperties,

    lastRowCell: {
         borderBottom: 'none',
    } as React.CSSProperties,


    actionButton: {
        padding: "6px 12px",
        borderRadius: "5px",
        cursor: "pointer",
        marginRight: "8px",
        border: 'none',
        color: '#fff',
         transition: 'background-color 0.3s ease',
    },
    editButton: {
        backgroundColor: "#ffc107",
         padding: "6px 12px",
        borderRadius: "5px",
        cursor: "pointer",
        marginRight: "8px",
        border: 'none',
        color: '#fff',
         transition: 'background-color 0.3s ease',
    },
    deleteButton: {
        backgroundColor: "#dc3545",
         padding: "6px 12px",
        borderRadius: "5px",
        cursor: "pointer",
        marginRight: "8px",
        border: 'none',
        color: '#fff',
         transition: 'background-color 0.3s ease',
    },
    lockButton: {
        backgroundColor: "#6c757d",
         padding: "6px 12px",
        borderRadius: "5px",
        cursor: "pointer",
        marginRight: "8px",
        border: 'none',
        color: '#fff',
         transition: 'background-color 0.3s ease',
    },
    noResultText: {
        textAlign: "center",
        padding: "20px",
        fontSize: "16px",
        color: "#666",
    },
    pagination: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "20px",
        gap: "5px",
         flexWrap: 'wrap',
    },
    pageButton: {
        padding: "8px 12px",
        cursor: "pointer",
        border: "1px solid #007bff",
        borderRadius: "5px",
        backgroundColor: "#fff",
        color: "#007bff",
         transition: 'background-color 0.3s ease, color 0.3s ease',
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
        padding: '20px',
        boxSizing: 'border-box',
    },
    formContainer: {
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
        width: "400px",
        maxWidth: "100%",
        position: "relative",
        maxHeight: "90vh",
        overflowY: "auto",
        boxSizing: 'border-box',
    },
    formContent: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },
    closeButton: {
        position: "absolute",
        top: "10px",
        right: "10px",
        backgroundColor: "#dc3545",
        border: "none",
        color: "#fff",
        fontSize: "18px",
        width: "30px",
        height: "30px",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
         transition: "background-color 0.3s ease",
        zIndex: 10,
    },
    validateErrors: {
        color: "#dc3545",
        fontSize: "14px",
        marginTop: "-10px",
    },
     formLabel: {
        fontWeight: 'bold',
        marginBottom: '5px',
        display: 'block',
        color: '#555',
     },
     formInput: {
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '16px',
        width: '100%',
        boxSizing: 'border-box',
     },
     formSelect: {
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '16px',
        width: '100%',
        boxSizing: 'border-box',
        backgroundColor: '#fff',
        cursor: 'pointer',
     },
     formButton: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        marginTop: '10px',
         transition: 'background-color 0.3s ease',
     },
     avatarIcon: { // Style for the avatar image in the table
         width: '40px',
         height: '40px',
         borderRadius: '50%', // Make it round
         objectFit: 'cover', // Ensure image covers the area
         border: '1px solid #ccc' // Optional border
     }
};


export default UserManagement;
