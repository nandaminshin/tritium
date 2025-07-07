import React from 'react';
import { Outlet } from 'react-router-dom';
import SuperAdminNav from './components/superAdmin/SuperAdminNav.jsx';
import SuperAdminSidebar from './components/superAdmin/SuperAdminSidebar.jsx';
import ChatHead from './components/ChatHead';

const SuperAdminLayout = () => {
    return (
        <div>
            {/* Fixed Sidebar */}
            <div className="fixed left-0 top-0 h-screen w-64 z-30">
                <SuperAdminSidebar />
            </div>
            {/* Main Content */}
            <div className="ml-64 min-h-screen flex flex-col">
                <div className="p-4">
                    <SuperAdminNav />
                </div>
                <Outlet />
                <ChatHead />
            </div>
        </div>
    );
}

export default SuperAdminLayout;
