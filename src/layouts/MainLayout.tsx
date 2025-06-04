import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, Monitor, BellRing, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Sidebar from '../components/layout/Sidebar';

const MainLayout: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { theme, setTheme, isDarkMode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-64 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between h-16 px-4">
            {/* Left Section */}
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700 lg:hidden"
              >
                <Menu size={20} />
              </button>
              
              <div className="relative ml-4 lg:ml-0">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="search"
                  className="input py-1.5 pl-10 w-full max-w-[200px] lg:max-w-xs"
                  placeholder="Search..."
                />
              </div>
            </div>
            
            {/* Right Section */}
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
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
              
              {/* Notifications */}
              <button className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700">
                <div className="relative">
                  <BellRing size={20} />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                    3
                  </span>
                </div>
              </button>
              
              {/* User Avatar */}
              <div className="relative">
                <button className="flex items-center focus:outline-none">
                  <span className="hidden md:block mr-2 text-sm font-medium">{user?.name}</span>
                  <img
                    src={user?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2'}
                    alt={user?.name || 'User avatar'}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;