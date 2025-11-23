// API工具函数
import { API_CONFIG } from './../config/api';

interface ApiOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string | FormData;
}

// 获取存储的token
const getToken = () => {
  return localStorage.getItem('token');
};

// 更新API请求函数以支持认证
export const makeApiRequest = async (endpoint: string, options: ApiOptions = {}) => {
  const url = `${API_CONFIG.baseUrl}${endpoint}`;

  // 准备请求头，包含认证信息
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // 如果有token，添加到请求头
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method: options.method || 'GET',
    headers,
    body: options.body,
  };

  try {
    const response = await fetch(url, config);

    // 检查是否是认证错误
    if (response.status === 401) {
      // 可能需要重定向到登录页
      console.error('Authentication required');
      throw new Error('Authentication required');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// 认证相关的API
export const authApi = {
  login: async (username: string, password: string) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${API_CONFIG.baseUrl}/api/token`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Login failed with status: ${response.status}`);
    }

    const data = await response.json();
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
    }
    return data;
  },
  logout: () => {
    localStorage.removeItem('token');
  },
  register: (userData: { username: string; email: string; password: string }) =>
    makeApiRequest('/api/users/', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),
};

// 任务相关API
export const taskApi = {
  getAll: () => makeApiRequest('/api/tasks'),
  getById: (id: string) => makeApiRequest(`/api/tasks/${id}`),
  create: (task: any) => makeApiRequest('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(task)
  }),
  update: (id: string, task: any) => makeApiRequest(`/api/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(task)
  }),
  delete: (id: string) => makeApiRequest(`/api/tasks/${id}`, {
    method: 'DELETE'
  }),
};

// 调度记录相关API
export const scheduleRecordApi = {
  getAll: () => makeApiRequest('/api/schedule-records'),
  create: (record: any) => makeApiRequest('/api/schedule-records', {
    method: 'POST',
    body: JSON.stringify(record)
  }),
  update: (id: string, record: any) => makeApiRequest(`/api/schedule-records/${id}`, {
    method: 'PUT',
    body: JSON.stringify(record)
  }),
  delete: (id: string) => makeApiRequest(`/api/schedule-records/${id}`, {
    method: 'DELETE'
  }),
};

// 由于新的后端没有 /api/init-data 端点，我们需要分别获取任务和调度记录
export const initDataApi = {
  get: async () => {
    try {
      const [tasks = [], scheduleRecords = []] = await Promise.all([
        taskApi.getAll(),
        // scheduleRecordApi.getAll()
      ]);
      return { tasks, scheduleRecords };
    } catch (error) {
      console.error('Failed to get initial data:', error);
      throw error;
    }
  },
};

// 日程安排相关API - 用于获取特定日期范围内的日程数据
export const scheduleApi = {
  getScheduleData: (query: { startDate: string; endDate?: string }) => 
    makeApiRequest('/api/schedule/', {
      method: 'POST',
      body: JSON.stringify(query)
    }),
};

// 日记相关API
export const journalApi = {
  getAll: () => makeApiRequest('/api/journals'),
  getById: (id: number) => makeApiRequest(`/api/journals/${id}`),
  create: (journal: any) => makeApiRequest('/api/journals', {
    method: 'POST',
    body: JSON.stringify(journal)
  }),
  update: (id: number, journal: any) => makeApiRequest(`/api/journals/${id}`, {
    method: 'PUT',
    body: JSON.stringify(journal)
  }),
  delete: (id: number) => makeApiRequest(`/api/journals/${id}`, {
    method: 'DELETE'
  }),
};

// 社区相关API
export const communityApi = {
  getPosts: (skip: number = 0, limit: number = 20) =>
    makeApiRequest(`/api/community/posts?skip=${skip}&limit=${limit}`),
  getPost: (id: number) => makeApiRequest(`/api/community/posts/${id}`),
  createPost: (post: any) => makeApiRequest('/api/community/posts', {
    method: 'POST',
    body: JSON.stringify(post)
  }),
  updatePost: (id: number, post: any) => makeApiRequest(`/api/community/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(post)
  }),
  deletePost: (id: number) => makeApiRequest(`/api/community/posts/${id}`, {
    method: 'DELETE'
  }),
  getComments: (postId: number, skip: number = 0, limit: number = 20) =>
    makeApiRequest(`/api/community/posts/${postId}/comments?skip=${skip}&limit=${limit}`),
  createComment: (comment: any) => makeApiRequest('/api/community/comments', {
    method: 'POST',
    body: JSON.stringify(comment)
  }),
  updateComment: (id: number, comment: any) => makeApiRequest(`/api/community/comments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(comment)
  }),
  deleteComment: (id: number) => makeApiRequest(`/api/community/comments/${id}`, {
    method: 'DELETE'
  }),
};