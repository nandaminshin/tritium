import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import Axios from '../../helpers/Axios';
import { useNavigate, Link } from 'react-router-dom';
import SuccessModal from '../../components/SuccessModal';

const Profile = () => {
    const { user, dispatch } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [studentData, setStudentData] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
        const fetchStudentData = async () => {
            try {
                const res = await Axios.get('/api/user/student/data');
                if (res.data.success) {
                    setStudentData(res.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch student data", error);
            }
        };
        fetchStudentData();
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
            const response = await Axios.put(`/api/user/update-profile`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 200) {
                dispatch({ type: 'LOGIN', payload: response.data.data.user });
                setIsModalOpen(true);
            }
        } catch (error) {
            setErrors(error.response?.data?.error || 'Profile update failed');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                const response = await Axios.delete(`/api/user/delete-profile`);
                if (response.status === 200) {
                    dispatch({ type: 'LOGOUT' });
                    navigate('/login');
                }
            } catch (error) {
                setErrors(error.response?.data?.error || 'Failed to delete account');
            }
        }
    };
    
    const closeModal = () => {
        setIsModalOpen(false);
    }

    return (
        <div className="bg-gradient-to-br from-[#03050a] to-[#000721] text-white min-h-screen" style={{ marginTop: '0px' }}>
            <SuccessModal
                isOpen={isModalOpen}
                onClose={closeModal}
                title="Success!"
                message="Your profile has been updated successfully."
            />
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="md:col-span-1">
                        <div className="bg-[#131a2a] p-8 rounded-2xl shadow-lg">
                            <h1 className="text-2xl font-bold text-center mb-4 text-white">
                                Your Profile
                            </h1>
                            <div className="flex items-center justify-center gap-4 mb-6">
                                <img src="/images/tritiumCoin.png" alt="Tritium Coin" className="w-10 h-10" />
                                <span className="text-2xl font-bold text-yellow-400">{studentData?.coinAmount || 0} Coins</span>
                            </div>
                            <form className="space-y-4" onSubmit={handleUpdate}>
                                <div className="flex justify-center">
                                    <img
                                        src={imagePreview || (user && user.profile_image ? `${backendUrl}/users/${user.profile_image}` : "/images/tritiumlogo.png")}
                                        alt="Profile"
                                        className="w-28 h-28 rounded-full border-4 border-slate-600 object-cover"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">
                                        Profile Photo
                                    </label>
                                    <input
                                        type="file"
                                        name="profile_image"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="w-full rounded-md border border-slate-600 bg-[#2c3446] px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full rounded-md border border-slate-600 bg-[#2c3446] px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full rounded-md border border-slate-600 bg-[#2c3446] px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                {errors && <p className="text-red-500 text-center text-sm">{errors}</p>}
                                <button
                                    type="submit"
                                    className="w-full text-white rounded-md bg-blue-600 hover:bg-blue-700 py-2.5 font-medium transition-colors"
                                >
                                    Update Profile
                                </button>
                            </form>
                            <div className="text-center mt-6">
                                <button
                                    onClick={handleDelete}
                                    className="text-red-500 hover:text-red-700 font-medium text-sm"
                                >
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Enrolled Courses */}
                    <div className="md:col-span-2">
                        <h2 className="text-3xl font-bold mb-6 text-white">Enrolled Courses</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {studentData?.courses && studentData.courses.length > 0 ? (
                                studentData.courses.map(course => (
                                    <Link
                                        to={`/course/${course._id}`}
                                        key={course._id}
                                        className="bg-[#181f2a] rounded-2xl shadow-lg p-6 flex items-center gap-4 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-[#232b3b] flex-shrink-0 flex items-center justify-center shadow-md overflow-hidden">
                                            <img
                                                src={course.image ? `${backendUrl}/courses/${course.image}` : "/images/tritiumlogo.png"}
                                                alt={course.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <h3 className="text-lg font-bold text-white">{course.name}</h3>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-slate-400 col-span-full">You have not enrolled in any courses yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;