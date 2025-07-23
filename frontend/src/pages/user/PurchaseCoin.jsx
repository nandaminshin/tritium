import React, { useState, useEffect, useContext } from 'react';
import { ShieldCheck, FileText, BookOpen, Banknote, Upload, X } from 'lucide-react';
import Axios from '../../helpers/Axios';
import { AuthContext } from '../../contexts/AuthContext';
import SuccessModal from '../../components/SuccessModal';
import { usePaymentInfo } from '../../helpers/usePaymentInfoQuery';
import { useQueryClient } from '@tanstack/react-query';

const PurchaseCoin = () => {
    const [coinAmount, setCoinAmount] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState('');
    const [receipt, setReceipt] = useState(null);
    const [submitError, setSubmitError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const { user, socket } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const { data: paymentInfo, isLoading, isError, error } = usePaymentInfo();

    useEffect(() => {
        const onPriceUpdate = () => {
            console.log('Received priceUpdated event, invalidating paymentInfo query.');
            queryClient.invalidateQueries({ queryKey: ['paymentInfo'] });
        };

        socket.on('priceUpdated', onPriceUpdate);

        return () => {
            socket.off('priceUpdated', onPriceUpdate);
        };
    }, [socket, queryClient]);

    const paymentMethodDetails = {
        kPay: { name: 'KBZPay' },
        wavePay: { name: 'WavePay' },
        ayaPay: { name: 'AYAPay' },
        uabPay: { name: 'UABPay' },
        additionalPay: { name: 'Other' }
    };

    useEffect(() => {
        if (paymentInfo && !selectedPayment) {
            const firstAvailableMethod = Object.keys(paymentMethodDetails).find(key => paymentInfo[key]);
            if (firstAvailableMethod) {
                setSelectedPayment(firstAvailableMethod);
            }
        }
    }, [paymentInfo, selectedPayment]);

    const handleAmountChange = (e) => {
        const amount = e.target.value;
        if (amount === '' || (amount >= 1 && !isNaN(amount))) {
            setCoinAmount(amount);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setReceipt(e.target.files[0]);
        }
    };

    const handlePurchase = async () => {
        if (!receipt) {
            setSubmitError('Please upload a receipt.');
            return;
        }
        setSubmitting(true);
        setSubmitError('');

        const formData = new FormData();
        formData.append('userId', user._id);
        formData.append('paymentMethod', selectedPayment);
        formData.append('coinAmount', coinAmount);
        formData.append('totalCost', coinAmount * paymentInfo.coinPrice);
        formData.append('receiptImage', receipt);

        try {
            const response = await Axios.post('/api/user/create-purchase', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.data.success) {
                setIsModalOpen(false);
                setIsSuccessModalOpen(true);
                setReceipt(null);
                window.dispatchEvent(new Event('purchaseMade'));
            } else {
                setSubmitError(response.data.message || 'An error occurred.');
            }
        } catch (err) {
            setSubmitError(err.response?.data?.message || 'An error occurred while submitting your request.');
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
    }

    if (isError) {
        return <div className="min-h-screen flex items-center justify-center text-red-500">{error.message}</div>;
    }

    if (!paymentInfo) {
        return <div className="min-h-screen flex items-center justify-center text-white">Payment information is not available at the moment.</div>;
    }

    return (
        <>
            <div className="min-h-screen flex items-center justify-center pt-32 pl-4 pr-4 pb-24 -mt-20">
                <div className="bg-[#181f2a] border border-slate-700 rounded-2xl shadow-2xl w-full max-w-4xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Left Column: Purchase Form */}
                    <div className="flex flex-col items-center">
                        <h2 className="text-3xl font-bold text-cyan-400 mb-2">Purchase Tritium Coin</h2>
                        <p className="text-slate-400 mb-6">Acquire coins to unlock premium content.</p>

                        <div className="relative my-8">
                            <img src="/images/tritiumCoin.png" alt="Tritium Coin" className="w-32 h-32 animate-spin-slow-3d" />
                            <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-2xl animate-pulse-slow"></div>
                        </div>

                        <div className="bg-[#232b3b] rounded-lg p-4 w-full text-center mb-6">
                            <p className="text-slate-300">Current Price</p>
                            <div className="flex items-center justify-center gap-2">
                                <span className='text-2xl font-bold'> 1 </span>
                                <img src="/images/tritiumCoin.png" alt="Tritium Coin" className="w-10 h-10 animate-spin-slow" />
                                <p className="text-2xl font-bold text-white ml-2"> = <span className="text-yellow-400">{paymentInfo.coinPrice} MMK</span></p>
                            </div>
                        </div>

                        <div className="w-full mb-4">
                            <label htmlFor="coinAmount" className="block text-sm font-medium text-slate-300 mb-2">Amount to Purchase</label>
                            <input
                                type="number"
                                id="coinAmount"
                                value={coinAmount}
                                onChange={handleAmountChange}
                                className="w-full bg-[#232b3b] border border-slate-600 rounded-lg px-4 py-3 text-white text-lg text-center font-bold focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                                placeholder="Enter amount"
                                min="1"
                            />
                        </div>

                        <div className="w-full bg-[#232b3b] rounded-lg p-4 text-center mb-8">
                            <p className="text-slate-300">Total Cost</p>
                            <p className="text-3xl font-extrabold text-yellow-400">{coinAmount * paymentInfo.coinPrice} MMK</p>
                        </div>

                        <button onClick={() => setIsModalOpen(true)} className="w-full py-3 bg-cyan-600 text-white font-bold rounded-lg shadow-lg hover:bg-cyan-500 transform hover:-translate-y-1 transition-all duration-300 text-lg cursor-pointer">
                            Purchase Now
                        </button>
                    </div>

                    {/* Right Column: Information */}
                    <div className="flex flex-col justify-center space-y-8 text-slate-300">
                        <div>
                            <h3 className="text-xl font-bold text-cyan-400 mb-3 flex items-center"><BookOpen className="mr-3" /> Purchasing Guide</h3>
                            <ul className="list-disc list-inside space-y-2 pl-2">
                                <li>Enter the amount of Tritium Coin you wish to purchase.</li>
                                <li>Click &quot;Purchase Now&quot; to open the payment confirmation modal.</li>
                                <li>Select your preferred payment method and send the exact amount to the provided account number.</li>
                                <li>Upload a screenshot of your payment receipt.</li>
                                <li>Click &quot;Confirm Purchase&quot;. Your coins will arrive in your account within minutes.</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-cyan-400 mb-3 flex items-center"><FileText className="mr-3" /> Terms & Conditions</h3>
                            <p className="text-sm">All purchases are final and non-refundable. Tritium Coins are a virtual currency for use exclusively on this platform and have no real-world value. By purchasing, you agree to our full terms of service.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-cyan-400 mb-3 flex items-center"><ShieldCheck className="mr-3" /> Privacy Policy</h3>
                            <p className="text-sm">We are committed to protecting your privacy. Your payment information is handled securely and is not stored on our servers. We only require a transaction receipt for verification purposes.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Purchase Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center pt-28 pl-4 pr-4 pb-4">
                    <div className="relative bg-[#181f2a] border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg mx-auto text-white p-8">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-bold text-cyan-400 mb-4">Confirm Your Purchase</h2>
                        <p className="text-slate-400 mb-6">Send <span className="font-bold text-yellow-400">{coinAmount * paymentInfo.coinPrice} MMK</span> to the account below and upload your receipt.</p>

                        {submitError && <p className="text-red-500 bg-red-900/50 border border-red-700 rounded-lg p-3 mb-4">{submitError}</p>}

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="paymentMethod" className="block text-sm font-medium text-slate-300 mb-2">Payment Method</label>
                                <select
                                    id="paymentMethod"
                                    value={selectedPayment}
                                    onChange={(e) => setSelectedPayment(e.target.value)}
                                    className="w-full bg-[#232b3b] border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                                >
                                    {Object.entries(paymentMethodDetails).map(([key, { name }]) => (
                                        paymentInfo[key] && <option key={key} value={key}>{name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="bg-[#232b3b] rounded-lg p-4 flex items-center justify-between">
                                <p className="text-slate-300">Account Number:</p>
                                <p className="font-mono text-lg text-yellow-400">{paymentInfo[selectedPayment]}</p>
                            </div>
                            <div>
                                <label htmlFor="receipt" className="block text-sm font-medium text-slate-300 mb-2">Upload Receipt</label>
                                <div className="flex items-center justify-center w-full">
                                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-600 border-dashed rounded-lg cursor-pointer bg-[#232b3b] hover:bg-slate-700">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-8 h-8 mb-2 text-slate-400" />
                                            <p className="mb-2 text-sm text-slate-400">{receipt ? `File: ${receipt.name}` : 'Click to upload or drag and drop'}</p>
                                            <p className="text-xs text-slate-500">PNG, JPG, or GIF</p>
                                        </div>
                                        <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/gif" />
                                    </label>
                                </div>
                            </div>
                            <button onClick={handlePurchase} disabled={!receipt || submitting} className="w-full py-3 bg-cyan-600 text-white font-bold rounded-lg shadow-lg hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed transform hover:-translate-y-1 transition-all duration-300 text-lg">
                                {submitting ? 'Submitting...' : 'Confirm Purchase'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                message="Your purchase request has been submitted successfully! You will be notified upon approval."
            />

            <style>{`
                @keyframes spin-slow-3d { 0% { transform: rotateY(0deg); } 100% { transform: rotateY(360deg); } }
                .animate-spin-slow-3d { animation: spin-slow-3d 8s linear infinite; }
                @keyframes pulse-slow { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
                .animate-pulse-slow { animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
            `}</style>
        </>
    );
};

export default PurchaseCoin;
