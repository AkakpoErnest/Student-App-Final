
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useOpportunityForm } from '@/hooks/useOpportunityForm';
import OpportunityTypeSelector from '@/components/opportunity/OpportunityTypeSelector';
import OpportunityFormFields from '@/components/opportunity/OpportunityFormFields';
import UniversityVerification from '@/components/UniversityVerification';
import { supabase } from '@/integrations/supabase/client';

interface PostOpportunityProps {
  onSuccess: () => void;
}

const PostOpportunity = ({ onSuccess }: PostOpportunityProps) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const {
    formData,
    loading: formLoading,
    handleInputChange,
    handleSubmit,
    getAvailableCategories
  } = useOpportunityForm(onSuccess);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const canPost = profile?.verification_status === 'verified' || profile?.verification_status === 'pending';

  return (
    <div className="space-y-6">
      <UniversityVerification 
        onVerificationComplete={fetchProfile}
        currentProfile={profile}
      />
      
      {canPost ? (
        <Card>
          <CardHeader>
            <CardTitle>Post Opportunity</CardTitle>
            <CardDescription>
              Create a new listing for jobs, internships, or items
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <OpportunityTypeSelector
                selectedType={formData.opportunity_type}
                onTypeChange={(type) => handleInputChange('opportunity_type', type)}
              />

              <OpportunityFormFields
                formData={formData}
                onInputChange={handleInputChange}
                getAvailableCategories={getAvailableCategories}
              />

              <Button 
                type="submit" 
                className="w-full" 
                disabled={formLoading || !formData.opportunity_type}
              >
                {formLoading ? 'Publishing...' : 'Publish'}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="p-6 text-center border border-gray-200 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Verification Required</h3>
          <p className="text-gray-600">Complete university verification to post opportunities</p>
        </div>
      )}
    </div>
  );
};

export default PostOpportunity;
