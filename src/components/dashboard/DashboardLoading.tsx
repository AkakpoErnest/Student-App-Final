import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';

const DashboardLoading = () => {
  const [showTimeout, setShowTimeout] = useState(false);
  const [loadingTime, setLoadingTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingTime(prev => {
        if (prev >= 10) {
          setShowTimeout(true);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  if (showTimeout) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Timeout</h2>
          <p className="text-gray-600 mb-6">
            The dashboard is taking longer than expected to load. This might be due to Firebase connection issues.
          </p>
          <div className="space-y-3">
            <Button onClick={handleRetry} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Loading
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/auth'} className="w-full">
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Dashboard</h2>
        <p className="text-gray-600 mb-2">Setting up your student workspace...</p>
        <p className="text-sm text-gray-500">Loading time: {loadingTime}s</p>
        {loadingTime > 5 && (
          <p className="text-sm text-orange-600 mt-2">
            This is taking longer than usual. Please wait...
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardLoading;
