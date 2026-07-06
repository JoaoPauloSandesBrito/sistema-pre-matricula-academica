import { Navigate, Route, Routes } from 'react-router-dom';

import DashboardLayout from '../layouts/DashboardLayout';
import useAuth from '../hooks/useAuth';

import Login from '../pages/login/Login';
import Dashboard from '../pages/dashboard/Dashboard';
import Perfil from '../pages/perfil/Perfil';
import DisciplinasAluno from '../pages/disciplinas/DisciplinasAluno';
import DetalhesDisciplina from '../pages/disciplinas/DetalhesDisciplina';
import InteressesAluno from '../pages/interesses/InteressesAluno';
import Alunos from '../pages/admin/Alunos';
import DadosAluno from '../pages/admin/DadosAluno';
import FormAluno from '../pages/admin/FormAluno';
import DisciplinasAdmin from '../pages/admin/DisciplinasAdmin';
import FormDisciplina from '../pages/admin/FormDisciplina';
import Matriculas from '../pages/admin/Matriculas';
import Relatorios from '../pages/admin/Relatorios';

function PrivateRoute({ children }) {
  const { usuario } = useAuth();

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AdminRoute({ children }) {
  const { perfil } = useAuth();

  if (perfil !== 'secretaria') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="perfil" element={<Perfil />} />
        <Route path="disciplinas" element={<DisciplinasAluno />} />
        <Route path="disciplinas/:id" element={<DetalhesDisciplina />} />
        <Route path="interesses" element={<InteressesAluno />} />

        <Route
          path="admin/alunos"
          element={
            <AdminRoute>
              <Alunos />
            </AdminRoute>
          }
        />
        <Route
          path="admin/alunos/novo"
          element={
            <AdminRoute>
              <FormAluno />
            </AdminRoute>
          }
        />
        <Route
          path="admin/alunos/:id"
          element={
            <AdminRoute>
              <DadosAluno />
            </AdminRoute>
          }
        />
        <Route
          path="admin/alunos/:id/editar"
          element={
            <AdminRoute>
              <FormAluno />
            </AdminRoute>
          }
        />
        <Route
          path="admin/disciplinas"
          element={
            <AdminRoute>
              <DisciplinasAdmin />
            </AdminRoute>
          }
        />
        <Route
          path="admin/disciplinas/nova"
          element={
            <AdminRoute>
              <FormDisciplina />
            </AdminRoute>
          }
        />
        <Route
          path="admin/disciplinas/:id/editar"
          element={
            <AdminRoute>
              <FormDisciplina />
            </AdminRoute>
          }
        />
        <Route
          path="admin/matriculas"
          element={
            <AdminRoute>
              <Matriculas />
            </AdminRoute>
          }
        />
        <Route
          path="admin/relatorios"
          element={
            <AdminRoute>
              <Relatorios />
            </AdminRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
