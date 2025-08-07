
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Coins, Gift, CheckCircle2, AlertCircle, Mail } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { useTokens } from '@/hooks/useTokens';

interface WelcomeModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeModal = ({ user, isOpen, onClose }: WelcomeModalProps) => {
  const { claimTokens, isFirstLogin, getClaimableTasks, userTokens } = useTokens(user);
  const [currentStep, setCurrentStep] = useState<'welcome' | 'claims'>('welcome');
  const [claimedTasks, setClaimedTasks] = useState<Set<string>>(new Set());

  const handleSignupClaim = async () => {
    if (isFirstLogin) {
      const success = await claimTokens('signup', 50);
      if (success) {
        setClaimedTasks(prev => new Set([...prev, 'signup']));
      }
    }
    setCurrentStep('claims');
  };

  const handleTaskClaim = async (taskType: string, tokens: number) => {
    const success = await claimTokens(taskType, tokens);
    if (success) {
      setClaimedTasks(prev => new Set([...prev, taskType]));
    }
  };

  const claimableTasks = getClaimableTasks().filter(task => task.canClaim);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {currentStep === 'welcome' ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-bold text-blue-600">
                Welcome to StuFind! 🎉
              </DialogTitle>
            </DialogHeader>
            <div className="text-center space-y-6 py-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <Gift className="w-10 h-10 text-blue-600" />
                </div>
              </div>
              
              {isFirstLogin ? (
                <>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Welcome Bonus!</h3>
                    <p className="text-gray-600">
                      Get started with 50 StuFind Tokens as our welcome gift!
                    </p>
                    <div className="flex items-center justify-center text-sm text-blue-600 mt-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      Powered by Base Blockchain
                    </div>
                  </div>
                  <Button 
                    onClick={handleSignupClaim}
                    className="bg-blue-600 hover:bg-blue-700 w-full"
                    size="lg"
                  >
                    <Coins className="w-5 h-5 mr-2" />
                    Claim Welcome Bonus
                  </Button>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Welcome Back!</h3>
                    <p className="text-gray-600">
                      Ready to claim your daily rewards?
                    </p>
                    {userTokens && (
                      <p className="text-sm text-blue-600 mt-2">
                        Current Balance: {userTokens.balance} StuFind Tokens
                      </p>
                    )}
                  </div>
                  <Button 
                    onClick={() => setCurrentStep('claims')}
                    className="bg-blue-600 hover:bg-blue-700 w-full"
                    size="lg"
                  >
                    View Available Rewards
                  </Button>
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-bold">
                Claim Today's Tokens! 🪙
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {claimableTasks.length > 0 ? (
                claimableTasks.map((task) => (
                  <div key={task.type} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          {task.type === 'email_verification' && <Mail className="w-4 h-4 mr-2 text-orange-500" />}
                          <h4 className="font-semibold">{task.title}</h4>
                          {task.isCompleted && (
                            <CheckCircle2 className="w-4 h-4 ml-2 text-green-500" />
                          )}
                          {!task.isCompleted && (
                            <AlertCircle className="w-4 h-4 ml-2 text-orange-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{task.description}</p>
                        <div className="flex items-center mt-2">
                          <Coins className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="font-semibold text-yellow-600">{task.tokens} tokens</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        {claimedTasks.has(task.type) ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircle2 className="w-5 h-5 mr-1" />
                            <span className="text-sm">Claimed!</span>
                          </div>
                        ) : (
                          <Button 
                            onClick={() => handleTaskClaim(task.type, task.tokens)}
                            size="sm"
                            disabled={!task.isCompleted}
                            className={task.isCompleted ? "bg-green-600 hover:bg-green-700" : ""}
                          >
                            {task.isCompleted ? 'Claim Reward' : 'Complete Task'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">No rewards available to claim right now.</p>
                  <p className="text-sm text-gray-400 mt-1">Come back tomorrow for your daily bonus!</p>
                </div>
              )}
              
              <div className="text-center pt-4">
                <div className="flex items-center justify-center text-sm text-blue-600 mb-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Powered by Base Blockchain
                </div>
                <Button onClick={onClose} variant="outline" className="w-full">
                  Done
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
