
import React from 'react';
import { Label } from '@/components/ui/label';
import { Briefcase, ShoppingCart, GraduationCap } from 'lucide-react';

interface OpportunityType {
  value: string;
  label: string;
  icon: React.ComponentType<any>;
  description: string;
}

interface OpportunityTypeSelectorProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

const OpportunityTypeSelector = ({ selectedType, onTypeChange }: OpportunityTypeSelectorProps) => {
  const opportunityTypes: OpportunityType[] = [
    { value: 'job', label: 'Job', icon: Briefcase, description: 'Full-time or part-time employment' },
    { value: 'internship', label: 'Internship', icon: GraduationCap, description: 'Learning opportunities and work experience' },
    { value: 'item', label: 'Item for Sale', icon: ShoppingCart, description: 'Physical items, textbooks, electronics, etc.' }
  ];

  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">What are you posting?</Label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {opportunityTypes.map((type) => {
          const Icon = type.icon;
          return (
            <div
              key={type.value}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedType === type.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onTypeChange(type.value)}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-6 h-6 ${
                  selectedType === type.value ? 'text-blue-600' : 'text-gray-400'
                }`} />
                <div>
                  <h3 className="font-medium">{type.label}</h3>
                  <p className="text-sm text-gray-500">{type.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OpportunityTypeSelector;
