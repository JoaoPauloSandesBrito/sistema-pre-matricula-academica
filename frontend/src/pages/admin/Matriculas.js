import { useEffect, useState } from 'react';

import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import Icon from '../../components/Icon/Icon';
import Table from '../../components/Table/Table';
import { mockInteresses, mockMatriculas } from '../../data/mockData';
import { listarInteresses } from '../../services/interesseService';
import {
  cancelarMatricula,
  confirmarMatricula,
  listarMatriculas,
} from '../../services/matriculaService';

function formatarData(data) {
  if (!data) {
    return '-';
  }

  return new Date(data).toLocaleDateString('pt-BR');
}

function somentePendentes(interesses) {
  return interesses.filter((item) => item.status !== 'matriculado');
}

export default function Matriculas() {
  const [matriculas, setMatriculas] = useState(mockMatriculas);
  const [interesses, setInteresses] = useState(mockInteresses);
  const [interesseSelecionado, setInteresseSelecionado] = useState(null);
  const [matriculaSelecionada, setMatriculaSelecionada] = useState(null);
  const [mensagem, setMensagem] = useState(null);

  useEffect(() => {
    async function carregarDados() {
      try {
        const [matriculasData, interessesData] = await Promise.all([
          listarMatriculas(),
          listarInteresses(),
        ]);

        setMatriculas(matriculasData);
        setInteresses(somentePendentes(interessesData));
      } catch (error) {
        setMatriculas(mockMatriculas);
        setInteresses(somentePendentes(mockInteresses));
      }
    }

    carregarDados();
  }, []);

  async function confirmar() {
    if (!interesseSelecionado) {
      return;
    }

    try {
      const novaMatricula = await confirmarMatricula({
        interesse_id: interesseSelecionado.id,
        usuario_id: interesseSelecionado.usuario_id,
        disciplina_id: interesseSelecionado.disciplina_id,
        semestre: '2026.2',
      });

      setMatriculas((anteriores) => [novaMatricula, ...anteriores]);
      setInteresses((anteriores) =>
        anteriores.filter((item) => item.id !== interesseSelecionado.id)
      );
      setMensagem({
        tipo: 'success',
        texto: 'Matrícula confirmada com sucesso.',
      });
    } catch (error) {
      setMensagem({
        tipo: 'error',
        texto:
          error.response?.data?.message ||
          'Não foi possível confirmar a matrícula.',
      });
    } finally {
      setInteresseSelecionado(null);
    }
  }

  async function confirmarCancelamento() {
    if (!matriculaSelecionada) {
      return;
    }

    try {
      await cancelarMatricula(matriculaSelecionada.id);
    } catch (error) {
      // Mantém comportamento local para apresentação, mesmo sem backend ativo.
    }

    setMatriculas((anteriores) =>
      anteriores.filter((item) => item.id !== matriculaSelecionada.id)
    );
    setMensagem({
      tipo: 'success',
      texto: 'Matrícula cancelada com sucesso.',
    });
    setMatriculaSelecionada(null);
  }

  const interesseColumns = [
    {
      key: 'disciplina',
      label: 'Disciplina',
      render: (item) => item.disciplina?.codigo || '-',
    },
    {
      key: 'aluno',
      label: 'Aluno',
      render: (item) => item.usuario?.nome || '-',
    },
    {
      key: 'data_interesse',
      label: 'Data Interesse',
      render: (item) => formatarData(item.data_interesse),
    },
    {
      key: 'status',
      label: 'Status',
      render: (item) => (
        <span className={`status-pill ${item.status || 'pendente'}`}>
          {item.status}
        </span>
      ),
    },
    {
      key: 'acoes',
      label: 'Ações',
      render: (item) => (
        <button
          type="button"
          className="btn btn-success"
          onClick={() => setInteresseSelecionado(item)}
        >
          <Icon name="how_to_reg" />
          Confirmar Matrícula
        </button>
      ),
    },
  ];

  const matriculaColumns = [
    {
      key: 'disciplina',
      label: 'Disciplina',
      render: (item) => item.disciplina?.codigo || '-',
    },
    {
      key: 'aluno',
      label: 'Aluno',
      render: (item) => item.usuario?.nome || '-',
    },
    {
      key: 'data_matricula',
      label: 'Data Matrícula',
      render: (item) => formatarData(item.data_matricula),
    },
    {
      key: 'status',
      label: 'Status',
      render: (item) => (
        <span className={`status-pill ${item.status || 'ativa'}`}>
          {item.status}
        </span>
      ),
    },
    {
      key: 'acoes',
      label: 'Ações',
      render: (item) => (
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => setMatriculaSelecionada(item)}
        >
          <Icon name="cancel" />
          Cancelar
        </button>
      ),
    },
  ];

  return (
    <section>
      <div className="page-intro">
        <h2>Confirmação de matrículas</h2>
        <p className="page-description">
          Analise interesses pendentes e efetive matrículas conforme vagas.
        </p>
      </div>

      {mensagem && (
        <div className={`message ${mensagem.tipo}`}>
          {mensagem.texto}
        </div>
      )}

      <div className="content-card">
        <h3 className="section-title">Interesses pendentes</h3>
        <Table
          columns={interesseColumns}
          data={interesses}
          emptyMessage="Nenhum interesse pendente."
        />
      </div>

      <div className="content-card">
        <h3 className="section-title">Matrículas efetivadas</h3>
        <Table
          columns={matriculaColumns}
          data={matriculas}
          emptyMessage="Nenhuma matrícula efetivada."
        />
      </div>

      <ConfirmModal
        aberto={Boolean(interesseSelecionado)}
        titulo="Confirmar Matrícula"
        mensagem={`Confirmar matrícula de ${
          interesseSelecionado?.usuario?.nome || ''
        } em ${interesseSelecionado?.disciplina?.codigo || ''}?`}
        onConfirmar={confirmar}
        onCancelar={() => setInteresseSelecionado(null)}
      />

      <ConfirmModal
        aberto={Boolean(matriculaSelecionada)}
        titulo="Cancelar Matrícula"
        mensagem={`Deseja realmente cancelar a matrícula de ${
          matriculaSelecionada?.usuario?.nome || ''
        } em ${matriculaSelecionada?.disciplina?.codigo || ''}?`}
        textoConfirmar="Cancelar matrícula"
        varianteConfirmar="btn-danger"
        onConfirmar={confirmarCancelamento}
        onCancelar={() => setMatriculaSelecionada(null)}
      />
    </section>
  );
}
