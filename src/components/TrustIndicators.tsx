
import React from 'react';
import { Shield, Clock, Star, Users, CheckCircle, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const TrustIndicators = () => {
  const stats = [
    { icon: Users, label: 'Active Patients', value: '400,000+', color: 'text-blue-600' },
    { icon: MapPin, label: 'Partner Pharmacies', value: '600+', color: 'text-green-600' },
    { icon: Clock, label: 'Avg. Reservation Time', value: '2 mins', color: 'text-purple-600' },
    { icon: Star, label: 'User Satisfaction', value: '4.8/5', color: 'text-yellow-600' }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Verified Pharmacies',
      description: 'All partner pharmacies are licensed and regulated by DRC health authorities'
    },
    {
      icon: Clock,
      title: 'Real-Time Updates',
      description: 'Live inventory tracking ensures accurate stock information'
    },
    {
      icon: CheckCircle,
      title: 'Secure Reservations',
      description: 'Your reservations are protected and guaranteed for 24 hours'
    }
  ];

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Stats Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Thousands</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join the growing community of patients who save time and get peace of mind with Phati
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Features */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Why Choose Phati?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-white">
            <CardContent className="p-8">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-lg text-gray-700 mb-4">
                "Phati saved me so much time! I used to visit 3-4 pharmacies just to find basic medicine for my family. 
                Now I know exactly where to go before I leave home."
              </blockquote>
              <div className="text-gray-600">
                <p className="font-medium">Marie Kabongo</p>
                <p className="text-sm">Mother of 3, Goma</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TrustIndicators;
