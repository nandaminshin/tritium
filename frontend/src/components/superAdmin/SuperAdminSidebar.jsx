import { Home, FileText, Layers, PieChart, Grid, Square, Table, User, Users } from 'lucide-react';
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
                        to=""
                        end  // This ensures it only matches exactly "/"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-4 rounded hover:text-purple-400 hover:bg-gray-800 ${isActive ? 'bg-gray-800 text-purple-400 font-medium' : ''
                            }`
                        }
                    >
                        <Home size={20} /> Dashboard
                    </NavLink>
                </li>
                {/* Pages dropdown */}
                <li className="relative">
                    <button
                        onClick={adminDropdownClick}
                        className={`w-full flex items-center justify-between px-3 py-4 rounded hover:bg-gray-800 ${isAdminActive ? 'bg-gray-800 text-purple-400' : ''}`}
                    >
                        <span className="flex items-center gap-2">
                            <Users size={20} /> Admin Management
                        </span>
                        <ChevronDownIcon className={`w-5 h-5 transition-transform ${pagesOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {pagesOpen && (
                        <ul className="ml-4 pl-4 border-l border-gray-700 mt-1 mb-2 space-y-2">
                            <li>
                                <NavLink to="manage-admins"
                                className={({ isActive }) =>
                                    `block px-3 py-2 rounded hover:text-purple-400 hover:bg-gray-800 ${isActive ? 'bg-gray-800 text-purple-400 font-medium' : ''
                                    }`
                                }
                                >Manage All Admins</NavLink>
                            </li>
                            <li>
                                <NavLink to="create-admin" 
                                className={({ isActive }) =>
                                    `block px-3 py-2 rounded hover:text-purple-400 hover:bg-gray-800 ${isActive ? 'bg-gray-800 text-purple-400 font-medium' : ''
                                    }`
                                }
                                >Create New Admin</NavLink>
                            </li>
                        </ul>
                    )}
                </li>
                
                <NavLink
                    to="user-management"
                    className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-4 rounded hover:text-purple-400 hover:bg-gray-800 ${isActive ? 'bg-gray-800 text-purple-400 font-medium' : ''
                        }`
                    }
                >
                    <Users size={20} /> User Management
                </NavLink>
            </ul>

            {/* Create Account Button */}
            <button className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
                Create account
            </button>
        </aside>
    );
}

export default SuperAdminSidebar;
