import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Gift, Calendar, CheckCircle2, Clock, Mail, AlertCircle } from 'lucide-react';
import { User } from '@/integrations/firebase/client';
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-teal-600 bg-clip-text text-transparent">StuFind Tokens</h2>
        {userTokens && <TokenBalance balance={userTokens.balance} showBlockchainInfo={true} />}
      </div>

      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-gray-900 dark:text-white">
            <div className="flex items-center">
              <Coins className="w-5 h-5 mr-2 text-orange-600 dark:text-orange-400" />
              Token Balance
            </div>
            <Button 
              onClick={refreshData}
              variant="outline" 
              size="sm"
              className="text-xs border-orange-200 dark:border-orange-700 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20"
            >
              Refresh
            </Button>
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Earn tokens by completing tasks and staying active on StuFind
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-6xl font-bold bg-gradient-to-r from-orange-600 to-teal-600 bg-clip-text text-transparent mb-2">
              {userTokens?.balance || 80}
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2 text-lg">StuFind Tokens</p>
            <div className="flex items-center justify-center text-sm text-orange-600 dark:text-orange-400">
              <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-teal-500 rounded-full mr-2"></div>
              Powered by Base Blockchain
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900 dark:text-white">
            <Gift className="w-5 h-5 mr-2 text-orange-600 dark:text-orange-400" />
            Available Rewards
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Complete tasks to earn more tokens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {claimableTasks.map((task) => (
              <div key={task.type} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center space-x-3">
                  {task.type === 'daily' && <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />}
                  {task.type === 'email_verification' && (
                    task.isCompleted ? 
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" /> : 
                      <Mail className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  )}
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-semibold mr-2 text-gray-900 dark:text-white">{task.title}</h4>
                      {task.isCompleted && !task.canClaim && (
                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                      )}
                      {!task.isCompleted && (
                        <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
                    <div className="flex items-center mt-1">
                      <Coins className="w-4 h-4 text-orange-600 dark:text-orange-400 mr-1" />
                      <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">+{task.tokens} tokens</span>
                    </div>
                  </div>
                </div>
                <div>
                  {task.canClaim ? (
                    <Button 
                      onClick={() => handleClaim(task.type, task.tokens)}
                      size="sm"
                      className="bg-gradient-to-r from-orange-600 to-teal-600 hover:from-orange-700 hover:to-teal-700 text-white"
                      disabled={claiming === task.type}
                    >
                      {claiming === task.type ? 'Claiming...' : 'Claim Reward'}
                    </Button>
                  ) : task.isCompleted ? (
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      <span className="text-sm">Claimed</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-orange-600 dark:text-orange-400">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      <span className="text-sm">Complete Task</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {claimableTasks.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Gift className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No rewards available right now.</p>
                <p className="text-sm mt-1">Come back tomorrow for your daily bonus!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">How to Earn More Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-teal-500 rounded-full mr-3"></div>
              <span className="text-gray-700 dark:text-gray-300">Log in daily to claim your daily bonus (10 tokens)</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-teal-500 rounded-full mr-3"></div>
              <span className="text-gray-700 dark:text-gray-300">Verify your email address (100 tokens one-time)</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-teal-500 rounded-full mr-3"></div>
              <span className="text-gray-700 dark:text-gray-300">Post opportunities and help other students</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-teal-500 rounded-full mr-3"></div>
              <span className="text-gray-700 dark:text-gray-300">Participate in community activities</span>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-teal-50 dark:from-orange-900/20 dark:to-teal-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
            <div className="flex items-center text-orange-700 dark:text-orange-300">
              <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-teal-500 rounded-full mr-2"></div>
              <span className="font-semibold text-sm">Powered by Base Blockchain</span>
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
              All rewards and token actions are built on Base blockchain for transparency and decentralization.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TokensTab;
