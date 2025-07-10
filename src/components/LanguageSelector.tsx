
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface LanguageSelectorProps {
  onLanguageSelect: (language: 'en' | 'fr') => void;
}

const LanguageSelector = ({ onLanguageSelect }: LanguageSelectorProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already selected a language
    const savedLanguage = localStorage.getItem('preferred-language');
    
    if (!savedLanguage) {
      // Show popup after 2 seconds
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleLanguageSelect = (language: 'en' | 'fr', dontAskAgain = false) => {
    if (dontAskAgain) {
      localStorage.setItem('preferred-language', language);
    }
    onLanguageSelect(language);
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl animate-scale-in">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Choose Your Language / Choisissez votre langue
            </h3>
            <p className="text-sm text-gray-600">
              Select your preferred language for the best experience
            </p>
            <p className="text-sm text-gray-600">
              Sélectionnez votre langue préférée pour une meilleure expérience
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-3">
          <Button
            onClick={() => handleLanguageSelect('en')}
            className="w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white"
          >
            <span className="text-lg">🇺🇸</span>
            Continue in English
          </Button>
          
          <Button
            onClick={() => handleLanguageSelect('fr')}
            variant="outline"
            className="w-full flex items-center justify-center gap-3 border-green-500 text-green-600 hover:bg-green-50"
          >
            <span className="text-lg">🇫🇷</span>
            Continuer en français
          </Button>
          
          <div className="text-center pt-2">
            <button
              onClick={() => handleLanguageSelect('en', true)}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Don't ask again / Ne plus demander
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
