import React from 'react';
import { Link } from 'react-router-dom';
import { useAllCourses } from '../../helpers/useCourseQueries';

const ManageCourses = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { data: courses, isLoading, isError, error } = useAllCourses();

    if (isLoading) {
        return <div className="text-center py-10">Loading courses...</div>
    }

    if (isError) {
        return <div className="text-center py-10 text-red-500">Error: {error.message}</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Manage Courses</h1>
        
        {courses && courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
                <Link to={`/admin/courses/${course._id}`} key={course._id}>
                    <div className="border border-gray-600 rounded-lg overflow-hidden bg-[#101324] hover:bg-[#1a1f38] transition-colors h-full flex flex-col">
                        {/* Image container with fixed height */}
                        <div className="h-48 w-full overflow-hidden">
                            <img 
                                src={`${backendUrl}/courses/${course.image}`} 
                                alt={course.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://placehold.co/600x400/101324/CCCCCC?text=No+Image';
                                }}
                            />
                        </div>
                        
                        {/* Content container */}
                        <div className="p-4 flex-grow flex flex-col">
                            <h2 className="text-xl font-semibold mb-2">{course.name}</h2>
                            <p className="text-gray-300 mb-2 flex-grow">{course.description.substring(0, 100)}...</p>
                            
                            <div className="flex flex-wrap gap-2 mt-3">
                                <span className="bg-blue-950 px-2 py-1 rounded text-sm border-1 border-blue-700">{course.category.name}</span>
                                <span className={`px-2 py-1 rounded text-sm ${course.status === 'completed' ? 'bg-green-950 border-1 border-green-500' : 'bg-red-950 border-1 border-red-600'}`}>
                                    {course.status}
                                </span>
                            </div>
                            
                            <div className="flex justify-between items-center mt-4">
                                <span className="text-blue-400">${course.price}</span>
                                <span
                                    className={`capitalize px-5 py-1 rounded-full text-sm font-semibold shadow-sm transition-colors
                                        ${course.level === 'beginner' ? 'bg-green-950 bg-opacity-50 text-green-500 border-1 border-green-500' : ''}
                                        ${course.level === 'intermediate' ? 'bg-sky-950 text-sky-400 border-1 border-sky-400' : ''}
                                        ${course.level === 'advanced' ? 'bg-amber-950 text-amber-300 border-1 border-amber-300' : ''}
                                    `}
                                >
                                    {course.level}
                                </span>
                            </div>
                            
                            <div className="mt-3 text-gray-300">
                                <span>Instructor: {course.instructor?.name || 'Unknown'}</span>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
            </div>
        ) : (
            <div className="text-center py-10">
            No courses found. Create your first course to get started.
            </div>
        )}
        </div>
    )
}

export default ManageCourses
