
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Clock, User, ShoppingCart, Briefcase, CheckCircle, Star, MessageCircle, Phone, Shield, Calendar, Edit, Eye } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';
import { toast } from 'sonner';
import { getCurrentUser } from '@/integrations/firebase/client';
import ChatModal from '@/components/ChatModal';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: string;
  opportunity_type: string;
  price: number;
  currency: string;
  location: string;
  university: string;
  requirements: string[];
  image_url: string;
  created_at: string;
  user_id: string;
  contact_email?: string;
  contact_phone?: string;
  contact_whatsapp?: string;
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    fetchOpportunity();
    setCurrentUser(getCurrentUser());
  }, [id]);

  // Track view when opportunity is loaded
  useEffect(() => {
    if (opportunity && currentUser) {
      trackView();
    }
  }, [opportunity, currentUser]);

  const trackView = async () => {
    if (!opportunity || !currentUser) return;
    
    try {
      // Don't count views from the owner
      if (currentUser.uid === opportunity.user_id) return;
      
      // Record the view
      const viewRef = doc(db, 'opportunity_views', `${opportunity.id}_${currentUser.uid}_${Date.now()}`);
      await setDoc(viewRef, {
        opportunity_id: opportunity.id,
        viewer_id: currentUser.uid,
        viewer_name: currentUser.displayName || 'Anonymous',
        viewed_at: new Date().toISOString(),
        user_agent: navigator.userAgent,
        ip_address: 'local' // In production, you'd get real IP
      });
      
      console.log('View tracked successfully');
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  const fetchOpportunity = async () => {
    if (!id) return;

    try {
      const docRef = doc(db, 'opportunities', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const opportunityData = { id: docSnap.id, ...docSnap.data() } as Opportunity;
        setOpportunity(opportunityData);
        
        // Fetch user profile
        if (opportunityData.user_id) {
          const profileRef = doc(db, 'profiles', opportunityData.user_id);
          const profileSnap = await getDoc(profileRef);
          if (profileSnap.exists()) {
            setUserProfile(profileSnap.data());
          }
        }
      } else {
        toast.error('Opportunity not found');
        navigate('/marketplace');
      }
    } catch (error) {
      console.error('Error fetching opportunity:', error);
      toast.error('Error loading opportunity');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!currentUser) {
      toast.error('Please log in to apply');
      navigate('/auth');
      return;
    }
    
    // Navigate to application form or show modal
    navigate(`/apply/${id}`);
  };

  const handleContact = (method: 'email' | 'phone' | 'whatsapp') => {
    if (!currentUser) {
      toast.error('Please log in to contact');
      navigate('/auth');
      return;
    }

    switch (method) {
      case 'email':
        if (opportunity?.contact_email) {
          window.open(`mailto:${opportunity.contact_email}?subject=Regarding: ${opportunity.title}`);
        }
        break;
      case 'phone':
        if (opportunity?.contact_phone) {
          window.open(`tel:${opportunity.contact_phone}`);
        }
        break;
      case 'whatsapp':
        if (opportunity?.contact_whatsapp) {
          const message = `Hi! I'm interested in your opportunity: ${opportunity.title}`;
          const whatsappUrl = `https://wa.me/${opportunity.contact_whatsapp.replace('+', '')}?text=${encodeURIComponent(message)}`;
          window.open(whatsappUrl);
        }
        break;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading opportunity...</p>
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Opportunity not found</p>
          <Button onClick={() => navigate('/marketplace')} className="mt-4">
            Back to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  const isOwner = currentUser?.uid === opportunity.user_id;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/marketplace')} className="mb-4">
            ← Back to Marketplace
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Opportunity Header */}
            <Card>
              <CardHeader>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant={opportunity.opportunity_type === 'item' ? 'default' : 'secondary'}>
                    {opportunity.opportunity_type === 'item' ? (
                      <>
                        <ShoppingCart className="w-3 h-3 mr-1" />
                        Item
                      </>
                    ) : (
                      <>
                        <Briefcase className="w-3 h-3 mr-1" />
                        Job
                      </>
                    )}
                  </Badge>
                  <Badge variant="outline">{opportunity.category}</Badge>
                  {opportunity.university && (
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      {opportunity.university}
                    </Badge>
                  )}
                </div>
                
                <CardTitle className="text-2xl sm:text-3xl mb-2">
                  {opportunity.title}
                </CardTitle>
                
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{opportunity.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatTimeAgo(opportunity.created_at)}</span>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Image Section */}
            {opportunity.image_url && (
              <Card>
                <CardContent className="p-0">
                  <img
                    src={opportunity.image_url}
                    alt={opportunity.title}
                    className="w-full h-64 sm:h-80 object-cover rounded-lg"
                  />
                </CardContent>
              </Card>
            )}

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{opportunity.description}</p>
              </CardContent>
            </Card>

            {/* Requirements */}
            {opportunity.requirements && opportunity.requirements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {opportunity.opportunity_type === 'item' ? 'Additional Details' : 'Requirements'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {opportunity.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {opportunity.contact_email && (
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">Email</p>
                      <p className="text-sm text-blue-600">{opportunity.contact_email}</p>
                    </div>
                  )}
                  {opportunity.contact_phone && (
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-800">Phone</p>
                      <p className="text-sm text-green-600">{opportunity.contact_phone}</p>
                    </div>
                  )}
                  {opportunity.contact_whatsapp && (
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-800">WhatsApp</p>
                      <p className="text-sm text-green-600">{opportunity.contact_whatsapp}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <p className="text-2xl font-bold text-green-600">
                    {opportunity.currency} {opportunity.price}
                  </p>
                  <p className="text-sm text-gray-600">
                    {opportunity.opportunity_type === 'item' ? 'Price' : 'Salary'}
                  </p>
                </div>

                {!isOwner ? (
                  <div className="space-y-3">
                    {opportunity.opportunity_type === 'item' ? (
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Buy Now
                      </Button>
                    ) : (
                      <Button onClick={handleApply} className="w-full">
                        <Briefcase className="w-4 h-4 mr-2" />
                        Apply Now
                      </Button>
                    )}
                    
                    <Button variant="outline" className="w-full" onClick={() => handleContact('whatsapp')}>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message Seller
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => setShowChat(true)}
                      disabled={!currentUser}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Start Chat
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full" onClick={() => navigate(`/dashboard?tab=manage`)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Opportunity
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => navigate(`/dashboard?tab=manage`)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Applications
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Seller Information */}
            {userProfile && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Seller Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">{userProfile.full_name || 'Student'}</p>
                      {userProfile.verification_status === 'verified' && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-600">Verified</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{userProfile.university || 'University not specified'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>Joined {userProfile.created_at ? new Date(userProfile.created_at).toLocaleDateString() : 'Recently'}</span>
                    </div>
                  </div>

                  {!isOwner && (
                    <div className="space-y-2 pt-4 border-t">
                      <Button variant="outline" className="w-full" onClick={() => handleContact('email')}>
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Send Email
                      </Button>
                      {opportunity.contact_phone && (
                        <Button variant="outline" className="w-full" onClick={() => handleContact('phone')}>
                          <Phone className="w-4 h-4 mr-2" />
                          Call
                        </Button>
                      )}
                      {opportunity.contact_whatsapp && (
                        <Button variant="outline" className="w-full" onClick={() => handleContact('whatsapp')}>
                          <MessageCircle className="w-4 h-4 mr-2" />
                          WhatsApp
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Campus Safety Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  Campus Safety Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    Meet in public campus locations
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    Bring a friend for high-value items
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    Verify seller's student status
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    Use Mobile Money for secure payments
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    Report suspicious activity to campus security
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <ChatModal
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        otherUserId={opportunity?.user_id || ''}
        otherUserName={userProfile?.full_name || 'Student'}
        opportunityTitle={opportunity?.title || ''}
      />
    </div>
  );
};

export default ProductDetail;
