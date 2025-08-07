
import React from 'react';
import { useNavigate } from 'react-router-dom';
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

interface ManageTabProps {
  myOpportunities: Opportunity[];
  onRefresh: () => void;
}

const ManageTab = ({ myOpportunities, onRefresh }: ManageTabProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Opportunities</CardTitle>
        <CardDescription>
          Manage the jobs and items you've posted
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myOpportunities.map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              showPayButton={false}
              isOwner={true}
            />
          ))}
          {myOpportunities.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              <p className="mb-4">You haven't posted any opportunities yet.</p>
              <Button onClick={() => navigate('/dashboard?tab=post')}>
                Post Your First Opportunity
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ManageTab;
