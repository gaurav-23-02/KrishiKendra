import api from './api';

export const newsService = {
  async getNews(params) {
    const res = await api.get('/news', { params });
    return res.data;
  },

  async getRecentNews(limit = 5) {
    const res = await api.get('/news/recent', { params: { limit } });
    return res.data;
  },

  async getCategories() {
    const res = await api.get('/news/categories');
    return res.data;
  },

  async getNewsById(id) {
    const res = await api.get(`/news/${id}`);
    return res.data;
  },

  async createNews(data) {
    const res = await api.post('/news', data);
    return res.data;
  },

  async updateNews(id, data) {
    const res = await api.put(`/news/${id}`, data);
    return res.data;
  },

  async deleteNews(id) {
    const res = await api.delete(`/news/${id}`);
    return res.data;
  }
};
