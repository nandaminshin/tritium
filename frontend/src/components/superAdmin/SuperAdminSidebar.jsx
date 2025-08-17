import { Home, FileText, Layers, PieChart, Grid, Square, Table, User, Users, ShoppingCart } from 'lucide-react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const SuperAdminSidebar = () => {
    const [pagesOpen, setPagesOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const adminPaths = ['/super-admin/manage-admins', '/super-admin/create-admin'];
        const isAdminPage = adminPaths.some(path => location.pathname.startsWith(path));
        setPagesOpen(isAdminPage);
    }, [location]);

    const adminDropdownClick = () => {
        setPagesOpen(!pagesOpen);
    }

    const isAdminActive = location.pathname.startsWith('/super-admin/manage-admins') ||
        location.pathname.startsWith('/super-admin/create-admin');

    return (
        <aside className="w-64 h-screen bg-gray-900 text-white px-4 py-6 space-y-6 flex flex-col overflow-y-auto 
        /* Hide scrollbar for Chrome, Safari and Opera */
        scrollbar-none 
        /* Hide scrollbar for IE, Edge and Firefox */
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */">
            {/* Logo */}
            <div className="flex items-center">
                <div>
                    <img src="/images/tritiumlogo.png" width={60} height={20} alt="" />
                </div>
                <div className="text-2xl font-bold pl-3">TRITIUM</div>
            </div>

            {/* Navigation */}
            <ul className="space-y-2 flex-1">
                <li>
                    <NavLink
                        to="/super-admin"
                        end
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-4 rounded hover:text-purple-400 hover:bg-gray-800 ${isActive ? 'bg-gray-800 text-purple-400 font-medium' : ''
                            }`
                        }
                    >
                        <Home size={20} /> Dashboard
                    </NavLink>
                </li>
                <NavLink
                    to="admin-management"
                    className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-4 rounded hover:text-purple-400 hover:bg-gray-800 ${isActive ? 'bg-gray-800 text-purple-400 font-medium' : ''
                        }`
                    }
                >
                    <Users size={20} /> Manage All Admins
                </NavLink>
                <NavLink
                    to="user-management"
                    className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-4 rounded hover:text-purple-400 hover:bg-gray-800 ${isActive ? 'bg-gray-800 text-purple-400 font-medium' : ''
                        }`
                    }
                >
                    <Users size={20} /> User Management
                </NavLink>
                <NavLink
                    to="currency-management"
                    className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-4 rounded hover:text-purple-400 hover:bg-gray-800 ${isActive ? 'bg-gray-800 text-purple-400 font-medium' : ''
                        }`
                    }
                >
                    <Users size={20} /> Currency Management
                </NavLink>
                <NavLink
                    to="purchase-requests"
                    className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-4 rounded hover:text-purple-400 hover:bg-gray-800 ${isActive ? 'bg-gray-800 text-purple-400 font-medium' : ''
                        }`
                    }
                >
                    <ShoppingCart size={20} /> Purchase Requests
                </NavLink>
            </ul>

            {/* Create Account Button */}
            {/* <button className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
                Create account
            </button> */}
        </aside>
    );
}

export default SuperAdminSidebar;
