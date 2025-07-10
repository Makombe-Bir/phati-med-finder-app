
// Simulated data for the platform
const MEDICINES_DATA = [
  {
    id: '1',
    name: 'Paracetamol',
    genericName: 'Acetaminophen',
    strength: '500mg',
    form: 'Tablets',
    price: '2,500 FC',
    inStock: true,
    stockLevel: 'high' as const,
    description: 'Pain relief and fever reducer',
    manufacturer: 'Pharma Plus',
    expiryDate: '2025-12-31',
    pharmacies: [
      { id: '1', name: 'Pharmacie Centrale', distance: '0.8 km', rating: 4.8, stockCount: 45, address: 'Avenue de la Paix, Goma', phone: '+243 123 456 789' },
      { id: '2', name: 'Pharmacie Sainte-Anne', distance: '1.2 km', rating: 4.6, stockCount: 23, address: 'Rue du Marché, Goma', phone: '+243 987 654 321' },
      { id: '3', name: 'Pharmacie Moderne', distance: '2.1 km', rating: 4.7, stockCount: 12, address: 'Boulevard Kanyamuhanga, Goma', phone: '+243 456 789 123' }
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
    stockLevel: 'medium' as const,
    description: 'Antibiotic for bacterial infections',
    manufacturer: 'MediCongo',
    expiryDate: '2025-08-15',
    pharmacies: [
      { id: '1', name: 'Pharmacie Centrale', distance: '0.8 km', rating: 4.8, stockCount: 8, address: 'Avenue de la Paix, Goma', phone: '+243 123 456 789' },
      { id: '4', name: 'Pharmacie du Marché', distance: '1.5 km', rating: 4.5, stockCount: 15, address: 'Marché Central, Bukavu', phone: '+243 321 654 987' }
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
    stockLevel: 'low' as const,
    description: 'Anti-inflammatory and pain relief',
    manufacturer: 'HealthCare Ltd',
    expiryDate: '2024-06-30',
    pharmacies: []
  },
  {
    id: '4',
    name: 'Aspirin',
    genericName: 'Acetylsalicylic Acid',
    strength: '100mg',
    form: 'Tablets',
    price: '1,800 FC',
    inStock: true,
    stockLevel: 'high' as const,
    description: 'Blood thinner and pain relief',
    manufacturer: 'Pharma Plus',
    expiryDate: '2026-03-20',
    pharmacies: [
      { id: '2', name: 'Pharmacie Sainte-Anne', distance: '1.2 km', rating: 4.6, stockCount: 67, address: 'Rue du Marché, Goma', phone: '+243 987 654 321' },
      { id: '5', name: 'Pharmacie Nouvelle', distance: '3.2 km', rating: 4.4, stockCount: 34, address: 'Quartier Himbi, Bukavu', phone: '+243 789 123 456' }
    ]
  },
  {
    id: '5',
    name: 'Metformin',
    genericName: 'Metformin Hydrochloride',
    strength: '500mg',
    form: 'Tablets',
    price: '12,500 FC',
    inStock: true,
    stockLevel: 'medium' as const,
    description: 'Diabetes medication',
    manufacturer: 'DiabetCare',
    expiryDate: '2025-11-10',
    pharmacies: [
      { id: '1', name: 'Pharmacie Centrale', distance: '0.8 km', rating: 4.8, stockCount: 19, address: 'Avenue de la Paix, Goma', phone: '+243 123 456 789' }
    ]
  }
];

const AI_RESPONSES = [
  {
    query: 'headache',
    response: 'For headache relief, I recommend Paracetamol 500mg or Ibuprofen 400mg. Paracetamol is gentler on the stomach and suitable for most people. Take 1-2 tablets every 4-6 hours as needed.',
    recommendedMedicines: ['1', '3']
  },
  {
    query: 'fever',
    response: 'For fever reduction, Paracetamol is very effective and safe. Take 500mg every 4-6 hours. Stay hydrated and rest. If fever persists above 39°C or lasts more than 3 days, consult a doctor.',
    recommendedMedicines: ['1']
  },
  {
    query: 'infection',
    response: 'For bacterial infections, Amoxicillin is commonly prescribed. However, antibiotics should only be used under medical supervision. Please consult a healthcare provider for proper diagnosis and dosage.',
    recommendedMedicines: ['2']
  },
  {
    query: 'diabetes',
    response: 'For Type 2 diabetes management, Metformin is often the first-line treatment. It helps control blood sugar levels. This medication requires regular monitoring and should be prescribed by a doctor.',
    recommendedMedicines: ['5']
  }
];

// Utility functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const checkOnlineStatus = () => {
  if (!navigator.onLine) {
    throw new Error('You are currently offline. Please check your internet connection and try again.');
  }
};

// API simulation functions
export const searchMedicines = async (query: string) => {
  checkOnlineStatus();
  await delay(800 + Math.random() * 700); // 800-1500ms delay
  
  if (!query.trim()) {
    return MEDICINES_DATA;
  }
  
  const searchTerm = query.toLowerCase();
  return MEDICINES_DATA.filter(medicine => 
    medicine.name.toLowerCase().includes(searchTerm) ||
    medicine.genericName.toLowerCase().includes(searchTerm) ||
    medicine.description.toLowerCase().includes(searchTerm)
  );
};

export const getMedicineById = async (id: string) => {
  checkOnlineStatus();
  await delay(300 + Math.random() * 200);
  
  return MEDICINES_DATA.find(medicine => medicine.id === id) || null;
};

export const getAIResponse = async (query: string) => {
  checkOnlineStatus();
  await delay(1200 + Math.random() * 800); // Longer delay for AI processing
  
  const searchTerm = query.toLowerCase();
  const matchedResponse = AI_RESPONSES.find(response => 
    searchTerm.includes(response.query)
  );
  
  if (matchedResponse) {
    return {
      response: matchedResponse.response,
      recommendedMedicines: matchedResponse.recommendedMedicines.map(id => 
        MEDICINES_DATA.find(med => med.id === id)
      ).filter(Boolean)
    };
  }
  
  // Default AI response
  return {
    response: `I understand you're asking about "${query}". Based on your symptoms, I recommend consulting with a healthcare provider for proper diagnosis. In the meantime, you can search our pharmacy network for common medications that might help.`,
    recommendedMedicines: []
  };
};

export const reserveMedicine = async (medicineId: string, pharmacyId: string, quantity: number = 1) => {
  checkOnlineStatus();
  await delay(1000 + Math.random() * 500);
  
  // Simulate successful reservation
  const reservationId = `RES-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Store reservation in localStorage
  const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
  const newReservation = {
    id: reservationId,
    medicineId,
    pharmacyId,
    quantity,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
  };
  
  reservations.push(newReservation);
  localStorage.setItem('reservations', JSON.stringify(reservations));
  
  return newReservation;
};

export const submitQualityReport = async (reportData: any) => {
  checkOnlineStatus();
  await delay(1500 + Math.random() * 1000);
  
  // Store report in localStorage
  const reports = JSON.parse(localStorage.getItem('qualityReports') || '[]');
  const newReport = {
    id: `QR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...reportData,
    status: 'submitted',
    createdAt: new Date().toISOString()
  };
  
  reports.push(newReport);
  localStorage.setItem('qualityReports', JSON.stringify(reports));
  
  return newReport;
};

export const getUserReservations = () => {
  return JSON.parse(localStorage.getItem('reservations') || '[]');
};

export const getUserReports = () => {
  return JSON.parse(localStorage.getItem('qualityReports') || '[]');
};

// Simulate network status changes
export const onlineStatusListener = (callback: (isOnline: boolean) => void) => {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};
