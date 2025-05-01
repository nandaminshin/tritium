import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNav from './components/admin/AdminNav.jsx';
import AdminSidebar from './components/admin/AdminSidebar.jsx';
// import './admin.css'; 


const AdminLayout = () => {
    return (
        <div className="flex">
            <AdminSidebar />
            <div className="flex-1 flex flex-col">
                <div className="p-4">
                    <AdminNav />
                </div>
                <Outlet />
            </div>
        </div>
    );
}

export default AdminLayout
