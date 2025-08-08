import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logSupabaseError, getUserFriendlyErrorMessage } from '@/lib/errorUtils';
import { jobCategories, itemCategories } from '@/constants/opportunityCategories';

interface FormData {
  title: string;
  description: string;
  category: string;
  opportunity_type: string;
  price: string;
  currency: string;
  location: string;
  university: string;
  requirements: string;
  contact_info: string;
  image_url: string;
}

export const useOpportunityForm = (onSuccess: () => void) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    opportunity_type: '',
    price: '',
    currency: 'GHS',
    location: '',
    university: '',
    requirements: '',
    contact_info: '',
    image_url: ''
  });
  const [loading, setLoading] = useState(false);

  const getAvailableCategories = () => {
    if (formData.opportunity_type === 'item') {
      return itemCategories;
    }
    return jobCategories;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      // Reset category when opportunity type changes
      if (field === 'opportunity_type') {
        newData.category = '';
      }
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const requirementsArray = formData.requirements
        .split('\n')
        .filter(req => req.trim() !== '')
        .map(req => req.trim());

      let contactInfo = {};
      if (formData.contact_info) {
        try {
          contactInfo = JSON.parse(formData.contact_info);
        } catch {
          contactInfo = { info: formData.contact_info };
        }
      }

      const { error } = await supabase
        .from('opportunities')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          opportunity_type: formData.opportunity_type,
          price: parseFloat(formData.price),
          currency: formData.currency,
          location: formData.location,
          university: formData.university === 'All Universities' ? null : formData.university,
          requirements: requirementsArray.length > 0 ? requirementsArray : null,
          contact_info: Object.keys(contactInfo).length > 0 ? contactInfo : null,
          image_url: formData.image_url || null
        });

      if (error) throw error;

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        opportunity_type: '',
        price: '',
        currency: 'GHS',
        location: '',
        university: '',
        requirements: '',
        contact_info: '',
        image_url: ''
      });

      toast.success('Opportunity posted successfully!');
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Error posting opportunity');
      console.error('Error posting opportunity:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    handleInputChange,
    handleSubmit,
    getAvailableCategories
  };
};
