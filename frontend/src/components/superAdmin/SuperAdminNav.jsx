import { Search, Bell } from 'lucide-react';
import { Menu } from '@headlessui/react';
import { Link, useNavigate } from 'react-router-dom';
import { UserIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { AuthContext } from '../../contexts/AuthContext';
import { useContext } from 'react';
import axios from '../../helpers/Axios';

const SuperAdminNav = () => {
    let { user, dispatch } = useContext(AuthContext);
    let navigate = useNavigate();

    const logout = async () => {
        try {
            let response = await axios.post('/api/user/logout');
            if (response.status == 200) {
                dispatch({ type: 'LOGOUT' });
                navigate('/login');
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="flex items-center justify-between bg-gray-900 px-6 py-3 shadow-md rounded-2xl">
            {/* Search Bar */}
            <div className="relative w-1/2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search for projects"
                    className="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
            </div>

            {/* {user.name} */}

            {/* Icons + Profile */}
            <div className="flex items-center gap-4">
                {/* Notification Dropdown */}
                <Menu as="div" className="relative">
                    <Menu.Button className="p-1 rounded-full hover:bg-gray-800 cursor-pointer">
                        <Bell className="h-6 w-6 text-gray-300 hover:text-white" />
                    </Menu.Button>

                    <Menu.Items className="absolute right-0 mt-2 w-72 origin-top-right rounded-md bg-gray-800 shadow-lg ring-1 ring-white/10 focus:outline-none z-50">
                        <div className="px-4 py-2 border-b border-gray-700">
                            <h3 className="text-sm font-medium text-white">Notifications</h3>
                        </div>
                        <Menu.Item>
                            {({ active }) => (
                                <a
                                    href="#"
                                    className={`${active ? 'bg-gray-700' : ''} block px-4 py-3 text-sm text-gray-300 border-b border-gray-700`}
                                >
                                    <div className="font-medium text-white">New message from John</div>
                                    <div className="text-xs text-gray-400 mt-1">2 minutes ago</div>
                                </a>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <a
                                    href="#"
                                    className={`${active ? 'bg-gray-700' : ''} block px-4 py-3 text-sm text-gray-300`}
                                >
                                    <div className="font-medium text-white">System update available</div>
                                    <div className="text-xs text-gray-400 mt-1">1 hour ago</div>
                                </a>
                            )}
                        </Menu.Item>
                        <div className="px-4 py-2 text-center">
                            <a href="#" className="text-xs text-purple-400 hover:text-purple-300">View all notifications</a>
                        </div>
                    </Menu.Items>
                </Menu>

                {/* Profile Dropdown */}
                <Menu as="div" className="relative">
                    <Menu.Button className="cursor-pointer">
                        <img
                            src={user && user.profile_image ? `${import.meta.env.VITE_BACKEND_URL}/users/${user.profile_image}` : "/images/tritiumlogo.png"}
                            alt="User"
                            className="w-10 h-10 rounded-full border-2 border-gray-400 hover:border-gray-300 transition-colors"
                        />
                    </Menu.Button>

                    <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-gray-800 shadow-lg ring-1 ring-white/10 focus:outline-none z-50">
                        <Menu.Item>
                            {({ active }) => (
                                <Link
                                    to="/super-admin/profile"
                                    className={`${active ? 'bg-gray-700' : ''} flex items-center gap-2 px-4 py-2 text-white cursor-pointer`}
                                >
                                    <UserIcon className="w-5 h-5" /> Profile
                                </Link>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <a
                                    href="#settings"
                                    className={`${active ? 'bg-gray-700' : ''} flex items-center gap-2 px-4 py-2 text-white cursor-pointer`}
                                >
                                    <Cog6ToothIcon className="w-5 h-5" /> Settings
                                </a>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <a
                                    onClick={logout}
                                    className={`${active ? 'bg-gray-700' : ''} flex items-center gap-2 px-4 py-2 text-white cursor-pointer`}
                                >
                                    <ArrowRightOnRectangleIcon className="w-5 h-5" /> Log out
                                </a>
                            )}
                        </Menu.Item>
                    </Menu.Items>
                </Menu>
            </div>
        </div>
    );
};

export default SuperAdminNav;
