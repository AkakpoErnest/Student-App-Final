import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, X, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface TokenClaimNotificationProps {
  isVisible: boolean;
  onClose: () => void;
  tokensEarned: number;
  reason: string;
}

const TokenClaimNotification = ({ isVisible, onClose, tokensEarned, reason }: TokenClaimNotificationProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      // Auto-hide after 8 seconds
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 500); // Wait for animation to finish
      }, 8000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-500 ${
      show ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
    }`}>
      <Card className="w-80 shadow-2xl border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Coins className="w-6 h-6 text-green-600" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <h3 className="font-semibold text-green-800">Tokens Earned!</h3>
              </div>
              
              <p className="text-sm text-green-700 mb-2">
                You earned <span className="font-bold text-green-800">{tokensEarned} tokens</span> for {reason}
              </p>
              
              <div className="flex items-center gap-2 text-xs text-green-600">
                <Coins className="w-3 h-3" />
                <span>Your token balance has been updated</span>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShow(false);
                setTimeout(onClose, 500);
              }}
              className="text-green-600 hover:text-green-700 hover:bg-green-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TokenClaimNotification;
