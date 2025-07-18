import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Axios from './Axios';

export const usePaymentInfo = () => {
    return useQuery({
        queryKey: ['paymentInfo'],
        queryFn: async () => {
            const response = await Axios.get('/api/user/get-payment-info');
            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.message || 'Failed to fetch payment info');
            }
        },
        refetchInterval: false,
    });
};

export const useUpdatePaymentInfo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const response = await Axios.put('/api/super-admin/update-payment-info', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['paymentInfo'] });
            queryClient.invalidateQueries({ queryKey: ['paymentInfoAdmin'] });
        },
    });
};
