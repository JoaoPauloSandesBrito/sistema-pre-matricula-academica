import { Outlet, useLocation } from 'react-router-dom';

import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import './DashboardLayout.css';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/perfil': 'Perfil',
  '/disciplinas': 'Disciplinas',
  '/interesses': 'Meus Interesses',
  '/admin/alunos': 'Alunos',
  '/admin/disciplinas': 'Disciplinas',
  '/admin/matriculas': 'Matrículas',
  '/admin/relatorios': 'Relatórios',
};

function resolveTitle(pathname) {
  if (pathname.startsWith('/disciplinas/')) {
    return 'Detalhes da Disciplina';
  }

  if (pathname === '/admin/alunos/novo') {
    return 'Novo Aluno';
  }

  if (pathname.startsWith('/admin/alunos/') && pathname.endsWith('/editar')) {
    return 'Editar Aluno';
  }

  if (pathname.startsWith('/admin/alunos/')) {
    return 'Dados Aluno';
  }

  if (pathname === '/admin/disciplinas/nova') {
    return 'Nova Disciplina';
  }

  if (
    pathname.startsWith('/admin/disciplinas/') &&
    pathname.endsWith('/editar')
  ) {
    return 'Editar Disciplina';
  }

  return pageTitles[pathname] || 'Sistema de Pré-Matrícula';
}

export default function DashboardLayout() {
  const location = useLocation();
  const title = resolveTitle(location.pathname);

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <Navbar title={title} />

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
