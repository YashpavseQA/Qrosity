/**
 * Edit Subcategory Page
 * 
 * Page component for editing an existing subcategory
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
import { useFetchSubcategory, useUpdateSubcategory } from '@/app/hooks/api/catalogue';
import SubcategoryForm from '@/app/components/admin/catalogue/forms/SubcategoryForm';
import { SubcategoryFormValues } from '@/app/components/admin/catalogue/schemas';
import { Subcategory } from '@/app/types/catalogue';
import Loader from '@/app/components/common/Loader';
import Notification from '@/app/components/common/Notification';
import useNotification from '@/app/hooks/useNotification';
import { formatDateTime } from '@/app/utils/dateUtils';

const EditSubcategoryPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const subcategoryId = typeof params.id === 'string' ? Number(params.id) : -1;
  
  // State to track if edit mode is enabled
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Notification state
  const { 
    notification, 
    showSuccess, 
    showError, 
    hideNotification 
  } = useNotification();
  
  // Fetch subcategory data
  const { 
    data: subcategory, 
    isLoading, 
    isError: isFetchError, 
    error: fetchError 
  } = useFetchSubcategory(subcategoryId);
  
  // Update subcategory mutation
  const { 
    mutate: updateSubcategory, 
    isPending: isUpdating, 
    isError: isUpdateError, 
    error: updateError 
  } = useUpdateSubcategory();
  
  // Toggle edit mode
  const handleEnableEdit = () => {
    setIsEditMode(true);
  };
  
  // Handle form submission
  const handleSubmit = (data: SubcategoryFormValues) => {
    if (subcategory) {
      // Create a properly typed update object that matches the Subcategory interface
      const updateData: Subcategory = {
        id: subcategoryId,
        name: data.name,
        description: data.description || undefined,
        is_active: data.is_active,
        category: data.category,
        image: data.image || undefined, // Map image_url to image for the API
        image_alt_text: data.image_alt_text || undefined,
        sort_order: Number(data.sort_order) || 0, // Ensure sort_order is a number
        created_at: subcategory.created_at,
        updated_at: subcategory.updated_at,
        // Include any other fields from the original subcategory that aren't in the form
        category_name: subcategory.category_name,
      };
      
      updateSubcategory(updateData, {
        onSuccess: () => {
          // Show success notification
          showSuccess(t('catalogue.subcategory.updateSuccess'));
          // Redirect to subcategories list page on success
          router.push('/Masters/catalogue/subcategories');
        },
        onError: (error: unknown) => {
          showError(error instanceof Error ? error.message : t('error'));
        }
      });
    }
  };

  // Show loading state while fetching subcategory data
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <Loader message={t('catalogue.loading')} />
      </Box>
    );
  }

  // Show error message if subcategory not found or invalid ID
  if (!subcategory || subcategoryId === -1) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {t('catalogue.subcategoryNotFound')}
        </Alert>
        <Button 
          component={Link} 
          href="/Masters/catalogue/subcategories"
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
        <MuiLink component={Link} href="/Masters/catalogue/subcategories" underline="hover" color="inherit">
          {t('catalogue.subcategories')}
        </MuiLink>
        <Typography color="text.primary">
          {isEditMode ? t('edit') : t('view')}
        </Typography>
      </Breadcrumbs>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          {isEditMode ? t('Subcategory Edit') : t('Subcategory Details')}: {subcategory.name}
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
      
      {/* Subcategory form */}
      <Paper sx={{ p: 3 }}>
        {isUpdating ? (
          <Loader message={t('catalogue.saving')} />
        ) : (
          <SubcategoryForm 
            readOnly={!isEditMode}
            defaultValues={{
              id: subcategory.id,
              name: subcategory.name,
              description: subcategory.description || '',
              is_active: subcategory.is_active,
              category: subcategory.category,
              image: subcategory.image || '',
              image_alt_text: subcategory.image_alt_text || '',
              sort_order: subcategory.sort_order || 0
            }}
            onSubmit={handleSubmit}
            isSubmitting={isUpdating}
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
                {subcategory.created_by?.username || 'N/A'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="body1" fontWeight="bold" sx={{ width: 150 }}>
                {t('createdAt')}:
              </Typography>
              <Typography variant="body1">
                {formatDateTime(subcategory.created_at)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="body1" fontWeight="bold" sx={{ width: 150 }}>
                {t('updatedBy')}:
              </Typography>
              <Typography variant="body1">
                {subcategory.updated_by?.username || 'N/A'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="body1" fontWeight="bold" sx={{ width: 150 }}>
                {t('updatedAt')}:
              </Typography>
              <Typography variant="body1">
                {formatDateTime(subcategory.updated_at)}
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

export default EditSubcategoryPage;
