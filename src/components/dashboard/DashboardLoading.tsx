import React from 'react';

const DashboardLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
    <div className="flex flex-col items-center">
      <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
      <p className="text-lg text-gray-700 dark:text-gray-200">Loading dashboard...</p>
    </div>
  </div>
);

export default DashboardLoading;
