import api from './api';

export async function buscarResumoRelatorios() {
  const response = await api.get('/relatorios/resumo');
  return response.data;
}

export async function buscarRelatorioGeral() {
  const response = await api.get('/relatorios/geral');
  return response.data;
}

export async function buscarRelatorioDisciplina(disciplinaId) {
  const response = await api.get(`/relatorios/disciplinas/${disciplinaId}`);
  return response.data;
}
