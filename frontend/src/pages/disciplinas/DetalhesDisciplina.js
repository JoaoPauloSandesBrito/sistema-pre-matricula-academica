import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import Icon from '../../components/Icon/Icon';
import useAuth from '../../hooks/useAuth';
import { mockDisciplinas } from '../../data/mockData';
import { buscarDisciplina } from '../../services/disciplinaService';
import { criarInteresse } from '../../services/interesseService';

export default function DetalhesDisciplina() {
  const { id } = useParams();
  const { usuario, perfil } = useAuth();

  const [disciplina, setDisciplina] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  useEffect(() => {
    async function carregarDisciplina() {
      try {
        const data = await buscarDisciplina(id);
        setDisciplina(data);
      } catch (error) {
        const fallback = mockDisciplinas.find(
          (item) => String(item.id) === String(id)
        );

        setDisciplina(fallback || mockDisciplinas[0]);
      }
    }

    carregarDisciplina();
  }, [id]);

  async function confirmarInteresse() {
    if (!disciplina) {
      return;
    }

    try {
      await criarInteresse({
        usuario_id: usuario?.id || 1,
        disciplina_id: disciplina.id,
      });

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
      setModalAberto(false);
    }
  }

  if (!disciplina) {
    return <p>Carregando disciplina...</p>;
  }

  const rotaVoltar = perfil === 'secretaria' ? '/admin/disciplinas' : '/disciplinas';

  return (
    <section>
      <div className="page-intro">
        <h2>
          {disciplina.codigo} - {disciplina.nome}
        </h2>
        <p className="page-description">
          Informações completas sobre a disciplina selecionada.
        </p>
      </div>

      {mensagem && (
        <div className={`message ${mensagem.tipo}`}>
          {mensagem.texto}
        </div>
      )}

      <div className="content-card">
        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">Curso</span>
            <span className="detail-value">
              {disciplina.curso || 'Ciência da Computação'}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Período ideal</span>
            <span className="detail-value">{disciplina.periodo || '-'}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Carga horária</span>
            <span className="detail-value">
              {disciplina.carga_horaria} horas
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Vagas</span>
            <span className="detail-value">{disciplina.vagas}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Professor</span>
            <span className="detail-value">
              {disciplina.professor || 'Não informado'}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Departamento</span>
            <span className="detail-value">
              {disciplina.departamento || 'Não informado'}
            </span>
          </div>

          <div className="detail-item full">
            <span className="detail-label">Descrição</span>
            <span className="detail-value">
              {disciplina.descricao || 'Não informada'}
            </span>
          </div>

          <div className="detail-item full">
            <span className="detail-label">Ementa</span>
            <span className="detail-value">
              {disciplina.ementa || 'Não informada'}
            </span>
          </div>
        </div>

        <div className="form-actions">
          <Link to={rotaVoltar} className="btn btn-secondary">
            <Icon name="arrow_back" />
            Voltar
          </Link>

          {perfil !== 'secretaria' && (
            <button
              type="button"
              className="btn btn-success"
              onClick={() => setModalAberto(true)}
            >
              <Icon name="add_task" />
              Inscrever-se
            </button>
          )}
        </div>
      </div>

      <ConfirmModal
        aberto={modalAberto}
        titulo="Confirmar Interesse"
        mensagem={`Confirma interesse em cursar ${disciplina.codigo} - ${disciplina.nome}?`}
        onConfirmar={confirmarInteresse}
        onCancelar={() => setModalAberto(false)}
      />
    </section>
  );
}
