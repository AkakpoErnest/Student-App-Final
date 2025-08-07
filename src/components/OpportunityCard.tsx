
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, User, ShoppingCart, Briefcase, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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
}

interface OpportunityCardProps {
  opportunity: Opportunity;
  showPayButton?: boolean;
  isOwner?: boolean;
  onPayClick?: () => void;
}

const OpportunityCard = ({ opportunity, showPayButton = true, isOwner = false, onPayClick }: OpportunityCardProps) => {
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    fetchUserProfile();
  }, [opportunity.user_id]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, university, verification_status')
        .eq('id', opportunity.user_id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error);
        return;
      }

      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
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

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
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
            <Badge variant="outline" className="text-xs text-green-600 border-green-200">
              {opportunity.university || userProfile?.university}
            </Badge>
          )}
        </div>
        
        <CardTitle className="text-lg sm:text-xl line-clamp-2 leading-tight">
          {opportunity.title}
        </CardTitle>
        
        <CardDescription className="line-clamp-3 text-sm">
          {opportunity.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between pt-0">
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-green-600">
              {opportunity.currency} {opportunity.price}
            </span>
          </div>

          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{opportunity.location}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>{formatTimeAgo(opportunity.created_at)}</span>
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
              <p className="font-medium text-gray-700 mb-1">
                {opportunity.opportunity_type === 'item' ? 'Details:' : 'Requirements:'}
              </p>
              <ul className="text-gray-600 space-y-1">
                {opportunity.requirements.slice(0, 2).map((req, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-sm truncate">{req}</span>
                  </li>
                ))}
                {opportunity.requirements.length > 2 && (
                  <li className="text-xs text-gray-500">
                    +{opportunity.requirements.length - 2} more...
                  </li>
                )}
              </ul>
            </div>
          )}
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
          ) : (
            !isOwner && (
              <Button variant="outline" className="flex-1">
                {opportunity.opportunity_type === 'item' ? 'Contact Seller' : 'Apply Now'}
              </Button>
            )
          )}
          
          <Button variant="outline" size="sm" className="sm:w-auto">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OpportunityCard;
