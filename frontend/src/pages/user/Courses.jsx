import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { List, User, Layers, Clock } from 'lucide-react';
import Footer from '../../components/user/Footer';
import Axios from '../../helpers/Axios';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [enrollments, setEnrollments] = useState({});

    useEffect(() => {
        const fetchAllCategories = async () => {
            try {
                const response = await Axios.get('/api/user/courses/categories');
                if (response.data.success) {
                    setCategories(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };
        fetchAllCategories();
    }, []);

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const studentRes = await Axios.get('/api/user/student/data');
                if (studentRes.data.success && studentRes.data.data.courses) {
                    const enrolledCourseIds = studentRes.data.data.courses.map(c => c._id);

                    const enrollmentPromises = enrolledCourseIds.map(courseId =>
                        Axios.get(`/api/user/courses/${courseId}/enrollment`)
                    );

                    const enrollmentResults = await Promise.all(enrollmentPromises);

                    const newEnrollments = enrollmentResults.reduce((acc, res) => {
                        if (res.data.success && res.data.data.enrollment) {
                            acc[res.data.data.enrollment.course] = res.data.data.enrollment;
                        }
                        return acc;
                    }, {});

                    setEnrollments(newEnrollments);
                }
            } catch (error) {
                console.error('Failed to fetch enrollment data:', error);
            }
        };

        fetchEnrollments();
    }, []);

    useEffect(() => {
        const fetchAllCourses = async () => {
            let url = '/api/user/courses/all'; // Default
            if (selectedCategory) {
                url = `/api/user/courses/category/${selectedCategory}`;
            } else if (activeFilter === 'recent') {
                url = '/api/user/courses/recent';
            }

            try {
                const response = await Axios.get(url);
                if (response.data.success) {
                    setCourses(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch courses:', error);
                setCourses([]);
            }
        };

        fetchAllCourses();
    }, [selectedCategory, activeFilter]);

    const handleFilterClick = (filter) => {
        setSelectedCategory('');
        setActiveFilter(filter);
    };

    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        setSelectedCategory(categoryId);
        if (categoryId) {
            setActiveFilter('');
        } else {
            setActiveFilter('all');
        }
    };

    return (
        <div className="flex bg-gradient-to-br from-[#03050a] to-[#000721] h-full text-white" style={{ marginTop: '-90px' }}>
            {/* Sidebar */}
            <aside className="w-72 min-w-[260px] bg-[#131a2a] text-slate-200 px-8 pt-28 pb-8 border-r border-[#232b3b] flex flex-col gap-8">
                <div>
                    <h2 className="text-xl font-bold mb-4 text-white">Discover</h2>
                    <ul className="space-y-2">
                        <li className={`flex items-center gap-2 cursor-pointer ${activeFilter === 'all' ? 'text-blue-400 font-semibold' : ''}`} onClick={() => handleFilterClick('all')}>
                            <span className={`w-2 h-2 rounded-full ${activeFilter === 'all' ? 'bg-blue-400' : ''} mr-2`}></span> Discover All
                        </li>
                        <li className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = '/learning-path'}>
                            <Layers className="w-4 h-4" /> Path
                        </li>
                        <li className={`flex items-center gap-2 cursor-pointer ${activeFilter === 'recent' ? 'text-blue-400 font-semibold' : ''}`} onClick={() => handleFilterClick('recent')}>
                            <Clock className="w-4 h-4" /> Recently Published
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-bold mb-2 text-white">Filter by Category</h3>
                    <select
                        className="w-full appearance-none bg-[#2c3446] text-slate-200 rounded-md px-3 py-2 border border-slate-600 focus:outline-none focus:ring-0 focus:border-blue-500 transition-colors duration-200"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                            backgroundPosition: 'right 0.5rem center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: '1.5em 1.5em',
                            paddingRight: '2.5rem',
                        }}
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </aside>
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <main className="flex-1 px-10 pt-28 pb-32">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-10">All Courses</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {Array.isArray(courses) && courses.length > 0 ? courses.map((course, idx) => {
                            const enrollment = enrollments[course._id];
                            const isEnrolled = !!enrollment;

                            return (
                                <Link
                                    to={`/course/${course._id}`}
                                    key={idx}
                                    className={`relative bg-[#181f2a] rounded-2xl shadow-lg p-6 flex flex-col justify-between items-start hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 min-h-[340px] h-full ${isEnrolled ? 'border-2 border-green-500' : ''}`}
                                >
                                    {isEnrolled && (
                                        <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                                            Enrolled
                                        </div>
                                    )}
                                    <div className="w-full">
                                        <div className="w-20 h-20 rounded-full bg-[#232b3b] flex items-center justify-center mb-4 shadow-md mx-auto overflow-hidden">
                                            <img
                                                src={course && course.image ? `${import.meta.env.VITE_BACKEND_URL}/courses/${course.image}` : "/images/tritiumlogo.png"}
                                                alt={course.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-1">{course.name}</h3>
                                        <div className="text-slate-300 text-sm mb-4">With {course.instructor?.name || 'Unknown'}</div>
                                        <div className="w-full border-t border-[#232b3b] my-2"></div>
                                    </div>
                                    <div className="flex flex-col gap-2 text-slate-300 text-sm w-full mt-2">
                                        <span className="flex items-center gap-2"><List className="text-blue-400 w-4 h-4" /> {course.lectureCount || 0} Episodes</span>
                                        <span className="flex items-center gap-2"><User className="text-green-400 w-4 h-4" /> {course.level || 'N/A'}</span>
                                        <span className="flex items-center gap-2"><Layers className="text-purple-400 w-4 h-4" /> {course.category?.name || 'Unknown'}</span>
                                    </div>
                                    {isEnrolled && enrollment && (
                                        <div className="w-full mt-4">
                                            <div className="h-2 w-full bg-gray-700 rounded-full">
                                                <div
                                                    className="h-full bg-green-500 rounded-full"
                                                    style={{ width: `${enrollment.completionPercentage}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-right mt-1 text-gray-400">{enrollment.completionPercentage}% complete</p>
                                        </div>
                                    )}
                                </Link>
                            )
                        }) : <div className="text-slate-400 col-span-full">No courses found.</div>}
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default Courses;
