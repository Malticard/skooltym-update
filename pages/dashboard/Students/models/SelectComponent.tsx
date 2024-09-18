import { useState, useRef, useEffect } from 'react';

export type Option = {
    name: string;
    value: string;
};

type SelectComponentProps = {
    options: Option[];
    label: string;
    onSelect: (selectedValue: string) => void;
};

const SelectComponent = ({ options, label, onSelect }: SelectComponentProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [focusedOptionIndex, setFocusedOptionIndex] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredOptions = options.filter(option =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle selecting an option
    const handleOptionClick = (option: Option) => {
        setSelectedOption(option);
        onSelect(option.value);
        setDropdownOpen(false);
        setSearchTerm('');
    };

    // Handle keyboard navigation (up/down arrow, enter key)
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            setFocusedOptionIndex((prevIndex) =>
                prevIndex < filteredOptions.length - 1 ? prevIndex + 1 : 0
            );
        } else if (e.key === 'ArrowUp') {
            setFocusedOptionIndex((prevIndex) =>
                prevIndex > 0 ? prevIndex - 1 : filteredOptions.length - 1
            );
        } else if (e.key === 'Enter' && filteredOptions.length > 0) {
            handleOptionClick(filteredOptions[focusedOptionIndex]);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative w-full max-w-md mx-auto" ref={dropdownRef}>
            <div className="w-full">
                <label className="block mb-1 font-medium text-gray-700">{label}</label>
                <div
                    className="border border-gray-300 rounded-md p-2 flex justify-between items-center cursor-pointer focus:outline-none"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            setDropdownOpen(!dropdownOpen);
                        }
                    }}
                    aria-expanded={dropdownOpen}
                    role="button"
                    aria-haspopup="listbox"
                >
                    <span className="text-gray-600">
                        {selectedOption ? selectedOption.name : 'Select an option'}
                    </span>
                    <svg
                        className="w-4 h-4 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </div>
                {dropdownOpen && (
                    <div
                        className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10"
                        role="listbox"
                        onKeyDown={handleKeyDown}
                    >
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search..."
                            className="p-2 w-full border-b border-gray-300 focus:outline-none"
                        />
                        <ul className="max-h-40 overflow-y-auto">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option, index) => (
                                    <li
                                        key={option.value}
                                        className={`p-2 cursor-pointer hover:bg-gray-100 ${index === focusedOptionIndex ? 'bg-gray-100' : ''
                                            }`}
                                        onClick={() => handleOptionClick(option)}
                                        onMouseEnter={() => setFocusedOptionIndex(index)}
                                        aria-selected={index === focusedOptionIndex}
                                        role="option"
                                    >
                                        {option.name}
                                    </li>
                                ))
                            ) : (
                                <li className="p-2 text-gray-500">No options found</li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SelectComponent;
