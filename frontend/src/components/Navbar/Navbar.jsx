import Icon from '../Icon/Icon';
import useAuth from '../../hooks/useAuth';
import './Navbar.css';

function getPrimeiroNome(nome) {
  if (!nome) {
    return 'Usuário';
  }

  return nome.split(' ')[0];
}

export default function Navbar({ title }) {
  const { usuario, perfil } = useAuth();
  const foto = usuario?.foto_url || usuario?.photoURL || usuario?.photo_url;
  const nome = usuario?.nome || usuario?.displayName || 'Usuário';
  const perfilLabel = perfil === 'secretaria' ? 'Secretaria' : 'Aluno';

  return (
    <header className="navbar">
      <div className="navbar-title-group">
        <Icon name="menu" className="navbar-menu-icon" />

        <div>
          <span className="navbar-kicker">Sistema de Pré-Matrícula</span>
          <h1>{title}</h1>
        </div>
      </div>

      <div className="navbar-user" title={nome}>
        {foto ? (
          <img
            src={foto}
            alt={`Foto de ${nome}`}
            className="navbar-avatar-img"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="navbar-avatar">
            {nome.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="navbar-user-info">
          <strong>{getPrimeiroNome(nome)}</strong>
          <span>{perfilLabel} · Online</span>
        </div>
      </div>
    </header>
  );
}
