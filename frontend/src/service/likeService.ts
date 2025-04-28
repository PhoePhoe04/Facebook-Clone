import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

export const createLike = async (like: { user: { id: number }; post?: { id: number }; comment?: { id: number } }) => {
    const response = await api.post('/likes', like);
    return response.data;
};

export const getLikesByPostId = async (postId: number) => {
    const response = await api.get(`/likes/post/${postId}`);
    return response.data;
};

export const getLikesByCommentId = async (commentId: number) => {
    const response = await api.get(`/likes/comment/${commentId}`);
    return response.data;
};