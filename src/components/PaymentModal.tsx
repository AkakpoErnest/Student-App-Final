import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Smartphone, Coins, Wallet, AlertCircle } from 'lucide-react';
import { getCurrentUser, db } from '@/integrations/firebase/client';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { blockchainClient } from '@/integrations/blockchain/client';
import { paymentService } from '@/integrations/payment/momo';
import { toast } from 'sonner';

interface Opportunity {
  id: string;
  title: string;
  price: number;
  currency: string;
}

interface PaymentModalProps {
  opportunity: Opportunity;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentModal = ({ opportunity, onClose, onSuccess }: PaymentModalProps) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'momo' | 'usdc'>('credit_card');
  const [walletAddress, setWalletAddress] = useState('');
  const [momoNumber, setMomoNumber] = useState('');
  const [momoProvider, setMomoProvider] = useState<'mtn' | 'vodafone' | 'airtel'>('mtn');
  const [walletConnected, setWalletConnected] = useState(false);
  const [escrowId, setEscrowId] = useState<string | null>(null);

  // Connect wallet for USDC payments
  const connectWallet = async () => {
    try {
      const address = await blockchainClient.connectWallet();
      if (address) {
        setWalletAddress(address);
        setWalletConnected(true);
        toast.success('Wallet connected successfully!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet. Please try again.');
    }
  };

  // Check if connected to Base network
  const checkNetwork = async () => {
    const isOnBase = await blockchainClient.checkNetwork();
    if (!isOnBase) {
      const switched = await blockchainClient.switchToBaseNetwork();
      if (!switched) {
        toast.error('Please switch to Base network in your wallet');
        return false;
      }
    }
    return true;
  };

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      const user = getCurrentUser();
      if (!user) throw new Error('Not authenticated');

      // Create payment record
      const paymentId = `payment_${Date.now()}`;
      const paymentData = {
        opportunity_id: opportunity.id,
        payer_id: user.uid,
        amount: opportunity.price,
        currency: opportunity.currency,
        payment_method: paymentMethod,
        payment_status: 'pending',
        created_at: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'payments', paymentId), paymentData);
      const payment = { id: paymentId, ...paymentData };

      // Handle different payment methods
      let updateData: any = { payment_status: 'completed' };

      switch (paymentMethod) {
        case 'credit_card':
          // In real implementation, integrate with Stripe
          updateData.stripe_session_id = `stripe_${Date.now()}`;
          break;
        
        case 'momo':
          // Mobile Money payment with real API integration
          if (!momoNumber.trim()) {
            throw new Error('Please enter your phone number');
          }
          
          const momoReference = `momo_${Date.now()}`;
          const momoResponse = await paymentService.initiateMoMoPayment(
            momoProvider,
            opportunity.price,
            momoNumber,
            momoReference,
            `Payment for ${opportunity.title}`
          );
          
          if (!momoResponse.success) {
            throw new Error(momoResponse.error || 'Mobile Money payment failed');
          }
          
          updateData.momo_reference = momoReference;
          updateData.momo_transaction_id = momoResponse.transaction_id;
          updateData.momo_provider = momoProvider;
          break;
        
        case 'usdc':
          // Blockchain escrow payment
          if (!walletConnected) {
            throw new Error('Wallet not connected');
          }

          // Check network
          const networkOk = await checkNetwork();
          if (!networkOk) {
            throw new Error('Please switch to Base network');
          }

          // Create escrow on blockchain
          const escrowId = await blockchainClient.createEscrow(
            opportunity.id,
            opportunity.price,
            walletAddress // This would be the seller's address from the opportunity
          );

          if (escrowId) {
            setEscrowId(escrowId);
            updateData.transaction_hash = escrowId;
            updateData.blockchain_verified = true;
            updateData.escrow_id = escrowId;
            toast.success(`Escrow created! ID: ${escrowId}`);
          } else {
            throw new Error('Failed to create escrow');
          }
          break;
      }

      // Update payment record
      await updateDoc(doc(db, 'payments', payment.id), updateData);

      toast.success('Payment processed successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error instanceof Error ? error.message : 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>
            Pay for "{opportunity.title}" to submit your application
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{opportunity.title}</CardTitle>
              <CardDescription className="text-2xl font-bold text-green-600">
                {opportunity.currency} {opportunity.price}
              </CardDescription>
            </CardHeader>
          </Card>

          <Tabs value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="credit_card" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Card
              </TabsTrigger>
              <TabsTrigger value="momo" className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                MoMo
              </TabsTrigger>
              <TabsTrigger value="usdc" className="flex items-center gap-2">
                <Coins className="w-4 h-4" />
                USDC
              </TabsTrigger>
            </TabsList>

            <TabsContent value="credit_card" className="space-y-4">
              <div className="space-y-2">
                <Label>Card Number</Label>
                <Input placeholder="1234 5678 9012 3456" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Expiry</Label>
                  <Input placeholder="MM/YY" />
                </div>
                <div className="space-y-2">
                  <Label>CVC</Label>
                  <Input placeholder="123" />
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-800">
                Powered by Stripe - Secure payments
              </Badge>
            </TabsContent>

            <TabsContent value="momo" className="space-y-4">
              {/* Provider Selection */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Select Provider</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'mtn', label: 'MTN MoMo', color: 'bg-yellow-500' },
                    { value: 'vodafone', label: 'Vodafone', color: 'bg-red-500' },
                    { value: 'airtel', label: 'AirtelTigo', color: 'bg-red-600' }
                  ].map((provider) => (
                    <div
                      key={provider.value}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                        momoProvider === provider.value
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                      onClick={() => setMomoProvider(provider.value as any)}
                    >
                      <div className="text-center">
                        <div className={`w-8 h-8 mx-auto mb-2 rounded-full ${provider.color}`}></div>
                        <span className="text-sm font-medium">{provider.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Phone Number Input */}
              <div className="space-y-2">
                <Label>Mobile Money Number</Label>
                <Input 
                  placeholder="0244 123 456"
                  value={momoNumber}
                  onChange={(e) => setMomoNumber(e.target.value)}
                />
                <p className="text-xs text-gray-500">Enter your Ghana phone number</p>
              </div>

              {/* Payment Instructions */}
              <div className="bg-gradient-to-r from-orange-50 to-teal-50 dark:from-orange-900/20 dark:to-teal-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-700">
                <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-3">Payment Instructions</h4>
                <div className="space-y-2 text-sm">
                  {paymentService.getPaymentInstructions(momoProvider, opportunity.price, `STU${Date.now()}`).map((instruction, index) => (
                    <p key={index} className="text-orange-700 dark:text-orange-300">{instruction}</p>
                  ))}
                </div>
              </div>

              <Badge className="bg-green-100 text-green-800">
                {paymentService.getProviderDisplayName(momoProvider)} supported
              </Badge>
            </TabsContent>

            <TabsContent value="usdc" className="space-y-4">
              {!walletConnected ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <Wallet className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                    <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
                    <p className="text-gray-600 mb-4">
                      Connect your MetaMask wallet to pay with USDC on Base network
                    </p>
                  </div>
                  <Button 
                    onClick={connectWallet}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    <Wallet className="w-5 h-5 mr-2" />
                    Connect Wallet
                  </Button>
                  <div className="text-sm text-gray-500 text-center">
                    <p>Make sure you have MetaMask installed and some USDC on Base network</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center text-green-700">
                      <Wallet className="w-5 h-5 mr-2" />
                      <span className="font-semibold">Wallet Connected</span>
                    </div>
                    <p className="text-sm text-green-600 mt-1">
                      Address: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Payment Details</Label>
                    <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span>Amount:</span>
                        <span className="font-semibold">{(opportunity.price * 0.31).toFixed(2)} USDC</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Network:</span>
                        <span className="text-blue-600">Base</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fee:</span>
                        <span className="text-green-600">~$0.01</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                      <div className="text-sm text-blue-700">
                        <p className="font-semibold">Escrow Protection</p>
                        <p>Your payment will be held in escrow until you confirm receipt. This protects both buyer and seller.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handlePayment} 
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Processing...' : `Pay ${opportunity.currency} ${opportunity.price}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
