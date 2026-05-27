import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/layout/AppLayout';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import ImportacaoPage from '../pages/ImportacaoPage';
import ProvisaoPage from '../pages/ProvisaoPage';
import PedidoPage from '../pages/PedidoPage';
import RelatoriosPage from '../pages/RelatoriosPage';
import ContratosPage from '../pages/ContratosPage';
import PerfilPage from '../pages/PerfilPage';
import GestaoSapPage from '../pages/GestaoSapPage';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? children : <Navigate to="/dashboard" replace />;
}

function routerBasename() {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return base || undefined;
}

export default function AppRouter() {
  return (
    <BrowserRouter basename={routerBasename()}>
      <Routes>
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/cadastro" element={<PublicRoute><RegisterPage /></PublicRoute>} />

        <Route
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/gestao-sap" element={<GestaoSapPage />} />
          <Route path="/importacao" element={<ImportacaoPage />} />
          <Route path="/provisao" element={<ProvisaoPage />} />
          <Route path="/pedido" element={<PedidoPage />} />
          <Route path="/relatorios" element={<RelatoriosPage />} />
          <Route path="/contratos" element={<ContratosPage />} />
          <Route path="/perfil" element={<PerfilPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
