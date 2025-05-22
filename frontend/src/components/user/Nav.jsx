import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import axios from '../../helpers/Axios'


const Nav = () => {
    let { user, dispatch } = useContext(AuthContext);
    let navigate = useNavigate();
    const [navigation, setNavigation] = useState([
        { name: 'Home', href: '/', current: true },
        { name: 'Courses', href: '/courses', current: false },
        { name: 'Blogs', href: '/blogs', current: false },
        { name: 'About Us', href: '/about', current: false },
        { name: 'Learning Path', href: '/learning-path', current: false },
    ]);

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    const handleClick = (name) => {
        setNavigation(prev => prev.map(item => ({
            ...item,
            current: item.name === name
        })));
    };

    const authBtnClick = () => {
        setNavigation(prev => prev.map(item => ({
            ...item,
            current: false
        })))
    }

    const handleLogout = async () => {
        try {
            let res = await axios.post('/api/user/logout');
            if (res.status == 200) {
                dispatch({ type: 'LOGOUT' });
                navigate('/login');
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <Disclosure as="nav" className="bg-[#111827]/90 backdrop-blur-md shadow-xl border border-[#2c2c3b]/40 rounded-2xl mt-4 mx-auto max-w-6xl">
            {({ open }) => (
                <>
                    <div className="mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                {/* Mobile menu button */}
                                <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white">
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </DisclosureButton>
                            </div>
                            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                {/* Logo */}
                                <div className="hidden sm:flex shrink-0 items-center">
                                    <img src="images/tritiumlogo.png" width={40} height={40} alt="" />
                                </div>
                                {/* Desktop nav links */}
                                <div className="hidden sm:ml-6 sm:block">
                                    <div className="flex space-x-4">
                                        {navigation.map((item) => (
                                            <Link
                                                key={item.name}
                                                to={item.href}
                                                aria-current={item.current ? 'page' : undefined}
                                                onClick={() => handleClick(item.name)}
                                                className={classNames(
                                                    item.current ? 'bg-[#1f2937] level-1-text'
                                                        : 'text-gray-300 hover:bg-[#2c3446] hover: text-white',
                                                    'rounded-md px-3 py-2 text-sm font-medium'
                                                )}
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {/* Profile section */}
                            <div className="absolute inset-y-0 right-0 flex items-center space-x-4 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                {user ? (
                                    <Menu as="div" className="relative ml-3">
                                        <MenuButton className="flex rounded-full bg-[#1f2937] text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                            <span className="sr-only">Open user menu</span>
                                            <div className="h-8 w-8 rounded-full bg-[#6d5dfc] flex items-center justify-center text-white font-medium">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                        </MenuButton>
                                        <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-[#1f2937] py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <MenuItem>
                                                {({ active }) => (
                                                    <Link
                                                        to="/profile"
                                                        className={classNames(
                                                            active ? 'bg-[#2c3446]' : '',
                                                            'block px-4 py-2 text-sm text-gray-300'
                                                        )}
                                                    >
                                                        Your Profile
                                                    </Link>
                                                )}
                                            </MenuItem>
                                            <MenuItem>
                                                {({ active }) => (
                                                    <Link
                                                        to="/settings"
                                                        className={classNames(
                                                            active ? 'bg-[#2c3446]' : '',
                                                            'block px-4 py-2 text-sm text-gray-300'
                                                        )}
                                                    >
                                                        Settings
                                                    </Link>
                                                )}
                                            </MenuItem>
                                            <MenuItem>
                                                {({ active }) => (
                                                    <button
                                                        onClick={handleLogout}
                                                        className={classNames(
                                                            active ? 'bg-[#2c3446]' : '',
                                                            'block w-full text-left px-4 py-2 text-sm text-gray-300'
                                                        )}
                                                    >
                                                        Logout
                                                    </button>
                                                )}
                                            </MenuItem>
                                        </MenuItems>
                                    </Menu>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            className="text-sm font-medium bg-[#030208] hover:bg-[#0e0f17] text-gray-300 hover:text-white px-4 py-1.5 rounded-lg"
                                            onClick={() => authBtnClick()}
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="text-sm font-medium bg-[#6d5dfc] hover:bg-[#8070f8] text-white px-4 py-1.5 rounded-lg"
                                            onClick={() => authBtnClick()}
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile nav */}
                    <DisclosurePanel className="sm:hidden">
                        <div className="space-y-1 px-2 pt-2 pb-3">
                            {navigation.map((item) => (
                                <DisclosureButton
                                    key={item.name}
                                    as="a"
                                    href={item.href}
                                    aria-current={item.current ? 'page' : undefined}
                                    className={classNames(
                                        item.current
                                            ? 'bg-[#1f2937] text-white'
                                            : 'text-gray-300 hover:bg-[#2c3446] hover:text-white',
                                        'block rounded-md px-3 py-2 text-base font-medium'
                                    )}
                                >
                                    {item.name}
                                </DisclosureButton>
                            ))}
                        </div>
                    </DisclosurePanel>
                </>
            )}
        </Disclosure>
    )
}

export default Nav

