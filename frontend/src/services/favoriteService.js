import api from './api';

export const favoriteService = {
  async getFavorites() {
    const res = await api.get('/favorites');
    return res.data;
  },

  async addFavorite(commodity, market) {
    const res = await api.post('/favorites', { commodity, market });
    return res.data;
  },

  async removeFavorite(id) {
    const res = await api.delete(`/favorites/${id}`);
    return res.data;
  },

  async checkFavorite(commodity, market) {
    const res = await api.get('/favorites/check', {
      params: { commodity, market }
    });
    return res.data;
  }
};
