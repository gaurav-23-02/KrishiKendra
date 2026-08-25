import api from './api';

export const marketService = {
  async searchPrices(params) {
    const res = await api.get('/market-prices', { params });
    return res.data;
  },

  async getPriceTrends(commodity, market, days) {
    const res = await api.get('/market-prices/trends', {
      params: { commodity, market, days }
    });
    return res.data;
  },

  async getHighlights(state, limit = 6) {
    const res = await api.get('/market-prices/highlights', {
      params: { state, limit }
    });
    return res.data;
  },

  async getStates() {
    const res = await api.get('/market-prices/states');
    return res.data;
  },

  async getDistricts(state) {
    const res = await api.get('/market-prices/districts', {
      params: { state }
    });
    return res.data;
  },

  async getMarkets(state, district) {
    const res = await api.get('/market-prices/markets', {
      params: { state, district }
    });
    return res.data;
  },

  async getCommodities() {
    const res = await api.get('/market-prices/commodities');
    return res.data;
  },

  async getPriceById(id) {
    const res = await api.get(`/market-prices/${id}`);
    return res.data;
  }
};
