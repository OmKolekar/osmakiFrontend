import { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved session on mount
    const savedUser = localStorage.getItem("osmaki_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error("Failed to parse saved user session:", err);
        localStorage.removeItem("osmaki_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const authenticatedUser = await authApi.login(email, password);
      // Ensure we store it as a parsed object
      const userObj = typeof authenticatedUser === "string" ? JSON.parse(authenticatedUser) : authenticatedUser;
      setUser(userObj);
      localStorage.setItem("osmaki_user", JSON.stringify(userObj));
      return userObj;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("osmaki_user");
  };

  const signUpLogin = (registeredUser) => {
    const userObj = typeof registeredUser === "string" ? JSON.parse(registeredUser) : registeredUser;
    setUser(userObj);
    localStorage.setItem("osmaki_user", JSON.stringify(userObj));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signUpLogin }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
