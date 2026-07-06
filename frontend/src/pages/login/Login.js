import { useNavigate } from 'react-router-dom';

import Icon from '../../components/Icon/Icon';
import useAuth from '../../hooks/useAuth';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const {
    entrarComGoogle,
    entrarComoDemo,
    carregando,
  } = useAuth();

  async function handleLoginGoogle() {
    await entrarComGoogle();
    navigate('/dashboard');
  }

  function handleDemo(tipo) {
    entrarComoDemo(tipo);
    navigate('/dashboard');
  }

  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="login-content">
          <h1>
            Sistema de
            <br />
            Pré-Matrícula
            <br />
            Acadêmica
          </h1>

          <p>
            Faça login com seu e-mail institucional da UESB
            para acessar o sistema.
          </p>

          <button
            type="button"
            className="google-button"
            onClick={handleLoginGoogle}
            disabled={carregando}
          >
            <span className="google-mark">G</span>
            Fazer login com e-mail Google
          </button>

          <div className="demo-actions">
            <button
              type="button"
              className="demo-button"
              onClick={() => handleDemo('aluno')}
            >
              <Icon name="person" />
              Entrar como aluno demo
            </button>

            <button
              type="button"
              className="demo-button"
              onClick={() => handleDemo('secretaria')}
            >
              <Icon name="admin_panel_settings" />
              Entrar como secretaria demo
            </button>
          </div>

          <small>
            Apenas e-mails institucionais @uesb.edu.br serão permitidos.
          </small>
        </div>
      </section>

      <section className="login-illustration">
        <div className="illustration-card">
          <strong>UESB</strong>
          <span>Pré-matrícula online</span>
        </div>
      </section>
    </main>
  );
}
