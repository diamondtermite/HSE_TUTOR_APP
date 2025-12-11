import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [auth, setAuth] = useState("Student");

    const login = (userData) => {
        setUser(userData);
        setAuth(userData.auth);
    }

    const logout = async () => {
        await fetch("/api/logout", { method: "POST", credentials: "include" });
        setUser(null);
        setAuth(null);
    }

    return (
        <AuthContext.Provider value={{ user, auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );

}

export default AuthProvider;

export function useAuth() {
  return useContext(AuthContext);
}