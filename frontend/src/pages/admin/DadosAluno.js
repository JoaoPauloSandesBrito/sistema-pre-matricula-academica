import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Icon from '../../components/Icon/Icon';
import { mockUsuario } from '../../data/mockData';
import { buscarAluno } from '../../services/alunoService';

export default function DadosAluno() {
  const { id } = useParams();
  const [aluno, setAluno] = useState(null);

  useEffect(() => {
    async function carregarAluno() {
      try {
        const data = await buscarAluno(id);
        setAluno(data);
      } catch (error) {
        setAluno(mockUsuario);
      }
    }

    carregarAluno();
  }, [id]);

  if (!aluno) {
    return <p>Carregando aluno...</p>;
  }

  const inicial = (aluno.nome || 'A').charAt(0).toUpperCase();

  return (
    <section>
      <div className="page-intro">
        <h2>Dados do aluno</h2>
        <p className="page-description">
          Visualização detalhada do cadastro selecionado.
        </p>
      </div>

      <div className="content-card profile-card">
        <div className="profile-grid">
          <div className="profile-avatar-large">{inicial}</div>

          <div>
            <h3 className="profile-name">{aluno.nome}</h3>

            <div className="profile-list">
              <p>
                <strong>Email:</strong> {aluno.email}
              </p>
              <p>
                <strong>Matrícula:</strong> {aluno.matricula || 'Não informado'}
              </p>
              <p>
                <strong>Curso:</strong> {aluno.curso || 'Não informado'}
              </p>
              <p>
                <strong>Perfil:</strong> {aluno.perfil}
              </p>
              <p>
                <strong>Status:</strong> {aluno.status ? 'Ativo' : 'Inativo'}
              </p>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <Link to="/admin/alunos" className="btn btn-secondary">
            <Icon name="arrow_back" />
            Voltar
          </Link>

          <Link to={`/admin/alunos/${aluno.id}/editar`} className="btn btn-warning">
            <Icon name="edit" />
            Editar
          </Link>
        </div>
      </div>
    </section>
  );
}
