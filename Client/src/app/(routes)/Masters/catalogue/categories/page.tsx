/**
 * Categories Listing Page
 * 
 * Page component for listing, filtering, and managing categories
 */
'use client';

import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import {
  Box,
  Button,
  Paper,
  Typography,
  TextField,
  IconButton,
  Chip,
  Alert,
  Grid,
  FormControlLabel,
  Switch,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar
} from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFetchCategories, useDeleteCategory, useFetchDivisions } from '@/app/hooks/api/catalogue';
import DeleteConfirmationDialog from '@/app/components/admin/catalogue/DeleteConfirmationDialog';
import { Category, CatalogueFilter, Division } from '@/app/types/catalogue';
import Loader from '@/app/components/common/Loader';
import Notification from '@/app/components/common/Notification';
import useNotification from '@/app/hooks/useNotification';
import { formatDate, formatDateTime } from '@/app/utils/dateUtils';

const CategoriesPage = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<CatalogueFilter>({
    search: '',
    is_active: undefined,
    division: undefined
  });
  
  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  
  // Notification state
  const { 
    notification, 
    showSuccess, 
    showError, 
    hideNotification 
  } = useNotification();

  // Fetch categories data
  const { 
    data, 
    isLoading: isLoadingCategories, 
    isError: isCategoriesError, 
    error: categoriesError 
  } = useFetchCategories(filters);
  
  // Fetch divisions for filter dropdown
  const { 
    data: divisions, 
    isLoading: isLoadingDivisions 
  } = useFetchDivisions();
  
  // Process data to add username fields directly and format dates
  const processedData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map((item: Category) => ({
      ...item,
      createdByUsername: item.created_by?.username || 'N/A',
      updatedByUsername: item.updated_by?.username || 'N/A',
      formattedCreatedAt: formatDateTime(item.created_at),
      formattedUpdatedAt: formatDateTime(item.updated_at)
    }));
  }, [data]);
  
  // Delete category mutation
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();
  

  
  // Handle delete button click
  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };
  
  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete.id, {
        onSuccess: () => {
          showSuccess(t('deleteSuccess'));
          setDeleteDialogOpen(false);
          setCategoryToDelete(null);
        },
        onError: (error: unknown) => {
          showError(error instanceof Error ? error.message : t('error'));
        }
      });
    }
  };

  // DataGrid columns definition
  const columns: GridColDef[] = [
    { 
      field: 'id', 
      headerName: t('id'), 
      width: 70 
    },
    { 
      field: 'actions', 
      headerName: t('actions'), 
      width: 120,
      sortable: false,
      renderCell: (params: GridRenderCellParams<any>) => (
        <Box>
          <Tooltip title={t('edit')}>
            <IconButton 
              component={Link} 
              href={`/Masters/catalogue/categories/${params.row.id}/edit`}
              size="small"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('delete')}>
            <IconButton 
              onClick={() => handleDeleteClick(params.row as Category)}
              size="small"
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    },
    { 
      field: 'name', 
      headerName: t('name'), 
      width: 200,
      flex: 1
    },
    { 
      field: 'description', 
      headerName: t('description'), 
      width: 300,
      flex: 1,
      renderCell: (params: GridRenderCellParams<any>) => (
        <Tooltip title={params.value || ''}>
          <Typography variant="body2" sx={{ 
            overflow: 'hidden', 
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%'
          }}>
            {params.value}
          </Typography>
        </Tooltip>
      )
    },
    { 
      field: 'division_name', 
      headerName: t('division'), 
      width: 150
    },
    { 
      field: 'default_tax_rate', 
      headerName: t('defaultTaxRate'), 
      width: 100,
    },
    { 
      field: 'tax_inclusive', 
      headerName: t('taxInclusive'), 
      width: 100,
     
    },
    { 
      field: 'is_active', 
      headerName: t('isActive'), 
      width: 100,
    },
    { 
      field: 'formattedCreatedAt', 
      headerName: t('createdAt'), 
      width: 100
    },
    { 
      field: 'createdByUsername', 
      headerName: t('createdBy'), 
      width: 100
    },
    { 
      field: 'formattedUpdatedAt', 
      headerName: t('updatedAt'), 
      width: 100
    },
    { 
      field: 'updatedByUsername', 
      headerName: t('updatedBy'), 
      width: 100
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">{t('categories')}</Typography>
        <Button
          component={Link}
          href="/Masters/catalogue/categories/add"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          {t('addCategory')}
        </Button>
      </Box>
      
   
      
      {/* Error message */}
      {isCategoriesError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {categoriesError instanceof Error ? categoriesError.message : t('error')}
        </Alert>
      )}

      {/* Loading indicator */}
      {(isLoadingCategories || isLoadingDivisions) && <Loader message={t('loading')} />}
      
      {/* Notification */}
      {notification.open && (
        <Notification
          open={notification.open}
          message={notification.message}
          severity={notification.severity}
          onClose={hideNotification}
        />
      )}
      
      {/* Data grid */}
      {!isLoadingCategories && !isLoadingDivisions && (
        <Paper sx={{ width: '100%' }}>
          <DataGrid
            rows={processedData}
            columns={columns}
            loading={isLoadingCategories || isLoadingDivisions}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
              columns: {
                columnVisibilityModel: {
                  id: true,
                  actions: true,
                  name: true,
                  description: true,
                  division_name: true,
                  default_tax_rate: true,
                  tax_inclusive: true,
                  is_active: true,
                  formattedCreatedAt: true,
                  createdByUsername: true,
                  formattedUpdatedAt: true,
                  updatedByUsername: true
                }
              },
              sorting: {
                sortModel: [{ field: 'id', sort: 'asc' }], // Default sort by ID ascending (same as API order)
              }
            }}
            slots={{
              toolbar: GridToolbar
            }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              }
            }}
            getRowId={(row) => row.id}
            autoHeight
            density="comfortable"
            sx={{
              '& .MuiDataGrid-cell': {
                padding: '8px 16px'
              }
            }}
          />
        </Paper>
      )}
      
      {/* Delete confirmation dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        title={t('deleteTitle')}
        message={t('deleteMessage')}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
        isDeleting={isDeleting}
      />
    </Box>
  );
};

export default CategoriesPage;
