
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCurrentUser, getProfile, updateProfileData } from '@/integrations/firebase/client';
import { toast } from 'sonner';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface UniversityVerificationProps {
  onVerificationComplete: () => void;
  currentProfile: any;
}

const UniversityVerification = ({ onVerificationComplete, currentProfile }: UniversityVerificationProps) => {
  const [formData, setFormData] = useState({
    university: '',
    studentId: '',
    fullName: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);

  const universities = [
    'University of Ghana (UG)',
    'Kwame Nkrumah University of Science and Technology (KNUST)',
    'University of Cape Coast (UCC)',
    'Ghana Institute of Management and Public Administration (GIMPA)',
    'Ashesi University',
    'University for Development Studies (UDS)',
    'University of Education, Winneba (UEW)',
    'Ho Technical University (HTU)'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = getCurrentUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await updateProfileData(user.uid, {
        university: formData.university,
        full_name: formData.fullName,
        phone: formData.phone,
        verification_status: 'submitted', // Changed from 'pending' to 'submitted'
        student_id: formData.studentId
      });

      if (error) throw error;

      toast.success('Verification request submitted successfully');
      onVerificationComplete();
    } catch (error: any) {
      toast.error(error.message || 'Error submitting verification');
    } finally {
      setLoading(false);
    }
  };

  if (currentProfile?.verification_status === 'pending' || currentProfile?.verification_status === 'submitted') {
    return (
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-yellow-600" />
          <div>
            <h3 className="font-medium text-yellow-800">Verification Under Review</h3>
            <p className="text-sm text-yellow-600">Your verification is being reviewed. You'll be able to post opportunities once approved.</p>
            {/* Test button for development - remove in production */}
            <Button 
              size="sm" 
              variant="outline" 
              className="mt-3"
              onClick={async () => {
                try {
                  const { error } = await updateProfileData(currentProfile.id, {
                    verification_status: 'verified'
                  });
                  if (error) throw error;
                  toast.success('Verification approved! (Test mode)');
                  // Refresh the page to show updated status
                  window.location.reload();
                } catch (error) {
                  toast.error('Error updating verification status');
                }
              }}
            >
              🧪 Test: Approve Verification
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (currentProfile?.verification_status === 'verified') {
    return (
      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <div>
            <h3 className="font-medium text-green-800">Verified Student</h3>
            <p className="text-sm text-green-600">{currentProfile.university}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>University Verification</CardTitle>
        <CardDescription>
          Verify your student status to post opportunities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="university">University</Label>
            <Select value={formData.university} onValueChange={(value) => setFormData(prev => ({ ...prev, university: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select your university" />
              </SelectTrigger>
              <SelectContent>
                {universities.map((uni) => (
                  <SelectItem key={uni} value={uni}>{uni}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              placeholder="Your full name"
              required
            />
          </div>

          <div>
            <Label htmlFor="studentId">Student ID</Label>
            <Input
              id="studentId"
              value={formData.studentId}
              onChange={(e) => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
              placeholder="Your student ID"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Your phone number"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Verification'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UniversityVerification;
