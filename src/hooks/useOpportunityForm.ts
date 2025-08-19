
import { useState, useEffect } from 'react';
import { getCurrentUser, db, storage } from '@/integrations/firebase/client';
import { doc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'sonner';
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
  contact_email: string;
  contact_phone: string;
  contact_whatsapp: string;
  image_url: string;
  image_file?: File;
}

export const useOpportunityForm = (onSuccess: () => void, initialData?: any) => {
  const [formData, setFormData] = useState<FormData>(() => {
    // If editing, use the initial data, otherwise load from localStorage
    if (initialData) {
      return {
        title: initialData.title || '',
        description: initialData.description || '',
        category: initialData.category || '',
        opportunity_type: initialData.opportunity_type || '',
        price: initialData.price?.toString() || '',
        currency: initialData.currency || 'GHS',
        location: initialData.location || '',
        university: initialData.university || '',
        requirements: initialData.requirements?.join('\n') || '',
        contact_email: initialData.contact_email || '',
        contact_phone: initialData.contact_phone || '',
        contact_whatsapp: initialData.contact_whatsapp || '',
        image_url: initialData.image_url || '',
        image_file: undefined
      };
    }
    
    // Try to load saved form data from localStorage
    const savedData = localStorage.getItem('opportunityFormData');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }
    
    // Return default form data if nothing saved
    return {
      title: '',
      description: '',
      category: '',
      opportunity_type: '',
      price: '',
      currency: 'GHS',
      location: '',
      university: '',
      requirements: '',
      contact_email: '',
      contact_phone: '',
      contact_whatsapp: '',
      image_url: '',
      image_file: undefined
    };
  });
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [isEditing, setIsEditing] = useState(!!initialData);

  // Save form data to localStorage whenever it changes (only for new posts)
  useEffect(() => {
    if (!isEditing) {
      // Don't save image_file to localStorage (it's not serializable)
      const dataToSave = { ...formData };
      delete dataToSave.image_file;
      
      localStorage.setItem('opportunityFormData', JSON.stringify(dataToSave));
    }
  }, [formData, isEditing]);

  const getAvailableCategories = () => {
    if (formData.opportunity_type === 'item') {
      return itemCategories;
    }
    return jobCategories;
  };

  const handleInputChange = (field: string, value: string | File) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      // Reset category when opportunity type changes
      if (field === 'opportunity_type') {
        newData.category = '';
      }
      return newData;
    });
  };

  // Function to clear saved form data
  const clearFormData = () => {
    localStorage.removeItem('opportunityFormData');
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
      contact_email: '',
      contact_phone: '',
      contact_whatsapp: '',
      image_url: '',
      image_file: undefined
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) return;
    
    try {
      setLoading(true);
      setUploadProgress('Validating form...');
      
      // Basic validation
      if (!formData.title.trim() || !formData.description.trim() || !formData.category || !formData.price) {
        toast.error('Please fill in all required fields');
        setLoading(false);
        setUploadProgress('');
        return;
      }

      const user = getCurrentUser();
      if (!user) {
        toast.error('Please log in to post opportunities');
        setLoading(false);
        setUploadProgress('');
        return;
      }

      let imageUrl = formData.image_url;

      // Handle image upload if there's a file
      if (formData.image_file) {
        try {
          // Validate file before upload
          if (!formData.image_file || formData.image_file.size === 0) {
            throw new Error('Invalid image file');
          }
          
          setUploadProgress('Preparing image for upload...');
          console.log('Starting image upload to Firebase Storage...');
          console.log('File details:', {
            name: formData.image_file.name,
            size: formData.image_file.size,
            type: formData.image_file.type
          });
          
          // Compress image if it's too large
          let fileToUpload = formData.image_file;
          if (formData.image_file.size > 1024 * 1024) { // If larger than 1MB
            setUploadProgress('Compressing image for faster upload...');
            // Simple compression by reducing quality
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            await new Promise((resolve) => {
              img.onload = resolve;
              img.src = URL.createObjectURL(formData.image_file);
            });
            
            // Calculate new dimensions (max 800px width/height)
            const maxSize = 800;
            let { width, height } = img;
            if (width > height && width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            } else if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
            
            canvas.width = width;
            canvas.height = height;
            ctx?.drawImage(img, 0, 0, width, height);
            
            // Convert to blob with reduced quality
            canvas.toBlob((blob) => {
              if (blob) {
                fileToUpload = new File([blob], formData.image_file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                });
                console.log('Image compressed:', {
                  originalSize: formData.image_file.size,
                  compressedSize: fileToUpload.size
                });
              }
            }, 'image/jpeg', 0.8); // 80% quality
          }
          
          setUploadProgress('Uploading image...');
          
          // Create a unique filename
          const fileExtension = fileToUpload.name.split('.').pop();
          const fileName = `opportunities/${user.uid}_${Date.now()}.${fileExtension}`;
          console.log('Uploading to path:', fileName);
          
          const storageRef = ref(storage, fileName);
          console.log('Storage reference created:', storageRef);
          
          // Upload the file
          console.log('Starting upload...');
          const uploadResult = await uploadBytes(storageRef, fileToUpload);
          console.log('Upload completed:', uploadResult);
          
          setUploadProgress('Getting image URL...');
          console.log('Getting download URL...');
          
          // Get the download URL
          imageUrl = await getDownloadURL(storageRef);
          console.log('Download URL obtained:', imageUrl);
          
          setUploadProgress('Image uploaded successfully!');
          toast.success('Image uploaded successfully!');
        } catch (uploadError: any) {
          console.error('Firebase Storage upload error:', uploadError);
          console.error('Error details:', {
            code: uploadError.code,
            message: uploadError.message,
            stack: uploadError.stack
          });
          
          // More specific error messages
          let errorMessage = 'Failed to upload image. Please try again.';
          if (uploadError.code === 'storage/unauthorized') {
            errorMessage = 'Storage access denied. Please check your Firebase configuration.';
          } else if (uploadError.code === 'storage/quota-exceeded') {
            errorMessage = 'Storage quota exceeded. Please try a smaller image.';
          } else if (uploadError.code === 'storage/unauthenticated') {
            errorMessage = 'Authentication required. Please log in again.';
          }
          
          toast.error(errorMessage);
          setLoading(false);
          setUploadProgress('');
          return;
        }
      } else if (formData.image_url && formData.image_url.startsWith('blob:')) {
        // If we have a blob URL but no file, clear it as it's not persistent
        console.log('Clearing blob URL as no file was uploaded');
        imageUrl = '';
      } else {
        console.log('No image file to upload');
      }

      // Validate contact information
      if (!formData.contact_email && !formData.contact_phone && !formData.contact_whatsapp) {
        toast.error('Please provide at least one contact method (email, phone, or WhatsApp)');
        setLoading(false);
        setUploadProgress('');
        return;
      }

      setUploadProgress('Creating opportunity...');

      const requirementsArray = formData.requirements
        .split('\n')
        .filter(req => req.trim() !== '')
        .map(req => req.trim());

      const opportunityId = isEditing ? initialData.id : `opp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const opportunityData = {
        user_id: user.uid,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        opportunity_type: formData.opportunity_type,
        price: parseFloat(formData.price),
        currency: formData.currency,
        location: formData.location,
        university: formData.university === 'All Universities' ? null : formData.university,
        requirements: requirementsArray.length > 0 ? requirementsArray : null,
        contact_email: formData.contact_email || null,
        contact_phone: formData.contact_phone || null,
        contact_whatsapp: formData.contact_whatsapp || null,
        image_url: imageUrl || null,
        status: 'active',
        created_at: isEditing ? initialData.created_at : new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (isEditing) {
        // Update existing opportunity
        await updateDoc(doc(db, 'opportunities', opportunityId), opportunityData);
        setUploadProgress('Opportunity updated successfully!');
        toast.success('Opportunity updated successfully!');
      } else {
        // Create new opportunity
        await setDoc(doc(db, 'opportunities', opportunityId), opportunityData);
        setUploadProgress('Opportunity created successfully!');

        // Award tokens for posting opportunity (only for new posts)
        try {
          setUploadProgress('Claiming your reward tokens...');
          
          // Update user's token balance
          const userProfileRef = doc(db, 'profiles', user.uid);
          await updateDoc(userProfileRef, {
            tokens: increment(50), // Award 50 tokens for posting
            total_opportunities_posted: increment(1),
            last_token_claim: new Date().toISOString()
          });
          
          toast.success('🎉 You earned 50 tokens for posting this opportunity!');
          console.log('Tokens awarded successfully');
        } catch (tokenError) {
          console.error('Error awarding tokens:', tokenError);
          // Don't fail the whole operation if token claiming fails
          toast.error('Opportunity posted, but token claiming failed');
        }
      }

      // Clear saved form data from localStorage and reset form
      clearFormData();

      toast.success('Opportunity posted successfully!');
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Error posting opportunity');
      console.error('Error posting opportunity:', error);
    } finally {
      setLoading(false);
      setUploadProgress('');
    }
  };

  return {
    formData,
    loading,
    uploadProgress,
    handleInputChange,
    handleSubmit,
    getAvailableCategories,
    clearFormData,
    tokensEarned: 50, // Return the tokens earned for posting
    isEditing
  };
};
