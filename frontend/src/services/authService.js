import api from './api';

export async function loginBackend(payload) {
  const response = await api.post('/login', payload);
  return response.data;
}
