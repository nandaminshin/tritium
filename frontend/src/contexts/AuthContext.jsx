import { createContext, useReducer, useEffect } from "react";
import axios from '../helpers/Axios';

const AuthContext = createContext();

let AuthReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, user: action.payload };
        case 'LOGOUT':
            return { ...state, user: null };
        case 'SET_USER':
            return { ...state, user: action.payload };
        default:
            return state;
    }
}

const AuthContextProvider = ({ children }) => {
    let [state, dispatch] = useReducer(AuthReducer, {
        user: null,
    });

    // Check for user authentication on initial load
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('/api/user/me');
                if (response.status === 200) {
                    dispatch({ type: 'SET_USER', payload: response.data.user });
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                dispatch({ type: 'LOGOUT' });
            }
        };

        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthContextProvider };

