import { useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const AuthNavigator = ({ children }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (user) {
            if (user.role === 'admin' && !location.pathname.startsWith('/admin')) {
                navigate('/admin');
            } else if (user.role === 'superAdmin' && !location.pathname.startsWith('/super-admin')) {
                navigate('/super-admin');

            } else if (user.role !== 'admin' && location.pathname.startsWith('/admin')) {
                navigate('/');
            }
        }
    }, [user, navigate, location.pathname]);

    return children;
};

export default AuthNavigator;