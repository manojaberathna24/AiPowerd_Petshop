import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="fixed left-6 top-6 z-50 flex items-center gap-3 glass-card px-3 py-2">
            <span className="text-xs font-semibold text-gray-300">
                {theme === 'dark' ? 'Dark' : 'Light'}
            </span>
            <button
                onClick={toggleTheme}
                className={`relative w-12 h-6 rounded-full transition-all ${theme === 'dark' ? 'bg-slate-700' : 'bg-blue-500'
                    }`}
                aria-label="Toggle theme"
            >
                <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-all flex items-center justify-center ${theme === 'dark' ? 'left-1' : 'left-7'
                        }`}
                >
                    {theme === 'dark' ? (
                        <FaMoon className="text-slate-700 text-xs" />
                    ) : (
                        <FaSun className="text-yellow-500 text-xs" />
                    )}
                </div>
            </button>
        </div>
    );
};

export default ThemeToggle;
