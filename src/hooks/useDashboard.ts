import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  signOutUser, 
  onAuthStateChange, 
  getCurrentUser, 
  getProfile, 
  getOpportunities as fetchFirebaseOpportunities,
  updateProfileData,
  User 
} from '@/integrations/firebase/client';
import { toast } from 'sonner';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  university: string;
  wallet_address: string;
  verification_status?: string;
}

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

export const useDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [myOpportunities, setMyOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = async (userId: string) => {
    try {
      const { profile, error } = await getProfile(userId);

      if (error) throw error;
      setProfile(profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchOpportunities = async () => {
    try {
      const { opportunities, error } = await fetchFirebaseOpportunities({ status: 'active' });

      if (error) throw error;
      setOpportunities(opportunities || []);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    }
  };

  const fetchMyOpportunities = async (userId: string) => {
    try {
      // For now, we'll fetch all opportunities and filter by user_id
      // In a real implementation, you'd want to create a composite index
      const { opportunities, error } = await fetchFirebaseOpportunities();
      
      if (error) throw error;
      const myOpps = opportunities.filter((opp: any) => opp.user_id === userId);
      setMyOpportunities(myOpps);
    } catch (error) {
      console.error('Error fetching my opportunities:', error);
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOutUser();
    if (error) {
      toast.error('Error signing out');
    } else {
      navigate('/'); // Redirect to home page after sign out
    }
  };

  const refreshData = () => {
    if (user) {
      fetchMyOpportunities(user.uid);
      fetchOpportunities();
    }
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const unsubscribe = onAuthStateChange((user) => {
      if (!user) {
        navigate('/');
      } else {
        setUser(user);
        ensureProfile(user);
        fetchOpportunities();
        fetchMyOpportunities(user.uid);
      }
    });

    // Check for existing session
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      ensureProfile(currentUser);
      fetchOpportunities();
      fetchMyOpportunities(currentUser.uid);
    } else {
      navigate('/auth');
    }
    
    // Set a timeout to prevent infinite loading
    timeoutId = setTimeout(() => {
      if (loading) {
        console.warn('Dashboard loading timeout - forcing loading to false');
        setLoading(false);
      }
    }, 15000); // 15 second timeout

    setLoading(false);

    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, [navigate]);

  // Ensure profile exists for user, create if missing
  const ensureProfile = async (user: User) => {
    try {
      const { profile, error } = await getProfile(user.uid);
        
      if (error && error === 'Profile not found') {
        // Profile doesn't exist, create it
        const profileData = {
          id: user.uid,
          full_name: user.displayName || '',
          email: user.email || '',
          verification_status: 'unverified',
          avatar_url: '',
          university: null,
          phone: null,
          wallet_address: null,
          student_id: null,
          tokens: 20,
          total_opportunities_posted: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const { error: insertError } = await updateProfileData(user.uid, profileData);
        
        if (insertError) {
          console.error('Error creating profile:', insertError);
          toast.error('Error creating user profile');
          return;
        }
        
        console.log('Profile created successfully');
        // Set the profile directly instead of fetching again
        setProfile(profileData);
      } else if (error) {
        console.error('Error fetching profile:', error);
        toast.error('Error loading user profile');
        return;
      } else if (profile) {
        // Profile exists, set it directly
        setProfile(profile);
      }
    } catch (error) {
      console.error('Error in ensureProfile:', error);
      toast.error('Error setting up user profile');
    }
  };

  return {
    user,
    profile,
    opportunities,
    myOpportunities,
    loading,
    handleSignOut,
    refreshData
  };
};
