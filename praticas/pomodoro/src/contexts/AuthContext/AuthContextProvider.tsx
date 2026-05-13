import { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './AuthContext';
import { forgotPassword, loginApi, logoutApi, me, register as registerApi, resetPassword as resetPasswordApi, type AuthUser } from '../../services/api';

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('chronos-token')) return;
    me().then((u) => { setUser(u); setIsAuthenticated(true); }).catch(() => { localStorage.removeItem('chronos-token'); });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token, user: authUser } = await loginApi({ email, password });
    localStorage.setItem('chronos-token', token);
    setUser(authUser);
    setIsAuthenticated(true);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    await registerApi({ name, email, password });
  }, []);

  const logout = useCallback(async () => {
    try { await logoutApi(); } catch {}
    localStorage.removeItem('chronos-token');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(() => ({
    isAuthenticated, user, login, register, logout,
    forgotPassword: async (email: string) => (await forgotPassword(email)).resetToken,
    resetPassword: async (token: string, newPassword: string) => { await resetPasswordApi(token, newPassword); },
  }), [isAuthenticated, login, logout, register, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
