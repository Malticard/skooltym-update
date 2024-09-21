import React, { useState } from 'react';

const SliderComponent = ({ min = 0, max = 100, step = 1, defaultValue = 50, onChange }: { onChange: (x: number) => void; defaultValue: number; step: number; min: number; max: number; }) => {
    const [value, setValue] = useState(defaultValue);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(Number(e.target.value));
        onChange(value);
    };

    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="relative pt-1">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={handleChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
                    }}
                />
                <div
                    className="absolute w-6 h-6 flex items-center justify-center text-xs font-bold text-white rounded-full bg-blue-500 -top-2 -mt-1 transform -translate-x-1/2 hover:scale-110 transition-transform duration-200"
                    style={{ left: `${percentage}%` }}
                >
                    {value}
                </div>
            </div>
        </div>
    );
};

export default SliderComponent;