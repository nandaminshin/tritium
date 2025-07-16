import React, { useState, useEffect, useMemo } from 'react';
import Axios from '../../helpers/Axios';
import { CheckCircle, Clock, Eye, Trash2 } from 'lucide-react';

const PurchaseRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'approved'

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await Axios.get('/api/super-admin/purchase-requests');
                if (response.data.success) {
                    setRequests(response.data.data);
                } else {
                    setError('Failed to fetch purchase requests.');
                }
            } catch (err) {
                setError('An error occurred while fetching data.');
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    const pendingRequests = useMemo(() => requests.filter(r => !r.approveStatus), [requests]);
    const approvedRequests = useMemo(() => requests.filter(r => r.approveStatus), [requests]);

    const handleApprove = async (purchaseId) => {
        try {
            const response = await Axios.put(`/api/super-admin/approve-purchase/${purchaseId}`);
            if (response.data.success) {
                setRequests(requests.map(req => 
                    req._id === purchaseId ? { ...req, approveStatus: true, updatedAt: new Date().toISOString() } : req
                ));
            } else {
                alert('Failed to approve request.');
            }
        } catch (err) {
            alert('An error occurred while approving the request.');
        }
    };

    const handleDelete = async (purchaseId) => {
        if (window.confirm('Are you sure you want to permanently delete this request? This action cannot be undone.')) {
            try {
                const response = await Axios.delete(`/api/super-admin/purchase-requests/${purchaseId}`);
                if (response.data.success) {
                    setRequests(requests.filter(req => req._id !== purchaseId));
                } else {
                    alert('Failed to delete request.');
                }
            } catch (err) {
                alert('An error occurred while deleting the request.');
            }
        }
    };

    const viewReceipt = (request) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const dataToShow = activeTab === 'pending' ? pendingRequests : approvedRequests;
    const dateLabel = activeTab === 'pending' ? 'Requested At' : 'Approved At';
    const dateField = activeTab === 'pending' ? 'createdAt' : 'updatedAt';

    if (loading) return <div className="text-center p-8">Loading...</div>;
    if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-6 text-white min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-cyan-400">Purchase Requests</h1>

            <div className="flex border-b border-gray-700 mb-6">
                <button 
                    onClick={() => setActiveTab('pending')}
                    className={`py-2 px-4 text-lg font-medium transition-colors duration-300 ${activeTab === 'pending' ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-gray-400 hover:text-white'}`}
                >
                    Pending ({pendingRequests.length})
                </button>
                <button 
                    onClick={() => setActiveTab('approved')}
                    className={`py-2 px-4 text-lg font-medium transition-colors duration-300 ${activeTab === 'approved' ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-gray-400 hover:text-white'}`}
                >
                    Approved ({approvedRequests.length})
                </button>
            </div>

            {dataToShow.length === 0 ? (
                <div className="text-center py-12 bg-gray-800 rounded-lg">
                    <Clock className="mx-auto h-12 w-12 text-gray-500" />
                    <h3 className="mt-2 text-lg font-medium text-gray-300">No {activeTab} requests</h3>
                </div>
            ) : (
                <div className="overflow-x-auto bg-gray-800 rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Coin Amount</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total Cost</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Payment Method</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{dateLabel}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {dataToShow.map((request) => (
                                <tr key={request._id} className="hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-white">{request.userId?.name || 'N/A'}</div>
                                        <div className="text-sm text-gray-400">{request.userId?.email || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-lg font-semibold text-cyan-400">{request.coinAmount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-yellow-400">{request.totalCost} MMK</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.paymentMethod}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatDate(request[dateField])}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center space-x-4">
                                        <button onClick={() => viewReceipt(request)} className="text-indigo-400 hover:text-indigo-300 transition duration-150 ease-in-out flex items-center cursor-pointer">
                                            <Eye className="h-5 w-5 mr-1" /> View
                                        </button>
                                        {activeTab === 'pending' ? (
                                            <button onClick={() => handleApprove(request._id)} className="text-green-400 hover:text-green-300 transition duration-150 ease-in-out flex items-center cursor-pointer">
                                                <CheckCircle className="h-5 w-5 mr-1" /> Approve
                                            </button>
                                        ) : (
                                            <button onClick={() => handleDelete(request._id)} className="text-red-500 hover:text-red-400 transition duration-150 ease-in-out flex items-center cursor-pointer">
                                                <Trash2 className="h-5 w-5 mr-1" /> Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg mx-auto border border-gray-700 flex flex-col">
                        <h3 className="text-xl font-bold text-cyan-400 mb-4">Payment Receipt</h3>
                        <div className="mb-4 overflow-hidden flex-grow">
                            <img
                                src={`${import.meta.env.VITE_BACKEND_URL}/users/receipts/${selectedRequest.receiptImage}`}
                                alt="Receipt"
                                className="max-w-full max-h-[70vh] h-auto rounded-lg mx-auto object-contain"
                            />
                        </div>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="w-full py-2 bg-cyan-600 text-white font-bold rounded-lg shadow-lg hover:bg-cyan-500 transition-all duration-300 mt-4"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PurchaseRequests;
