import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

export const createNotification = async (notification: { user: { id: number }; fromUser: { id: number }; post?: { id: number }; type: string; isRead: boolean }) => {
    const response = await api.post('/notifications', notification);
    return response.data;
};

export const getNotificationsByUserId = async (userId: number) => {
    const response = await api.get(`/notifications/user/${userId}`);
    return response.data;
};