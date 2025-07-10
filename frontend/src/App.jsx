import { Outlet, useLocation } from 'react-router-dom';
import Nav from './components/user/Nav.jsx';
import PageIllustration from './components/user/PageIllustration.jsx';
import ChatHead from './components/ChatHead.jsx';
import { useContext } from 'react';
import { AuthContext } from './contexts/AuthContext.jsx';
import AdminLayout from './AdminLayout.jsx';
import SuperAdminLayout from './SuperAdminLayout.jsx';

function App() {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const showIllustration = ['/login', '/register'].includes(location.pathname);

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

            {/* {showIllustration && (
                <div className='relative z-0'>
                    <PageIllustration />
                </div>
            )} */}
            
            <div className='relative inset-0 z-10'>
                <Outlet />
                <ChatHead />
            </div>
        </>
    );
}

export default App;
