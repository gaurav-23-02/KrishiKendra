import api from './api';

export const assistantService = {
  async askQuestion(message, state, district, preferredLanguage) {
    const res = await api.post('/assistant/chat', {
      message,
      state,
      district,
      preferredLanguage
    });
    return res.data;
  }
};
