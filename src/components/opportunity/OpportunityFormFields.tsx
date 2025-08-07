import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

interface OpportunityFormFieldsProps {
  formData: FormData;
  onInputChange: (field: string, value: string) => void;
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
          <Label htmlFor="image_url">Image URL (optional)</Label>
          <Input
            id="image_url"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={formData.image_url}
            onChange={(e) => onInputChange('image_url', e.target.value)}
          />
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
        <Textarea
          id="contact_info"
          placeholder='{"email": "contact@example.com", "phone": "+233123456789", "whatsapp": "+233123456789"}'
          value={formData.contact_info}
          onChange={(e) => onInputChange('contact_info', e.target.value)}
          rows={2}
        />
        <p className="text-xs text-gray-500">
          Enter as JSON format or plain text. Your profile email will be used if left empty.
        </p>
      </div>
    </>
  );
};

export default OpportunityFormFields;
