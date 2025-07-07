import { createContext, useReducer, useEffect, useState } from "react";

const AuthContext = createContext();

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

    return (
        <AuthContext.Provider value={{ ...state, dispatch, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthContextProvider };

