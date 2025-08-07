import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Gift, Calendar, CheckCircle2, Clock, Mail, AlertCircle } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { useTokens } from '@/hooks/useTokens';
import TokenBalance from '@/components/tokens/TokenBalance';

interface TokensTabProps {
  user: User;
}

const TokensTab = ({ user }: TokensTabProps) => {
  const { 
    userTokens, 
    claimTokens, 
    claimDailyTokens,
    initializeUserTokens,
    getClaimableTasks,
    refreshData,
    todayClaims,
    allTimeClaims,
    loading 
  } = useTokens(user);
  const [claiming, setClaiming] = useState<string | null>(null);

  const handleClaim = async (taskType: string, tokens: number) => {
    setClaiming(taskType);
    try {
      if (taskType === 'daily') {
        await claimDailyTokens();
      } else {
        await claimTokens(taskType, tokens);
      }
      // Refresh data after claiming
      await refreshData();
    } finally {
      setClaiming(null);
    }
  };

  // Initialize tokens if needed
  React.useEffect(() => {
    if (user && !userTokens) {
      initializeUserTokens();
    }
  }, [user, userTokens, initializeUserTokens]);

  const claimableTasks = getClaimableTasks();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Debug Section - Remove this later */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-orange-800">Debug Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div><strong>User ID:</strong> {user?.id || 'Not logged in'}</div>
            <div><strong>User Email:</strong> {user?.email || 'N/A'}</div>
            <div><strong>Email Verified:</strong> {user?.email_confirmed_at ? 'Yes' : 'No'}</div>
            <div><strong>Token Record:</strong> {userTokens ? `Balance: ${userTokens.balance}` : 'No token record'}</div>
            <div><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</div>
            <div><strong>Today Claims:</strong> {todayClaims.length}</div>
            <div><strong>All Time Claims:</strong> {allTimeClaims.length}</div>
          </div>
          <Button 
            onClick={() => {
              console.log('Manual refresh triggered');
              refreshData();
            }}
            size="sm"
            className="mt-4"
          >
            Manual Refresh
          </Button>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">StuFind Tokens</h2>
        {userTokens && <TokenBalance balance={userTokens.balance} showBlockchainInfo={true} />}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Coins className="w-5 h-5 mr-2 text-yellow-500" />
              Token Balance
            </div>
            <Button 
              onClick={refreshData}
              variant="outline" 
              size="sm"
              className="text-xs"
            >
              Refresh
            </Button>
          </CardTitle>
          <CardDescription>
            Earn tokens by completing tasks and staying active on StuFind
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-6xl font-bold text-blue-600 mb-2">
              {userTokens?.balance || 0}
            </div>
            <p className="text-gray-600 mb-2 text-lg">StuFind Tokens</p>
            <div className="flex items-center justify-center text-sm text-blue-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Powered by Base Blockchain
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Gift className="w-5 h-5 mr-2 text-green-500" />
            Available Rewards
          </CardTitle>
          <CardDescription>
            Complete tasks to earn more tokens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {claimableTasks.map((task) => (
              <div key={task.type} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {task.type === 'daily' && <Calendar className="w-5 h-5 text-blue-500" />}
                  {task.type === 'email_verification' && (
                    task.isCompleted ? 
                      <CheckCircle2 className="w-5 h-5 text-green-500" /> : 
                      <Mail className="w-5 h-5 text-orange-500" />
                  )}
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-semibold mr-2">{task.title}</h4>
                      {task.isCompleted && !task.canClaim && (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      )}
                      {!task.isCompleted && (
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{task.description}</p>
                    <div className="flex items-center mt-1">
                      <Coins className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-semibold text-yellow-600">+{task.tokens} tokens</span>
                    </div>
                  </div>
                </div>
                <div>
                  {task.canClaim ? (
                    <Button 
                      onClick={() => handleClaim(task.type, task.tokens)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      disabled={claiming === task.type}
                    >
                      {claiming === task.type ? 'Claiming...' : 'Claim Reward'}
                    </Button>
                  ) : task.isCompleted ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      <span className="text-sm">Claimed</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-orange-500">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      <span className="text-sm">Complete Task</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {claimableTasks.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Gift className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No rewards available right now.</p>
                <p className="text-sm mt-1">Come back tomorrow for your daily bonus!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How to Earn More Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span>Log in daily to claim your daily bonus (10 tokens)</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span>Verify your email address (100 tokens one-time)</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span>Post opportunities and help other students</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span>Participate in community activities</span>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center text-blue-700">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="font-semibold text-sm">Powered by Base Blockchain</span>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              All rewards and token actions are built on Base blockchain for transparency and decentralization.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TokensTab;
