
import React, { useState } from 'react';
import { Search, Filter, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Medicine {
  id: string;
  name: string;
  genericName: string;
  strength: string;
  form: string;
  price: string;
  inStock: boolean;
  stockLevel: 'high' | 'medium' | 'low';
  pharmacies: Array<{
    id: string;
    name: string;
    distance: string;
    rating: number;
    stockCount: number;
  }>;
}

const MedicineSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAI, setShowAI] = useState(false);

  // Mock data
  const medicines: Medicine[] = [
    {
      id: '1',
      name: 'Paracetamol',
      genericName: 'Acetaminophen',
      strength: '500mg',
      form: 'Tablets',
      price: '2,500 FC',
      inStock: true,
      stockLevel: 'high',
      pharmacies: [
        { id: '1', name: 'Pharmacie Centrale', distance: '0.8 km', rating: 4.8, stockCount: 45 },
        { id: '2', name: 'Pharmacie Sainte-Anne', distance: '1.2 km', rating: 4.6, stockCount: 23 },
        { id: '3', name: 'Pharmacie Moderne', distance: '2.1 km', rating: 4.7, stockCount: 12 }
      ]
    },
    {
      id: '2',
      name: 'Amoxicillin',
      genericName: 'Amoxicillin Trihydrate',
      strength: '250mg',
      form: 'Capsules',
      price: '8,000 FC',
      inStock: true,
      stockLevel: 'medium',
      pharmacies: [
        { id: '1', name: 'Pharmacie Centrale', distance: '0.8 km', rating: 4.8, stockCount: 8 },
        { id: '4', name: 'Pharmacie du Marché', distance: '1.5 km', rating: 4.5, stockCount: 15 }
      ]
    },
    {
      id: '3',
      name: 'Ibuprofen',
      genericName: 'Ibuprofen',
      strength: '400mg',
      form: 'Tablets',
      price: '3,200 FC',
      inStock: false,
      stockLevel: 'low',
      pharmacies: []
    }
  ];

  const getStockColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search medicines by name, symptom, or condition..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-3 text-lg"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
          <Button 
            onClick={() => setShowAI(!showAI)}
            className="bg-green-500 hover:bg-green-600 flex items-center gap-2"
          >
            🤖 AI Assistant
          </Button>
        </div>

        {/* AI Assistant Toggle */}
        {showAI && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🤖</span>
                </div>
                <div className="flex-1">
                  <p className="text-green-800 mb-2">
                    <strong>AI Assistant:</strong> I can help you find the right medicine! 
                    Try asking me something like:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="cursor-pointer hover:bg-green-200">
                      "I have a headache"
                    </Badge>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-green-200">
                      "Antibiotics for infection"
                    </Badge>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-green-200">
                      "Pain relief for children"
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Results */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Available Medicines {searchQuery && `for "${searchQuery}"`}
        </h2>

        {medicines.map((medicine) => (
          <Card key={medicine.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{medicine.name}</CardTitle>
                  <p className="text-gray-600">{medicine.genericName} • {medicine.strength} • {medicine.form}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">{medicine.price}</p>
                  <Badge className={getStockColor(medicine.stockLevel)}>
                    {medicine.inStock ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {medicine.inStock ? (
                <div className="space-y-4">
                  <p className="text-gray-700">Available at {medicine.pharmacies.length} nearby pharmacies:</p>
                  <div className="grid gap-3">
                    {medicine.pharmacies.map((pharmacy) => (
                      <div key={pharmacy.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <div>
                            <p className="font-medium">{pharmacy.name}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {pharmacy.distance}
                              </span>
                              <span>⭐ {pharmacy.rating}</span>
                              <span>{pharmacy.stockCount} in stock</span>
                            </div>
                          </div>
                        </div>
                        <Button className="bg-green-500 hover:bg-green-600">
                          Reserve Now
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="font-medium text-red-800">Currently out of stock</p>
                    <p className="text-red-600 text-sm">We'll notify you when it becomes available</p>
                  </div>
                  <Button variant="outline" className="ml-auto">
                    Notify Me
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MedicineSearch;
