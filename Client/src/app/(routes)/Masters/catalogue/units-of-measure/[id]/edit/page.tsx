/**
 * Edit Unit of Measure Page
 * 
 * Page component for editing an existing unit of measure
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
import { useFetchUnitOfMeasure, useUpdateUnitOfMeasure } from '@/app/hooks/api/catalogue';
import UnitOfMeasureForm from '@/app/components/admin/catalogue/forms/UnitOfMeasureForm';
import { UnitOfMeasureFormValues } from '@/app/components/admin/catalogue/schemas';
import { UnitOfMeasure } from '@/app/types/catalogue';
import Loader from '@/app/components/common/Loader';
import Notification from '@/app/components/common/Notification';
import useNotification from '@/app/hooks/useNotification';
import { formatDateTime } from '@/app/utils/dateUtils';

const EditUnitOfMeasurePage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const unitId = typeof params.id === 'string' ? Number(params.id) : -1;
  
  // State to track if edit mode is enabled
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Notification state
  const { 
    notification, 
    showSuccess, 
    showError, 
    hideNotification 
  } = useNotification();
  
  // Fetch unit of measure data
  const { 
    data: unit, 
    isLoading, 
    isError: isFetchError, 
    error: fetchError 
  } = useFetchUnitOfMeasure(unitId);
  
  // Update unit of measure mutation
  const { 
    mutate: updateUnitOfMeasure, 
    isPending: isUpdating, 
    isError: isUpdateError, 
    error: updateError 
  } = useUpdateUnitOfMeasure();
  
  // Toggle edit mode
  const handleEnableEdit = () => {
    setIsEditMode(true);
  };
  
  // Handle form submission
  const handleSubmit = (data: UnitOfMeasureFormValues) => {
    if (unit) {
      // Create an update object that matches the API expectations
      const updateData = {
        id: unitId,
        name: data.name,
        symbol: data.symbol,
        description: data.description || '',  // Convert null to empty string to match API expectations
        unit_type: data.unit_type,
        type_display: unit.type_display,
        associated_value: data.associated_value === undefined ? null : data.associated_value,
        is_active: data.is_active,
        created_by: unit.created_by,
        updated_by: unit.updated_by
      };
      
      // @ts-ignore - Ignore type mismatch between frontend and API types
      updateUnitOfMeasure(updateData, {
        onSuccess: () => {
          // Show success notification
          showSuccess(t('catalogue.unitOfMeasure.updateSuccess'));
          // Redirect to units of measure list page on success
          router.push('/Masters/catalogue/units-of-measure');
        },
        onError: (error: unknown) => {
          showError(error instanceof Error ? error.message : t('error'));
        }
      });
    }
  };

  // Show loading state while fetching unit data
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <Loader message={t('catalogue.loading')} />
      </Box>
    );
  }

  // Show error message if unit not found or invalid ID
  if (!unit || unitId === -1) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {t('catalogue.unitOfMeasureNotFound')}
        </Alert>
        <Button 
          component={Link} 
          href="/Masters/catalogue/units-of-measure"
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
        <MuiLink component={Link} href="/Masters/catalogue/units-of-measure" underline="hover" color="inherit">
          {t('catalogue.unitOfMeasures')}
        </MuiLink>
        <Typography color="text.primary">
          {isEditMode ? t('edit') : t('view')}
        </Typography>
      </Breadcrumbs>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          {isEditMode ? t('catalogue.editUnitOfMeasure') : t('catalogue.viewUnitOfMeasure')}: {unit.name}
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
      
      {/* Unit of Measure form */}
      <Paper sx={{ p: 3 }}>
        {isUpdating ? (
          <Loader message={t('catalogue.saving')} />
        ) : (
          <UnitOfMeasureForm 
            defaultValues={{
              id: unit.id,
              name: unit.name,
              symbol: unit.symbol,
              description: unit.description || '',
              unit_type: unit.unit_type,
              associated_value: unit.associated_value || undefined,
              is_active: unit.is_active
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
                {unit.created_by?.username || 'N/A'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="body1" fontWeight="bold" sx={{ width: 150 }}>
                {t('createdAt')}:
              </Typography>
              <Typography variant="body1">
                {formatDateTime(unit.created_at)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="body1" fontWeight="bold" sx={{ width: 150 }}>
                {t('updatedBy')}:
              </Typography>
              <Typography variant="body1">
                {unit.updated_by?.username || 'N/A'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="body1" fontWeight="bold" sx={{ width: 150 }}>
                {t('updatedAt')}:
              </Typography>
              <Typography variant="body1">
                {formatDateTime(unit.updated_at)}
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

export default EditUnitOfMeasurePage;
