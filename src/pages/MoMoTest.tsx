import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Smartphone, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Loader2,
  ArrowLeft,
  CreditCard,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  MoMoProvider, 
  paymentService, 
  generatePaymentReference,
  validateGhanaPhone,
  PaymentStatus 
} from '@/integrations/payment/momo';
import { toast } from 'sonner';

const MoMoTest = () => {
  const [amount, setAmount] = useState('10');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<MoMoProvider>(MoMoProvider.MTN);
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [testResults, setTestResults] = useState<any[]>([]);

  const handlePayment = async () => {
    if (!phoneNumber.trim()) {
      toast.error('Please enter a phone number');
      return;
    }

    if (!validateGhanaPhone(phoneNumber)) {
      toast.error('Please enter a valid Ghana phone number (e.g., 0244 123 456)');
      return;
    }

    if (!amount || parseFloat(amount) < 1) {
      toast.error('Please enter a valid amount (minimum 1 GHS)');
      return;
    }

    setLoading(true);
    setPaymentStatus(PaymentStatus.PENDING);

    try {
      const reference = generatePaymentReference('test-opp', 'test-user');
      const result = await paymentService.initiateMoMoPayment(
        selectedProvider,
        parseFloat(amount),
        phoneNumber,
        reference
      );

      if (result.success) {
        setTransactionId(result.transaction_id || '');
        setPaymentStatus(PaymentStatus.INITIATED);
        toast.success(result.message);
        
        // Add to test results
        setTestResults(prev => [...prev, {
          id: Date.now(),
          provider: selectedProvider,
          amount: parseFloat(amount),
          phone: phoneNumber,
          status: 'initiated',
          timestamp: new Date().toLocaleTimeString(),
          transactionId: result.transaction_id
        }]);
        
        // Start polling for status
        pollPaymentStatus(result.transaction_id || '');
      } else {
        setPaymentStatus(PaymentStatus.FAILED);
        toast.error(result.error || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus(PaymentStatus.FAILED);
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const pollPaymentStatus = async (txId: string) => {
    let attempts = 0;
    const maxAttempts = 30; // 5 minutes with 10-second intervals
    
    const poll = async () => {
      if (attempts >= maxAttempts) {
        setPaymentStatus(PaymentStatus.FAILED);
        toast.error('Payment timeout. Please check your phone or try again.');
        return;
      }

      try {
        const status = await paymentService.checkPaymentStatus(selectedProvider, txId);
        
        if (status.success) {
          setPaymentStatus(status.status);
          
          if (status.status === PaymentStatus.SUCCESS) {
            toast.success('Payment confirmed! 🎉');
            // Update test results
            setTestResults(prev => prev.map(result => 
              result.transactionId === txId 
                ? { ...result, status: 'success' }
                : result
            ));
            return;
          } else if (status.status === PaymentStatus.FAILED) {
            toast.error('Payment failed. Please try again.');
            // Update test results
            setTestResults(prev => prev.map(result => 
              result.transactionId === txId 
                ? { ...result, status: 'failed' }
                : result
            ));
            return;
          }
        }
        
        attempts++;
        setTimeout(poll, 10000); // Poll every 10 seconds
      } catch (error) {
        console.error('Status check error:', error);
        attempts++;
        setTimeout(poll, 10000);
      }
    };

    poll();
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case PaymentStatus.SUCCESS:
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case PaymentStatus.FAILED:
        return <AlertCircle className="w-6 h-6 text-red-600" />;
      case PaymentStatus.INITIATED:
      case PaymentStatus.PROCESSING:
        return <Clock className="w-6 h-6 text-orange-600" />;
      default:
        return <Smartphone className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (paymentStatus) {
      case PaymentStatus.SUCCESS:
        return 'bg-green-100 text-green-800 border-green-200';
      case PaymentStatus.FAILED:
        return 'bg-red-100 text-red-800 border-red-200';
      case PaymentStatus.INITIATED:
      case PaymentStatus.PROCESSING:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = () => {
    switch (paymentStatus) {
      case PaymentStatus.SUCCESS:
        return 'Payment Successful';
      case PaymentStatus.FAILED:
        return 'Payment Failed';
      case PaymentStatus.INITIATED:
        return 'Payment Initiated';
      case PaymentStatus.PROCESSING:
        return 'Processing Payment';
      default:
        return 'Ready to Pay';
    }
  };

  const clearTestResults = () => {
    setTestResults([]);
    setPaymentStatus(null);
    setTransactionId('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/dashboard" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mobile Money Testing</h1>
              <p className="text-gray-600 dark:text-gray-400">Test Mobile Money integration with real providers</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Test */}
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-teal-100 dark:from-orange-900/20 dark:to-teal-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle className="text-xl">Mobile Money Test</CardTitle>
              <CardDescription>
                Test the Mobile Money integration with real providers
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Provider Selection */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Select Provider</Label>
                <div className="grid grid-cols-3 gap-3">
                  {Object.values(MoMoProvider).map((provider) => (
                    <div
                      key={provider}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedProvider === provider
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                      onClick={() => setSelectedProvider(provider)}
                    >
                      <div className="text-center">
                        <div className="w-8 h-8 mx-auto mb-2">
                          {provider === MoMoProvider.MTN && <div className="w-8 h-8 bg-yellow-500 rounded-full"></div>}
                          {provider === MoMoProvider.VODAFONE && <div className="w-8 h-8 bg-red-500 rounded-full"></div>}
                          {provider === MoMoProvider.AIRTEL && <div className="w-8 h-8 bg-red-600 rounded-full"></div>}
                        </div>
                        <span className="text-sm font-medium capitalize">{provider}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-base font-medium">
                  Amount (GHS)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="10.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Phone Number Input */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base font-medium">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  placeholder="0244 123 456"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">Enter a Ghana phone number</p>
              </div>

              {/* Payment Instructions */}
              <div className="bg-gradient-to-r from-orange-50 to-teal-50 dark:from-orange-900/20 dark:to-teal-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-700">
                <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-3">Payment Instructions</h4>
                <div className="space-y-2 text-sm">
                  {paymentService.getPaymentInstructions(selectedProvider, parseFloat(amount) || 0, 'TEST-REF').map((instruction, index) => (
                    <p key={index} className="text-orange-700 dark:text-orange-300">{instruction}</p>
                  ))}
                </div>
              </div>

              {/* Payment Status */}
              {paymentStatus && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    {getStatusIcon()}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{getStatusText()}</p>
                      {transactionId && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">ID: {transactionId}</p>
                      )}
                    </div>
                  </div>
                  <Badge className={getStatusColor()}>
                    {paymentStatus.toUpperCase()}
                  </Badge>
                </div>
              )}

              {/* Action Button */}
              <Button 
                onClick={handlePayment}
                disabled={loading || !phoneNumber.trim() || !amount}
                className="w-full bg-gradient-to-r from-orange-600 to-teal-600 hover:from-orange-700 hover:to-teal-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Initiating Payment...
                  </>
                ) : (
                  'Test Mobile Money Payment'
                )}
              </Button>

              {/* Info */}
              <div className="text-center text-xs text-gray-500">
                <p>This is a test environment. No real money will be charged.</p>
                <p>Use any valid Ghana phone number format.</p>
              </div>
            </CardContent>
          </Card>

          {/* Test Results */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Test Results</CardTitle>
                  <CardDescription>Recent payment tests and their status</CardDescription>
                </div>
                {testResults.length > 0 && (
                  <Button variant="outline" size="sm" onClick={clearTestResults}>
                    Clear All
                  </Button>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              {testResults.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Smartphone className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No test payments yet</p>
                  <p className="text-sm">Start testing to see results here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {testResults.map((result) => (
                    <div key={result.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          result.status === 'success' ? 'bg-green-500' :
                          result.status === 'failed' ? 'bg-red-500' :
                          'bg-orange-500'
                        }`}></div>
                        <div>
                          <p className="font-medium text-sm">
                            {paymentService.getProviderDisplayName(result.provider)}
                          </p>
                          <p className="text-xs text-gray-500">
                            GH₵{result.amount} • {result.phone} • {result.timestamp}
                          </p>
                        </div>
                      </div>
                      <Badge variant={result.status === 'success' ? 'default' : 'secondary'}>
                        {result.status.toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Integration Status */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-orange-600" />
              Integration Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-green-600">API Integration</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ready for production</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-blue-600">Payment Processing</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Real-time status updates</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Smartphone className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-orange-600">Mobile Support</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">All major providers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MoMoTest;


