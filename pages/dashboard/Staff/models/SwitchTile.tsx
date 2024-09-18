import { FormControlLabel, Switch } from '@mui/material';
import React from 'react';
import { useState } from 'react';
// import { Switch } from '@headlessui/react';
import { FaBus } from 'react-icons/fa';
const SwitchTile = ({ label, subtitle, onChange }: { label: string; subtitle: string; onChange: (event: boolean) => void; }) => {
    const [enabled, setEnabled] = useState(false);

    // Handle toggle switch change
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.checked;
        setEnabled(value);
        onChange(value)
        // Capture the value and process it (e.g., send to a server or log)
        // console.log("Van student status changed:", value ? 'Van student' : 'Not a van student');
    };

    return (
        <div className="bg-blue-100 p-4 rounded-lg flex items-center justify-between w-full max-w-md">
            {/* Left Section: Icon and Text */}
            <div className="flex items-center space-x-3">
                <FaBus className="text-2xl text-gray-600" />
                <div>
                    <p className="font-semibold text-gray-800">
                        {label} <span className="text-red-500">*</span>
                    </p>
                    <p className="text-sm text-gray-500">
                        {subtitle}
                    </p>
                </div>
            </div>

            {/* Right Section: Toggle Switch */}
            <FormControlLabel
                control={
                    <Switch
                        checked={enabled}
                        onChange={handleChange}
                        color="primary"
                    />
                }
                label=""
            />
        </div>
    );
};

export default SwitchTile;