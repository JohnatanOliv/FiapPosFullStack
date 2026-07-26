import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'student' or 'teacher'

  const login = (type, name) => {
    setUserType(type);
    setUser({ name, type });
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
  };

  return (
    <UserContext.Provider value={{ user, userType, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
