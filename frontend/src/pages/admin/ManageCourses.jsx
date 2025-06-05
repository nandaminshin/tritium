import React from 'react';
import { useAllCourses } from '../../helpers/useCourseQueries';

const ManageCourses = () => {
    const { data: courses, isLoading, isError, error } = useAllCourses()

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
                <div key={course._id} className="border border-gray-600 rounded-lg p-4 bg-[#101324]">
                <h2 className="text-xl font-semibold mb-2">{course.name}</h2>
                <p className="text-gray-300 mb-2">{course.description.substring(0, 100)}...</p>
                <div className="flex justify-between items-center mt-4">
                    <span className="text-blue-400">${course.price}</span>
                    <span className="capitalize bg-gray-700 px-2 py-1 rounded text-sm">{course.level}</span>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
                    Edit
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                    Delete
                    </button>
                </div>
                </div>
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
