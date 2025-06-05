import { useQuery } from '@tanstack/react-query'
import axios from './Axios'

// Hook for fetching all courses
export const useAllCourses = () => {
    return useQuery({
        queryKey: ['courses'],
        queryFn: async () => {
            const response = await axios.get('/api/admin/get-all-courses')
            return response.data.data.courses
        },
    })
}

// Hook for fetching a single course by ID
export const useCourseById = (courseId) => {
    return useQuery({
        queryKey: ['course', courseId],
        queryFn: async () => {
            const response = await axios.get(`/api/admin/get-course-by-id/${courseId}`)
            return response.data.data.course
        },
        enabled: !!courseId, // Only run the query if courseId exists
    })
}