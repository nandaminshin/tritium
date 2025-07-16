import { Outlet, useLocation } from 'react-router-dom';
import Nav from './components/user/Nav.jsx';
import PageIllustration from './components/user/PageIllustration.jsx';
import ChatHead from './components/ChatHead.jsx';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from './contexts/AuthContext.jsx';
import AdminLayout from './AdminLayout.jsx';
import SuperAdminLayout from './SuperAdminLayout.jsx';
import Axios from './helpers/Axios.js';
import PendingRequest from './components/user/PendingRequest.jsx';

function App() {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const [hasPending, setHasPending] = useState(false);

    useEffect(() => {
        const checkPendingPurchase = async () => {
            if (user && user.role === 'user') {
                try {
                    const response = await Axios.get('/api/user/get-pending-purchase');
                    if (response.data.success && response.data.data) {
                        setHasPending(true);
                    } else {
                        setHasPending(false);
                    }
                } catch (error) {
                    console.error('Failed to check for pending purchases:', error);
                    setHasPending(false);
                }
            }
        };

        checkPendingPurchase();
        
        // Listen for an event that signifies a new purchase has been made
        const handlePurchaseMade = () => checkPendingPurchase();
        window.addEventListener('purchaseMade', handlePurchaseMade);

        return () => {
            window.removeEventListener('purchaseMade', handlePurchaseMade);
        };

    }, [user, location]);

    if (user && user.role === 'admin' && location.pathname.startsWith('/admin')) {
        return <AdminLayout />;
    }

    if (user && user.role === 'superAdmin' && location.pathname.startsWith('/super-admin')) {
        return <SuperAdminLayout />;
    }

    return (
        <>
            <div className='sticky top-0 z-50'>
                <Nav />
            </div>
            
            <div className='relative inset-0 z-10'>
                <Outlet />
                <ChatHead />
                {hasPending && <PendingRequest />}
            </div>
        </>
    );
}

export default App;
