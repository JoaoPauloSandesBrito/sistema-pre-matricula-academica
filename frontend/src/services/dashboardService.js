import api from './api';

export async function buscarResumoDashboard() {
  const response = await api.get('/relatorios/resumo');
  return response.data;
}
