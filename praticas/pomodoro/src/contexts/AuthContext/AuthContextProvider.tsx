import { useCallback, useMemo, useState } from 'react';
import { AuthContext } from './AuthContext';
import { apiLogin } from '../../services/api';

const STORAGE_KEY = 'chronos-auth-data';

interface UserPayload {
  name: string;
  email: string;
}

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [authData, setAuthData] = useState<{ token: string; user: UserPayload } | null>(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  });

  const isAuthenticated = useMemo(() => !!authData?.token, [authData]);
  const userName = useMemo(() => authData?.user?.name || '', [authData]);

  const login = useCallback(async (username: string, password: string) => {
    try {
      // Passando o email recebido no campo username do formulário
      const data = await apiLogin({ email: username, password });
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setAuthData(data);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setAuthData(null);
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, userName, login, logout }),
    [isAuthenticated, userName, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}