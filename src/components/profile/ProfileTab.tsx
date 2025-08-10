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
  full_name: string | null;
  email: string | null;
  university: string | null;
  phone: string | null;
  wallet_address: string | null;
  verification_status: string | null;
  student_id: string | null;
  avatar_url: string | null;
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
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    walletAddress: ''
  });
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
      console.log('Fetching profile for user:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      console.log('Profile fetch result:', { data, error });

      if (error && error.code !== 'PGRST116') {
        console.error('Profile fetch error:', error);
        throw error;
      }

      if (data) {
        setProfile(data);
        setFormData({
          fullName: data.full_name || '',
          phone: data.phone || '',
          walletAddress: data.wallet_address || ''
        });
        setVerificationData({
          university: data.university || '',
          studentId: data.student_id || '',
          fullName: data.full_name || '',
          phone: data.phone || ''
        });
      } else {
        // Create a new profile if it doesn't exist
        console.log('Creating new profile for user:', user.id);
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || '',
            verification_status: 'unverified',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (createError) {
          console.error('Profile creation error:', createError);
          throw createError;
        } else {
          console.log('Profile created successfully:', newProfile);
          setProfile(newProfile);
          setFormData({
            fullName: newProfile.full_name || '',
            phone: newProfile.phone || '',
            walletAddress: newProfile.wallet_address || ''
          });
        }
      }
    } catch (error: any) {
      console.error('Error in fetchProfile:', error);
      toast.error('Error loading profile: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      console.log('Saving profile for user:', user.id);
      console.log('Form data:', formData);

      const updateData = {
        full_name: formData.fullName.trim(),
        phone: formData.phone.trim(),
        wallet_address: formData.walletAddress.trim() || null,
        updated_at: new Date().toISOString()
      };

      console.log('Update data:', updateData);

      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .single();

      console.log('Profile update result:', { data, error });

      if (error) {
        console.error('Profile update error:', error);
        throw error;
      }

      setProfile(data);
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (error: any) {
      console.error('Error in handleSaveProfile:', error);
      toast.error('Error updating profile: ' + (error.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleVerificationSubmit = async () => {
    setSaving(true);
    try {
      console.log('Submitting verification for user:', user.id);
      console.log('Verification data:', verificationData);

      const updateData = {
        university: verificationData.university,
        full_name: verificationData.fullName.trim(),
        phone: verificationData.phone.trim(),
        verification_status: 'pending',
        student_id: verificationData.studentId.trim(),
        updated_at: new Date().toISOString()
      };

      console.log('Verification update data:', updateData);

      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .single();

      console.log('Verification update result:', { data, error });

      if (error) {
        console.error('Verification submit error:', error);
        throw error;
      }

      setProfile(data);
      toast.success('Verification request submitted successfully!');
    } catch (error: any) {
      console.error('Error in handleVerificationSubmit:', error);
      toast.error('Error submitting verification: ' + (error.message || 'Unknown error'));
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
      console.log('Uploading avatar for user:', user.id);
      
      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${user.id}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
        
      if (uploadError) {
        console.error('Avatar upload error:', uploadError);
        throw uploadError;
      }
      
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const publicUrl = data.publicUrl;
      
      console.log('Avatar uploaded, updating profile with URL:', publicUrl);
      
      // Update profile with new avatar URL
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();
        
      if (updateError) {
        console.error('Avatar URL update error:', updateError);
        throw updateError;
      }
      
      setProfile(updatedProfile);
      toast.success('Profile picture updated successfully!');
    } catch (error: any) {
      console.error('Error in handleAvatarChange:', error);
      toast.error('Error uploading profile picture: ' + (error.message || 'Unknown error'));
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
      {/* Debug Info */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div><strong>User ID:</strong> {user?.id}</div>
            <div><strong>User Email:</strong> {user?.email}</div>
            <div><strong>Profile Loaded:</strong> {profile ? 'Yes' : 'No'}</div>
            <div><strong>Profile ID:</strong> {profile?.id || 'N/A'}</div>
            <div><strong>Full Name:</strong> {profile?.full_name || 'N/A'}</div>
            <div><strong>Verification Status:</strong> {profile?.verification_status || 'N/A'}</div>
          </div>
        </CardContent>
      </Card>

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
                {avatarUploading && (
                  <div className="absolute inset-0 bg-white/70 dark:bg-black/70 flex items-center justify-center rounded-full">
                    <div className="animate-spin h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                )}
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
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
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
                  {user.email_confirmed_at && (
                    <CheckCircle className="w-4 h-4 ml-2 text-green-500" />
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                {editing ? (
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
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
                {editing ? (
                  <Input
                    value={formData.walletAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, walletAddress: e.target.value }))}
                    placeholder="Your blockchain wallet address"
                  />
                ) : (
                  <div className="flex items-center mt-2 p-3 bg-gray-50 rounded-md">
                    <CreditCard className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-gray-900 font-mono text-sm">
                      {profile?.wallet_address || 'Not connected'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {editing && (
            <div className="pt-4 flex gap-3">
              <Button onClick={handleSaveProfile} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="outline" onClick={() => {
                setEditing(false);
                // Reset form data to original values
                setFormData({
                  fullName: profile?.full_name || '',
                  phone: profile?.phone || '',
                  walletAddress: profile?.wallet_address || ''
                });
              }}>
                Cancel
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
              <p className="text-sm text-gray-600">Update your account password</p>
            </div>
            <Button variant="outline" size="sm">
              Change Password
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Email Verification</h4>
              <p className="text-sm text-gray-600">
                {user.email_confirmed_at ? 'Email verified' : 'Email not verified'}
              </p>
            </div>
            {!user.email_confirmed_at && (
              <Button variant="outline" size="sm">
                Verify Email
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileTab;