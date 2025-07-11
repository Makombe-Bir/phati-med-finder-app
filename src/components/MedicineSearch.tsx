
import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Clock, CheckCircle, AlertCircle, AlertTriangle, Loader2, Wifi, WifiOff, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { searchMedicines, reserveMedicine, onlineStatusListener } from '@/services/dataService';

interface Medicine {
  id: string;
  name: string;
  genericName: string;
  strength: string;
  form: string;
  price: string;
  inStock: boolean;
  stockLevel: 'high' | 'medium' | 'low';
  description: string;
  manufacturer: string;
  expiryDate: string;
  pharmacies: Array<{
    id: string;
    name: string;
    distance: string;
    rating: number;
    stockCount: number;
    address: string;
    phone: string;
  }>;
}

interface MedicineSearchProps {
  initialQuery?: string;
}

const MedicineSearch = ({ initialQuery = '' }: MedicineSearchProps) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [reservingMedicine, setReservingMedicine] = useState<string | null>(null);
  const { toast } = useToast();

  // Monitor online status
  useEffect(() => {
    const cleanup = onlineStatusListener(setIsOnline);
    return cleanup;
  }, []);

  // Load initial medicines and handle initial query
  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    } else {
      handleSearch('');
    }
  }, [initialQuery]);

  const handleSearch = async (query: string = searchQuery) => {
    if (!isOnline) {
      toast({
        title: "You're offline",
        description: "Please check your internet connection to search medicines.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const results = await searchMedicines(query);
      setMedicines(results);
      
      if (query && results.length === 0) {
        toast({
          title: "No medicines found",
          description: `No medicines found for "${query}". Try a different search term.`,
        });
      }
    } catch (error) {
      toast({
        title: "Search failed",
        description: error instanceof Error ? error.message : "Failed to search medicines. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReserveMedicine = async (medicineId: string, pharmacyId: string, medicineName: string, pharmacyName: string) => {
    if (!isOnline) {
      toast({
        title: "You're offline",
        description: "Reservation requires an internet connection.",
        variant: "destructive"
      });
      return;
    }

    setReservingMedicine(`${medicineId}-${pharmacyId}`);
    try {
      const reservation = await reserveMedicine(medicineId, pharmacyId, 1);
      toast({
        title: "Medicine Reserved!",
        description: `${medicineName} has been reserved at ${pharmacyName}. Reservation Code: ${reservation.id}. Please collect within 24 hours.`,
      });
    } catch (error) {
      toast({
        title: "Reservation failed",
        description: error instanceof Error ? error.message : "Failed to reserve medicine. Please try again.",
        variant: "destructive"
      });
    } finally {
      setReservingMedicine(null);
    }
  };

  const handleQuickReport = (medicineName: string, pharmacyName?: string) => {
    toast({
      title: "Report Quality Issue",
      description: `Starting quality report for ${medicineName}${pharmacyName ? ` from ${pharmacyName}` : ''}. You'll be redirected to the full report form.`,
    });
    console.log('Quick report initiated for:', { medicineName, pharmacyName });
  };

  const handleGetDirections = (address: string, pharmacyName: string) => {
    // Generate Google Maps directions URL
    const encodedAddress = encodeURIComponent(`${address}, Goma, DRC`);
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    window.open(mapsUrl, '_blank');
    
    toast({
      title: "Opening Directions",
      description: `Getting directions to ${pharmacyName}`,
    });
  };

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
      {/* Online Status Indicator */}
      {!isOnline && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <WifiOff className="w-5 h-5 text-red-600" />
              <p className="text-red-800">
                <strong>You're offline.</strong> Some features may not be available. Please check your internet connection.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

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
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10 py-3 text-lg"
              disabled={loading || !isOnline}
            />
          </div>
          <Button 
            onClick={() => handleSearch()}
            disabled={loading || !isOnline}
            className="flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Search
              </>
            )}
          </Button>
        </div>

        {/* Quality Alert Banner */}
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-orange-800 text-sm">
                  <strong>Medicine Safety Notice:</strong> If you notice anything unusual about a medicine 
                  (packaging, color, effectiveness), please report it using the "Report Quality Issue" button. 
                  Help protect your community from substandard medicines.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-green-500" />
            <p className="text-gray-600">Searching medicines across 600+ pharmacies...</p>
          </div>
        </div>
      )}

      {/* Results */}
      {!loading && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {searchQuery ? (
                <>Found {medicines.length} medicine{medicines.length !== 1 ? 's' : ''} for "{searchQuery}"</>
              ) : (
                <>Available Medicines ({medicines.length})</>
              )}
            </h2>
            {isOnline && (
              <div className="flex items-center gap-2 text-green-600">
                <Wifi className="w-4 h-4" />
                <span className="text-sm">Live inventory</span>
              </div>
            )}
          </div>

          {medicines.map((medicine) => (
            <Card key={medicine.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{medicine.name}</CardTitle>
                    <p className="text-gray-600 mb-2">{medicine.genericName} • {medicine.strength} • {medicine.form}</p>
                    <p className="text-sm text-gray-500">{medicine.description}</p>
                    <p className="text-xs text-gray-400 mt-1">Manufacturer: {medicine.manufacturer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{medicine.price}</p>
                    <Badge className={getStockColor(medicine.stockLevel)}>
                      {medicine.inStock ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickReport(medicine.name)}
                    className="text-orange-600 border-orange-300 hover:bg-orange-50 flex items-center gap-2"
                  >
                    <AlertTriangle className="w-3 h-3" />
                    Report Quality Issue
                  </Button>
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
                              <p className="text-xs text-gray-500">{pharmacy.address}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuickReport(medicine.name, pharmacy.name)}
                              className="text-orange-600 border-orange-300 hover:bg-orange-50"
                            >
                              <AlertTriangle className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleGetDirections(pharmacy.address, pharmacy.name)}
                              className="text-blue-600 border-blue-300 hover:bg-blue-50"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                            <Button 
                              className="bg-green-500 hover:bg-green-600"
                              disabled={reservingMedicine === `${medicine.id}-${pharmacy.id}` || !isOnline}
                              onClick={() => handleReserveMedicine(medicine.id, pharmacy.id, medicine.name, pharmacy.name)}
                            >
                              {reservingMedicine === `${medicine.id}-${pharmacy.id}` ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                  Reserving...
                                </>
                              ) : (
                                'Reserve Now'
                              )}
                            </Button>
                          </div>
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
                    <Button variant="outline" className="ml-auto" disabled={!isOnline}>
                      Notify Me
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {!loading && medicines.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No medicines found</h3>
              <p className="text-gray-600">Try searching with different keywords</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MedicineSearch;
