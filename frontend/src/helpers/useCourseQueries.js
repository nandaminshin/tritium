import { useQuery } from '@tanstack/react-query'
import axios from './Axios'

// Hook for fetching all courses
export const useAllCourses = () => {
    return useQuery({
        queryKey: ['courses'],
        queryFn: async () => {
            const response = await axios.get('/api/admin/get-all-courses');
            if (response.status === 200) {
                return response.data.data.courses;
            } else {
                throw new Error(response.data.message || 'Failed to fetch courses');
            }
        },
    })
}

// Hook for fetching a single course by ID
export const useCourseById = (courseId) => {
    return useQuery({
        queryKey: ['course', courseId],
        queryFn: async () => {
            const response = await axios.get(`/api/admin/get-course-by-id/${courseId}`);
            if (response.status === 200) {
                return response.data.data.course;
            } else {
                throw new Error(response.data.message || 'Failed to fetch courses');
            }
        },
        enabled: !!courseId, // Only run the query if courseId exists
    })
}

// Hook for fetching featured courses
export const useFeaturedCourses = () => {
    return useQuery({
        queryKey: ['featured-courses'],
        queryFn: async () => {
            const response = await axios.get('/api/user/featured-courses');
            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error(response.data.message || 'Failed to fetch featured courses');
            }
        },
    })
}
