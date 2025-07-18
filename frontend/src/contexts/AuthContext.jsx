import { createContext, useReducer, useEffect, useState } from "react";
import { io } from 'socket.io-client';

const AuthContext = createContext();

// Initialize socket connection
const socket = io(import.meta.env.VITE_BACKEND_URL);

let AuthReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            localStorage.setItem('user', JSON.stringify(action.payload));
            return { ...state, user: action.payload };
        case 'LOGOUT':
            localStorage.removeItem('user');
            return { ...state, user: null };
        default:
            return state;
    }
}

const AuthContextProvider = ({ children }) => {
    let [state, dispatch] = useReducer(AuthReducer, {
        user: null,
    });
    const [loading, setLoading] = useState(true);

    // Initial auth check
    useEffect(() => {
        try {
            let user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                dispatch({ type: 'LOGIN', payload: user });
            } else {
                dispatch({ type: 'LOGOUT' });
            }
        } catch (e) {
            dispatch({ type: 'LOGOUT' });
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Socket connected in AuthContext');
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected in AuthContext');
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
        };
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, dispatch, loading, socket }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthContextProvider };

