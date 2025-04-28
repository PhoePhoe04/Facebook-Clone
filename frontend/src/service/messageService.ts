import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

export const sendMessage = async (message: { sender: { id: number }; receiver: { id: number }; content: string }) => {
    const response = await api.post('/messages', message);
    return response.data;
};

export const getMessagesBetweenUsers = async (userId1: number, userId2: number) => {
    const response = await api.get(`/messages/${userId1}/${userId2}`);
    return response.data;
};