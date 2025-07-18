import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Axios from '../../helpers/Axios';
import SuccessModal from '../../components/SuccessModal';
import { useUpdatePaymentInfo } from '../../helpers/usePaymentInfoQuery';

const fetchPaymentInfo = async () => {
    const response = await Axios.get('/api/super-admin/get-payment-info');
    return response.data.data;
};

const CurrencyManagement = () => {
    const [formData, setFormData] = useState({
        coinPrice: '',
        kPay: '',
        wavePay: '',
        ayaPay: '',
        uabPay: '',
        additionalPay: ''
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: paymentInfo, isLoading, isError, error: queryError } = useQuery({
        queryKey: ['paymentInfoAdmin'],
        queryFn: fetchPaymentInfo,
    });

    const mutation = useUpdatePaymentInfo();

    useEffect(() => {
        if (paymentInfo) {
            setFormData(paymentInfo);
        }
    }, [paymentInfo]);

    useEffect(() => {
        if (mutation.isSuccess) {
            setIsModalOpen(true);
        }
    }, [mutation.isSuccess]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        mutation.reset();
    };

    if (isLoading) {
        return <div className="text-center text-white">Loading...</div>;
    }

    const displayError = mutation.error?.response?.data?.message || mutation.error?.message || (isError ? queryError.message : '');

    return (
        <>
            <SuccessModal
                isOpen={isModalOpen}
                onClose={closeModal}
                title="Success!"
                message="Payment information has been updated successfully."
            />
            <div className="flex items-center justify-center px-4">
                <div className="w-full max-w-3xl">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white text-center mb-8">
                        Currency Management
                    </h1>
                    <form className="space-y-5 pb-8" onSubmit={handleSubmit}>
                        {/* Coin Price */}
                        <div>
                            <label htmlFor="coinPrice" className="block text-sm font-medium text-gray-300 mb-1">
                                Coin Price (1 Coin = ? MMK)
                            </label>
                            <input
                                type="number"
                                name="coinPrice"
                                id="coinPrice"
                                value={formData.coinPrice || ''}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-600 bg-[#101324] px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                            />
                        </div>

                        {/* Payment Methods */}
                        <div className="border-t border-gray-700 pt-5">
                            <h2 className="text-xl font-semibold text-white mb-4">Payment Accounts</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {Object.keys(formData).filter(k => k !== 'coinPrice' && k !== '_id' && k !== '__v').map(key => (
                                    <div key={key}>
                                        <label htmlFor={key} className="block text-sm font-medium text-gray-300 mb-1 capitalize">
                                            {key.replace(/([A-Z])/g, ' $1')}
                                        </label>
                                        <input
                                            type="text"
                                            name={key}
                                            id={key}
                                            value={formData[key] || ''}
                                            onChange={handleChange}
                                            placeholder={`Enter ${key} account number`}
                                            className="w-full rounded-md border border-gray-600 bg-[#101324] px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-sky-400"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {displayError && <p className="text-red-500 text-center">{displayError}</p>}

                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="w-full text-white rounded-md bg-purple-600 hover:bg-purple-700 py-2.5 font-medium disabled:bg-gray-500"
                        >
                            {mutation.isPending ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CurrencyManagement;
