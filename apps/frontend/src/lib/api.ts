import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to convert string numbers to actual numbers
const convertNumericStrings = (obj: unknown): unknown => {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'object') {
    if (Array.isArray(obj)) {
      return obj.map(convertNumericStrings);
    }

    const converted: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      // Fields that should be converted from string to number
      if (['price', 'salePrice', 'priceAdjustment'].includes(key) && typeof value === 'string') {
        converted[key] = parseFloat(value);
      } else if (typeof value === 'object') {
        converted[key] = convertNumericStrings(value);
      } else {
        converted[key] = value;
      }
    }
    return converted;
  }

  return obj;
};

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors and converting numeric strings
api.interceptors.response.use(
  (response) => {
    // Convert string numbers to actual numbers in response data
    response.data = convertNumericStrings(response.data);
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
