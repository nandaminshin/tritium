import React from 'react';
import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import axios from '../../helpers/Axios'
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

const AdminManagement = () => {
    // Dummy data for admins - replace with API data
    // const admins = [
    //     { id: 1, name: 'John Doe', email: 'john.doe@example.com', dateAdded: '2024-01-15' },
    //     { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', dateAdded: '2024-02-20' },
    //     { id: 3, name: 'Sam Wilson', email: 'sam.wilson@example.com', dateAdded: '2024-03-10' },
    //     { id: 4, name: 'Alice Johnson', email: 'alice.johnson@example.com', dateAdded: '2024-04-05' },
    // ];

    const [admins, setAdmins] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const response = await axios.get('/api/super-admin/get-all-admins');
                setAdmins(response.data.data);
            } catch (error) {
                setError('Failed to fetch admins');
            }
        }
        fetchAdmins();
    }, []);

    return (
        <div className="container mx-auto p-6 text-white min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-cyan-400">Admin Management</h1>
                <button className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300">
                    Add New Admin
                </button>
            </div>

            <div className="overflow-x-auto bg-gray-800 rounded-lg shadow">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Date Added</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {admins.map((admin) => (
                                <tr key={admin._id} className="hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-white">{admin.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                        {admin.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">
                                        {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center justify-center space-x-4">
                                        <div className="flex item-center justify-center space-x-4">
                                            <button
                                                className="text-yellow-400 hover:text-yellow-300 transition duration-300 cursor-pointer"
                                                title="manage this admin"
                                            >
                                                <Cog6ToothIcon className="h-7 w-7" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminManagement;
