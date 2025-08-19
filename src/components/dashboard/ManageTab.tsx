
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, Eye } from 'lucide-react';
import OpportunityCard from '@/components/OpportunityCard';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';
import { toast } from 'sonner';

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
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (opportunityId: string) => {
    if (!confirm('Are you sure you want to delete this opportunity? This action cannot be undone.')) {
      return;
    }

    setDeletingId(opportunityId);
    try {
      await deleteDoc(doc(db, 'opportunities', opportunityId));
      toast.success('Opportunity deleted successfully!');
      onRefresh(); // Refresh the list
    } catch (error) {
      console.error('Error deleting opportunity:', error);
      toast.error('Failed to delete opportunity. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleView = (opportunity: Opportunity) => {
    // Navigate to the detailed view page
    navigate(`/product/${opportunity.id}`);
  };

  const handleEdit = (opportunity: Opportunity) => {
    // Navigate to edit form with opportunity data
    navigate(`/dashboard?tab=post&edit=${opportunity.id}`, { 
      state: { editOpportunity: opportunity } 
    });
  };

  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">My Opportunities</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300">
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
              onDelete={handleDelete}
              onEdit={handleEdit}
              onViewDetails={handleView}
              deleting={deletingId === opportunity.id}
            />
          ))}
          {myOpportunities.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
              <p className="mb-4">You haven't posted any opportunities yet.</p>
              <Button 
                onClick={() => navigate('/post-opportunity')}
                className="bg-gradient-to-r from-orange-600 to-teal-600 hover:from-orange-700 hover:to-teal-700 text-white px-6 py-2"
              >
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
