import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Icon from '../../components/Icon/Icon';
import { mockDisciplinas } from '../../data/mockData';
import {
  atualizarDisciplina,
  buscarDisciplina,
  criarDisciplina,
} from '../../services/disciplinaService';

const initialState = {
  codigo: '',
  nome: '',
  carga_horaria: 60,
  vagas: 30,
  professor: '',
  curso: 'Ciência da Computação',
  periodo: '4º semestre',
  departamento: 'DCET',
  status: 'ativa',
  descricao: '',
  ementa: '',
};

export default function FormDisciplina() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditando = Boolean(id);

  const [form, setForm] = useState(initialState);
  const [mensagem, setMensagem] = useState(null);

  useEffect(() => {
    async function carregarDisciplina() {
      if (!isEditando) {
        return;
      }

      try {
        const data = await buscarDisciplina(id);
        setForm(data);
      } catch (error) {
        const fallback = mockDisciplinas.find(
          (item) => String(item.id) === String(id)
        );

        setForm(fallback || mockDisciplinas[0]);
      }
    }

    carregarDisciplina();
  }, [id, isEditando]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === 'vagas' || name === 'carga_horaria'
        ? Number(value)
        : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      if (isEditando) {
        await atualizarDisciplina(id, form);
      } else {
        await criarDisciplina(form);
      }

      navigate('/admin/disciplinas');
    } catch (error) {
      setMensagem({
        tipo: 'error',
        texto:
          error.response?.data?.message ||
          'Não foi possível salvar a disciplina.',
      });
    }
  }

  return (
    <section>
      <div className="page-intro">
        <h2>{isEditando ? 'Editar disciplina' : 'Cadastrar nova disciplina'}</h2>
        <p className="page-description">
          Informe código, vagas, período, professor, descrição e ementa.
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
              placeholder="Digite o nome da disciplina"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="codigo">Código</label>
            <input
              id="codigo"
              name="codigo"
              value={form.codigo}
              placeholder="Ex: BD001"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="carga_horaria">Carga horária</label>
            <input
              id="carga_horaria"
              type="number"
              name="carga_horaria"
              min="1"
              value={form.carga_horaria}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="vagas">Limite de vagas</label>
            <input
              id="vagas"
              type="number"
              name="vagas"
              min="0"
              value={form.vagas}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="professor">Professor</label>
            <input
              id="professor"
              name="professor"
              value={form.professor || ''}
              placeholder="Digite o nome do professor"
              onChange={handleChange}
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
            <label htmlFor="periodo">Período ideal</label>
            <select
              id="periodo"
              name="periodo"
              value={form.periodo}
              onChange={handleChange}
            >
              <option value="1º semestre">1º semestre</option>
              <option value="2º semestre">2º semestre</option>
              <option value="3º semestre">3º semestre</option>
              <option value="4º semestre">4º semestre</option>
              <option value="5º semestre">5º semestre</option>
              <option value="6º semestre">6º semestre</option>
              <option value="7º semestre">7º semestre</option>
              <option value="8º semestre">8º semestre</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="departamento">Departamento</label>
            <input
              id="departamento"
              name="departamento"
              value={form.departamento || ''}
              placeholder="Ex: DCET"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Situação</label>
            <select
              id="status"
              name="status"
              value={form.status || 'ativa'}
              onChange={handleChange}
            >
              <option value="ativa">Ativa</option>
              <option value="inativa">Inativa</option>
            </select>
          </div>

          <div className="form-group full">
            <label htmlFor="descricao">Descrição</label>
            <textarea
              id="descricao"
              name="descricao"
              value={form.descricao || ''}
              placeholder="Digite a descrição da disciplina"
              onChange={handleChange}
            />
          </div>

          <div className="form-group full">
            <label htmlFor="ementa">Ementa</label>
            <textarea
              id="ementa"
              name="ementa"
              value={form.ementa || ''}
              placeholder="Digite a ementa da disciplina"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <Link to="/admin/disciplinas" className="btn btn-secondary">
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
