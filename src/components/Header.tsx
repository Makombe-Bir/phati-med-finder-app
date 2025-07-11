
import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Header = () => {
  const handleGoLive = () => {
    // This could later redirect to signup/onboarding
    alert('Go Live feature coming soon! Sign up to access real-time inventory and reservations.');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Phati</span>
            <span className="text-sm text-gray-500 hidden sm:inline">Marketplace</span>
          </div>

          {/* Location */}
          <div className="hidden md:flex items-center space-x-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Goma, DRC</span>
          </div>

          {/* Demo Mode & Go Live */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                Demo Version
              </Badge>
              <Button 
                onClick={handleGoLive}
                size="sm" 
                className="bg-green-500 hover:bg-green-600 flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Go Live
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
