import { Link } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';

import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import Icon from '../../components/Icon/Icon';
import Table from '../../components/Table/Table';
import useAuth from '../../hooks/useAuth';
import { mockDisciplinas } from '../../data/mockData';
import {
  criarInteresse,
  listarInteresses,
} from '../../services/interesseService';
import { listarDisciplinas } from '../../services/disciplinaService';

export default function DisciplinasAluno() {
  const { usuario } = useAuth();
  const [busca, setBusca] = useState('');
  const [mensagem, setMensagem] = useState(null);
  const [disciplinas, setDisciplinas] = useState(mockDisciplinas);
  const [interessesIds, setInteressesIds] = useState([]);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState(null);

  const carregarDados = useCallback(async () => {
    try {
      const [disciplinasData, interessesData] = await Promise.all([
        listarDisciplinas(),
        listarInteresses(usuario?.id || 1),
      ]);

      setDisciplinas(disciplinasData);
      setInteressesIds(
        interessesData.map((interesse) => interesse.disciplina_id)
      );
    } catch (error) {
      setDisciplinas(mockDisciplinas);
    }
  }, [usuario?.id]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const disciplinasFiltradas = useMemo(() => {
    const termo = busca.toLowerCase().trim();

    return disciplinas.filter((disciplina) => {
      return (
        disciplina.nome.toLowerCase().includes(termo) ||
        disciplina.codigo.toLowerCase().includes(termo)
      );
    });
  }, [busca, disciplinas]);

  async function confirmarInteresse() {
    if (!disciplinaSelecionada) {
      return;
    }

    try {
      await criarInteresse({
        usuario_id: usuario?.id || 1,
        disciplina_id: disciplinaSelecionada.id,
      });

      setInteressesIds((anteriores) => [
        ...anteriores,
        disciplinaSelecionada.id,
      ]);

      setMensagem({
        tipo: 'success',
        texto: 'Interesse registrado com sucesso.',
      });
    } catch (error) {
      setMensagem({
        tipo: 'error',
        texto:
          error.response?.data?.message ||
          'Não foi possível registrar o interesse.',
      });
    } finally {
      setDisciplinaSelecionada(null);
    }
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
      render: (disciplina) => {
        const jaInscrito = interessesIds.includes(disciplina.id);

        return (
          <div className="table-actions">
            <Link
              to={`/disciplinas/${disciplina.id}`}
              className="btn btn-primary"
            >
              <Icon name="visibility" />
              Detalhes
            </Link>

            <button
              type="button"
              className="btn btn-success"
              disabled={jaInscrito}
              onClick={() => setDisciplinaSelecionada(disciplina)}
            >
              <Icon name={jaInscrito ? 'check_circle' : 'add_task'} />
              {jaInscrito ? 'Interesse registrado' : 'Inscrever-se'}
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <section>
      <div className="page-intro">
        <h2>Disciplinas disponíveis</h2>
        <p className="page-description">
          Consulte disciplinas disponíveis e registre interesse na pré-matrícula.
        </p>
      </div>

      {mensagem && (
        <div className={`message ${mensagem.tipo}`}>
          {mensagem.texto}
        </div>
      )}

      <div className="content-card">
        <div className="toolbar">
          <input
            className="search-input"
            value={busca}
            placeholder="Buscar por nome ou código"
            onChange={(event) => setBusca(event.target.value)}
          />
        </div>

        <Table
          columns={columns}
          data={disciplinasFiltradas}
          emptyMessage="Nenhuma disciplina encontrada."
        />
      </div>

      <ConfirmModal
        aberto={Boolean(disciplinaSelecionada)}
        titulo="Confirmar Interesse"
        mensagem={`Deseja realmente demonstrar interesse em cursar a disciplina ${
          disciplinaSelecionada?.codigo || ''
        } - ${disciplinaSelecionada?.nome || ''}?`}
        onConfirmar={confirmarInteresse}
        onCancelar={() => setDisciplinaSelecionada(null)}
      />
    </section>
  );
}
