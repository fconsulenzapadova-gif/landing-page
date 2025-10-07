import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BackButtonProps {
  to: string;
  label?: string;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  to, 
  label = "Indietro", 
  className = "" 
}) => {
  return (
    <div className={`fixed top-4 left-4 z-50 ${className}`}>
      <Link to={to}>
        <Button 
          variant="outline" 
          size="sm"
          className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg border-gray-200 hover:border-gray-300 transition-all duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {label}
        </Button>
      </Link>
    </div>
  );
};

export default BackButton;