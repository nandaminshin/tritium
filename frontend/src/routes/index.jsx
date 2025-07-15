import PurchaseCoin from "../pages/user/PurchaseCoin.jsx";
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import Home from '../pages/user/Home.jsx';
import Courses from '../pages/user/Courses.jsx';
import Blogs from '../pages/user/Blogs.jsx';
import About from '../pages/user/About.jsx';
import Register from '../pages/user/Register.jsx';
import LearningPath from '../pages/user/LearningPath.jsx';
import App from '../App.jsx';
import Login from '../pages/user/Login.jsx';
import AdminLayout from '../AdminLayout.jsx';
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import CreateNewCourse from '../pages/admin/CreateNewCourse.jsx';
import UserManagement from '../pages/admin/UserManagement.jsx';
import ManageCourses from "../pages/admin/ManageCourses.jsx";
import ManageSingleCourse from "../pages/admin/ManageSingleCourse.jsx";
import AddLecture from "../pages/admin/AddLecture.jsx";
import EditCourse from "../pages/admin/EditCourse.jsx";
import Profile from "../pages/admin/Profile.jsx";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import AuthNavigator from '../components/AuthNavigator';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import SuperAdminLayout from '../SuperAdminLayout.jsx';
import SuperAdminDashboard from '../pages/superAdmin/SuperAdminDashboard.jsx';
import SuperAdminProfile from '../pages/superAdmin/Profile.jsx';
import CurrencyManagement from "../pages/superAdmin/CurrencyManagement.jsx";

const ProtectedRoute = ({ children, requireAuth = true, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);


    if (loading) {
        // You can return a spinner or null
        return <div>Loading...</div>;
    }

    if (requireAuth && !user) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        // a little alert to show the user that they are not authorized to view the page
        alert('You are not authorized to view this page');
        return <Navigate to="/" />;
    }

    if (!requireAuth && user) {
        if (user.role === 'admin') {
            return <Navigate to="/admin" />;
        } else if (user.role === 'superAdmin') {
            return <Navigate to="/super-admin" />;
        } else if (user.role === 'user') {
            return <Navigate to="/" />;
        }
    }

    return children;
};

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            cacheTime: 1000 * 60 * 30, // 30 minutes
        },
    },
});

const index = () => {
    const router = createBrowserRouter([
        {
            path: '/',
            element: (
                <AuthNavigator>
                    <App />
                </AuthNavigator>
            ),
            children: [
                {
                    path: '/',
                    element: <Home />
                },
                {
                    path: '/courses',
                    element: <ProtectedRoute><Courses /></ProtectedRoute>
                },
                {
                    path: '/blogs',
                    element: <ProtectedRoute><Blogs /></ProtectedRoute>
                },
                {
                    path: '/about',
                    element: <About />
                },
                {
                    path: '/learning-path',
                    element: <ProtectedRoute><LearningPath /></ProtectedRoute>
                },
                {
                    path: '/login',
                    element: <ProtectedRoute requireAuth={false}><Login /></ProtectedRoute>
                },
                {
                    path: '/register',
                    element: <ProtectedRoute requireAuth={false}><Register /></ProtectedRoute>
                },
                {
                    path: '/purchase-coin',
                    element: <ProtectedRoute><PurchaseCoin /></ProtectedRoute>
                }
            ]
        },
        {
            path: '/admin',
            element: (
                <QueryClientProvider client={queryClient}>
                    <ProtectedRoute allowedRoles={['admin']}>
                        <AdminLayout />
                    </ProtectedRoute>
                </QueryClientProvider>
            ),
            children: [
                {
                    path: '',
                    element: <AdminDashboard />
                },
                {
                    path: 'manage-courses',
                    element: <ManageCourses />
                },
                {
                    path: 'create-course',
                    element: <CreateNewCourse />
                },
                {
                    path: 'user-management',
                    element: <UserManagement />
                },

                {
                    path: 'courses/:courseId',
                    element: <ManageSingleCourse />
                },
                {
                    path: 'courses/:courseId/add-lecture',
                    element: <AddLecture />
                },
                {
                    path: 'courses/edit/:courseId',
                    element: <EditCourse />
                },
                {
                    path: 'profile',
                    element: <Profile />
                }
            ]
        },
        {
            path: '/super-admin',
            element: (
                <QueryClientProvider client={queryClient}>
                    <ProtectedRoute allowedRoles={['superAdmin']}>
                        <SuperAdminLayout />
                    </ProtectedRoute>
                </QueryClientProvider>
            ),
            children: [
                {
                    path: '',
                    element: <SuperAdminDashboard />
                },
                {
                    path: 'profile',
                    element: <SuperAdminProfile />
                },
                {
                    path: 'currency-management',
                    element: <CurrencyManagement />
                }
            ]
        }
    ]);

    return <RouterProvider router={router} />;
};

export default index;
