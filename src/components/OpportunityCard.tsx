
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, User, ShoppingCart, Briefcase, CheckCircle, Eye, Edit, Trash2 } from 'lucide-react';
import { db } from '@/integrations/firebase/client';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

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

interface OpportunityCardProps {
  opportunity: Opportunity;
  showPayButton?: boolean;
  isOwner?: boolean;
  onPayClick?: () => void;
  onViewDetails?: (opportunity: Opportunity) => void;
  onEdit?: (opportunity: Opportunity) => void;
  onDelete?: (id: string) => void;
  deleting?: boolean;
}

const OpportunityCard = ({ opportunity, showPayButton = true, isOwner = false, onPayClick, onViewDetails, onEdit, onDelete, deleting }: OpportunityCardProps) => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [viewCount, setViewCount] = useState<number>(0);
  const [loadingViews, setLoadingViews] = useState(true);

  useEffect(() => {
    fetchUserProfile();
    fetchViewCount();
  }, [opportunity.user_id, opportunity.id]);

  const fetchUserProfile = async () => {
    try {
      const profileRef = doc(db, 'profiles', opportunity.user_id);
      const profileSnap = await getDoc(profileRef);

      if (profileSnap.exists()) {
        setUserProfile(profileSnap.data());
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchViewCount = async () => {
    try {
      setLoadingViews(true);
      
      // Query opportunity_views collection for this opportunity
      const viewsQuery = query(
        collection(db, 'opportunity_views'),
        where('opportunity_id', '==', opportunity.id)
      );
      
      const viewsSnapshot = await getDocs(viewsQuery);
      const uniqueViews = new Set();
      
      // Count unique viewers (not total views)
      viewsSnapshot.forEach(doc => {
        const viewData = doc.data();
        uniqueViews.add(viewData.viewer_id);
      });
      
      setViewCount(uniqueViews.size);
    } catch (error) {
      console.error('Error fetching view count:', error);
      setViewCount(0);
    } finally {
      setLoadingViews(false);
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

  const handlePayment = () => {
    if (onPayClick) {
      onPayClick();
    }
  };

  const handleApply = (opportunity: Opportunity) => {
    // Placeholder for actual application logic
    console.log('Applying for opportunity:', opportunity);
    // You would typically navigate to a new page or show a modal for application
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      {opportunity.image_url && (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          <img 
            src={opportunity.image_url} 
            alt={opportunity.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant={opportunity.opportunity_type === 'item' ? 'default' : 'secondary'} className="text-xs">
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
          <Badge variant="outline" className="text-xs">
            {opportunity.category}
          </Badge>
          {(opportunity.university || userProfile?.university) && (
            <Badge variant="outline" className="text-xs text-green-600 border-green-200 dark:text-green-400 dark:border-green-600">
              {opportunity.university || userProfile?.university}
            </Badge>
          )}
        </div>
        
        <CardTitle className="text-lg sm:text-xl line-clamp-2 leading-tight text-gray-900 dark:text-white">
          {opportunity.title}
        </CardTitle>
        
        <CardDescription className="line-clamp-3 text-sm text-gray-600 dark:text-gray-300">
          {opportunity.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between pt-0">
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
              {opportunity.currency} {opportunity.price}
            </span>
          </div>

          <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{opportunity.location}</span>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Posted {formatTimeAgo(opportunity.created_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>
                  {loadingViews ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : (
                    `${viewCount} ${viewCount === 1 ? 'view' : 'views'}`
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <User className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">
                {userProfile?.full_name ? `Posted by ${userProfile.full_name}` : 'Posted by student'}
              </span>
              {userProfile?.verification_status === 'verified' && (
                <CheckCircle className="w-3 h-3 text-green-500" />
              )}
            </div>
          </div>

          {opportunity.requirements && opportunity.requirements.length > 0 && (
            <div className="text-sm">
              <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                {opportunity.opportunity_type === 'item' ? 'Details:' : 'Requirements:'}
              </p>
              <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                {opportunity.requirements.slice(0, 2).map((req, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-sm truncate">{req}</span>
                  </li>
                ))}
                {opportunity.requirements.length > 2 && (
                  <li className="text-xs text-gray-500 dark:text-gray-500">
                    +{opportunity.requirements.length - 2} more...
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Contact Information */}
          <div className="text-sm border-t border-gray-200 dark:border-gray-600 pt-3">
            <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Contact Information:</p>
            <div className="space-y-1 text-gray-600 dark:text-gray-400">
              {(opportunity.contact_email || userProfile?.contact_email) && (
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">Email</span>
                  <span className="text-xs">{opportunity.contact_email || userProfile?.contact_email}</span>
                </div>
              )}
              {(opportunity.contact_phone || userProfile?.contact_phone) && (
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">Phone</span>
                  <span className="text-xs">{opportunity.contact_phone || userProfile?.contact_phone}</span>
                </div>
              )}
              {(opportunity.contact_whatsapp || userProfile?.contact_whatsapp) && (
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">WhatsApp</span>
                  <span className="text-xs">{opportunity.contact_whatsapp || userProfile?.contact_whatsapp}</span>
                </div>
              )}
              {!opportunity.contact_email && !opportunity.contact_phone && !opportunity.contact_whatsapp && 
               !userProfile?.contact_email && !userProfile?.contact_phone && !userProfile?.contact_whatsapp && (
                <p className="text-xs text-gray-500 dark:text-gray-500">Contact details not provided</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          {opportunity.opportunity_type === 'item' && showPayButton && !isOwner ? (
            <Button 
              onClick={handlePayment}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Buy Now
            </Button>
          ) : opportunity.opportunity_type === 'job' && showPayButton && !isOwner ? (
            <Button 
              onClick={() => handleApply(opportunity)}
              variant="outline" 
              className="flex-1"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Apply Now
            </Button>
          ) : null}
          
          {isOwner ? (
            <div className="flex gap-2 w-full">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onViewDetails?.(opportunity)}
                className="flex-1"
              >
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onEdit?.(opportunity)}
                className="flex-1"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onDelete?.(opportunity.id)}
                className="flex-1 text-red-600 hover:text-red-700 hover:border-red-300"
                disabled={deleting}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" className="sm:w-auto">
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OpportunityCard;
