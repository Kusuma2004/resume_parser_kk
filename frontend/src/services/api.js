import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://resume-parser-kk.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const resumeAPI = {
  uploadResume: async (formData) => {
    const response = await api.post('/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get('/resumes/history');
    return response.data;
  },

  getResumeById: async (id) => {
    const response = await api.get(`/resumes/${id}`);
    return response.data;
  },
  deleteResumeById: async (id) => {
    const res = await api.delete(`/${id}`);
    return res.data;
  },
};

export default api;
