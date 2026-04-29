// PublicOnlyRoute/index.tsx (opcional)
import { Navigate } from 'react-router';
import { useAuthContext } from '../../contexts/AuthContext';

export function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthContext();
  if (isAuthenticated) return <Navigate to="/home" replace />;
  return <>{children}</>;
}