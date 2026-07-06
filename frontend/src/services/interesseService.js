import api from './api';

export async function listarInteresses(usuarioId) {
  const config = usuarioId
    ? {
        params: {
          usuario_id: usuarioId,
        },
      }
    : undefined;

  const response = await api.get('/interesses', config);
  return response.data.data || response.data;
}

export async function criarInteresse(dados) {
  const response = await api.post('/interesses', dados);
  return response.data.data || response.data;
}

export async function retirarInteresse(id) {
  const response = await api.delete(`/interesses/${id}`);
  return response.data;
}
