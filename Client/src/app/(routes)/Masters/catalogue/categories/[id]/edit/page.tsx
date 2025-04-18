/**
 * Edit Category Page
 * 
 * Page component for editing an existing category
 */
'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { 
  Box, 
  Typography, 
  Breadcrumbs, 
  Link as MuiLink, 
  Alert, 
  Button,
  Paper,
  Stack
} from '@mui/material';
import Link from 'next/link';
import EditIcon from '@mui/icons-material/Edit';
import { useFetchCategory, useUpdateCategory } from '@/app/hooks/api/catalogue';
import CategoryForm from '@/app/components/admin/catalogue/forms/CategoryForm';
import { CategoryFormValues } from '@/app/components/admin/catalogue/schemas';
import { Category } from '@/app/types/catalogue';
import Loader from '@/app/components/common/Loader';
import Notification from '@/app/components/common/Notification';
import useNotification from '@/app/hooks/useNotification';
import { formatDateTime } from '@/app/utils/dateUtils';

const EditCategoryPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const categoryId = typeof params.id === 'string' ? Number(params.id) : -1;
  
  // State to track if edit mode is enabled
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Notification state
  const { 
    notification, 
    showSuccess, 
    showError, 
    hideNotification 
  } = useNotification();
  
  // Fetch category data
  const { 
    data: category, 
    isLoading, 
    isError: isFetchError, 
    error: fetchError 
  } = useFetchCategory(categoryId);
  
  // Update category mutation
  const { 
    mutate: updateCategory, 
    isPending: isUpdating, 
    isError: isUpdateError, 
    error: updateError 
  } = useUpdateCategory();
  
  // Toggle edit mode
  const handleEnableEdit = () => {
    setIsEditMode(true);
  };
  
  // Handle form submission
  const handleSubmit = (data: CategoryFormValues) => {
    if (category) {
      // Create a properly typed update object that matches the Category interface
      const updateData: Category = {
        id: categoryId,
        name: data.name,
        description: data.description || undefined,
        is_active: data.is_active,
        division: data.division,
        image: data.image || undefined,
        image_alt_text: data.image_alt_text || undefined,
        default_tax_rate: Number(data.default_tax_rate),
        tax_inclusive: data.tax_inclusive,
        sort_order: Number(data.sort_order),
        created_at: category.created_at,
        updated_at: category.updated_at,
        // Include any other fields from the original category that aren't in the form
        division_name: category.division_name,
        created_by: category.created_by,
        updated_by: category.updated_by
      };
      
      updateCategory(updateData, {
        onSuccess: () => {
          // Show success notification
          showSuccess(t('catalogue.category.updateSuccess'));
          // Redirect to categories list page on success
          router.push('/Masters/catalogue/categories');
        },
        onError: (error: unknown) => {
          showError(error instanceof Error ? error.message : t('error'));
        }
      });
    }
  };

  // Show loading state while fetching category data
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <Loader message={t('catalogue.loading')} />
      </Box>
    );
  }

  // Show error message if category not found or invalid ID
  if (!category || categoryId === -1) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {t('catalogue.categoryNotFound')}
        </Alert>
        <Button 
          component={Link} 
          href="/Masters/catalogue/categories"
          variant="contained" 
          sx={{ mt: 2 }}
        >
          {t('back')}
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <MuiLink component={Link} href="/Masters" underline="hover" color="inherit">
          {t('dashboard')}
        </MuiLink>
        <MuiLink component={Link} href="/Masters/catalogue/categories" underline="hover" color="inherit">
          {t('catalogue.categories')}
        </MuiLink>
        <Typography color="text.primary">
          {isEditMode ? t('edit') : t('view')}
        </Typography>
      </Breadcrumbs>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          {isEditMode ? t('Category Edit') : t('Category Details')}: {category.name}
        </Typography>
        
        {!isEditMode && (
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEnableEdit}
          >
            {t('edit')}
          </Button>
        )}
      </Box>
      
      {/* Error messages */}
      {isFetchError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {fetchError instanceof Error ? fetchError.message : t('error')}
        </Alert>
      )}
      
      {isUpdateError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {updateError instanceof Error ? updateError.message : t('error')}
        </Alert>
      )}
      
      {/* Category form */}
      <Paper sx={{ p: 3 }}>
        {isUpdating ? (
          <Loader message={t('catalogue.saving')} />
        ) : (
          <CategoryForm 
            defaultValues={{
              id: category.id,
              name: category.name,
              description: category.description || '',
              is_active: category.is_active,
              division: category.division,
              image: category.image || '',
              image_alt_text: category.image_alt_text || '',
              default_tax_rate: category.default_tax_rate || 0,
              tax_inclusive: category.tax_inclusive || false,
              sort_order: category.sort_order || 0
            }}
            onSubmit={handleSubmit}
            isSubmitting={isUpdating}
            readOnly={!isEditMode}
          />
        )}
      </Paper>
      

         {/* Audit Information */}
         {!isEditMode && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('auditInformation')}
          </Typography>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="body1" fontWeight="bold" sx={{ width: 150 }}>
                {t('createdBy')}:
              </Typography>
              <Typography variant="body1">
                {category.created_by?.username || 'N/A'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="body1" fontWeight="bold" sx={{ width: 150 }}>
                {t('createdAt')}:
              </Typography>
              <Typography variant="body1">
                {formatDateTime(category.created_at)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="body1" fontWeight="bold" sx={{ width: 150 }}>
                {t('updatedBy')}:
              </Typography>
              <Typography variant="body1">
                {category.updated_by?.username || 'N/A'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="body1" fontWeight="bold" sx={{ width: 150 }}>
                {t('updatedAt')}:
              </Typography>
              <Typography variant="body1">
                {formatDateTime(category.updated_at)}
              </Typography>
            </Box>
          </Stack>
        </Paper>
      )}
      {/* Notification */}
      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={hideNotification}
      />
    </Box>
  );
};

export default EditCategoryPage;
