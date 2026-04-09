import React from 'react';

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-10">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
  </div>
);

export const ProgressBar = ({ progress }) => (
  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 overflow-hidden">
    <div 
      className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
      style={{ width: `${progress}%` }}
    />
  </div>
);

export const AnimatedProgress = () => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => prev >= 100 ? 0 : prev + 10);
    }, 200);
    return () => clearInterval(timer);
  }, []);

  return <ProgressBar progress={progress} />;
};
