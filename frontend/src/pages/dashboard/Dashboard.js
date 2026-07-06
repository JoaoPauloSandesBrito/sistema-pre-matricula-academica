import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Card from '../../components/Card/Card';
import Icon from '../../components/Icon/Icon';
import Table from '../../components/Table/Table';
import useAuth from '../../hooks/useAuth';
import { mockDashboard } from '../../data/mockData';
import { buscarResumoDashboard } from '../../services/dashboardService';

function imprimirRelatorio() {
  window.print();
}

export default function Dashboard() {
  const { perfil } = useAuth();
  const [resumo, setResumo] = useState(mockDashboard);

  useEffect(() => {
    async function carregarResumo() {
      try {
        const data = await buscarResumoDashboard();
        setResumo({ ...mockDashboard, ...data });
      } catch (error) {
        setResumo(mockDashboard);
      }
    }

    carregarResumo();
  }, []);

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
          {perfil === 'secretaria' ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={imprimirRelatorio}
            >
              <Icon name="print" />
              Imprimir Relatório
            </button>
          ) : (
            <Link to={`/disciplinas/${disciplina.id}`} className="btn btn-primary">
              <Icon name="visibility" />
              Ver detalhes
            </Link>
          )}
        </div>
      ),
    },
  ];

  return (
    <section>
      <div className="page-intro">
        <h2>
          {perfil === 'secretaria'
            ? 'Visão geral da secretaria'
            : 'Visão geral do aluno'}
        </h2>

        <p className="page-description">
          Acompanhe os principais números do processo de pré-matrícula.
        </p>
      </div>

      <div className="grid-cards">
        <Card
          titulo="Discentes"
          valor={resumo.total_alunos}
          descricao="Total de discentes"
          variante="blue"
        />

        <Card
          titulo="Disciplinas"
          valor={resumo.total_disciplinas}
          descricao="Total de disciplinas"
          variante="green"
        />

        <Card
          titulo={perfil === 'secretaria' ? 'Matrículas' : 'Interesses'}
          valor={
            perfil === 'secretaria'
              ? resumo.total_matriculas
              : resumo.total_interesses
          }
          descricao="Solicitações registradas"
          variante="amber"
        />

        <Card
          titulo="Vagas"
          valor={resumo.total_vagas}
          descricao="Total de vagas ofertadas"
          variante="slate"
        />
      </div>

      <div className="content-card">
        <div className="toolbar">
          <div className="toolbar-title">
            <h3>Disciplinas recentes</h3>
            <p className="page-description">
              Lista resumida de disciplinas cadastradas no sistema.
            </p>
          </div>
        </div>

        <Table
          columns={columns}
          data={resumo.disciplinas || []}
          emptyMessage="Nenhuma disciplina cadastrada."
        />
      </div>
    </section>
  );
}
