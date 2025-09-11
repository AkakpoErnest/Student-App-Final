import React from 'react';

const MoMoDemo = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Mobile Money Integration Demo</h2>
      <p className="text-gray-600 mb-4">
        This demonstrates how Mobile Money (MoMo) integration works for all opportunity types:
      </p>
      
      <div className="space-y-4">
        <div className="border p-4 rounded">
          <h3 className="font-semibold text-green-600">✅ Items for Sale</h3>
          <p>Physical items use escrow with shipping address</p>
        </div>
        
        <div className="border p-4 rounded">
          <h3 className="font-semibold text-blue-600">✅ Jobs & Internships</h3>
          <p>Services use escrow with service location</p>
        </div>
        
        <div className="border p-4 rounded">
          <h3 className="font-semibold text-orange-600">✅ Mobile Money Support</h3>
          <p>MTN, Vodafone, Airtel integration ready</p>
        </div>
      </div>
    </div>
  );
};

export default MoMoDemo;







