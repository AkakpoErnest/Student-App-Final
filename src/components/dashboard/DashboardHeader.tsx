
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, User as UserIcon } from 'lucide-react';
import { User } from '@/integrations/firebase/client';
import Logo from '@/components/Logo';
import TokenBalance from '@/components/tokens/TokenBalance';
import { useTokens } from '@/hooks/useTokens';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  university: string;
  wallet_address: string;
  verification_status?: string;
}

interface DashboardHeaderProps {
  profile: Profile;
  user: User;
  onSignOut: () => void;
}

export const DashboardHeader = ({ profile, user, onSignOut }: DashboardHeaderProps) => {
  const { userTokens } = useTokens(user);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo />
          
          <div className="flex items-center space-x-4">
            {userTokens && <TokenBalance balance={userTokens.balance} />}
            
            <div className="flex items-center space-x-2">
              <UserIcon className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">{profile.full_name || profile.email}</span>
            </div>
            
            <Button variant="outline" size="sm" onClick={onSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
