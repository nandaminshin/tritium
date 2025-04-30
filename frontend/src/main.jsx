import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from './pages/user/Home.jsx'
import Courses from './pages/user/Courses.jsx'
import Blogs from './pages/user/Blogs.jsx'
import About from './pages/user/About.jsx'
import Register from './pages/user/Register.jsx'
import LearningPath from './pages/user/LearningPath.jsx'
import './index.css'
import App from './App.jsx'
import Login from './pages/user/Login.jsx'

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
            }
        ]
    }
]);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
)
