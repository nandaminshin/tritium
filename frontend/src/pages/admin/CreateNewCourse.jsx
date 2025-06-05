import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from '../../helpers/Axios'

const CreateNewCourse = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [level, setLevel] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);
    const [instructor, setInstructor] = useState({ name: '', id: '' });
    const [intro_video, setIntroVideo] = useState(null);
    const [errors, setErrors] = useState({});

    let navigate = useNavigate();
    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;
        
        if (type === 'image') {
            setImage(file); 
        } else if (type === 'video') {
            setIntroVideo(file); 
        }
    };

    useEffect(() => {
        let fetchCategories = async () => {
            try {
                let res = await axios.get('/api/admin/get-all-categories');
                if (res.status === 200) {
                    setCategories(res.data.data.categories);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        }

        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setInstructor({ name: user.name, id: user._id });
        }

        fetchCategories();
    }, []); 

    let createCourse = async (e) => {
        e.preventDefault();
        const fileData = new FormData();
        if (image) fileData.append('image', image);
        if (intro_video) fileData.append('intro_video', intro_video);
        let fileResponse = await axios.post('/api/admin/upload-course-file', fileData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (fileResponse.status === 200) {
            let data = {
                name,
                description,
                price: Number(price),
                level,
                category,
                image: fileResponse.data.data?.image || null,
                instructor: instructor.id,
                intro_video: fileResponse.data.data?.intro_video || null
            };
    
            try {
                const response = await axios.post('/api/admin/create-new-course', data);
                if (response.status === 201) {
                    navigate('/admin/manage-courses'); 
                }
            } catch (error) {
                console.error('Error creating course:', error);
                setErrors(error.response.data?.error || {});
            }
        } else {
            setErrors(fileResponse.data?.error || {});
        }
    };

    return (
        <div className="flex items-center justify-center px-4">
            <div className="w-full max-w-2xl">
                <h1 className="text-3xl sm:text-4xl font-bold level-1-text text-center mb-8">
                    Create New Course
                </h1>
                <form className="space-y-5 pb-8" onSubmit={createCourse}>
                    <div>
                        <label className="block text-sm font-medium level-1-text mb-1">
                            Course Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            name="name"
                            placeholder="Enter course name"
                            className="w-full rounded-md border border-gray-600 bg-[#101324] px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                            required
                        />
                        {errors.name && <p className="text-red-500">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium level-1-text mb-1">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            onChange={(e) => setDescription(e.target.value)}
                            name="description"
                            placeholder="Enter course description"
                            className="w-full rounded-md border border-gray-600 bg-[#101324] px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-400 min-h-[100px]"
                            required
                        />
                        {errors.description && <p className="text-red-500">{errors.description}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium level-1-text mb-1">
                            Price <span className="text-red-500">*</span>
                        </label>
                        <input
                            onChange={(e) => setPrice(e.target.value)}
                            type="number"
                            name="price"
                            placeholder="Enter course price"
                            className="w-full rounded-md border border-gray-600 bg-[#101324] px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                            required
                        />
                        {errors.price && <p className="text-red-500">{errors.price}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium level-1-text mb-1">
                            Image <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'image')}
                            className="w-full rounded-md border border-gray-600 bg-[#101324] px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-sky-400"
                            required
                        />
                        {errors.image && <p className="text-red-500">{errors.image}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium level-1-text mb-1">
                            Level <span className="text-red-500">*</span>
                        </label>
                        <select
                            onChange={(e) => setLevel(e.target.value)}
                            name="level"
                            className="w-full rounded-md border border-gray-600 bg-[#101324] px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                            required
                        >
                            <option value="">Select course level</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                        {errors.level && <p className="text-red-500">{errors.level}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium level-1-text mb-1">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            onChange={(e) => setCategory(e.target.value)}
                            name="category"
                            className="w-full rounded-md border border-gray-600 bg-[#101324] px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                            required
                        >
                            <option value="">Select course category</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {errors.category && <p className="text-red-500">{errors.category}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium level-1-text mb-1">
                            Instructor <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="instructor"
                            value=""
                            placeholder={instructor.name}
                            className="w-full rounded-md border border-gray-600 bg-[#101324] px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                            required
                            disabled
                        />
                        {errors.name && <p className="text-red-500">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium level-1-text mb-1">
                            Intro Video
                        </label>
                        <input
                            type="file"
                            name="intro_video"
                            accept="video/*"
                            onChange={(e) => handleFileChange(e, 'video')}
                            className="w-full rounded-md border border-gray-600 bg-[#101324] px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-sky-400"
                        />
                        {errors.intro_video && <p className="text-red-500">{errors.intro_video}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full text-white rounded-md auth-btn py-2 font-medium"
                    >
                        Create Course
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateNewCourse;
