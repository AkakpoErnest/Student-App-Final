import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Shield, CheckCircle, XCircle, Clock, Wallet, AlertTriangle } from 'lucide-react';
import { blockchainClient } from '@/integrations/blockchain/client';
import { db } from '@/integrations/firebase/client';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { toast } from 'sonner';

interface EscrowTransaction {
  id: string;
  escrow_id: string;
  opportunity_id: string;
  buyer_id: string;
  seller_id: string;
  amount: number;
  status: 'pending' | 'released' | 'refunded';
  created_at: string;
  blockchain_details?: any;
}

interface EscrowManagerProps {
  user: any;
}

const EscrowManager = ({ user }: EscrowManagerProps) => {
  const [escrows, setEscrows] = useState<EscrowTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEscrow, setSelectedEscrow] = useState<EscrowTransaction | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchEscrows();
  }, [user]);

  const fetchEscrows = async () => {
    try {
      // Fetch escrow transactions where user is buyer or seller
      const paymentsRef = collection(db, 'payments');
      const q = query(
        paymentsRef,
        where('transaction_hash', '!=', null)
      );
      
      const querySnapshot = await getDocs(q);
      const payments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Filter payments where user is buyer or seller
      const userPayments = payments.filter(payment => 
        payment.payer_id === user.uid || payment.seller_id === user.uid
      );

      // Fetch opportunities for these payments
      const opportunitiesRef = collection(db, 'opportunities');
      const opportunityIds = [...new Set(userPayments.map(p => p.opportunity_id))];
      
      const opportunities = [];
      for (const oppId of opportunityIds) {
        const oppDoc = await getDoc(doc(db, 'opportunities', oppId));
        if (oppDoc.exists()) {
          opportunities.push({ id: oppId, ...oppDoc.data() });
        }
      }

      const escrowTransactions: EscrowTransaction[] = userPayments.map(payment => {
        const opportunity = opportunities.find(opp => opp.id === payment.opportunity_id);
        return {
          id: payment.id,
          escrow_id: payment.transaction_hash || payment.id,
          opportunity_id: payment.opportunity_id,
          buyer_id: payment.payer_id,
          seller_id: opportunity?.user_id || '',
          amount: payment.amount,
          status: (payment.payment_status === 'completed' ? 'pending' : payment.payment_status) as 'pending' | 'released' | 'refunded',
          created_at: payment.created_at,
          blockchain_details: null
        };
      });

      // Fetch blockchain details for each escrow
      for (const escrow of escrowTransactions) {
        try {
          const details = await blockchainClient.getEscrowDetails(escrow.escrow_id);
          escrow.blockchain_details = details;
        } catch (error) {
          console.error('Error fetching escrow details:', error);
        }
      }

      setEscrows(escrowTransactions);
    } catch (error) {
      console.error('Error fetching escrows:', error);
      toast.error('Failed to load escrow transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleReleaseFunds = async (escrow: EscrowTransaction) => {
    if (!confirm('Are you sure you want to release funds to the seller? This action cannot be undone.')) {
      return;
    }

    setActionLoading(true);
    try {
      const success = await blockchainClient.releaseFunds(escrow.escrow_id);
      
      if (success) {
        // Update database
        await updateDoc(doc(db, 'payments', escrow.id), { 
          payment_status: 'released' 
        });

        toast.success('Funds released successfully!');
        fetchEscrows();
      } else {
        toast.error('Failed to release funds');
      }
    } catch (error) {
      console.error('Error releasing funds:', error);
      toast.error('Failed to release funds');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefundBuyer = async (escrow: EscrowTransaction) => {
    if (!confirm('Are you sure you want to refund the buyer? This action cannot be undone.')) {
      return;
    }

    setActionLoading(true);
    try {
      const success = await blockchainClient.refundBuyer(escrow.escrow_id);
      
      if (success) {
        // Update database
        await updateDoc(doc(db, 'payments', escrow.id), { 
          payment_status: 'refunded' 
        });

        toast.success('Buyer refunded successfully!');
        fetchEscrows();
      } else {
        toast.error('Failed to refund buyer');
      }
    } catch (error) {
      console.error('Error refunding buyer:', error);
      toast.error('Failed to refund buyer');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-orange-600 border-orange-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'released':
        return <Badge variant="outline" className="text-green-600 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Released</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="text-red-600 border-red-200"><XCircle className="w-3 h-3 mr-1" />Refunded</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const isBuyer = (escrow: EscrowTransaction) => escrow.buyer_id === user.uid;
  const isSeller = (escrow: EscrowTransaction) => escrow.seller_id === user.uid;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Escrow Transactions</h2>
        <div className="flex items-center text-sm text-blue-600">
          <Shield className="w-4 h-4 mr-2" />
          Powered by Base Blockchain
        </div>
      </div>

      {escrows.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No Escrow Transactions</h3>
            <p className="text-gray-600">You don't have any escrow transactions yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {escrows.map((escrow) => (
            <Card key={escrow.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <div>
                      <h3 className="font-semibold">Escrow #{escrow.escrow_id.slice(0, 8)}</h3>
                      <p className="text-sm text-gray-600">Created {new Date(escrow.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {getStatusBadge(escrow.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="font-semibold">${escrow.amount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Your Role</p>
                    <p className="font-semibold">{isBuyer(escrow) ? 'Buyer' : 'Seller'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-semibold capitalize">{escrow.status}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedEscrow(escrow);
                      setShowDetails(true);
                    }}
                  >
                    View Details
                  </Button>

                  {escrow.status === 'pending' && (
                    <div className="flex space-x-2">
                      {isBuyer(escrow) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRefundBuyer(escrow)}
                          disabled={actionLoading}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Request Refund
                        </Button>
                      )}
                      {isSeller(escrow) && (
                        <Button
                          size="sm"
                          onClick={() => handleReleaseFunds(escrow)}
                          disabled={actionLoading}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Release Funds
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Escrow Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Escrow Details</DialogTitle>
            <DialogDescription>
              Blockchain transaction details for this escrow
            </DialogDescription>
          </DialogHeader>
          
          {selectedEscrow && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Transaction Info</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Escrow ID:</span>
                    <span className="font-mono">{selectedEscrow.escrow_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span>${selectedEscrow.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="capitalize">{selectedEscrow.status}</span>
                  </div>
                </div>
              </div>

              {selectedEscrow.blockchain_details && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2 text-blue-700">Blockchain Details</h4>
                  <div className="space-y-2 text-sm text-blue-700">
                    <div className="flex justify-between">
                      <span>Buyer:</span>
                      <span className="font-mono">{selectedEscrow.blockchain_details.buyer.slice(0, 6)}...{selectedEscrow.blockchain_details.buyer.slice(-4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Seller:</span>
                      <span className="font-mono">{selectedEscrow.blockchain_details.seller.slice(0, 6)}...{selectedEscrow.blockchain_details.seller.slice(-4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Released:</span>
                      <span>{selectedEscrow.blockchain_details.released ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Refunded:</span>
                      <span>{selectedEscrow.blockchain_details.refunded ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center text-sm text-gray-600">
                <AlertTriangle className="w-4 h-4 mr-2" />
                <span>All transactions are secured by Base blockchain</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EscrowManager; 