import React from 'react';
import './SuccessModal.css';

const SuccessModal = ({ isOpen, onClose, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-green-400 mb-4">{title}</h2>
                <p className="text-gray-300 mb-6">{message}</p>
                <button
                    onClick={onClose}
                    className="w-full text-white rounded-md bg-purple-600 hover:bg-purple-700 py-2.5 font-medium"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default SuccessModal;
