import { useState } from "react";
import { UserContext } from "./context/UserContextValue";

/**
 * Default username in Portuguese. Change here for localization.
 */
const DEFAULT_USERNAME = "Usuário";
const USER_STORAGE_KEY = "user";
const AUTH_TOKEN_STORAGE_KEY = "authToken";

const getInitialUser = () => {
  const savedUser = localStorage.getItem(USER_STORAGE_KEY);
  const savedToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

  if (!savedUser) {
    if (savedToken) {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    }
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch (e) {
    console.error("Failed to parse saved user:", e);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    return null;
  }
};

export function UserProvider({ children }) {
  const [user, setUser] = useState(getInitialUser);

  const login = (roleOrUser, nameOrToken = null, maybeToken = null) => {
    const isObjectPayload = typeof roleOrUser === "object" && roleOrUser !== null;
    const token = isObjectPayload ? nameOrToken : maybeToken;

    const userData = isObjectPayload
      ? {
        ...roleOrUser,
        role: roleOrUser.role || "student",
        name: roleOrUser.name || DEFAULT_USERNAME,
      }
      : {
        role: roleOrUser,
        name: nameOrToken || DEFAULT_USERNAME,
      };

    setUser(userData);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));

    if (token) {
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
