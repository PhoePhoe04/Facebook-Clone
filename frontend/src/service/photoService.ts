import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

export const createPhoto = async (photo: { name?: string; album: { id: number }; imageUrl: string }) => {
    const response = await api.post('/photos', photo);
    return response.data;
};

export const getPhotosByAlbumId = async (albumId: number) => {
    const response = await api.get(`/photos/album/${albumId}`);
    return response.data;
};