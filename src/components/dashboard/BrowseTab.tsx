
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import OpportunityCard from '@/components/OpportunityCard';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: string;
  opportunity_type: string;
  price: number;
  currency: string;
  location: string;
  university: string;
  requirements: string[];
  image_url: string;
  created_at: string;
  user_id: string;
}

interface BrowseTabProps {
  opportunities: Opportunity[];
}

const BrowseTab = ({ opportunities }: BrowseTabProps) => {
  const handlePayClick = (opportunity: Opportunity) => {
    console.log('Pay button clicked for opportunity:', opportunity.id);
    // TODO: Implement payment logic
  };

  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">Available Opportunities</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300">
          Browse jobs, internships, and items from students across Ghana
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              onPayClick={() => handlePayClick(opportunity)}
              showPayButton={true}
              isOwner={false}
            />
          ))}
          {opportunities.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
              <p className="mb-4">No opportunities available at the moment.</p>
              <Link to="/marketplace">
                <Button variant="outline">Browse Marketplace</Button>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BrowseTab;
