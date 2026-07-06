import { useCallback, useEffect, useState } from 'react';

import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import Icon from '../../components/Icon/Icon';
import Table from '../../components/Table/Table';
import useAuth from '../../hooks/useAuth';
import { mockInteresses } from '../../data/mockData';
import {
  listarInteresses,
  retirarInteresse,
} from '../../services/interesseService';

function formatarData(data) {
  if (!data) {
    return '-';
  }

  return new Date(data).toLocaleDateString('pt-BR');
}

function classificarStatus(status) {
  if (status === 'matriculado' || status === 'ativa') {
    return 'success';
  }

  if (status === 'cancelado') {
    return 'danger';
  }

  return 'warning';
}

export default function InteressesAluno() {
  const { usuario } = useAuth();
  const [interesses, setInteresses] = useState(mockInteresses);
  const [interesseSelecionado, setInteresseSelecionado] = useState(null);
  const [mensagem, setMensagem] = useState(null);

  const carregarInteresses = useCallback(async () => {
    try {
      const data = await listarInteresses(usuario?.id || 1);
      setInteresses(data);
    } catch (error) {
      setInteresses(mockInteresses);
    }
  }, [usuario?.id]);

  useEffect(() => {
    carregarInteresses();
  }, [carregarInteresses]);

  async function confirmarRetirada() {
    if (!interesseSelecionado) {
      return;
    }

    try {
      await retirarInteresse(interesseSelecionado.id);

      setMensagem({
        tipo: 'success',
        texto: 'Interesse retirado com sucesso.',
      });

      setInteresses((anteriores) =>
        anteriores.filter((item) => item.id !== interesseSelecionado.id)
      );
    } catch (error) {
      setMensagem({
        tipo: 'error',
        texto:
          error.response?.data?.message ||
          'Não foi possível retirar o interesse.',
      });
    } finally {
      setInteresseSelecionado(null);
    }
  }

  const columns = [
    {
      key: 'codigo',
      label: 'Código',
      render: (interesse) => interesse.disciplina?.codigo || '-',
    },
    {
      key: 'nome',
      label: 'Nome',
      render: (interesse) => interesse.disciplina?.nome || '-',
    },
    {
      key: 'data_interesse',
      label: 'Data',
      render: (interesse) => formatarData(interesse.data_interesse),
    },
    {
      key: 'status',
      label: 'Situação',
      render: (interesse) => (
        <span className={`status-pill ${classificarStatus(interesse.status)}`}>
          {interesse.status}
        </span>
      ),
    },
    {
      key: 'acoes',
      label: 'Ações',
      render: (interesse) => {
        const bloqueado = interesse.status === 'matriculado';

        return (
          <button
            type="button"
            className={bloqueado ? 'btn btn-secondary' : 'btn btn-danger'}
            disabled={bloqueado}
            onClick={() => setInteresseSelecionado(interesse)}
          >
            <Icon name={bloqueado ? 'check_circle' : 'cancel'} />
            {bloqueado ? 'Matriculado' : 'Retirar'}
          </button>
        );
      },
    },
  ];

  return (
    <section>
      <div className="page-intro">
        <h2>Interesses registrados</h2>
        <p className="page-description">
          Acompanhe as disciplinas em que você demonstrou interesse.
        </p>
      </div>

      {mensagem && (
        <div className={`message ${mensagem.tipo}`}>
          {mensagem.texto}
        </div>
      )}

      <div className="content-card">
        <Table
          columns={columns}
          data={interesses}
          emptyMessage="Você ainda não registrou interesses."
        />
      </div>

      <ConfirmModal
        aberto={Boolean(interesseSelecionado)}
        titulo="Retirar Interesse"
        mensagem={`Deseja realmente retirar o interesse em ${
          interesseSelecionado?.disciplina?.codigo || ''
        } - ${interesseSelecionado?.disciplina?.nome || ''}?`}
        textoConfirmar="Retirar"
        varianteConfirmar="btn-danger"
        onConfirmar={confirmarRetirada}
        onCancelar={() => setInteresseSelecionado(null)}
      />
    </section>
  );
}
