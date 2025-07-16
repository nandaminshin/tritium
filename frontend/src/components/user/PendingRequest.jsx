import React from 'react';
import { Clock } from 'lucide-react';

const PendingRequest = () => {
    return (
        <div className="fixed bottom-4 left-4 sm:left-8 z-50">
            <div className="flex items-center gap-3 bg-yellow-500 text-white font-bold py-3 px-5 rounded-full shadow-lg animate-pulse">
                <Clock className="h-6 w-6" />
                <span>Purchase Pending Approval</span>
            </div>
        </div>
    );
};

export default PendingRequest;
