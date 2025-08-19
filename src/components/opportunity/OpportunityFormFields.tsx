import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

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
  image_url: string;
  image_file?: File;
  contact_email?: string;
  contact_phone?: string;
  contact_whatsapp?: string;
}

interface OpportunityFormFieldsProps {
  formData: FormData;
  onInputChange: (field: string, value: string | File) => void;
  getAvailableCategories: () => string[];
}

const OpportunityFormFields = ({ formData, onInputChange, getAvailableCategories }: OpportunityFormFieldsProps) => {
  const universities = [
    'University of Ghana (UG)',
    'Kwame Nkrumah University of Science and Technology (KNUST)',
    'University of Cape Coast (UCC)',
    'Ghana Institute of Management and Public Administration (GIMPA)',
    'Ashesi University',
    'University of Development Studies (UDS)',
    'University of Education, Winneba (UEW)',
    'Ho Technical University (HTU)',
    'All Universities'
  ];

  const [previewUrl, setPreviewUrl] = useState('');

  // Cleanup preview URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">
            {formData.opportunity_type === 'item' ? 'Item Name' : 'Job Title'} *
          </Label>
          <Input
            id="title"
            placeholder={
              formData.opportunity_type === 'item' 
                ? 'e.g., MacBook Air M1' 
                : 'e.g., Frontend Developer Needed'
            }
            value={formData.title}
            onChange={(e) => onInputChange('title', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => onInputChange('category', value)}
            disabled={!formData.opportunity_type}
          >
            <SelectTrigger>
              <SelectValue placeholder={
                !formData.opportunity_type 
                  ? 'Select type first' 
                  : 'Select category'
              } />
            </SelectTrigger>
            <SelectContent>
              {getAvailableCategories().map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">
            {formData.opportunity_type === 'item' ? 'Price' : 'Salary'} (GHS) *
          </Label>
          <Input
            id="price"
            type="number"
            placeholder={
              formData.opportunity_type === 'item' 
                ? 'e.g., 2500' 
                : 'e.g., 1500 (monthly)'
            }
            value={formData.price}
            onChange={(e) => onInputChange('price', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            placeholder="e.g., Accra, Greater Accra"
            value={formData.location}
            onChange={(e) => onInputChange('location', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="university">Target University</Label>
          <Select 
            value={formData.university} 
            onValueChange={(value) => onInputChange('university', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select university" />
            </SelectTrigger>
            <SelectContent>
              {universities.map((uni) => (
                <SelectItem key={uni} value={uni}>
                  {uni}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Image Upload</Label>
          <div className="space-y-3">
            {/* File Upload Input */}
            <div className="flex items-center gap-3">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Validate file size (5MB limit)
                    if (file.size > 5 * 1024 * 1024) {
                      toast.error('File size must be less than 5MB. Please choose a smaller image.');
                      return;
                    }
                    
                    // Clean up previous preview URL to prevent memory leaks
                    if (previewUrl) {
                      URL.revokeObjectURL(previewUrl);
                    }
                    
                    onInputChange('image_file', file);
                    // Create a preview URL for display only (don't store in form data)
                    const newPreviewUrl = URL.createObjectURL(file);
                    // Store the preview URL separately for display purposes
                    setPreviewUrl(newPreviewUrl);
                  }
                }}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  // Clean up the preview URL to prevent memory leaks
                  if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                  }
                  onInputChange('image_file', undefined as any);
                  onInputChange('image_url', '');
                  setPreviewUrl('');
                }}
                className="text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Image Preview */}
            {(formData.image_url || previewUrl) && (
              <div className="relative">
                <div className="w-full max-w-xs rounded-lg border border-gray-200 overflow-hidden">
                  <img
                    src={formData.image_url || previewUrl}
                    alt="Preview"
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-2 bg-gray-50 text-xs text-gray-600">
                    {formData.image_file ? (
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-3 h-3" />
                        {formData.image_file.name}
                        <span className="text-gray-400">
                          ({(formData.image_file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-3 h-3" />
                        Image preview
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Upload Instructions */}
            <div className="text-xs text-gray-500 space-y-1">
              <p>• Supported formats: JPG, PNG, GIF, WebP</p>
              <p>• Maximum file size: 5MB</p>
              <p>• Recommended dimensions: 800x600 pixels</p>
              <p>• <strong>Tip:</strong> Smaller files upload faster!</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          {formData.opportunity_type === 'item' ? 'Item Description' : 'Job Description'} *
        </Label>
        <Textarea
          id="description"
          placeholder={
            formData.opportunity_type === 'item'
              ? 'Describe the item condition, specifications, reason for selling...'
              : 'Provide detailed information about the job role, responsibilities, and company...'
          }
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="requirements">
          {formData.opportunity_type === 'item' ? 'Additional Details' : 'Requirements'} (one per line)
        </Label>
        <Textarea
          id="requirements"
          placeholder={
            formData.opportunity_type === 'item'
              ? 'Original packaging included&#10;1 year warranty remaining&#10;Minor scratches on back'
              : 'React.js experience&#10;Portfolio required&#10;Available weekends'
          }
          value={formData.requirements}
          onChange={(e) => onInputChange('requirements', e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact_info">Contact Information</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contact_email" className="text-sm">Email</Label>
            <Input
              id="contact_email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.contact_email || ''}
              onChange={(e) => onInputChange('contact_email', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contact_phone" className="text-sm">Phone</Label>
            <Input
              id="contact_phone"
              type="tel"
              placeholder="+233123456789"
              value={formData.contact_phone || ''}
              onChange={(e) => onInputChange('contact_phone', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contact_whatsapp" className="text-sm">WhatsApp (Optional)</Label>
            <Input
              id="contact_whatsapp"
              type="tel"
              placeholder="+233123456789"
              value={formData.contact_whatsapp || ''}
              onChange={(e) => onInputChange('contact_whatsapp', e.target.value)}
            />
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Your profile email will be used if contact email is left empty.
        </p>
      </div>
    </>
  );
};

export default OpportunityFormFields;
