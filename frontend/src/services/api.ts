import { ComplaintCreateDto } from '@/types/complaint';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Add this line
});


// Add request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
);

export const auth = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      console.log('API login response:', response.data); // Add this for debugging
      return response.data;
    } catch (error) {
      console.error('API login error:', error);
      throw error;
    }
  },
  register: async (userData: any, files: { [key: string]: File }) => {
    try {
      const formData = new FormData();
      
      // Add user data as JSON string
      formData.append('user', new Blob([JSON.stringify(userData)], {
        type: 'application/json'
      }));
      
      // Add files
      Object.keys(files).forEach(key => {
        if (files[key]) {
          formData.append(key, files[key]);
        }
      });

      const response = await api.post('/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
};

export const departments = {
  getAll: async () => {
    const response = await api.get('/departments');
    return response.data;
  }
};

export const feedback = {
  submit: async (complaintId: number, data: { rating: number; comment: string }) => {
    const response = await api.post(`/feedback/${complaintId}`, data);
    return response.data;
  },
  get: async (complaintId: number) => {
    const response = await api.get(`/feedback/${complaintId}`);
    return response.data;
  }
};

export const complaints = {
  create: async (complaintData: ComplaintCreateDto, evidenceFiles?: File[]) => {
    try {
      const formData = new FormData();
      // Convert departmentId to number
      const dataToSend = {
        ...complaintData,
        departmentId: Number(complaintData.departmentId),
        incidentDate: new Date(complaintData.incidentDate).toISOString()
      };

      formData.append('complaint', new Blob([JSON.stringify(dataToSend)], {
        type: 'application/json'
      }));
      
      if (evidenceFiles?.length) {
        evidenceFiles.forEach(file => {
          formData.append('evidences', file);
        });
      }

      const response = await api.post('/complaints', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('API Error:', error.response?.data || error.message);
      throw error;
    }
  },
  getAll: async () => {
    const response = await api.get('/complaints');
    return response.data;
  },
  getUserComplaints: async (userId: number) => {
    try {
      const response = await api.get(`/complaints/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user complaints:', error);
      throw error;
    }
  },
};

export const users = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  updateProfile: async (data: any) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  }
};

export const admin = {
  getAllComplaints: async () => {
    const response = await api.get('/admin/complaints');
    return response.data;
  },
  getPendingUsers: async () => {
    const response = await api.get('/admin/pending-users');
    return response.data;
  },
  approveUser: async (userId: number) => {
    const response = await api.put(`/admin/users/${userId}/approve`);
    return response.data;
  },
  rejectUser: async (userId: number) => {
    const response = await api.put(`/admin/users/${userId}/reject`);
    return response.data;
  }
};

export default api;