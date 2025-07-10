
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';

const AnimatedCityText = () => {
  const cities = [
    { name: 'Goma', isSoon: false },
    { name: 'Bukavu', isSoon: false },
    { name: 'Lubumbashi', isSoon: false },
    { name: 'Kinshasa', isSoon: true }
  ];

  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentCityIndex((prev) => (prev + 1) % cities.length);
        setIsVisible(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentCity = cities[currentCityIndex];

  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={`transition-all duration-300 ease-in-out ${
          isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-2'
        }`}
      >
        {currentCity.name}
      </span>
      {currentCity.isSoon && (
        <Badge
          variant="secondary"
          className={`text-xs bg-green-200 text-green-800 animate-pulse transition-all duration-300 ease-in-out ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-2'
          }`}
        >
          Soon
        </Badge>
      )}
    </span>
  );
};

export default AnimatedCityText;
