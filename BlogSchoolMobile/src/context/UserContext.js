import React, { createContext, useMemo, useState } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = ({ user: nextUser, token: nextToken }) => {
    setUser(nextUser);
    setToken(nextToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const value = useMemo(() => ({
    user,
    token,
    login,
    logout,
    isTeacher: user?.role === 'teacher',
    isStudent: user?.role === 'student',
  }), [token, user]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}
