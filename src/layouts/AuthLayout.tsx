import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const AuthLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  
  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header with theme toggle */}
      <header className="w-full py-4 px-6 flex justify-end">
        <div className="relative group">
          <button className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700">
            {theme === 'light' && <Sun size={20} />}
            {theme === 'dark' && <Moon size={20} />}
            {theme === 'system' && <Monitor size={20} />}
          </button>
          
          <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center w-full px-4 py-2 text-sm ${
                theme === 'light' ? 'text-primary-600 bg-primary-50 dark:bg-gray-700' : 'text-gray-700 dark:text-gray-300'
              } hover:bg-gray-100 dark:hover:bg-gray-700`}
            >
              <Sun size={16} className="mr-2" />
              Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center w-full px-4 py-2 text-sm ${
                theme === 'dark' ? 'text-primary-600 bg-primary-50 dark:bg-gray-700' : 'text-gray-700 dark:text-gray-300'
              } hover:bg-gray-100 dark:hover:bg-gray-700`}
            >
              <Moon size={16} className="mr-2" />
              Dark
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`flex items-center w-full px-4 py-2 text-sm ${
                theme === 'system' ? 'text-primary-600 bg-primary-50 dark:bg-gray-700' : 'text-gray-700 dark:text-gray-300'
              } hover:bg-gray-100 dark:hover:bg-gray-700`}
            >
              <Monitor size={16} className="mr-2" />
              System
            </button>
          </div>
        </div>
      </header>
      
      {/* Auth Form Container */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary-600 dark:text-primary-500"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <polyline points="16 11 18 13 22 9"></polyline>
              </svg>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">TeamTasks</span>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
            <Outlet />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} TeamTasks. All rights reserved.
      </footer>
    </div>
  );
};

export default AuthLayout;