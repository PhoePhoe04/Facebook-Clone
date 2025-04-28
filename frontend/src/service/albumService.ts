import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

export const createAlbum = async (album: { owner: { id: number }; name: string }) => {
    const response = await api.post('/albums', album);
    return response.data;
};

export const getAlbumsByOwnerId = async (ownerId: number) => {
    const response = await api.get(`/albums/owner/${ownerId}`);
    return response.data;
};