import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from '../../helpers/Axios';
import { AuthContext } from '../../contexts/AuthContext';
import { BookOpen, Clapperboard, Clock, Star, Users, Calendar } from 'lucide-react';

// Individual Stat Widget Component
const StatWidget = ({ icon, label, value, color, loading }) => {
    const IconComponent = icon;
    return (
        <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg flex items-center space-x-4 transition-transform transform hover:scale-105">
            <div className={`bg-${color}-500/20 p-3 rounded-full`}>
                <IconComponent className={`text-${color}-400`} size={28} />
            </div>
            <div>
                <p className="text-sm text-gray-400 font-medium">{label}</p>
                {loading ? (
                    <div className="h-8 w-24 bg-gray-700/50 rounded-md animate-pulse mt-1"></div>
                ) : (
                    <p className="text-2xl font-bold text-white">{value}</p>
                )}
            </div>
        </div>
    );
};

// Main Dashboard Component
const AdminDashboard = () => {
    const { user } = useContext(AuthContext);

    const fetchDashboardStats = async () => {
        const response = await axios.get('/api/admin/dashboard-stats');
        return response.data.data;
    };

    const { data: stats, isLoading, isError, error } = useQuery({
        queryKey: ['dashboardStats', user.id],
        queryFn: fetchDashboardStats,
    });

    const calculateAccountAge = (createdAt) => {
        if (!createdAt) return 'N/A';
        const now = new Date();
        const created = new Date(createdAt);
        const diffInDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));
        if (diffInDays < 30) return `${diffInDays} days`;
        if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months`;
        return `${Math.floor(diffInDays / 365)} years`;
    };

    const widgetData = [
        {
            icon: BookOpen,
            label: 'Courses Created',
            value: stats?.courseCount,
            color: 'sky',
        },
        {
            icon: Clapperboard,
            label: 'Lectures Uploaded',
            value: stats?.lectureCount,
            color: 'emerald',
        },
        {
            icon: Clock,
            label: 'Hours of Contribution',
            value: stats?.contributionHours,
            color: 'amber',
        },
        {
            icon: Users,
            label: 'Total Students',
            value: stats?.totalStudents || '583', // Mock
            color: 'violet',
        },
        {
            icon: Star,
            label: 'Your Rating',
            value: stats?.averageRating ? `${stats.averageRating} / 5.0` : '4.8 / 5.0', // Mock
            color: 'yellow',
        },
        {
            icon: Calendar,
            label: 'Account Age',
            value: calculateAccountAge(stats?.accountCreatedAt),
            color: 'rose',
        },
    ];

    if (isError) {
        return (
            <div className="flex items-center justify-center h-full text-red-400">
                <p>Error fetching dashboard data: {error.message}</p>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Welcome Back, {user?.name}!</h1>
            <p className="text-gray-400 mb-8">Here&apos;s a snapshot of your contributions.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {widgetData.map((widget, index) => (
                    <StatWidget
                        key={index}
                        icon={widget.icon}
                        label={widget.label}
                        value={widget.value}
                        color={widget.color}
                        loading={isLoading}
                    />
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
