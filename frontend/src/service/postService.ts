import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

export const createPost = async (post: { user: { id: number }; content: string; imageUrl?: string }) => {
    const response = await api.post('/posts', post);
    return response.data;
};

export const getAllPosts = async () => {
    const response = await api.get('/posts');
    return response.data;
};

export const getPostsByUserId = async (userId: number) => {
    const response = await api.get(`/posts/user/${userId}`);
    return response.data;
};