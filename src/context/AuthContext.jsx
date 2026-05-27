import { createContext, useContext, useState, useEffect } from 'react';

const VALID_EMAIL = 'usuarioteste@email.com';
const VALID_PASSWORD = 'usuarioteste@123*';

const MOCK_USER = {
  name: 'Usuário Teste',
  email: 'usuarioteste@email.com',
  role: 'Administrador',
  department: 'Telecom',
  company: 'Neoenergia Coelba',
  initials: 'UT',
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem('neo_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        sessionStorage.removeItem('neo_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      sessionStorage.setItem('neo_user', JSON.stringify(MOCK_USER));
      setUser(MOCK_USER);
      return { success: true };
    }
    return { success: false, message: 'E-mail ou senha incorretos.' };
  };

  const logout = () => {
    sessionStorage.removeItem('neo_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
