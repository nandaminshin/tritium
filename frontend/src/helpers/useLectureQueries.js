import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from './Axios';

// Fetch all lectures for a course
export const useLectures = (courseId) => {
    return useQuery({
        queryKey: ['lectures', courseId],
        queryFn: async () => {
            const res = await axios.get(`/api/admin/courses/${courseId}/lectures`);
            if (res.status === 200) return res.data.data.lectures;
            throw new Error(res.data.error || 'Failed to fetch lectures');
        },
        enabled: !!courseId,
    });
};

// Add a new lecture
export const useAddLecture = (courseId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (lectureData) => {
            const res = await axios.post(`/api/admin/courses/${courseId}/lectures`, lectureData);
            if (res.status === 201) return res.data.data.lecture;
            else { throw new Error(res.data.error || 'Failed to add lecture'); }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['lectures', courseId]);
        },
    });
};

// Delete a lecture
export const useDeleteLecture = (courseId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (lectureId) => {
            await axios.delete(`/api/admin/lectures/${lectureId}`);
        },
        onSuccess: () => queryClient.invalidateQueries(['lectures', courseId]),
    });
};

// Hide/unhide a lecture
export const useToggleHiddenLecture = (courseId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ lectureId, hidden }) => {
            console.log('we are in query');
            await axios.put(`/api/admin/lectures/${lectureId}/hidden`, { hidden });
        },
        onSuccess: () => queryClient.invalidateQueries(['lectures', courseId]),
    });
};

// Reorder lectures
export const useReorderLectures = (courseId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (lecturesToUpdate) => {
            await axios.put(`/api/admin/lectures/reorder`, { lectures: lecturesToUpdate });
        },
        onSuccess: () => queryClient.invalidateQueries(['lectures', courseId]),
    });
};

// Update a lecture
export const useUpdateLecture = (courseId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (updatedLecture) => {
            const { _id, ...data } = updatedLecture;
            const res = await axios.put(`/api/admin/courses/${courseId}/lectures/${_id}`, data);
            if (res.status === 200) return res.data;
            throw new Error(res.data.error || 'Failed to update lecture');
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['lectures', courseId]);
        },
    });
}; 