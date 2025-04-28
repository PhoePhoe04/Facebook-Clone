import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

export const registerUser = async (user: { name: string; email: string; password: string; avatarUrl?: string; bio?: string }) => {
    const response = await api.post('/users/register', user);
    return response.data;
};

export const getUserByEmail = async (email: string) => {
    const response = await api.get(`/users/email/${email}`);
    return response.data;
};

export const getUserById = async (id: number) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
};