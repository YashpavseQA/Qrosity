/**
 * Subcategories Listing Page
 * 
 * Page component for listing, filtering, and managing subcategories
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
import { useFetchSubcategories, useDeleteSubcategory, useFetchCategories } from '@/app/hooks/api/catalogue';
import DeleteConfirmationDialog from '@/app/components/admin/catalogue/DeleteConfirmationDialog';
import { Subcategory, CatalogueFilter, Category } from '@/app/types/catalogue';
import Loader from '@/app/components/common/Loader';
import Notification from '@/app/components/common/Notification';
import useNotification from '@/app/hooks/useNotification';
import { formatDateTime } from '@/app/utils/dateUtils';

const SubcategoriesPage = () => {
  const { t } = useTranslation();
  
  // State for filters
  const [filters, setFilters] = useState<CatalogueFilter>({});
  
  // State for search term
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subcategoryToDelete, setSubcategoryToDelete] = useState<Subcategory | null>(null);
  
  // Notification state
  const { 
    notification, 
    showSuccess, 
    showError, 
    hideNotification 
  } = useNotification();
  
  // Fetch subcategories with filters
  const { 
    data, 
    isLoading: isLoadingSubcategories, 
    isError: isSubcategoriesError,
    error: subcategoriesError,
    refetch: refetchSubcategories
  } = useFetchSubcategories(filters);
  
  console.log("Subcategories data:", data);
  
  // Process data to add username fields directly and format dates
  const processedData = useMemo(() => {
    if (!data) return [];
    
    // Handle both array response and CatalogueListResponse structure
    const subcategories = Array.isArray(data) ? data : data.results || [];
    
    return subcategories.map((item) => ({
      ...item,
      createdByUsername: item.created_by?.username || 'N/A',
      updatedByUsername: item.updated_by?.username || 'N/A',
      formattedCreatedAt: formatDateTime(item.created_at),
      formattedUpdatedAt: formatDateTime(item.updated_at)
    }));
  }, [data]);

 
  
  // Fetch categories for filtering
  const { 
    data: categories, 
    isLoading: isLoadingCategories 
  } = useFetchCategories();
  
  // Delete subcategory mutation
  const { 
    mutate: deleteSubcategory, 
    isPending: isDeleting,
    isError: isDeleteError,
    error: deleteError
  } = useDeleteSubcategory();
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value) {
      setFilters(prev => ({ ...prev, search: e.target.value }));
    } else {
      const { search, ...rest } = filters;
      setFilters(rest);
    }
  };
  
  // Handle category filter change
  const handleCategoryChange = (e: SelectChangeEvent<string>) => {
    setFilters(prev => ({
      ...prev,
      category: e.target.value === '' ? undefined : Number(e.target.value)
    }));
  };
  
  // Handle delete button click
  const handleDeleteClick = (subcategory: Subcategory) => {
    setSubcategoryToDelete(subcategory);
    setDeleteDialogOpen(true);
  };
  
  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (subcategoryToDelete) {
      deleteSubcategory(subcategoryToDelete.id, {
        onSuccess: () => {
          showSuccess(t('deleteSuccess'));
          setDeleteDialogOpen(false);
        },
        onError: (error: unknown) => {
          showError(error instanceof Error ? error.message : t('error'));
        }
      });
    }
  };
  
  // Handle delete dialog close
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
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
              href={`/Masters/catalogue/subcategories/${params.row.id}/edit`}
              size="small"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('delete')}>
            <IconButton 
              onClick={() => handleDeleteClick(params.row as Subcategory)}
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
      width: 150,
      flex: 1
    },
    { 
      field: 'description', 
      headerName: t('description'), 
      width: 200,
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
      field: 'category_name', 
      headerName: t('category'), 
      width: 150
    },
    { 
      field: 'division_name', 
      headerName: t('division'), 
      width: 150
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          {t('subcategories')}
        </Typography>
        <Button 
          component={Link} 
          href="/Masters/catalogue/subcategories/add"
          variant="contained" 
          startIcon={<AddIcon />}
        >
          {t('add')}
        </Button>
      </Box>
      
      {/* Error alerts */}
      {isSubcategoriesError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {subcategoriesError instanceof Error ? subcategoriesError.message : t('error')}
        </Alert>
      )}
      
      {isDeleteError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {deleteError instanceof Error ? deleteError.message : t('error')}
        </Alert>
      )}
      
      {/* Loading indicator */}
      {isLoadingSubcategories && <Loader message={t('loading')} />}
      
      {/* Data grid */}
      {!isLoadingSubcategories && (
        <Paper sx={{ width: '100%' }}>
          <DataGrid
            rows={processedData}
            columns={columns}
            loading={isLoadingCategories}
            slots={{
              loadingOverlay: () => <Loader fullScreen={false} />,
              toolbar: GridToolbar
            }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              }
            }}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
              columns: {
                columnVisibilityModel: {
                  id: true,
                  actions: true,
                  name: true,
                  description: true,
                  category_name: true,
                  division_name: true,
                  is_active: true,
                  formattedCreatedAt: true,
                  createdByUsername: true,
                  formattedUpdatedAt: true,
                  updatedByUsername: true
                }
              }
            }}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            autoHeight
            density="comfortable"
            getRowId={(row) => row.id}
          />
        </Paper>
      )}
      
      {/* Delete confirmation dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        title={t('deleteTitle')}
        content={t('deleteMessage')}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteDialogClose}
        loading={isDeleting}
      />
      
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

export default SubcategoriesPage;
