import React, { useState, useEffect } from 'react';

const Snackbar = ({ message, isVisible, onClose }: {
    message
    : string, isVisible: boolean, onClose: () => void
}) => {
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        if (isVisible) {
            setProgress(100);
            const timer = setInterval(() => {
                setProgress((prevProgress) => {
                    if (prevProgress <= 0) {
                        clearInterval(timer);
                        onClose();
                        return 0;
                    }
                    return prevProgress - (100 / 30); // 100% to 0% in 3 seconds (30 steps of 100ms)
                });
            }, 100);

            return () => clearInterval(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    return (
        <div className="fixed top-[5em] right-4 bg-[#000] text-white p-2 px-2 rounded-sm shadow-lg z-999999 max-w-sm">
            <div className="flex justify-between items-center mb-2">
                <span>{message}</span>
                <button onClick={onClose} className="text-white hover:text-gray-200">
                    &times;
                </button>
            </div>
            <div className="w-full bg-green-600 rounded-full h-2">
                <div
                    className="bg-white h-[0.03em] rounded-full transition-all duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
};

export default Snackbar;