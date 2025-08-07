import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import DashboardLoading from '@/components/dashboard/DashboardLoading';
import ManageTab from '@/components/dashboard/ManageTab';
import TokensTab from '@/components/dashboard/TokensTab';
import ProfileTab from '@/components/profile/ProfileTab';
import WelcomeModal from '@/components/tokens/WelcomeModal';
import { useDashboard } from '@/hooks/useDashboard';
import EscrowManager from '@/components/EscrowManager';
import { Settings, Coins, Shield, User, Store } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, profile, opportunities, myOpportunities, loading, handleSignOut, refreshData } = useDashboard();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [activeTab, setActiveTab] = useState('manage');

  // Show welcome modal when user logs in
  useEffect(() => {
    if (user && !loading) {
      const lastLogin = localStorage.getItem('lastLogin');
      const today = new Date().toDateString();
      
      if (lastLogin !== today) {
        setShowWelcomeModal(true);
        localStorage.setItem('lastLogin', today);
      }
    }
  }, [user, loading]);

  if (loading) {
    return <DashboardLoading />;
  }

  if (!user || !profile) {
    return <DashboardLoading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        profile={profile} 
        onSignOut={handleSignOut}
        user={user}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Marketplace Button */}
        <div className="mb-6 flex justify-center">
          <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3">
            <Link to="/marketplace" className="flex items-center gap-2">
              <Store className="w-5 h-5" />
              Go to Marketplace
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="manage" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="manage">My Posts</TabsTrigger>
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
            <TabsTrigger value="escrow">Escrow</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manage">
            <ManageTab 
              myOpportunities={myOpportunities} 
              onRefresh={refreshData} 
            />
          </TabsContent>
          
          <TabsContent value="tokens">
            <TokensTab user={user} />
          </TabsContent>
          
          <TabsContent value="escrow">
            <EscrowManager user={user} />
          </TabsContent>
          
          <TabsContent value="profile">
            <ProfileTab user={user} />
          </TabsContent>
        </Tabs>
      </main>

      <WelcomeModal 
        user={user}
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
      />
    </div>
  );
};

export default Dashboard;
