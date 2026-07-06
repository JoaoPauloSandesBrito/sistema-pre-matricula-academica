import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import Icon from '../../components/Icon/Icon';
import Table from '../../components/Table/Table';
import { mockDisciplinas } from '../../data/mockData';
import {
  excluirDisciplina,
  listarDisciplinas,
} from '../../services/disciplinaService';

export default function DisciplinasAdmin() {
  const [busca, setBusca] = useState('');
  const [disciplinas, setDisciplinas] = useState(mockDisciplinas);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState(null);

  useEffect(() => {
    async function carregarDisciplinas() {
      try {
        const data = await listarDisciplinas();
        setDisciplinas(data);
      } catch (error) {
        setDisciplinas(mockDisciplinas);
      }
    }

    carregarDisciplinas();
  }, []);

  const disciplinasFiltradas = useMemo(() => {
    const termo = busca.toLowerCase().trim();

    return disciplinas.filter((disciplina) => {
      return (
        disciplina.nome.toLowerCase().includes(termo) ||
        disciplina.codigo.toLowerCase().includes(termo)
      );
    });
  }, [busca, disciplinas]);

  async function confirmarExclusao() {
    if (!disciplinaSelecionada) {
      return;
    }

    try {
      await excluirDisciplina(disciplinaSelecionada.id);
    } catch (error) {
      // Mantém comportamento local para apresentação, mesmo sem backend ativo.
    }

    setDisciplinas((anteriores) =>
      anteriores.filter((item) => item.id !== disciplinaSelecionada.id)
    );
    setDisciplinaSelecionada(null);
  }

  const columns = [
    {
      key: 'codigo',
      label: 'Código',
    },
    {
      key: 'nome',
      label: 'Nome',
    },
    {
      key: 'carga_horaria',
      label: 'CH',
    },
    {
      key: 'vagas',
      label: 'Vagas',
    },
    {
      key: 'acoes',
      label: 'Ações',
      render: (disciplina) => (
        <div className="table-actions">
          <Link
            to={`/disciplinas/${disciplina.id}`}
            className="btn btn-primary btn-icon"
            title="Visualizar"
          >
            <Icon name="visibility" />
          </Link>

          <Link
            to={`/admin/disciplinas/${disciplina.id}/editar`}
            className="btn btn-warning btn-icon"
            title="Editar"
          >
            <Icon name="edit" />
          </Link>

          <button
            type="button"
            className="btn btn-danger btn-icon"
            title="Excluir"
            onClick={() => setDisciplinaSelecionada(disciplina)}
          >
            <Icon name="delete" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <section>
      <div className="page-intro">
        <h2>Gerenciamento de disciplinas</h2>
        <p className="page-description">
          Cadastre, edite, consulte ou remova disciplinas ofertadas.
        </p>
      </div>

      <div className="content-card">
        <div className="toolbar">
          <input
            className="search-input"
            value={busca}
            placeholder="Buscar por nome ou código"
            onChange={(event) => setBusca(event.target.value)}
          />

          <Link to="/admin/disciplinas/nova" className="btn btn-primary">
            <Icon name="add" />
            Nova Disciplina
          </Link>
        </div>

        <Table
          columns={columns}
          data={disciplinasFiltradas}
          emptyMessage="Nenhuma disciplina encontrada."
        />
      </div>

      <ConfirmModal
        aberto={Boolean(disciplinaSelecionada)}
        titulo="Excluir Disciplina"
        mensagem={`Deseja realmente excluir ${
          disciplinaSelecionada?.codigo || ''
        } - ${disciplinaSelecionada?.nome || ''}?`}
        textoConfirmar="Excluir"
        varianteConfirmar="btn-danger"
        onConfirmar={confirmarExclusao}
        onCancelar={() => setDisciplinaSelecionada(null)}
      />
    </section>
  );
}
