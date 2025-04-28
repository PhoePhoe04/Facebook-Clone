import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

export const createComment = async (comment: { post: { id: number }; user: { id: number }; content: string }) => {
    const response = await api.post('/comments', comment);
    return response.data;
};

export const getCommentsByPostId = async (postId: number) => {
    const response = await api.get(`/comments/post/${postId}`);
    return response.data;
};