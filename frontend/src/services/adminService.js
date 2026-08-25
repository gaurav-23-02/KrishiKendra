import api from './api';

export const adminService = {
  async getStats() {
    const res = await api.get('/admin/stats');
    return res.data;
  },

  async getUsers(page = 0, size = 15) {
    const res = await api.get('/admin/users', { params: { page, size } });
    return res.data;
  },

  async updateUserRole(id, role) {
    const res = await api.put(`/admin/users/${id}/role`, null, {
      params: { role }
    });
    return res.data;
  },

  async deleteUser(id) {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data;
  }
};
