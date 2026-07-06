import api from './api';

export async function listarAlunos() {
  const response = await api.get('/usuarios', {
    params: {
      perfil: 'aluno',
    },
  });

  return response.data.data || response.data;
}

export async function buscarAluno(id) {
  const response = await api.get(`/usuarios/${id}`);
  return response.data.data || response.data;
}

export async function criarAluno(dados) {
  const response = await api.post('/usuarios', dados);
  return response.data.data || response.data;
}

export async function atualizarAluno(id, dados) {
  const response = await api.put(`/usuarios/${id}`, dados);
  return response.data.data || response.data;
}

export async function excluirAluno(id) {
  const response = await api.delete(`/usuarios/${id}`);
  return response.data;
}
