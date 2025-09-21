import { ComplaintCreateDto, Department } from '@/types/complaint';
import { UserDto, ComplaintDto, DepartmentDto, FeedbackDto } from "@/types/dto";
import { User } from '@/types/user';
import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:8080/api',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true // Add this line
// });



const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
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
      const response = await api.post<{
        token: string;
        user: User;
      }>('/auth/login', { email, password });
      
      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
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
  getAll: async (): Promise<Department[]> => {
    const response = await api.get('/departments');
    return response.data;
  }
};

export const feedback = {
  submit: async (complaintId: number, data: { rating: number; comment: string }) => {
    try {
      // Don't check for existing feedback first - let the backend handle it
      const response = await api.post(`/feedback/${complaintId}`, data);
      return response.data;
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.status === 404) {
        // Not found - complaint doesn't exist
        throw new Error('Complaint not found');
      } else if (error.response?.data?.message?.includes('already exists')) {
        // Feedback already exists
        throw new Error('Feedback already exists for this complaint');
      }
      // Other errors
      throw new Error(error.response?.data?.message || 'Failed to submit feedback');
    }
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

      // Fix the API endpoint
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
  getUserComplaints: async (userId: number): Promise<ComplaintDto[]> => {
    try {
      // Remove extra 'api' from URL since baseURL already has it
      const response = await api.get(`/complaints/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  getDepartmentComplaints: async (departmentId: number): Promise<ComplaintDto[]> => {
    try {
      console.log("Making API call for department:", departmentId); // Debug log
      const response = await api.get(`/complaints/department/${departmentId}`);
      console.log("API Response:", response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Failed to fetch department complaints:', error);
      console.log("Error details:", {  // Debug log
        status: error.response?.status,
        message: error.response?.data?.message,
        error
      });
      throw error;
    }
  },
  getAllComplaints: async (): Promise<ComplaintDto[]> => {
    try {
      const response = await api.get('/complaints/all');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch all complaints:', error);
      throw error;
    }
  },
  markAsResolved: async (complaintId: number) => {
    try {
      const response = await api.put(`/complaints/${complaintId}/resolve`);
      return response.data;
    } catch (error) {
      console.error('Failed to resolve complaint:', error);
      throw error;
    }
  },
  updateComplaint: async (id: number, data: ComplaintCreateDto): Promise<ComplaintDto> => {
    const response = await api.put(`/complaints/${id}`, data);
    return response.data;
  },
  getComplaint: async (id: number): Promise<ComplaintDto> => {
    const response = await api.get(`/complaints/${id}`);
    return response.data;
  },
  updateStatus: async (complaintId: number, data: { status: ComplaintStatus }): Promise<ComplaintDto> => {
    try {
      const response = await api.put(`/complaints/${complaintId}/status`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to update complaint status:', error);
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
  },
  submitFeedback: async (data: { feedback: string, rating: number }) => {
    const response = await api.post('/users/feedback', data);
    return response.data;
  },
  getFeedback: async () => {
    const response = await api.get<{ feedback: string; rating: number }>('/users/feedback');
    return response.data;
  }
};

export const admin = {
  getPendingUsers: async (): Promise<UserDto[]> => {
    const response = await api.get('/admin/users/pending');
    return response.data;
  },

  getAllComplaints: async (): Promise<ComplaintDto[]> => {
    try {
      // Remove /admin from URL since context-path already includes /api
      const response = await api.get('/complaints/all');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch all complaints:', error);
      throw error;
    }
  },

  approveUser: async (userId: number): Promise<UserDto> => {
    try {
      // Fix: Remove extra 'api' from the URL
      const response = await api.put(`/admin/users/${userId}/approve`);
      return response.data;
    } catch (error: any) {
      console.error('Error approving user:', error);
      throw error;
    }
  },

  rejectUser: async (userId: number) => {
    try {
      // Fix: Remove extra 'api' from the URL
      const response = await api.put(`/admin/users/${userId}/reject`);
      return response.data;
    } catch (error) {
      console.error('Failed to reject user:', error);
      throw error;
    }
  },
  resolveComplaint: async (complaintId: number) => {
    try {
      const response = await api.put(`/admin/complaints/${complaintId}/resolve`);
      return response.data;
    } catch (error) {
      console.error('Failed to resolve complaint:', error);
      throw error;
    }
  },
};

export default api;