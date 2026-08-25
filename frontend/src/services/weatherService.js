import api from './api';

export const weatherService = {
  async getWeather(city, lat, lon) {
    const res = await api.get('/weather', {
      params: { city, lat, lon }
    });
    return res.data;
  },

  async getForecast(city) {
    const res = await api.get('/weather/forecast', {
      params: { city }
    });
    return res.data;
  }
};
