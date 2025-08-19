import { useState, useEffect } from 'react';
import { db } from '@/integrations/firebase/client';
import { toast } from 'sonner';
import { User } from '@/integrations/firebase/client';
import { doc, getDoc, setDoc, collection, query, where, getDocs, addDoc, updateDoc } from 'firebase/firestore';

interface UserTokens {
  id: string;
  user_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

interface TokenClaim {
  id: string;
  user_id: string;
  claim_type: string;
  tokens_earned: number;
  claimed_at: string;
  claim_date: string;
}

interface ClaimableTask {
  type: string;
  title: string;
  description: string;
  tokens: number;
  isCompleted: boolean;
  canClaim: boolean;
}

export const useTokens = (user: User | null) => {
  const [userTokens, setUserTokens] = useState<UserTokens | null>(null);
  const [todayClaims, setTodayClaims] = useState<TokenClaim[]>([]);
  const [allTimeClaims, setAllTimeClaims] = useState<TokenClaim[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserTokens = async () => {
    if (!user) {
      console.log('No user found, skipping token fetch');
      return;
    }

    try {
      console.log('Fetching tokens for user:', user.uid);
      console.log('User object:', { id: user.uid, email: user.email });
      
      // First check if we can connect to Firebase
      const profileRef = doc(db, 'profiles', user.uid);
      const profileSnap = await getDoc(profileRef);

      if (!profileSnap.exists()) {
        console.error('Profile not found');
        throw new Error('Profile not found');
      }
      
      const tokenRef = doc(db, 'user_tokens', user.uid);
      const tokenSnap = await getDoc(tokenRef);

      console.log('Token fetch result:', { tokenSnap });

      if (!tokenSnap.exists()) {
        console.log('No token record found, creating one...');
        // Create initial token record
        const newTokenData = { 
          user_id: user.uid, 
          balance: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        await setDoc(tokenRef, newTokenData);
        setUserTokens({ id: user.uid, ...newTokenData });
      } else {
        console.log('Found existing token record:', tokenSnap.data());
        setUserTokens({ id: user.uid, ...tokenSnap.data() });
      }
    } catch (error) {
      console.error('Error in fetchUserTokens:', error);
      toast.error('Failed to load token balance');
    }
  };

  const fetchTodayClaims = async () => {
    if (!user) return;

    try {
      console.log('Fetching today claims for user:', user.uid);
      const today = new Date().toISOString().split('T')[0];
      
      const claimsRef = collection(db, 'token_claims');
      const q = query(
        claimsRef, 
        where('user_id', '==', user.uid),
        where('claim_date', '==', today)
      );
      
      const querySnapshot = await getDocs(q);
      const claims = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log('Today claims result:', { claims });
      setTodayClaims(claims);
    } catch (error) {
      console.error('Error in fetchTodayClaims:', error);
    }
  };

  const fetchAllTimeClaims = async () => {
    if (!user) return;

    try {
      console.log('Fetching all time claims for user:', user.uid);
      
      const claimsRef = collection(db, 'token_claims');
      const q = query(claimsRef, where('user_id', '==', user.uid));
      
      const querySnapshot = await getDocs(q);
      const claims = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log('All time claims result:', { claims });
      setAllTimeClaims(claims);
    } catch (error) {
      console.error('Error in fetchAllTimeClaims:', error);
    }
  };

  const claimTokens = async (claimType: string, tokensAmount: number) => {
    if (!user || !userTokens) {
      console.error('User or userTokens not available');
      toast.error('Unable to claim tokens. Please try again.');
      return false;
    }

    try {
      console.log('Claiming tokens:', { claimType, tokensAmount, userId: user.uid });
      const today = new Date().toISOString().split('T')[0];

      // Check if already claimed (for one-time claims like email verification)
      if (claimType === 'email_verification') {
        const existingClaim = allTimeClaims.find(claim => claim.claim_type === claimType);
        if (existingClaim) {
          toast.error('You have already claimed this reward!');
          return false;
        }
      } else {
        // For daily claims, check today's claims
        const existingClaim = todayClaims.find(claim => claim.claim_type === claimType);
        if (existingClaim) {
          toast.error('You have already claimed this reward today!');
          return false;
        }
      }

      // Insert claim record
      const claimId = `claim_${Date.now()}`;
      const claimData = {
        user_id: user.uid,
        claim_type: claimType,
        tokens_earned: tokensAmount,
        claim_date: today,
        claimed_at: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'token_claims', claimId), claimData);
      console.log('Claim record created:', claimData);

      // Update user balance
      const newBalance = userTokens.balance + tokensAmount;
      await updateDoc(doc(db, 'user_tokens', user.uid), { 
        balance: newBalance, 
        updated_at: new Date().toISOString() 
      });

      console.log('Balance updated:', newBalance);

      // Update local state
      setUserTokens({ ...userTokens, balance: newBalance });
      await fetchTodayClaims();
      await fetchAllTimeClaims();

      toast.success(`🎉 You earned ${tokensAmount} StuFind Tokens! You now have ${newBalance} tokens`, {
        duration: 4000,
      });
      return true;
    } catch (error) {
      console.error('Error claiming tokens:', error);
      toast.error('Failed to claim tokens. Please try again.');
      return false;
    }
  };

  const getClaimableTasks = (): ClaimableTask[] => {
    const isEmailVerified = user?.emailVerified ? true : false;
    const hasClaimedEmailVerification = allTimeClaims.some(claim => claim.claim_type === 'email_verification');
    const hasClaimedDailyToday = todayClaims.some(claim => claim.claim_type === 'daily');

    const tasks: ClaimableTask[] = [
      {
        type: 'daily',
        title: 'Daily Login Bonus',
        description: 'Claim your daily login bonus',
        tokens: 10,
        isCompleted: true,
        canClaim: !hasClaimedDailyToday
      },
      {
        type: 'email_verification',
        title: 'Email Verification',
        description: 'Verify your email address to earn tokens',
        tokens: 100,
        isCompleted: isEmailVerified,
        canClaim: isEmailVerified && !hasClaimedEmailVerification
      }
    ];

    return tasks;
  };

  const hasSignupBonus = () => {
    return allTimeClaims.some(claim => claim.claim_type === 'signup');
  };

  const isFirstLogin = () => {
    return userTokens?.balance === 0 && !hasSignupBonus();
  };

  const claimDailyTokens = async () => {
    if (!user) return;

    try {
      console.log('Attempting to claim daily tokens for user:', user.id);
      
      // First, ensure user has a token record
      await fetchUserTokens();
      
      const today = new Date().toISOString().split('T')[0];
      
      // Check if already claimed today
      const { data: existingClaims, error: checkError } = await supabase
        .from('token_claims')
        .select('*')
        .eq('user_id', user.id)
        .eq('claim_type', 'daily')
        .eq('claim_date', today);

      console.log('Existing claims check:', { existingClaims, checkError });

      if (checkError) {
        console.error('Error checking existing claims:', checkError);
        throw checkError;
      }

      if (existingClaims && existingClaims.length > 0) {
        toast.error('You have already claimed your daily tokens today!');
        return;
      }

      // Insert the claim record
      const { data: claimData, error: claimError } = await supabase
        .from('token_claims')
        .insert({
          user_id: user.id,
          claim_type: 'daily',
          tokens_earned: 10,
          claimed_at: new Date().toISOString(),
          claim_date: today
        })
        .select()
        .single();

      console.log('Claim insertion result:', { claimData, claimError });

      if (claimError) {
        console.error('Error inserting claim:', claimError);
        throw claimError;
      }

      // Get current balance first
      const currentBalance = userTokens?.balance || 0;
      
      // Update user's token balance
      const { data: updateData, error: updateError } = await supabase
        .from('user_tokens')
        .update({ 
          balance: currentBalance + 10,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      console.log('Balance update result:', { updateData, updateError });

      if (updateError) {
        console.error('Error updating balance:', updateError);
        throw updateError;
      }

      setUserTokens(updateData);
      toast.success(`Successfully claimed 10 tokens! You now have ${updateData.balance} tokens.`);
      
      // Refresh all data to ensure UI is up to date
      await Promise.all([fetchUserTokens(), fetchTodayClaims(), fetchAllTimeClaims()]);
    } catch (error) {
      console.error('Error claiming daily tokens:', error);
      toast.error('Failed to claim daily tokens. Please try again.');
    }
  };

  const initializeUserTokens = async () => {
    if (!user) return;

    try {
      console.log('Initializing tokens for user:', user.id);
      
      // Instead of using RPC, directly insert the token record
      const { data, error } = await supabase
        .from('user_tokens')
        .insert({ 
          user_id: user.id, 
          balance: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      console.log('Token initialization result:', { data, error });

      if (error && error.code !== '23505') { // Ignore unique constraint violations
        console.error('Error initializing tokens:', error);
        throw error;
      }

      // Refresh token data
      await fetchUserTokens();
    } catch (error) {
      console.error('Error in initializeUserTokens:', error);
    }
  };

  const testTokenTables = async () => {
    if (!user) return;

    try {
      console.log('Testing token tables existence...');
      
      // Test user_tokens table
      const { data: tokensTest, error: tokensError } = await supabase
        .from('user_tokens')
        .select('count')
        .limit(1);

      console.log('user_tokens table test:', { tokensTest, tokensError });

      // Test token_claims table
      const { data: claimsTest, error: claimsError } = await supabase
        .from('token_claims')
        .select('count')
        .limit(1);

      console.log('token_claims table test:', { claimsTest, claimsError });

      return { tokensError, claimsError };
    } catch (error) {
      console.error('Error testing token tables:', error);
      return { error };
    }
  };

  useEffect(() => {
    if (user) {
      console.log('User authenticated, testing token system...');
      testTokenTables().then(() => {
        Promise.all([fetchUserTokens(), fetchTodayClaims(), fetchAllTimeClaims()]).finally(() => {
          setLoading(false);
        });
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  return {
    userTokens,
    loading,
    claimTokens,
    getClaimableTasks,
    isFirstLogin: isFirstLogin(),
    refreshData: () => Promise.all([fetchUserTokens(), fetchTodayClaims(), fetchAllTimeClaims()]),
    claimDailyTokens,
    initializeUserTokens,
    todayClaims,
    allTimeClaims
  };
};
