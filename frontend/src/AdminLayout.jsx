import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNav from './components/admin/AdminNav.jsx';
import AdminSidebar from './components/admin/AdminSidebar.jsx';
import ChatHead from './components/ChatHead';
// import './admin.css'; 

const AdminLayout = () => {
    return (
        <div>
            {/* Fixed Sidebar */}
            <div className="fixed left-0 top-0 h-screen w-64 z-30">
                <AdminSidebar />
            </div>
            {/* Main Content */}
            <div className="ml-64 min-h-screen flex flex-col">
                <div className="p-4">
                    <AdminNav />
                </div>
                <Outlet />
                <ChatHead />
            </div>
        </div>
    );
}

export default AdminLayout
