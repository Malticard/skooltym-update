import React, { useState } from 'react';

const SwitchComponent = ({ defaultChecked = false, onChange }: { defaultChecked: boolean; onChange: (b: boolean) => void }) => {
    const [isChecked, setIsChecked] = useState(defaultChecked);

    const handleToggle = () => {
        setIsChecked(!isChecked);
        if (onChange) {
            onChange(!isChecked);
        }
    };

    return (
        <div className="inline-block">
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isChecked}
                    onChange={handleToggle}
                />
                <div className={`
          w-15 h-8 rounded-full
          flex items-center
          ${isChecked ? 'bg-[#0a47eecc]' : 'bg-[#b6b7b6]'}
          transition-colors duration-300 ease-in-out
          peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300
        `}>
                    {/* <div className={`
            w-5 h-5 rounded-full
            // ${isChecked ? 'bg-white ml-1' : 'bg-[#787878] ml-1'}
            transition-all duration-300 ease-in-out
          `}></div> */}
                    <div className={`
            absolute w-6 h-6 rounded-full
            ${isChecked
                            ? 'bg-white translate-x-7'
                            : 'bg-white translate-x-0.5'}
            shadow-md
            transition-all duration-300 ease-in-out
          `}></div>
                </div>
            </label>
        </div>
    );
};

export default SwitchComponent;