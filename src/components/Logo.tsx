import React from 'react';
import { Briefcase, DollarSign } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LOGO_URL = '/stufind-logo.png'; // Place the provided image in public/stufind-logo.png

const Logo = ({ className = '', size = 'md' }: LogoProps) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src={LOGO_URL}
        alt="StuFind Logo"
        className={`${iconSizes[size]} rounded-xl shadow-lg bg-white border-2 border-orange-100`}
        onError={(e) => {
          // Fallback if image doesn't exist
          e.currentTarget.style.display = 'none';
          e.currentTarget.nextElementSibling?.classList.remove('hidden');
        }}
      />
      <div className={`${iconSizes[size]} rounded-xl shadow-lg bg-gradient-to-br from-orange-500 to-cyan-600 flex items-center justify-center hidden`}>
        <Briefcase className={`w-1/2 h-1/2 text-white`} />
      </div>
      <div className="flex flex-col">
        <span className={`font-bold text-gradient ${sizeClasses[size]} leading-tight`}>
          StuFind
        </span>
        <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
          Students Financial Hub
        </span>
      </div>
    </div>
  );
};

export default Logo;
