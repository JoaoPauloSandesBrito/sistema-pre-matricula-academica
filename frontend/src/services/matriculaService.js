import api from './api';

export async function listarMatriculas() {
  const response = await api.get('/matriculas');
  return response.data.data || response.data;
}

export async function confirmarMatricula(dados) {
  const response = await api.post('/matriculas', dados);
  return response.data.data || response.data;
}

export async function cancelarMatricula(id) {
  const response = await api.delete(`/matriculas/${id}`);
  return response.data;
}
