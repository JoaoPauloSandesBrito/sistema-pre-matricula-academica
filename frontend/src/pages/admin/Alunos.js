import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import Icon from '../../components/Icon/Icon';
import Table from '../../components/Table/Table';
import { mockUsuario } from '../../data/mockData';
import { excluirAluno, listarAlunos } from '../../services/alunoService';

const alunosMock = [
  mockUsuario,
  {
    ...mockUsuario,
    id: 3,
    nome: 'Ivana Souza Santos',
    matricula: '202110812',
    email: '202110812@uesb.edu.br',
  },
  {
    ...mockUsuario,
    id: 4,
    nome: 'João Vitor Oliveira',
    matricula: '202110813',
    email: '202110813@uesb.edu.br',
  },
];

export default function Alunos() {
  const [busca, setBusca] = useState('');
  const [alunos, setAlunos] = useState(alunosMock);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);

  useEffect(() => {
    async function carregarAlunos() {
      try {
        const data = await listarAlunos();
        setAlunos(data);
      } catch (error) {
        setAlunos(alunosMock);
      }
    }

    carregarAlunos();
  }, []);

  const alunosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase().trim();

    return alunos.filter((aluno) => {
      return (
        aluno.nome.toLowerCase().includes(termo) ||
        String(aluno.matricula || '').toLowerCase().includes(termo)
      );
    });
  }, [alunos, busca]);

  async function confirmarExclusao() {
    if (!alunoSelecionado) {
      return;
    }

    try {
      await excluirAluno(alunoSelecionado.id);
    } catch (error) {
      // Mantém comportamento local para apresentação, mesmo sem backend ativo.
    }

    setAlunos((anteriores) =>
      anteriores.filter((aluno) => aluno.id !== alunoSelecionado.id)
    );
    setAlunoSelecionado(null);
  }

  const columns = [
    {
      key: 'matricula',
      label: 'Matrícula',
    },
    {
      key: 'nome',
      label: 'Nome',
    },
    {
      key: 'curso',
      label: 'Curso',
    },
    {
      key: 'status',
      label: 'Status',
      render: (aluno) => (
        <span className={`status-pill ${aluno.status ? 'success' : 'danger'}`}>
          {aluno.status ? 'Ativo' : 'Inativo'}
        </span>
      ),
    },
    {
      key: 'acoes',
      label: 'Ações',
      render: (aluno) => (
        <div className="table-actions">
          <Link
            to={`/admin/alunos/${aluno.id}`}
            className="btn btn-primary btn-icon"
            title="Visualizar aluno"
          >
            <Icon name="visibility" />
          </Link>

          <Link
            to={`/admin/alunos/${aluno.id}/editar`}
            className="btn btn-warning btn-icon"
            title="Editar aluno"
          >
            <Icon name="edit" />
          </Link>

          <button
            type="button"
            className="btn btn-danger btn-icon"
            title="Excluir aluno"
            onClick={() => setAlunoSelecionado(aluno)}
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
        <h2>Gerenciamento de alunos</h2>
        <p className="page-description">
          Cadastre, consulte, edite ou remova alunos do sistema.
        </p>
      </div>

      <div className="content-card">
        <div className="toolbar">
          <input
            className="search-input"
            value={busca}
            placeholder="Buscar por nome ou número de matrícula"
            onChange={(event) => setBusca(event.target.value)}
          />

          <Link to="/admin/alunos/novo" className="btn btn-primary">
            <Icon name="add" />
            Novo Aluno
          </Link>
        </div>

        <Table
          columns={columns}
          data={alunosFiltrados}
          emptyMessage="Nenhum aluno encontrado."
        />
      </div>

      <ConfirmModal
        aberto={Boolean(alunoSelecionado)}
        titulo="Excluir Aluno"
        mensagem={`Deseja realmente excluir ${alunoSelecionado?.nome || ''}?`}
        textoConfirmar="Excluir"
        varianteConfirmar="btn-danger"
        onConfirmar={confirmarExclusao}
        onCancelar={() => setAlunoSelecionado(null)}
      />
    </section>
  );
}
