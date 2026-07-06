import api from './api';

export async function listarDisciplinas() {
  const response = await api.get('/disciplinas');
  return response.data.data || response.data;
}

export async function buscarDisciplina(id) {
  const response = await api.get(`/disciplinas/${id}`);
  return response.data.data || response.data;
}

export async function criarDisciplina(dados) {
  const response = await api.post('/disciplinas', dados);
  return response.data.data || response.data;
}

export async function atualizarDisciplina(id, dados) {
  const response = await api.put(`/disciplinas/${id}`, dados);
  return response.data.data || response.data;
}

export async function excluirDisciplina(id) {
  const response = await api.delete(`/disciplinas/${id}`);
  return response.data;
}
