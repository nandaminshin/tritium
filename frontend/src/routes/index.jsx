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
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import AuthNavigator from '../components/AuthNavigator';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const ProtectedRoute = ({ children, requireAuth = true }) => {
    const { user } = useContext(AuthContext);
    
    if (requireAuth && !user) {
        return <Navigate to="/login" />;
    }
    
    if (!requireAuth && user) {
        if (user.role === 'admin') {
            return <Navigate to="/admin" />;    
        } else {
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
            ]
        },
        {
            path: '/admin',
            element: <AdminLayout />,
            children: [
                {
                    path: '',
                    element: <AdminDashboard />
                },
                {
                    path: 'manage-courses',
                    element: (
                        <QueryClientProvider client={queryClient}>
                            <ManageCourses />
                        </QueryClientProvider>
                    )
                },
                {
                    path: 'create-course',
                    element: <CreateNewCourse />
                },
                {
                    path: 'user-management',
                    element: <UserManagement />
                },
                
            ]
        }
    ]);

    return <RouterProvider router={router} />;
};

export default index;
