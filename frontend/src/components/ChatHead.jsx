import React, { useState } from 'react';

const ChatHead = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-4 right-4 sm:right-8 z-50">
        {/* Chat Dialog */}
        {isOpen && (
            <div className="absolute bottom-20 right-0 w-[95vw] sm:w-[400px] md:w-[450px] h-[80vh] sm:h-[490px] bg-gray-900 rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-primary text-white">
                    <h3 className="font-semibold text-sm sm:text-base">AI Assistant</h3>
                    <button
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:text-gray-200 p-1"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    </button>
                </div>
                <div className="p-3 sm:p-4 h-[calc(100%-140px)] overflow-y-auto">
                    {/* Chat messages will go here */}
                </div>
                <div className="pr-3 pl-3 sm:pr-4 sm:pl-4 pt-3 sm:pt-4 border-t border-grey-200">
                    <div className="flex gap-2 pb-3 sm:pb-4">
                        <input
                            type="text"
                            placeholder="Send a message..."
                            className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button className="p-2 bg-primary text-white rounded-full hover:bg-primary-dark">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Chat Head Button */}
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-400 rounded-full shadow-lg hover:shadow-xl transform transition-transform duration-300 bounce-slow"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
            </svg>
        </button>
        </div>
    );
};

export default ChatHead;