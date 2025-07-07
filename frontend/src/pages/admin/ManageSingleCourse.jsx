import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourseById } from '../../helpers/useCourseQueries';
import { useLectures } from '../../helpers/useLectureQueries';
import axios from '../../helpers/Axios';
import { useQueryClient } from '@tanstack/react-query';

const ManageSingleCourse = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { courseId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: course, isLoading, isError, error } = useCourseById(courseId);
    const { data: lectures = [] } = useLectures(courseId);

    if (isLoading) {
        return <div className="text-center py-10">Loading course details...</div>;
    }

    if (isError) {
        return <div className="text-center py-10 text-red-500">Error: {error.message}</div>;
    }

    if (!course) {
        return <div className="text-center py-10">Course not found</div>;
    }

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await axios.delete(`/api/admin/delete-course/${courseId}`);
                queryClient.invalidateQueries(['courses']);
                navigate('/admin/manage-courses');
            } catch (error) {
                console.error('Error deleting course:', error);
                // Handle error appropriately
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Course: {course.name}</h1>
                <button
                    onClick={() => navigate('/admin/manage-courses')}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                >
                    Back to Courses
                </button>
            </div>

            <div className="bg-[#101324] border border-gray-600 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Course Information</h2>
                        <div className="space-y-3">
                            <p><span className="font-medium">Name:</span> {course.name}</p>
                            <p><span className="font-medium">Description:</span> {course.description}</p>
                            <p><span className="font-medium">Price:</span> ${course.price}</p>
                            <p><span className="font-medium">Level:</span> {course.level}</p>
                            <p><span className="font-medium">Category:</span> {course.category?.name}</p>
                            <p><span className="font-medium">Status:</span> {course.status}</p>
                            <p><span className="font-medium">Instructor:</span> {course.instructor?.name}</p>
                        </div>
                    </div>
                    <div>
                        {course.image && (
                            <div className="mb-4">
                                <h3 className="text-lg font-medium mb-2">Course Image</h3>
                                <img
                                    src={`${backendUrl}/courses/${course.image}`}
                                    alt={course.name}
                                    className="w-full max-h-48 object-cover rounded"
                                />
                            </div>
                        )}
                        {course.intro_video && (
                            <div>
                                <h3 className="text-lg font-medium mb-2">Intro Video</h3>
                                <video
                                    src={`${backendUrl}/courses/${course.intro_video}`}
                                    controls
                                    className="w-full rounded"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col space-y-6">
                <div className="bg-[#101324] border border-gray-600 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Course Management</h2>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => navigate(`/admin/courses/edit/${courseId}`)}
                            className="px-3 py-1 rounded text-sm font-semibold shadow-sm transition-colors border border-yellow-600 bg-yellow-950 text-yellow-300 hover:bg-yellow-900 cursor-pointer"
                        >
                            Edit Course
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-3 py-1 rounded text-sm font-semibold shadow-sm transition-colors border border-red-600 bg-red-950 text-red-400 hover:bg-red-900 cursor-pointer"
                        >
                            Delete Course
                        </button>
                    </div>
                </div>

                <div className="bg-[#101324] border border-gray-600 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Course Materials</h2>
                    <button
                        onClick={() => navigate(`/admin/courses/${courseId}/add-lecture`)}
                        className="px-3 py-1 rounded text-sm font-semibold shadow-sm transition-colors border border-green-600 bg-green-950 text-green-400 hover:bg-green-900 cursor-pointer"
                    >
                        Add Lecture
                    </button>

                    <div className="mt-4">
                        {lectures ? (lectures.length == 1 ? <p>1 lecture added.</p> : <p>{lectures.length} lectures added.</p>) : <p className="text-gray-400">No lectures added yet.</p>}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageSingleCourse;