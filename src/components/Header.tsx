
import React from 'react';
import { Search, User, Bell, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
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
            <span className="text-sm">Kinshasa, DRC</span>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Bell className="w-4 h-4 mr-2" />
              <span>Notifications</span>
            </Button>
            <Button variant="outline" size="sm">
              <User className="w-4 h-4 mr-2" />
              <span>Account</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
