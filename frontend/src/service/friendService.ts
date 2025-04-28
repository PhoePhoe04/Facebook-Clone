import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

export const sendFriendRequest = async (friendship: { requester: { id: number }; receiver: { id: number }; status: string }) => {
    const response = await api.post('/friendships', friendship);
    return response.data;
};

export const getFriendRequestsReceived = async (receiverId: number) => {
    const response = await api.get(`/friendships/received/${receiverId}`);
    return response.data;
};

export const getFriends = async (userId: number) => {
    const response = await api.get(`/friendships/friends/${userId}`);
    return response.data;
};