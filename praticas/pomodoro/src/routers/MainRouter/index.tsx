import { BrowserRouter, Route, Routes, useLocation } from 'react-router';
import { AboutPomodoro } from '../../pages/AboutPomodoro';
import { NotFound } from '../../pages/NotFound';
import { Home } from '../../pages/Home';
import { useEffect } from 'react';
import { History } from '../../pages/History';
import { Settings } from '../../pages/Settings';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { PublicOnlyRoute } from '../../components/PublicOnlyRoute';
import { Login } from '../../pages/Login';
import { Register } from '../../pages/Register';
import { ForgotPassword } from '../../pages/ForgotPassword';
import { ResetPassword } from '../../pages/ResetPassword';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

export function MainRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Acessíveis Apenas Sem Autenticação */}
        <Route
          path='/'
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path='/register'
          element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <PublicOnlyRoute>
              <ForgotPassword />
            </PublicOnlyRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <PublicOnlyRoute>
              <ResetPassword />
            </PublicOnlyRoute>
          }
        />

        {/* Rotas Protegidas - Só entra Autenticado */}
        <Route
          path='/home'
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path='/history'
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
        <Route
          path='/settings'
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path='/about-pomodoro'
          element={
            <ProtectedRoute>
              <AboutPomodoro />
            </ProtectedRoute>
          }
        />

        {/* Rota Fallback para 404 */}
        <Route path='*' element={<NotFound />} />
      </Routes>
      <ScrollToTop />
    </BrowserRouter>
  );
}
