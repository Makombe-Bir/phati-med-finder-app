
import React, { useState, useEffect } from 'react';
import { MapPin, AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface LocationDetectorProps {
  onDetectionComplete: () => void;
}

const LocationDetector = ({ onDetectionComplete }: LocationDetectorProps) => {
  const [showPopup, setShowPopup] = useState(false);
  const [isDetecting, setIsDetecting] = useState(true);

  useEffect(() => {
    // Check if location detection was already done
    const hasDetected = localStorage.getItem('locationDetected');
    if (hasDetected) {
      onDetectionComplete();
      return;
    }

    // Simulate location detection with a delay
    const detectLocation = async () => {
      setIsDetecting(true);
      
      // Wait 2 seconds to simulate detection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, always show the popup since we're not in Goma
      // In real implementation, you would use navigator.geolocation
      
      setIsDetecting(false);
      setShowPopup(true);
    };

    detectLocation();
  }, [onDetectionComplete]);

  const handleContinue = () => {
    localStorage.setItem('locationDetected', 'true');
    setShowPopup(false);
    onDetectionComplete();
  };

  if (isDetecting) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-green-600 animate-pulse" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Detecting Your Location</h3>
            <p className="text-gray-600">
              We're checking if you're in our operational area...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg mx-4">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Outside Operational Area
              </h3>
              <p className="text-gray-700 mb-4">
                Oops, we couldn't detect your location. It seems you're outside Goma (DRC), our operational city. 
                Therefore, you are being redirected to the demo version, as we couldn't find any nearby partner pharmacies.
              </p>
              <p className="text-sm text-gray-600 mb-6">
                <strong>Demo Mode:</strong> You can explore all features, but reservations and reports are simulated.
              </p>
              <div className="flex gap-3">
                <Button 
                  onClick={handleContinue}
                  className="bg-green-500 hover:bg-green-600 flex-1"
                >
                  Continue to Demo
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleContinue}
                  size="sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationDetector;
