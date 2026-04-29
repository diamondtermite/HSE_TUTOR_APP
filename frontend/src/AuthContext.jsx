import { createContext, useContext, useState, useEffect } from 'react'; // importing the necessary functions to manage context and state from React

const AuthContext = createContext(null); // creating the authentication context that will allow for "global" access to the user and auth state

function AuthProvider({ children }) { // the AuthProvider component that will wrap around the app and provide the AuthContext to its children
    const [user, setUser] = useState(null); // user state that will be accesible throught the AuthContext
    const [auth, setAuth] = useState(null); // auth state that will be accesible throught the AuthContext
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState(""); // success message state

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const res = await fetch('/api/current_user', { credentials: 'include' });
                if (!res.ok) {
                    setUser(null);
                    setAuth(null);
                } else {
                    const data = await res.json();
                    if (data.success) {
                        setUser(data.user);
                        setAuth(data.user.auth);
                    } else {
                        setUser(null);
                        setAuth(null);
                    }
                }
            } catch (err) {
                setUser(null);
                setAuth(null);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUser();
    }, []);

    const login = (userData) => { // function to log in a user and set the user and auth state
        setUser(userData);
        setAuth(userData.auth);
    }

    const logout = async () => {
        await fetch("/api/logout", { method: "POST", credentials: "include" });
        setUser(null);
        setAuth(null);
    }

    /*
    The AuthContext.Provider component that will provide the user, auth, login, logout, and loading values to its children
    Allows for any component wrapped in AuthProvider to access authentication state and functions, and is used in App.jsx for this
    */
    return (
        <AuthContext.Provider value={{ user, auth, login, logout, loading, successMessage, setSuccessMessage }}>
            {children}
        </AuthContext.Provider>
    );

}

export default AuthProvider; // exporting the AuthProvider component to be used in other parts of the app

export function useAuth() { // custom hook to access the AuthContext values more easily
  return useContext(AuthContext);
}