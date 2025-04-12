'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Import components and hooks
import ProductForm from '@/app/components/admin/products/forms/ProductForm';
import { useCreateProduct } from '@/app/hooks/api/products';
import { ProductFormData } from '@/app/components/admin/products/forms/ProductForm.schema';

export default function AddProductPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // Create product mutation
  const createProduct = useCreateProduct();
  
  // State for draft saving
  const [savingDraft, setSavingDraft] = useState(false);

  // Handle form submission
  const handleCreateProduct = async (data: ProductFormData) => {
    try {
      await createProduct.mutateAsync(data);
      setSnackbar({
        open: true,
        message: t('products.createSuccess'),
        severity: 'success'
      });
      
      // Navigate back to products list after successful creation
      setTimeout(() => {
        router.push('/Masters/products');
      }, 1500);
    } catch (error) {
      console.error('Error creating product:', error);
      setSnackbar({
        open: true,
        message: t('products.createError'),
        severity: 'error'
      });
    }
  };
  


  return (
    <Box sx={{ pb: 10 }}> 
    
          <ProductForm onSubmit={handleCreateProduct} />
       



    </Box>
  );
}
