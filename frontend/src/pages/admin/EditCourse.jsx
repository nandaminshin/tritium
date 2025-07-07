import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../helpers/Axios';
import { useQueryClient } from '@tanstack/react-query';
import { useCourseById } from '../../helpers/useCourseQueries';

const EditCourse = () => {
    const { courseId } = useParams();
    const { data: course, isLoading, isError, error } = useCourseById(courseId);
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [level, setLevel] = useState('');
    const [category, setCategory] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [image, setImage] = useState(null);
    const [instructor, setInstructor] = useState({ name: '', id: '' });
    const [intro_video, setIntroVideo] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState('');
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    let navigate = useNavigate();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (course) {
            setName(course.name);
            setDescription(course.description);
            setPrice(course.price);
            setLevel(course.level);
            setCategory(course.category?._id);
            setInstructor({ name: course.instructor?.name, id: course.instructor?._id });
        }
    }, [course]);

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        if (type === 'image') {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        } else if (type === 'video') {
            setIntroVideo(file);
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    const removeVideo = () => {
        setIntroVideo(null);
        setVideoPreview(null);
    };

    const createCategory = async () => {
        try {
            const response = await axios.post('/api/admin/create-new-category', { name: newCategory });
            if (response.status === 201) {
                setCategories([...categories, response.data.data.category]);
                setNewCategory('');
            }
        } catch (error) {
            setErrors(error.response.data.error);
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

        fetchCategories();
    }, []);

    let updateCourse = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('level', level);
        formData.append('category', category);
        formData.append('instructor', instructor.id);
        if (image) {
            formData.append('image', image);
        }
        if (intro_video) {
            formData.append('intro_video', intro_video);
        }

        try {
            const response = await axios.put(`/api/admin/update-course/${courseId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 200) {
                queryClient.invalidateQueries(['courses', courseId]);
                navigate(`/admin/manage-courses`);
            }
        } catch (error) {
            console.error('Error updating course:', error);
            setErrors(error.response?.data?.error || 'Course update failed');
        }
    };

    if (isLoading) {
        return <div className="text-center py-10">Loading course details...</div>;
    }

    if (isError) {
        return <div className="text-center py-10 text-red-500">Error: {error.message}</div>;
    }

    return (
        <div className="flex items-center justify-center px-4">
            <div className="w-full max-w-2xl">
                <h1 className="text-3xl sm:text-4xl font-bold level-1-text text-center mb-8">
                    Edit Course
                </h1>
                <form className="space-y-5 pb-8" onSubmit={updateCourse}>
                    <div>
                        <label className="block text-sm font-medium level-1-text mb-1">
                            Course Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            name="name"
                            value={name}
                            placeholder="Enter course name"
                            className="w-full rounded-md border border-gray-600 bg-[#101324] px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium level-1-text mb-1">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            onChange={(e) => setDescription(e.target.value)}
                            name="description"
                            value={description}
                            placeholder="Enter course description"
                            className="w-full rounded-md border border-gray-600 bg-[#101324] px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-400 min-h-[100px]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium level-1-text mb-1">
                            Price <span className="text-red-500">*</span>
                        </label>
                        <input
                            onChange={(e) => setPrice(e.target.value)}
                            type="number"
                            name="price"
                            value={price}
                            placeholder="Enter course price"
                            className="w-full rounded-md border border-gray-600 bg-[#101324] px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium level-1-text mb-1">
                            Current Image
                        </label>
                        <img src={`${backendUrl}/courses/${course.image}`} alt={course.name} className="w-full h-auto rounded-md" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium level-1-text mb-1">
                            Image
                        </label>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'image')}
                            className="w-full rounded-md border border-gray-600 bg-[#101324] px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-sky-400"
                        />
                    </div>

                    {imagePreview && (
                        <div className="mt-4">
                            <img src={imagePreview} alt="Image Preview" className="w-full h-auto rounded-md" />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium level-1-text mb-1">
                            Level <span className="text-red-500">*</span>
                        </label>
                        <select
                            onChange={(e) => setLevel(e.target.value)}
                            name="level"
                            value={level}
                            className="w-full rounded-md border border-gray-600 bg-[#101324] px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                            required
                        >
                            <option value="">Select course level</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium level-1-text mb-1">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            onChange={(e) => setCategory(e.target.value)}
                            name="category"
                            value={category}
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
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-full">
                            <label className="block text-sm font-medium level-1-text mb-1">
                                Or Create New Category
                            </label>
                            <input
                                type="text"
                                placeholder="Enter new category"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                className="w-full rounded-md border border-gray-600 bg-[#101324] px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                            />
                        </div>
                        {newCategory && (
                            <button
                                type="button"
                                onClick={createCategory}
                                className="self-end py-2 px-4 text-white rounded-md auth-btn font-medium"
                            >
                                Create
                            </button>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium level-1-text mb-1">
                            Instructor <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="instructor"
                            value={instructor.name}
                            placeholder={instructor.name}
                            className="w-full rounded-md border border-gray-600 bg-[#101324] px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                            required
                            disabled
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium level-1-text mb-1">
                            Current Intro Video
                        </label>
                        <video src={`${backendUrl}/courses/${course.intro_video}`} controls className="w-full rounded-md"></video>
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
                    </div>

                    {videoPreview && (
                        <div className="mt-4">
                            <video src={videoPreview} controls className="w-full rounded-md"></video>
                            <button
                                type="button"
                                onClick={removeVideo}
                                className="mt-2 text-red-500"
                            >
                                Remove Video
                            </button>
                        </div>
                    )}
                    {errors && <p className="text-red-500">{errors}</p>}
                    <button
                        type="submit"
                        className="w-full text-white rounded-md auth-btn py-2 font-medium"
                    >
                        Update Course
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditCourse;
