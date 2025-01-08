import { IconAlarm } from '@/public/assets/icon-fonts/tabler-icons/icons-react';
import React, { useState } from 'react';

const DropOffsComponent = ({
    title,
    trailing,
    leading,
    subTitle,
    onTap,
}: {
    leading?: React.ReactNode;
    title: string;
    subTitle: string;
    onTap?: () => void;
    trailing: string | React.ReactNode;
}) => {
    const [isZoomed, setIsZoomed] = useState(false);

    const handleClick = () => {
        if (onTap) {
            setIsZoomed(true);
            onTap();
            setTimeout(() => setIsZoomed(false), 100); // Duration of the animation
        }
    };

    return (
        <div
            className={`bg-white dark:bg-[#2b2b2b] rounded-lg p-2 my-2 flex items-center justify-between cursor-pointer transition-all duration-300 ease-in-out ${isZoomed ? 'scale-95' : 'scale-100'
                }`}
            onClick={handleClick}
        >
            <div className="flex items-center">
                <div className="bg-blue-500 dark:bg-blue-700 p-2 rounded-lg mr-4">
                    {leading ?? <IconAlarm className="dark:text-white" size={24} />}
                </div>
                <div>
                    <h2 className="text-md font-semibold text-black dark:text-white">{title}</h2>
                    <p className="text-xs font-normal text-gray-500 dark:text-gray-300">{subTitle}</p>
                </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-300">{trailing}</div>
        </div>
    );
};

export default DropOffsComponent;
