
import React from 'react';
import { Coins } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TokenBalanceProps {
  balance: number;
  showAnimation?: boolean;
  showBlockchainInfo?: boolean;
}

const TokenBalance = ({ balance, showAnimation = false, showBlockchainInfo = false }: TokenBalanceProps) => {
  return (
    <div className={`inline-flex flex-col items-center ${showAnimation ? 'animate-pulse' : ''}`}>
      <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-800 px-3 py-1">
        <Coins className="w-4 h-4 mr-1 text-yellow-600" />
        <span className="font-semibold">{balance} StuFind Tokens</span>
      </Badge>
      {showBlockchainInfo && (
        <div className="text-xs text-gray-500 mt-1 flex items-center">
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
          Powered by Base Blockchain
        </div>
      )}
    </div>
  );
};

export default TokenBalance;
