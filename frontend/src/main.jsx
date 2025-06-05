import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { AuthContextProvider } from './contexts/AuthContext.jsx';
import Routes from './routes/index.jsx';
import AuthNavigator from './components/AuthNavigator.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthContextProvider>
            <Routes />
        </AuthContextProvider>
    </StrictMode>,
)
