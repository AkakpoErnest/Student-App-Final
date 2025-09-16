import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Truck, 
  CreditCard, 
  Users, 
  TrendingUp,
  Phone,
  Building,
  Wallet,
  Smartphone
} from 'lucide-react';

interface EscrowManagerProps {
  user: any;
}

const EscrowManager = ({ user }: EscrowManagerProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Escrow System</h2>
        <p className="text-gray-600 dark:text-gray-400">Secure payment protection for all transactions</p>
        <div className="mt-4">
          <Button asChild className="bg-gradient-to-r from-orange-600 to-teal-600 hover:from-orange-700 hover:to-teal-700">
            <Link to="/momo-test">
              Test Mobile Money Payments
            </Link>
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-orange-50 to-teal-50 dark:from-orange-900/20 dark:to-teal-900/20 border-orange-200 dark:border-orange-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Active Transactions</p>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">0</p>
              </div>
              <Shield className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 border-teal-200 dark:border-teal-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-teal-600 dark:text-teal-400">Completed</p>
                <p className="text-2xl font-bold text-teal-700 dark:text-teal-300">0</p>
              </div>
              <CheckCircle className="h-8 w-8 text-teal-600 dark:text-teal-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Volume</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">GH₵ 0</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How Escrow Works */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-orange-600" />
            How Escrow Works
          </CardTitle>
          <CardDescription>
            Secure your transactions with our Ghana Cedis escrow system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <CreditCard className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-1">1. Payment</h3>
              <p className="text-sm text-orange-600 dark:text-orange-300">Buyer pays via Mobile Money</p>
            </div>
            
            <div className="text-center p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-teal-800 dark:text-teal-200 mb-1">2. Secure Hold</h3>
              <p className="text-sm text-teal-600 dark:text-teal-300">Funds held safely in escrow</p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">3. Delivery</h3>
              <p className="text-sm text-blue-600 dark:text-blue-300">Item delivered to buyer</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-green-800 dark:text-green-200 mb-1">4. Release</h3>
              <p className="text-sm text-green-600 dark:text-green-300">Payment released to seller</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coming Soon Message */}
      <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600">
        <CardContent className="p-8 text-center">
          <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Escrow System Coming Soon
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            We're working on implementing a secure Ghana Cedis escrow system with Mobile Money integration.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="outline" className="text-xs">Mobile Money</Badge>
            <Badge variant="outline" className="text-xs">Bank Transfer</Badge>
            <Badge variant="outline" className="text-xs">Secure Payments</Badge>
            <Badge variant="outline" className="text-xs">Auto Release</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EscrowManager;