import axios from 'axios';

const API_BASE_URL = '/'; // 替换为你的 API 基础 URL

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// GET 请求
export const get = (url, params = {}) => {
  return apiClient.get(url, { params });
};

// POST 请求
export const post = (url, data = {}) => {
  return apiClient.post(url, data);
};

// PUT 请求
export const put = (url, data = {}) => {
  return apiClient.put(url, data);
};

// DELETE 请求
export const del = (url) => {
  return apiClient.delete(url);
};
