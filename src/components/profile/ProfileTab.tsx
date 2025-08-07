import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CheckCircle, AlertCircle, Clock, User as UserIcon, Mail, Phone, University, CreditCard, Edit, Upload as UploadIcon } from 'lucide-react';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  university: string;
  phone: string;
  wallet_address: string;
  verification_status: string;
  student_id: string;
  avatar_url: string;
}

interface ProfileTabProps {
  user: User;
}

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=User&background=random';

const ProfileTab = ({ user }: ProfileTabProps) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [verificationData, setVerificationData] = useState({
    university: '',
    studentId: '',
    fullName: '',
    phone: ''
  });
  const [avatarUploading, setAvatarUploading] = useState(false);

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

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setVerificationData({
          university: data.university || '',
          studentId: data.student_id || '',
          fullName: data.full_name || '',
          phone: data.phone || ''
        });
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast.error('Error loading profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: verificationData.fullName,
          phone: verificationData.phone,
          wallet_address: profile?.wallet_address || ''
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Profile updated successfully');
      setEditing(false);
      fetchProfile();
    } catch (error: any) {
      toast.error(error.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handleVerificationSubmit = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          university: verificationData.university,
          full_name: verificationData.fullName,
          phone: verificationData.phone,
          verification_status: 'pending',
          student_id: verificationData.studentId
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Verification request submitted successfully');
      fetchProfile();
    } catch (error: any) {
      toast.error(error.message || 'Error submitting verification');
    } finally {
      setSaving(false);
    }
  };

  const getVerificationStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-4 h-4 mr-1" />
            Verified
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="w-4 h-4 mr-1" />
            Pending
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <AlertCircle className="w-4 h-4 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            <AlertCircle className="w-4 h-4 mr-1" />
            Unverified
          </Badge>
        );
    }
  };

  // Handle avatar upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${user.id}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const publicUrl = data.publicUrl;
      // Update profile with new avatar URL
      const { error: updateError } = await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);
      if (updateError) throw updateError;
      toast.success('Profile picture updated!');
      fetchProfile();
    } catch (error: any) {
      toast.error(error.message || 'Error uploading profile picture');
    } finally {
      setAvatarUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={profile?.avatar_url || DEFAULT_AVATAR}
                  alt="Profile Avatar"
                  className="w-16 h-16 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                />
                <label className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 rounded-full p-1 cursor-pointer border border-gray-300 dark:border-gray-600 shadow" title="Upload new profile picture">
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={avatarUploading} />
                  <UploadIcon className="w-4 h-4 text-blue-600" />
                </label>
                {avatarUploading && <div className="absolute inset-0 bg-white/70 dark:bg-black/70 flex items-center justify-center rounded-full"><div className="animate-spin h-6 w-6 border-b-2 border-blue-600"></div></div>}
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="w-5 h-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Manage your personal information and account settings
                </CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing(!editing)}
            >
              <Edit className="w-4 h-4 mr-2" />
              {editing ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                {editing ? (
                  <Input
                    id="fullName"
                    value={verificationData.fullName}
                    onChange={(e) => setVerificationData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Your full name"
                  />
                ) : (
                  <div className="flex items-center mt-2 p-3 bg-gray-50 rounded-md">
                    <UserIcon className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-gray-900">{profile?.full_name || 'Not set'}</span>
                  </div>
                )}
              </div>
              
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="flex items-center mt-2 p-3 bg-gray-50 rounded-md">
                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-gray-900">{user.email}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                {editing ? (
                  <Input
                    id="phone"
                    value={verificationData.phone}
                    onChange={(e) => setVerificationData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Your phone number"
                  />
                ) : (
                  <div className="flex items-center mt-2 p-3 bg-gray-50 rounded-md">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-gray-900">{profile?.phone || 'Not set'}</span>
                  </div>
                )}
              </div>
              
              <div>
                <Label>Wallet Address</Label>
                <div className="flex items-center mt-2 p-3 bg-gray-50 rounded-md">
                  <CreditCard className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-gray-900 font-mono text-sm">
                    {profile?.wallet_address || 'Not connected'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {editing && (
            <div className="pt-4">
              <Button onClick={handleSaveProfile} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Verification Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <University className="w-5 h-5" />
                Student Verification
              </CardTitle>
              <CardDescription>
                Verify your student status to access all platform features
              </CardDescription>
            </div>
            {getVerificationStatusBadge(profile?.verification_status || 'unverified')}
          </div>
        </CardHeader>
        <CardContent>
          {profile?.verification_status === 'verified' ? (
            <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-green-800 mb-2">Verification Complete!</h3>
                  <p className="text-green-700 mb-4">
                    Your student status has been verified. You can now access all platform features including posting opportunities and making purchases.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-green-800">University:</span>
                      <p className="text-green-700">{profile.university}</p>
                    </div>
                    <div>
                      <span className="font-medium text-green-800">Student ID:</span>
                      <p className="text-green-700">{profile.student_id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : profile?.verification_status === 'pending' ? (
            <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Clock className="w-6 h-6 text-yellow-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-yellow-800 mb-2">Verification Under Review</h3>
                  <p className="text-yellow-700 mb-4">
                    Your verification request is being processed. This usually takes 1-2 business days.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-yellow-800">University:</span>
                      <p className="text-yellow-700">{profile.university}</p>
                    </div>
                    <div>
                      <span className="font-medium text-yellow-800">Student ID:</span>
                      <p className="text-yellow-700">{profile.student_id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-2">Verification Required</h3>
                    <p className="text-blue-700">
                      Complete student verification to post opportunities, make purchases, and access all platform features.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="university">University *</Label>
                  <Select value={verificationData.university} onValueChange={(value) => setVerificationData(prev => ({ ...prev, university: value }))}>
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
                  <Label htmlFor="studentId">Student ID *</Label>
                  <Input
                    id="studentId"
                    value={verificationData.studentId}
                    onChange={(e) => setVerificationData(prev => ({ ...prev, studentId: e.target.value }))}
                    placeholder="Your student ID"
                  />
                </div>

                <div>
                  <Label htmlFor="verificationFullName">Full Name *</Label>
                  <Input
                    id="verificationFullName"
                    value={verificationData.fullName}
                    onChange={(e) => setVerificationData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Your full name (as on student ID)"
                  />
                </div>

                <div>
                  <Label htmlFor="verificationPhone">Phone Number *</Label>
                  <Input
                    id="verificationPhone"
                    value={verificationData.phone}
                    onChange={(e) => setVerificationData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Your phone number"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  onClick={handleVerificationSubmit} 
                  disabled={saving || !verificationData.university || !verificationData.studentId || !verificationData.fullName || !verificationData.phone}
                  className="w-full sm:w-auto"
                >
                  {saving ? 'Submitting...' : 'Submit Verification Request'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Security */}
      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>
            Manage your account security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Password</h4>
              <p className="text-sm text-gray-600">Last updated: Never</p>
            </div>
            <Button variant="outline" size="sm">
              Change Password
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600">Add an extra layer of security</p>
            </div>
            <Button variant="outline" size="sm">
              Enable 2FA
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileTab;
