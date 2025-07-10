
import React, { useState } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import MedicineSearch from '@/components/MedicineSearch';
import AIAssistant from '@/components/AIAssistant';
import MedicineReportForm from '@/components/MedicineReportForm';
import TrustIndicators from '@/components/TrustIndicators';
import LanguageSelector from '@/components/LanguageSelector';
import { Button } from '@/components/ui/button';
import { MessageCircle, Search, Bot, AlertTriangle } from 'lucide-react';

const Index = () => {
  const [activeSection, setActiveSection] = useState<'search' | 'ai' | 'report'>('search');
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'fr'>('en');

  const handleLanguageSelect = (language: 'en' | 'fr') => {
    setCurrentLanguage(language);
    console.log(`Language selected: ${language}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <LanguageSelector onLanguageSelect={handleLanguageSelect} />
      <Header />
      <HeroSection />
      
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 bg-white sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto">
            <Button
              variant={activeSection === 'search' ? 'default' : 'ghost'}
              onClick={() => setActiveSection('search')}
              className={`flex items-center gap-2 py-4 border-b-2 rounded-none flex-shrink-0 ${
                activeSection === 'search' 
                  ? 'border-green-500 bg-green-500 hover:bg-green-600' 
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Search className="w-4 h-4" />
              Search Medicines
            </Button>
            <Button
              variant={activeSection === 'ai' ? 'default' : 'ghost'}
              onClick={() => setActiveSection('ai')}
              className={`flex items-center gap-2 py-4 border-b-2 rounded-none flex-shrink-0 ${
                activeSection === 'ai' 
                  ? 'border-green-500 bg-green-500 hover:bg-green-600' 
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Bot className="w-4 h-4" />
              AI Assistant
            </Button>
            <Button
              variant={activeSection === 'report' ? 'default' : 'ghost'}
              onClick={() => setActiveSection('report')}
              className={`flex items-center gap-2 py-4 border-b-2 rounded-none flex-shrink-0 ${
                activeSection === 'report' 
                  ? 'border-green-500 bg-green-500 hover:bg-green-600' 
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              Report Quality Issues
            </Button>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="py-8">
        {activeSection === 'search' && <MedicineSearch />}
        {activeSection === 'ai' && (
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">AI-Powered Medicine Assistant</h2>
              <p className="text-xl text-gray-600">
                Get personalized medicine recommendations using natural language
              </p>
            </div>
            <AIAssistant />
          </div>
        )}
        {activeSection === 'report' && <MedicineReportForm />}
      </div>

      <TrustIndicators />

      {/* Footer CTA */}
      <div className="bg-green-500 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Healthcare Experience?</h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of patients who no longer waste time searching for medicine
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 text-lg"
              onClick={() => setActiveSection('search')}
            >
              Start Searching Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 text-lg"
              onClick={() => setActiveSection('ai')}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Talk to AI Assistant
            </Button>
          </div>
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-bold text-white">Phati Marketplace</span>
          </div>
          <p className="text-gray-400 mb-4">
            Making healthcare accessible, one pharmacy at a time.
          </p>
          <p className="text-sm text-gray-500">
            © 2024 Phati Marketplace. Improving healthcare access in the Democratic Republic of Congo.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
