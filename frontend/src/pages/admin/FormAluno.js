import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Icon from '../../components/Icon/Icon';
import { mockUsuario } from '../../data/mockData';
import {
  atualizarAluno,
  buscarAluno,
  criarAluno,
} from '../../services/alunoService';

const initialState = {
  nome: '',
  email: '',
  matricula: '',
  curso: 'Ciência da Computação',
  perfil: 'aluno',
  status: true,
};

export default function FormAluno() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditando = Boolean(id);

  const [form, setForm] = useState(initialState);
  const [mensagem, setMensagem] = useState(null);

  useEffect(() => {
    async function carregarAluno() {
      if (!isEditando) {
        return;
      }

      try {
        const data = await buscarAluno(id);
        setForm(data);
      } catch (error) {
        setForm(mockUsuario);
      }
    }

    carregarAluno();
  }, [id, isEditando]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      if (isEditando) {
        await atualizarAluno(id, form);
      } else {
        await criarAluno(form);
      }

      navigate('/admin/alunos');
    } catch (error) {
      setMensagem({
        tipo: 'error',
        texto:
          error.response?.data?.message ||
          'Não foi possível salvar o aluno.',
      });
    }
  }

  return (
    <section>
      <div className="page-intro">
        <h2>{isEditando ? 'Editar cadastro' : 'Cadastrar novo aluno'}</h2>
        <p className="page-description">
          Preencha os dados acadêmicos e institucionais do usuário.
        </p>
      </div>

      {mensagem && (
        <div className={`message ${mensagem.tipo}`}>
          {mensagem.texto}
        </div>
      )}

      <form className="content-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group full">
            <label htmlFor="nome">Nome</label>
            <input
              id="nome"
              name="nome"
              value={form.nome}
              placeholder="Digite o nome completo"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="matricula">Matrícula</label>
            <input
              id="matricula"
              name="matricula"
              value={form.matricula || ''}
              placeholder="Ex: 202110811"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">E-mail institucional</label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              placeholder="matricula@uesb.edu.br"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="curso">Curso</label>
            <input
              id="curso"
              name="curso"
              value={form.curso || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="perfil">Perfil</label>
            <select
              id="perfil"
              name="perfil"
              value={form.perfil}
              onChange={handleChange}
            >
              <option value="aluno">Aluno</option>
              <option value="secretaria">Secretaria</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Situação</label>
            <select
              id="status"
              name="status"
              value={form.status ? 'true' : 'false'}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  status: event.target.value === 'true',
                }))
              }
            >
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <Link to="/admin/alunos" className="btn btn-secondary">
            <Icon name="close" />
            Cancelar
          </Link>

          <button type="submit" className="btn btn-primary">
            <Icon name="save" />
            Salvar
          </button>
        </div>
      </form>
    </section>
  );
}
