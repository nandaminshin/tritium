import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from '../../helpers/Axios';
import { AuthContext } from '../../contexts/AuthContext';

const Login = () => {
    let { dispatch } = useContext(AuthContext);
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let [error, setError] = useState(null);
    let navigate = useNavigate();

    const login = async (e) => {
        try {
            e.preventDefault();
            setError(null);
            let data = {
                email,
                password
            }

            let response = await axios.post("/api/user/login", data);

            if (response.status == 200) {
                dispatch({ type: 'LOGIN', payload: response.data.user });
                if (response.data.user.role == 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            }
        } catch (error) {
            setError(error.response.data.message);
        }
    }

    return (
        <div className="flex items-center justify-center px-4 min-h-[calc(100vh-4rem)]">
            <div className="w-full max-w-md">
                <h1 className="text-3xl sm:text-4xl font-bold level-1-text text-center mb-8">
                    Welcome back
                </h1>
                <form className="space-y-5" onSubmit={login} autoComplete='off'>
                    <div>
                        <label className="block text-sm font-medium level-1-text mb-1">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            placeholder="Your email"
                            className="w-full rounded-md border border-gray-600 bg-[#101324] px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                        {!!(error) && <span className='text-red-500 my-3'>{error}</span>}
                    </div>
                    <div>
                        <div className="flex justify-between">
                            <label className="block text-sm font-medium level-1-text mb-1">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <Link to='/forgot-password' className='text-gray-500'>Forgot?</Link>
                        </div>
                        <input
                            type="password"
                            placeholder="Password (at least 6 characters)"
                            className="w-full rounded-md border border-gray-600 bg-[#101324] px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                            onChange={e => setPassword(e.target.value)}
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full text-white rounded-md auth-btn py-2 font-medium"
                    >
                        Login
                    </button>
                </form>

                <div className="flex items-center justify-center mt-4">
                    <span className="text-gray-400 text-sm">or</span>
                </div>

                <button className="w-full mt-4 flex justify-center items-center rounded-md bg-[#1F2937] text-white py-2 hover:bg-gray-700 transition">
                    Sign In with Google
                </button>

                <p className="mt-6 text-center text-sm text-gray-400">
                    Don&apos;t you have an account?{" "}
                    <Link to="/register" className="text-violet-500 hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login
