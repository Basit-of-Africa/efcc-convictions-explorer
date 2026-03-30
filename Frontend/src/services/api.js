import axios from 'axios';

const API_BASE = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const convictionsAPI = {
  // Get all convictions with pagination
  getConvictions: (limit = 10, offset = 0) =>
    api.get('/convictions', { params: { limit, offset } }),

  // Search by defendant name
  searchByName: (name, limit = 10, offset = 0) =>
    api.get('/search', { params: { name, limit, offset } }),

  // Filter by offense type
  filterByOffense: (type, limit = 10, offset = 0) =>
    api.get('/offense', { params: { type, limit, offset } }),

  // Filter by court
  filterByCourt: (name, limit = 10, offset = 0) =>
    api.get('/court', { params: { name, limit, offset } }),

  // Get statistics
  getStats: () =>
    api.get('/stats'),

  // Health check
  getHealth: () =>
    api.get('/'),
};

export default api;
