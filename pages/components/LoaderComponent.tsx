import React from 'react';

const LoaderComponent = () => {
    return (
        <div>
            <div className='flex justify-center items-center h-96'>
                <div className='flex flex-col items-center'>
                    <div className='animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-900'></div>
                    <p className='text-gray-900 text-lg font-semibold mt-4'>Loading...</p>
                </div>
            </div>
        </div>
    );
};

export default LoaderComponent;