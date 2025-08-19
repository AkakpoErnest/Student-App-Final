
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useOpportunityForm } from '@/hooks/useOpportunityForm';
import OpportunityTypeSelector from '@/components/opportunity/OpportunityTypeSelector';
import OpportunityFormFields from '@/components/opportunity/OpportunityFormFields';
import UniversityVerification from '@/components/UniversityVerification';
import { getCurrentUser, getProfile } from '@/integrations/firebase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Clock, Edit, Eye } from 'lucide-react';
import TokenClaimNotification from '@/components/TokenClaimNotification';

interface PostOpportunityProps {
  onSuccess: () => void;
}

const PostOpportunity = ({ onSuccess }: PostOpportunityProps) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showTokenNotification, setShowTokenNotification] = useState(false);
  const [tokensEarned, setTokensEarned] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editOpportunity, setEditOpportunity] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const {
    formData,
    loading: formLoading,
    uploadProgress,
    handleInputChange,
    handleSubmit,
    getAvailableCategories,
    tokensEarned: formTokensEarned,
    isEditing: formIsEditing
  } = useOpportunityForm(() => {
    // Show token notification only for new posts, not edits
    if (!formIsEditing) {
      setTokensEarned(formTokensEarned);
      setShowTokenNotification(true);
    }
    
    // Navigate to marketplace after successful posting/editing
    navigate('/marketplace');
    onSuccess();
  }, editOpportunity);

  useEffect(() => {
    fetchProfile();
    
    // Check if we're in edit mode
    const searchParams = new URLSearchParams(location.search);
    const editId = searchParams.get('edit');
    
    if (editId && location.state?.editOpportunity) {
      setIsEditing(true);
      setEditOpportunity(location.state.editOpportunity);
      console.log('Editing opportunity:', location.state.editOpportunity);
    }
  }, [location]);

  const fetchProfile = async () => {
    try {
      const user = getCurrentUser();
      if (!user) return;

      const { profile, error } = await getProfile(user.uid);

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Only allow posting for verified users
  const canPost = profile?.verification_status === 'verified';
  const isVerified = profile?.verification_status === 'verified';
  const isSubmitted = profile?.verification_status === 'submitted' || profile?.verification_status === 'pending';

  return (
    <div className="space-y-6">
      <UniversityVerification 
        onVerificationComplete={fetchProfile}
        currentProfile={profile}
      />
      
      {canPost ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {formIsEditing ? (
                <>
                  <Edit className="w-5 h-5" />
                  Edit Opportunity
                </>
              ) : (
                'Post Opportunity'
              )}
            </CardTitle>
            <CardDescription>
              {formIsEditing 
                ? 'Update your opportunity details'
                : 'Create a new listing for jobs, internships, or items'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Data Persistence Notice */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 text-blue-600">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm text-blue-800">
                    <strong>Auto-save enabled:</strong> Your form data is automatically saved. You can switch tabs and return without losing your work.
                  </p>
                </div>
              </div>

              <OpportunityTypeSelector
                selectedType={formData.opportunity_type}
                onTypeChange={(type) => handleInputChange('opportunity_type', type)}
              />

              <OpportunityFormFields
                formData={formData}
                onInputChange={handleInputChange}
                getAvailableCategories={getAvailableCategories}
              />

              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={formLoading || !formData.opportunity_type}
                >
                  {formLoading ? (formIsEditing ? 'Updating...' : 'Publishing...') : (formIsEditing ? 'Update Opportunity' : 'Publish')}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    if (confirm('Are you sure you want to clear all form data? This action cannot be undone.')) {
                      // Clear the form data
                      localStorage.removeItem('opportunityFormData');
                      window.location.reload(); // Simple way to reset the form
                    }
                  }}
                  disabled={formLoading}
                >
                  Clear Form
                </Button>
              </div>

              {/* Upload Progress Display */}
              {formLoading && uploadProgress && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-800">{uploadProgress}</p>
                        <p className="text-xs text-blue-600">Please wait, this may take a few moments...</p>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                    </div>
                    
                    {/* Upload Tips */}
                    <div className="text-xs text-blue-700 bg-blue-100 p-2 rounded">
                      <p><strong>💡 Upload Tips:</strong></p>
                      <ul className="mt-1 space-y-1">
                        <li>• Smaller images upload faster</li>
                        <li>• JPG/PNG files work best</li>
                        <li>• Keep files under 5MB</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Post Opportunity</CardTitle>
            <CardDescription>
              Complete verification to unlock opportunity posting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {isSubmitted ? 'Verification Under Review' : 'Verification Required'}
              </h3>
              <p className="text-gray-600 mb-4">
                {isSubmitted 
                  ? "Your verification is being reviewed. You'll be able to post opportunities once approved."
                  : "Please complete your university verification to start posting opportunities."
                }
              </p>
              {!isSubmitted && (
                <Button asChild>
                  <Link to="/dashboard?tab=profile">
                    Complete Verification
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Token Claim Notification */}
      <TokenClaimNotification
        isVisible={showTokenNotification}
        onClose={() => setShowTokenNotification(false)}
        tokensEarned={tokensEarned}
        reason="posting an opportunity"
      />
    </div>
  );
};

export default PostOpportunity;
