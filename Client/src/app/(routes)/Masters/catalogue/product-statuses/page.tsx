"use client";

/**
 * Product Statuses Listing Page
 * 
 * Page component for listing, filtering, and managing product statuses
 */
import React, { useState, useMemo, useRef } from 'react';
import { Typography, Box, Button, Tooltip, IconButton, Chip } from '@mui/material';
import { GridColDef, GridRenderCellParams, GridRowSelectionModel } from '@mui/x-data-grid';
import CustomDataGrid from '@/app/components/common/CustomDataGrid';
import ContentCard from '@/app/components/common/ContentCard';
import { useTranslation } from 'react-i18next';
import { 
  useFetchProductStatuses, 
  useDeleteProductStatus, 
  useCreateProductStatus, 
  useUpdateProductStatus 
} from '@/app/hooks/api/catalogue';
import { ProductStatus } from '@/app/types/catalogue';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ConfirmDialog from '@/app/components/common/ConfirmDialog';
import { formatDateTime } from '@/app/utils/dateUtils';
import Loader from '@/app/components/common/Loader';
import Notification from '@/app/components/common/Notification';
import useNotification from '@/app/hooks/useNotification';
import AnimatedDrawer from '@/app/components/common/AnimatedDrawer';
import ProductStatusForm from '@/app/components/admin/catalogue/forms/ProductStatusForm';
import { DrawerProvider, useDrawer } from '@/app/contexts/DrawerContext';
import { ProductStatusFormValues } from '@/app/components/admin/catalogue/schemas';

// Extended type to handle audit fields
interface ProductStatusExtended extends ProductStatus {
  created_by: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  updated_by: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

// Type for the processed row data
interface ProcessedProductStatus extends ProductStatusExtended {
  formattedCreatedAt: string;
  formattedUpdatedAt: string;
  createdByUsername: string;
  updatedByUsername: string;
}

// Type for filter state
interface FilterState {
  field: string;
  operator: string;
  value: any;
}

// Wrapper component that provides the DrawerContext
export default function ProductStatusesPageWrapper() {
  return (
    <DrawerProvider>
      <ProductStatusesPage />
    </DrawerProvider>
  );
}

// Main component that uses the DrawerContext
function ProductStatusesPage() {
  const { t } = useTranslation();
  const { notification, showSuccess, showError, hideNotification } = useNotification();
  
  // Use drawer context
  const drawerContext = useDrawer();
  
  // Local state for drawer management
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'add' | 'edit'>('add');
  const [selectedStatusId, setSelectedStatusId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ProductStatus | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
  
  // Form ref for submitting the form from outside
  const formRef = useRef<{ submitForm: () => void } | null>(null);
  
  // State for active sidebar item
  const [activeSidebarItem, setActiveSidebarItem] = useState<string>('view');
  
  // Pagination state
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  
  // View and filter states
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterState[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'id', 'name', 'description', 'is_active', 'is_orderable',
    'formattedCreatedAt', 'createdByUsername', 
    'formattedUpdatedAt', 'updatedByUsername', 'actions'
  ]);
  const [activeTab, setActiveTab] = useState('all');
  
  // State for delete confirmation dialog
  const [confirmDelete, setConfirmDelete] = useState<{open: boolean, id: number | null}>({
    open: false,
    id: null
  });
  
  // API hooks
  const { data, isLoading, isError, error, refetch } = useFetchProductStatuses({
    search: searchTerm
  });
  
  const { mutate: deleteProductStatus, isPending: isDeleting } = useDeleteProductStatus();
  const { mutate: createProductStatus, isPending: isCreating } = useCreateProductStatus();
  const { mutate: updateProductStatus, isPending: isUpdating } = useUpdateProductStatus();
  
  // Process data to add username fields directly and format dates
  const processedRows = useMemo(() => {
    if (!data) return [];
    
    // Handle both array response and paginated response structure
    const statuses = Array.isArray(data) ? data : data.results || [];
    
    // Sort the data by ID in ascending order
    const sortedData = [...statuses].sort((a, b) => a.id - b.id);
    
    return sortedData.map((item) => ({
      ...item,
      createdByUsername: item.created_by?.username || 'N/A',
      updatedByUsername: item.updated_by?.username || 'N/A',
      formattedCreatedAt: formatDateTime(item.created_at),
      formattedUpdatedAt: formatDateTime(item.updated_at)
    }));
  }, [data]);
  
  // Filter data based on search term and filters
  const filteredData = useMemo(() => {
    let filtered = processedRows;
    
    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(row => 
        row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (row.description && row.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply active filters
    if (activeFilters.length > 0) {
      filtered = filtered.filter(row => {
        return activeFilters.every(filter => {
          const value = row[filter.field as keyof ProcessedProductStatus];
          
          switch (filter.operator) {
            case 'contains':
              return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
            case 'equals':
              return String(value).toLowerCase() === String(filter.value).toLowerCase();
            case 'startsWith':
              return String(value).toLowerCase().startsWith(String(filter.value).toLowerCase());
            case 'endsWith':
              return String(value).toLowerCase().endsWith(String(filter.value).toLowerCase());
            default:
              return true;
          }
        });
      });
    }
    
    // Apply tab filter
    if (activeTab === 'active') {
      filtered = filtered.filter(row => row.is_active);
    } else if (activeTab === 'inactive') {
      filtered = filtered.filter(row => !row.is_active);
    }
    
    return filtered;
  }, [processedRows, searchTerm, activeFilters, activeTab]);
  

  const drawerSidebarIcons = useMemo(() => {
    if (drawerMode === 'add') {
      return [];
    }
    return [
      {
        id: 'view',
        icon: <VisibilityIcon />,
        tooltip: t('view', 'View'),
        onClick: () => {
          setActiveSidebarItem('view');
          setIsViewMode(true);
        }
      },
      {
        id: 'edit',
        icon: <EditIcon />,
        tooltip: t('edit', 'Edit'),
        onClick: () => {
          setActiveSidebarItem('edit');
          setIsViewMode(false);
        }
      }
    ];
  }, [drawerMode, t, drawerContext]);
  // Handle search from ContentCard
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  // Handle view change from ContentCard
  const handleViewChange = (newView: 'list' | 'grid') => {
    setView(newView);
  };
  
  // Handle filter change from ContentCard
  const handleFilterChange = (filters: FilterState[]) => {
    setActiveFilters(filters);
  };
  
  // Handle tab change from ContentCard
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    
    // Reset filters when changing tabs
    setActiveFilters([]);
    
    // Apply specific filters based on tab
    if (newTab === 'active') {
      setActiveFilters([
        {
          field: 'is_active',
          operator: 'equals',
          value: true
        }
      ]);
    } else if (newTab === 'inactive') {
      setActiveFilters([
        {
          field: 'is_active',
          operator: 'equals',
          value: false
        }
      ]);
    }
  };
  
  // Handle drawer open for adding a new product status
  const handleAddStatus = () => {
    setSelectedStatusId(null);
    setSelectedStatus(null);
    setDrawerMode('add');
    setIsViewMode(false);
    setActiveSidebarItem('view');
    setDrawerOpen(true);
  };
  
  // Handle drawer open for editing a product status
  const handleOpenEditDrawer = (id: number) => {
    setIsViewMode(true);
    setActiveSidebarItem('view');
    setSelectedStatusId(id);
    
    // Find the selected status in the data
    const status = processedRows.find(item => item.id === id);
    
    if (status) {
      setSelectedStatus(status);
      setDrawerMode('edit');
      setDrawerOpen(true);
    } else {
      showError('Product status not found');
    }
  };
  
  // Handle drawer close
  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedStatusId(null);
    setSelectedStatus(null);
  };
  
  // Handle form submission for creating or updating product status
  const handleFormSubmit = (data: ProductStatusFormValues) => {
    if (drawerMode === 'add') {
      createProductStatus(data, {
        onSuccess: (response) => {
          showSuccess('Product status created successfully');
          handleDrawerClose();
          refetch();
        },
        onError: (error: any) => {
          showError(error.response?.data?.detail || 'Failed to create product status');
        }
      });
    } else if (drawerMode === 'edit' && selectedStatusId) {
      updateProductStatus(
        { 
          id: selectedStatusId, 
          ...data 
        } as ProductStatus,
        {
          onSuccess: (response) => {
            showSuccess('Product status updated successfully');
            handleDrawerClose();
            refetch();
          },
          onError: (error: any) => {
            showError(error.response?.data?.detail || 'Failed to update product status');
          }
        }
      );
    }
  };
  
  // Handle delete button click
  const handleDelete = (id: number) => {
    setConfirmDelete({ open: true, id });
  };
  
  // Handle delete confirmation
  const confirmDeleteAction = () => {
    if (confirmDelete.id) {
      deleteProductStatus(confirmDelete.id, {
        onSuccess: () => {
          showSuccess('Product status deleted successfully');
          setConfirmDelete({ open: false, id: null });
          refetch();
        },
        onError: (error: any) => {
          showError(error?.response?.data?.detail || 'Failed to delete product status');
          setConfirmDelete({ open: false, id: null });
        }
      });
    }
  };
  
  // Column definitions for the data grid
  const columns: GridColDef[] = [
    { field: 'id', headerName: t('id', 'ID'), width: 70 },
    { field: 'name', headerName: t('name', 'Name'), width: 200 },
    { field: 'description', headerName: t('description', 'Description'), width: 300 },
    { 
      field: 'is_active', 
      headerName: t('status', 'Status'), 
      width: 120,
       renderCell: (params) => {
             const isActive = params.value as boolean;
             let status = isActive ? 'Active' : 'Inactive';
             let textColor = isActive ? '#00a854' : '#f44336'; // Green for Active, Red for Inactive
             
             return (
               <Box sx={{ 
                 width: '100%',
                 height: '100%',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'flex-start'
               }}>
                 <Typography variant="body2" sx={{ color: textColor, fontWeight: 500 }}>
                   {status}
                 </Typography>
               </Box>
             );
           }
    },
    { 
      field: 'is_orderable', 
      headerName: t('productStatusOrderable'), 
      width: 120,
    },

    { 
      field: 'formattedCreatedAt', 
      headerName: t('createdAt'), 
      width: 180 
    },
    { 
      field: 'createdByUsername', 
      headerName: t('createdBy'), 
      width: 150 
    },
    { 
      field: 'formattedUpdatedAt', 
      headerName: t('updatedAt'), 
      width: 180 
    },
    { 
      field: 'updatedByUsername', 
      headerName: t('updatedBy'), 
      width: 150 
    },
    {
      field: 'actions',
      headerName: t('actions', 'Actions'),
      width: 120,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={t('delete', 'Delete')}>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                                handleDelete(params.row.id);
              }}
              size="small"
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];
  
  // Define filter options
  const filterOptions = [
    {
      field: 'name',
      label: t('name', 'Name'),
      type: 'text' as const
    },
    {
      field: 'description',
      label: t('description', 'Description'),
      type: 'text' as const
    },
    {
      field: 'is_active',
      label: t('status', 'Status'),
      type: 'boolean' as const
    },
    {
      field: 'created_at',
      label: t('createdAt'),
      type: 'date' as const
    },
    {
      field: 'updated_at',
      label: t('updatedAt'),
      type: 'date' as const
    }
  ];
  
  // Define column options for visibility control
  const columnOptions = columns.map(col => ({
    field: col.field,
    headerName: col.headerName as string
  }));
  
  // Define tab options
  const tabOptions = [
    { 
      value: 'all', 
      label: t('all', 'All'), 
      count: processedRows.length 
    },
    { 
      value: 'active', 
      label: t('active', 'Active'), 
      count: processedRows.filter(row => row.is_active).length 
    },
    { 
      value: 'inactive', 
      label: t('inactive', 'Inactive'), 
      count: processedRows.filter(row => !row.is_active).length 
    }
  ];
  
  if (isLoading) return <Loader />;
  
  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" variant="h6">
          {t('error.loading', 'Error loading data. Please try again.')}
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {t('productStatuses')}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleAddStatus}
        >
          {t('add', 'Add')}
        </Button>
      </Box>
      
      <ContentCard 
        onSearch={handleSearch}
        onViewChange={handleViewChange}
        onFilterChange={handleFilterChange}
        onColumnsChange={setVisibleColumns}
        onTabChange={handleTabChange}
        filterOptions={filterOptions}
        columnOptions={columnOptions}
        tabOptions={tabOptions}
      >
        {view === 'list' ? (
          <CustomDataGrid
            rows={filteredData}
            columns={columns.filter(col => visibleColumns.includes(col.field))}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 25]}
            checkboxSelection={true}
            disableRowSelectionOnClick={false}
            autoHeight
            getRowId={(row) => row.id}
            rowSelectionModel={rowSelectionModel}
            onRowSelectionModelChange={(newSelection) => {
              setRowSelectionModel(newSelection);
            }}
            onRowClick={(params) => {
              handleOpenEditDrawer(params.row.id);
            }}
          />
        ) : (
          // Grid view can be implemented here
          <Box sx={{ p: 3 }}>
            <Typography variant="body1" color="text.secondary" align="center">
              Grid view is not implemented yet
            </Typography>
          </Box>
        )}
      </ContentCard>
      
      {/* AnimatedDrawer for adding/editing product statuses */}
      <AnimatedDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        initialWidth={550}
        expandedWidth={550}
        title={
          isViewMode
            ? t('view', 'View Product Status')
            : drawerMode === 'add'
            ? t('add', 'Add Product Status')
            : t('edit', 'Edit Product Status')
        }
        onSave={isViewMode ? undefined : () => {
          if (formRef.current) {
            formRef.current.submitForm();
          }
        }}
        sidebarIcons={drawerSidebarIcons}
        defaultSidebarItem={activeSidebarItem}
        footerContent={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {drawerMode === 'edit' && selectedStatusId && (
              <Typography variant="caption" color="text.secondary">
                {t('lastUpdated', 'Last updated')}: {selectedStatus?.updated_at ? formatDateTime(selectedStatus.updated_at) : ''}
              </Typography>
            )}
          </Box>
        }
      >
        <ProductStatusForm
          ref={formRef}
          defaultValues={
            selectedStatus ? {
              id: selectedStatus.id,
              name: selectedStatus.name,
              description: selectedStatus.description || '',
              is_active: selectedStatus.is_active,
              is_orderable: selectedStatus.is_orderable
            } : undefined
          }
          onSubmit={handleFormSubmit}
          isSubmitting={isCreating || isUpdating}
          readOnly={isViewMode}
        />
      </AnimatedDrawer>
      
      <ConfirmDialog
        open={confirmDelete.open}
        title={t('deleteProductStatus')}
        content={t('deleteProductStatusConfirm')}
        onConfirm={confirmDeleteAction}
        onCancel={() => setConfirmDelete({ open: false, id: null })}
        isLoading={isDeleting}
      />
      
      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={hideNotification}
      />
    </Box>
  );
}
