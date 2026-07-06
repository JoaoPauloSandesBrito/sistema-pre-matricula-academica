import { NavLink } from 'react-router-dom';

import Icon from '../Icon/Icon';
import useAuth from '../../hooks/useAuth';
import './Sidebar.css';

const alunoLinks = [
  {
    to: '/dashboard',
    icon: 'dashboard',
    label: 'Dashboard',
  },
  {
    to: '/disciplinas',
    icon: 'menu_book',
    label: 'Disciplinas',
  },
  {
    to: '/interesses',
    icon: 'assignment_turned_in',
    label: 'Interesses',
  },
  {
    to: '/perfil',
    icon: 'account_circle',
    label: 'Perfil',
  },
];

const secretariaLinks = [
  {
    to: '/dashboard',
    icon: 'dashboard',
    label: 'Dashboard',
  },
  {
    to: '/admin/alunos',
    icon: 'groups',
    label: 'Alunos',
  },
  {
    to: '/admin/disciplinas',
    icon: 'menu_book',
    label: 'Disciplinas',
  },
  {
    to: '/admin/matriculas',
    icon: 'how_to_reg',
    label: 'Matrículas',
  },
  {
    to: '/admin/relatorios',
    icon: 'monitoring',
    label: 'Relatórios',
  },
];

export default function Sidebar() {
  const { perfil, sair } = useAuth();
  const links = perfil === 'secretaria' ? secretariaLinks : alunoLinks;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <Icon name="school" className="filled" />
        </div>

        <div>
          Pré-Matrícula
          <span>Acadêmica</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }
          >
            <Icon name={link.icon} className="sidebar-icon" />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <button type="button" className="sidebar-logout" onClick={sair}>
        <Icon name="logout" className="sidebar-icon" />
        <span>Sair</span>
      </button>
    </aside>
  );
}
