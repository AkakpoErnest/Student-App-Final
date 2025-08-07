
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
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
    'Ho Technical University'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update({
          university: formData.university,
          full_name: formData.fullName,
          phone: formData.phone,
          verification_status: 'pending',
          student_id: formData.studentId
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Verification request submitted successfully');
      onVerificationComplete();
    } catch (error: any) {
      toast.error(error.message || 'Error submitting verification');
    } finally {
      setLoading(false);
    }
  };

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

  if (currentProfile?.verification_status === 'pending') {
    return (
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-yellow-600" />
          <div>
            <h3 className="font-medium text-yellow-800">Verification Pending</h3>
            <p className="text-sm text-yellow-600">Your verification is under review</p>
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
