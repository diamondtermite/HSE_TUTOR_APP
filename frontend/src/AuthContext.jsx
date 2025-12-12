import { createContext, useContext, useState } from 'react'; // importing the necessary functions to manage context and state from React

const AuthContext = createContext(null); // creating the authentication context that will allow for "global" access to the user and auth state

function AuthProvider({ children }) { // the AuthProvider component that will wrap around the app and provide the AuthContext to its children
    const [user, setUser] = useState(null); // user state that will be accesible throught the AuthContext
    const [auth, setAuth] = useState("Student"); // auth state that will be accesible throught the AuthContext

    const login = (userData) => { // function to log in a user and set the user and auth state
        setUser(userData);
        setAuth(userData.auth);
    }

    const logout = async () => { // function to log out a user and clear the user and auth state
        await fetch("/api/logout", { method: "POST", credentials: "include" });
        setUser(null);
        setAuth(null);
    }

    /*
    The AuthContext.Provider component that will provide the user, auth, login, and logout values to its children
    Allows for any component wrapped in AuthProvider to access the authentication state and functions, and is used in App.jsx for this
    */
    return (
        <AuthContext.Provider value={{ user, auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );

}

export default AuthProvider; // exporting the AuthProvider component to be used in other parts of the app

export function useAuth() { // custom hook to access the AuthContext values more easily
  return useContext(AuthContext);
}