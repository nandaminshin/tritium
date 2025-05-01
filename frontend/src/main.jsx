import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './pages/user/Home.jsx';
import Courses from './pages/user/Courses.jsx';
import Blogs from './pages/user/Blogs.jsx';
import About from './pages/user/About.jsx';
import Register from './pages/user/Register.jsx';
import LearningPath from './pages/user/LearningPath.jsx';
import './index.css';
import App from './App.jsx';
import Login from './pages/user/Login.jsx';
import AdminLayout from './AdminLayout.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import CreateNewCourse from './pages/admin/CreateNewCourse.jsx';
import UserManagement from './pages/admin/UserManagement.jsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/courses',
                element: <Courses />
            },
            {
                path: '/blogs',
                element: <Blogs />
            },
            {
                path: '/about',
                element: <About />
            },
            {
                path: '/learning-path',
                element: <LearningPath />
            },
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/register',
                element: <Register />
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
                path: 'course-management',
                element: <CreateNewCourse />
            },
            {
                path: 'user-management',
                element: <UserManagement />
            },
        ]
    }
]);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
)
