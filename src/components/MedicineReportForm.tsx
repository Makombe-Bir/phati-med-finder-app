
import React, { useState, useEffect } from 'react';
import { AlertTriangle, FileText, Send, Loader2, WifiOff, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { submitQualityReport, getUserReports, onlineStatusListener, MEDICINE_NAMES, PHARMACY_NAMES } from '@/services/dataService';

interface ReportFormData {
  medicineName: string;
  pharmacyName: string;
  location: string;
  issueType: string;
  description: string;
  anonymous: boolean;
  contactInfo: string;
}

const MedicineReportForm = () => {
  const { toast } = useToast();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userReports, setUserReports] = useState<any[]>([]);
  const [medicineSearchResults, setMedicineSearchResults] = useState<string[]>([]);
  const [pharmacySearchResults, setPharmacySearchResults] = useState<string[]>([]);
  const [showMedicineResults, setShowMedicineResults] = useState(false);
  const [showPharmacyResults, setShowPharmacyResults] = useState(false);
  const [formData, setFormData] = useState<ReportFormData>({
    medicineName: '',
    pharmacyName: '',
    location: 'Goma', // Default to Goma
    issueType: '',
    description: '',
    anonymous: false,
    contactInfo: ''
  });

  const issueTypes = [
    { id: 'packaging', label: 'Suspicious Packaging', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'appearance', label: 'Wrong Appearance/Color', color: 'bg-orange-100 text-orange-800' },
    { id: 'effectiveness', label: 'No Effect/Ineffective', color: 'bg-red-100 text-red-800' },
    { id: 'side-effects', label:'Unexpected Side Effects', color: 'bg-purple-100 text-purple-800' },
    { id: 'expiry', label: 'Expired Medicine', color: 'bg-gray-100 text-gray-800' },
    { id: 'counterfeit', label: 'Suspected Counterfeit', color: 'bg-red-100 text-red-800' }
  ];

  // Monitor online status and load user reports
  useEffect(() => {
    const cleanup = onlineStatusListener(setIsOnline);
    const reports = getUserReports();
    setUserReports(reports);
    return cleanup;
  }, []);

  const handleInputChange = (field: keyof ReportFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMedicineSearch = (value: string) => {
    setFormData(prev => ({ ...prev, medicineName: value }));
    
    if (value.length > 0) {
      const filtered = MEDICINE_NAMES.filter(name => 
        name.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setMedicineSearchResults(filtered);
      setShowMedicineResults(true);
    } else {
      setShowMedicineResults(false);
    }
  };

  const handlePharmacySearch = (value: string) => {
    setFormData(prev => ({ ...prev, pharmacyName: value }));
    
    if (value.length > 0) {
      const filtered = PHARMACY_NAMES.filter(name => 
        name.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setPharmacySearchResults(filtered);
      setShowPharmacyResults(true);
    } else {
      setShowPharmacyResults(false);
    }
  };

  const selectMedicine = (medicine: string) => {
    setFormData(prev => ({ ...prev, medicineName: medicine }));
    setShowMedicineResults(false);
  };

  const selectPharmacy = (pharmacy: string) => {
    setFormData(prev => ({ ...prev, pharmacyName: pharmacy }));
    setShowPharmacyResults(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isOnline) {
      toast({
        title: "You're offline",
        description: "Report submission requires an internet connection.",
        variant: "destructive"
      });
      return;
    }
    
    // Basic validation
    if (!formData.medicineName || !formData.issueType || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const report = await submitQualityReport(formData);
      
      toast({
        title: "Report Submitted Successfully",
        description: `Thank you for helping keep medicines safe. Report ID: ${report.id}. We will investigate this report.`,
      });

      // Update user reports list
      const updatedReports = getUserReports();
      setUserReports(updatedReports);

      // Reset form
      setFormData({
        medicineName: '',
        pharmacyName: '',
        location: 'Goma',
        issueType: '',
        description: '',
        anonymous: false,
        contactInfo: ''
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Failed to submit report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {!isOnline && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <WifiOff className="w-5 h-5 text-red-600" />
              <p className="text-red-800">
                <strong>You're offline.</strong> Report submission requires an internet connection.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Report Medicine Quality Issues</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Help protect your community by reporting substandard or falsified medicines. 
          Your report helps authorities take action against dangerous counterfeit drugs.
        </p>
      </div>

      {/* User Reports Summary */}
      {userReports.length > 0 && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-800">
                <strong>Your Impact:</strong> You have submitted {userReports.length} quality report{userReports.length !== 1 ? 's' : ''}. 
                Thank you for helping improve medicine safety!
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mb-6 border-orange-200 bg-orange-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-orange-800 mb-2">Important Notice</h3>
              <p className="text-orange-700 mb-3">
                If you suspect you've taken a dangerous medicine, seek medical attention immediately. 
                This report helps prevent future incidents.
              </p>
              <p className="text-sm text-orange-600">
                <strong>Most commonly reported:</strong> Oral antibiotics (Amoxicillin, Ciprofloxacin, Azithromycin)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Medicine Quality Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Medicine Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Medicine Information</h3>
              
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medicine Name *
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Amoxicillin 500mg capsules"
                  value={formData.medicineName}
                  onChange={(e) => handleMedicineSearch(e.target.value)}
                  onBlur={() => setTimeout(() => setShowMedicineResults(false), 200)}
                  onFocus={() => formData.medicineName && setShowMedicineResults(true)}
                  required
                  disabled={isSubmitting}
                />
                {showMedicineResults && medicineSearchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                    {medicineSearchResults.map((medicine, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => selectMedicine(medicine)}
                      >
                        {medicine}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pharmacy Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Where did you get this medicine?"
                    value={formData.pharmacyName}
                    onChange={(e) => handlePharmacySearch(e.target.value)}
                    onBlur={() => setTimeout(() => setShowPharmacyResults(false), 200)}
                    onFocus={() => formData.pharmacyName && setShowPharmacyResults(true)}
                    disabled={isSubmitting}
                  />
                  {showPharmacyResults && pharmacySearchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                      {pharmacySearchResults.map((pharmacy, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => selectPharmacy(pharmacy)}
                        >
                          {pharmacy}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) => handleInputChange('location', value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Goma">Goma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Issue Type */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">What's the issue? *</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {issueTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleInputChange('issueType', type.id)}
                    disabled={isSubmitting}
                    className={`p-3 text-left border-2 rounded-lg transition-colors ${
                      formData.issueType === type.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Badge className={`${type.color} mb-2`}>
                      {type.label}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Description *
              </label>
              <Textarea
                placeholder="Please describe the issue in detail. What did you notice? When did you notice it? Any symptoms or effects?"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={formData.anonymous}
                  onChange={(e) => handleInputChange('anonymous', e.target.checked)}
                  className="rounded border-gray-300"
                  disabled={isSubmitting}
                />
                <label htmlFor="anonymous" className="text-sm text-gray-700">
                  Submit this report anonymously
                </label>
              </div>

              {!formData.anonymous && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Information (Optional)
                  </label>
                  <Input
                    type="text"
                    placeholder="Phone number or email for follow-up"
                    value={formData.contactInfo}
                    onChange={(e) => handleInputChange('contactInfo', e.target.value)}
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    We may contact you for additional information about your report
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="bg-green-500 hover:bg-green-600 flex items-center gap-2"
                disabled={isSubmitting || !isOnline}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting Report...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Report
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormData({
                  medicineName: '',
                  pharmacyName: '',
                  location: 'Goma',
                  issueType: '',
                  description: '',
                  anonymous: false,
                  contactInfo: ''
                })}
                disabled={isSubmitting}
              >
                Clear Form
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Safety Information */}
      <Card className="mt-6 border-green-200 bg-green-50">
        <CardContent className="p-6">
          <h3 className="font-semibold text-green-800 mb-3">Your Safety Matters</h3>
          <div className="space-y-2 text-sm text-green-700">
            <p>• Always check medicine packaging for tampering or unusual appearance</p>
            <p>• Buy medicines only from licensed pharmacies</p>
            <p>• If a medicine doesn't work as expected, consult a healthcare provider</p>
            <p>• Keep medicine boxes and receipts for reporting purposes</p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      {userReports.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Your Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userReports.slice(-3).reverse().map((report) => (
                <div key={report.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{report.medicineName}</p>
                      <p className="text-sm text-gray-600">Report ID: {report.id}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      {report.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MedicineReportForm;
