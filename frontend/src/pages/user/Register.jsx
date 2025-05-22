import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../helpers/Axios';

const Register = () => {

    let [name, setName] = useState('');
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let [rePassword, setRePassword] = useState('');
    let [error, setError] = useState(null);
    let [passwordNotMatch, setPasswordNotMatch] = useState(null);
    let navigate = useNavigate();

    const register = async (e) => {
        e.preventDefault();
        setError(null);
        setPasswordNotMatch(null);
        if (password != rePassword) {
            setPasswordNotMatch('Passwords do not match');
        } else {
            try {
                let data = {
                    name,
                    email,
                    password
                };

                let response = await axios.post('/api/user/register', data);

                if (response.status == 200) {
                    navigate('/');
                }
            } catch (e) {
                const serverError = e.response.data.error;
                setError(serverError);
            }
        }
    }

    return (
        <div className="flex items-center justify-center px-4 reg-form">
            <div className="w-full max-w-md">
                <h1 className="text-3xl sm:text-4xl font-bold level-1-text text-center mb-8">
                    Create an account
                </h1>
                <form className="space-y-5" onSubmit={register}>
                    <div>
                        <label className="block text-sm font-medium level-1-text mb-1">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name='name'
                            placeholder="Your full name"
                            className="w-full rounded-md border border-gray-600 bg-[#101324] px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                        {!!(error && error.name) && <span className='text-red-500 my-3'>{error.name.msg}</span>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium level-1-text mb-1">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name='email'
                            placeholder="Your email"
                            className="w-full rounded-md border border-gray-600 bg-[#101324] px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                        {!!(error && error.email) && <span className='text-red-500 my-3'>{error.email.msg}</span>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium level-1-text mb-1">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            name='password'
                            placeholder="Password (at least 6 characters)"
                            className="w-full rounded-md border border-gray-600 bg-[#101324] px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                        {!!(error && error.password) && <span className='text-red-500 my-3'>{error.password.msg}</span>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium level-1-text mb-1">
                            Re-enter Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            name='re-password'
                            placeholder="Re-enter Password"
                            className="w-full rounded-md border border-gray-600 bg-[#101324] px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                            value={rePassword}
                            onChange={e => setRePassword(e.target.value)}
                            required
                        />
                        {passwordNotMatch && <span className='text-red-500'>Passwords do not match</span>}
                    </div>
                    <button
                        type="submit"
                        className="w-full text-white rounded-md auth-btn py-2 font-medium"
                    >
                        Register
                    </button>
                </form>

                <div className="flex items-center justify-center mt-4">
                    <span className="text-gray-400 text-sm">or</span>
                </div>

                <button className="w-full mt-4 flex justify-center items-center rounded-md bg-[#1F2937] text-white py-2 hover:bg-gray-700 transition">
                    Sign In with Google
                </button>

                <p className="mt-6 text-center text-sm text-gray-400">
                    Already have an account?{" "}
                    <Link to="/login" className="text-violet-500 hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register
