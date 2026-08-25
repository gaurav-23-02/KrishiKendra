import api from './api';

export const schemeService = {
  async getSchemes(params) {
    const res = await api.get('/schemes', { params });
    return res.data;
  },

  async getRecentSchemes(limit = 5) {
    const res = await api.get('/schemes/recent', { params: { limit } });
    return res.data;
  },

  async getCategories() {
    const res = await api.get('/schemes/categories');
    return res.data;
  },

  async getStates() {
    const res = await api.get('/schemes/states');
    return res.data;
  },

  async getSchemeById(id) {
    const res = await api.get(`/schemes/${id}`);
    return res.data;
  },

  async createScheme(data) {
    const res = await api.post('/schemes', data);
    return res.data;
  },

  async updateScheme(id, data) {
    const res = await api.put(`/schemes/${id}`, data);
    return res.data;
  },

  async deleteScheme(id) {
    const res = await api.delete(`/schemes/${id}`);
    return res.data;
  }
};
