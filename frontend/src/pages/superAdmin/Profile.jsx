import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import axios from '../../helpers/Axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, dispatch } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState('');
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        if (profileImage) {
            formData.append('profile_image', profileImage);
        }

        try {
            const response = await axios.put(`/api/super-admin/update-profile`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 200) {
                dispatch({ type: 'LOGIN', payload: response.data.data.user });
                navigate('/super-admin');
            }
        } catch (error) {
            setErrors(error.response?.data?.error || 'Profile update failed');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                const response = await axios.delete(`/api/super-admin/delete-profile`);
                if (response.status === 200) {
                    dispatch({ type: 'LOGOUT' });
                    navigate('/login');
                }
            } catch (error) {
                setErrors(error.response?.data?.error || 'Failed to delete account');
            }
        }
    };

    return (
        <div className="flex items-center justify-center px-4">
            <div className="w-full max-w-2xl">
                <h1 className="text-3xl sm:text-4xl font-bold level-1-text text-center mb-8">
                    Manage Profile
                </h1>
                <form className="space-y-5 pb-8" onSubmit={handleUpdate}>
                    <div className="flex justify-center">
                        <img
                            src={imagePreview || (user && user.profile_image ? `${backendUrl}/users/${user.profile_image}` : "/images/tritiumlogo.png")}
                            alt="Profile"
                            className="w-32 h-32 rounded-full border-4 border-gray-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium level-1-text mb-1">
                            Profile Photo
                        </label>
                        <input
                            type="file"
                            name="profile_image"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full rounded-md border border-gray-600 bg-[#101324] px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-sky-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium level-1-text mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-md border border-gray-600 bg-[#101324] px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium level-1-text mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-md border border-gray-600 bg-[#101324] px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                        />
                    </div>
                    {errors && <p className="text-red-500">{errors}</p>}
                    <button
                        type="submit"
                        className="w-full text-white rounded-md auth-btn py-2 font-medium"
                    >
                        Update Profile
                    </button>
                </form>
                <div className="text-center">
                    <button
                        onClick={handleDelete}
                        className="text-red-500 hover:text-red-700 font-medium"
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;