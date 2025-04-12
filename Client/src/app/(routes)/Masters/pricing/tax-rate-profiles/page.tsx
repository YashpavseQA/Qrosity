"use client";

/**
 * Tax Rate Profiles Listing Page
 * 
 * Page component for listing, filtering, and managing tax rate profiles
 */
import React, { useState, useMemo, useRef } from 'react';
import { Typography, Box, Button, Tooltip, IconButton } from '@mui/material';
import { GridColDef, GridRenderCellParams, GridRowSelectionModel } from '@mui/x-data-grid';
import CustomDataGrid from '@/app/components/common/CustomDataGrid';
import ContentCard from '@/app/components/common/ContentCard';
import { useTranslation } from 'react-i18next';
import { useFetchTaxRateProfiles, useDeleteTaxRateProfile, useCreateTaxRateProfile, useUpdateTaxRateProfile } from '@/app/hooks/api/pricing';
import { TaxRateProfile, TaxRate } from '@/app/types/pricing';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useRouter } from 'next/navigation';
import ConfirmDialog from '@/app/components/common/ConfirmDialog';
import { formatDateTime } from '@/app/utils/dateUtils';
import Loader from '@/app/components/common/Loader';
import Notification from '@/app/components/common/Notification';
import useNotification from '@/app/hooks/useNotification';
import AnimatedDrawer from '@/app/components/common/AnimatedDrawer';
import TaxRateProfileForm from '@/app/components/admin/pricing/forms/TaxRateProfileForm';
import { DrawerProvider, useDrawer } from '@/app/contexts/DrawerContext';
import { TaxRateProfileFormValues } from '@/app/components/admin/pricing/schemas';
import api from '@/lib/api';
import Link from 'next/link';

// Extended type to handle audit fields
interface TaxRateProfileExtended extends TaxRateProfile {
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
interface ProcessedTaxRateProfile extends TaxRateProfileExtended {
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
export default function TaxRateProfilesPageWrapper() {
  return (
    <DrawerProvider>
      <TaxRateProfilesPage />
    </DrawerProvider>
  );
}

// Main component that uses the DrawerContext
function TaxRateProfilesPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { notification, showSuccess, showError, hideNotification } = useNotification();
  
  // Use drawer context
  const drawerContext = useDrawer();
  
  // Local state for drawer management
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'add' | 'edit'>('add');
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<TaxRateProfile | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
  const [dateRange, setDateRange] = useState<{start: Date | null, end: Date | null}>({
    start: null,
    end: null
  });
  const [activeFilters, setActiveFilters] = useState<FilterState[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'id', 'name', 'code', 'tax_rates_details', 'is_default', 'is_active', 
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
  const { data, isLoading: isLoadingProfiles, isError, error, refetch } = useFetchTaxRateProfiles();
  const { mutate: deleteTaxRateProfile, isPending: isDeleting } = useDeleteTaxRateProfile();
  const { mutate: createTaxRateProfile, isPending: isCreating } = useCreateTaxRateProfile();
  const { mutate: updateTaxRateProfile, isPending: isUpdating } = useUpdateTaxRateProfile();
  
  // Process data to add username fields directly and format dates
  const processedRows = useMemo(() => {
    if (!data) return [];
    
    // Handle both array response and paginated response structure
    const profiles = Array.isArray(data) ? data : data.results || [];
    
    // Sort the data by ID in ascending order
    const sortedData = [...profiles].sort((a, b) => a.id - b.id);
    
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
    if (searchTerm.trim()) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(profile => 
        profile.name.toLowerCase().includes(lowerCaseSearch) ||
        profile.code.toLowerCase().includes(lowerCaseSearch)
      );
    }
    
    // Apply active filters
    if (activeFilters.length > 0) {
      filtered = filtered.filter(profile => {
        return activeFilters.every(filter => {
          const value = profile[filter.field as keyof typeof profile];
          
          switch (filter.operator) {
            case 'equals':
              if (filter.field === 'is_active') {
                return profile.is_active === filter.value;
              }
              return String(value).toLowerCase() === String(filter.value).toLowerCase();
            case 'contains':
              return typeof value === 'string' && value.toLowerCase().includes(String(filter.value).toLowerCase());
            case 'greaterThan':
              return typeof value === 'number' && value > Number(filter.value);
            case 'lessThan':
              return typeof value === 'number' && value < Number(filter.value);
            case 'between':
              if (filter.field === 'created_at' || filter.field === 'updated_at') {
                const date = new Date(String(value));
                const startDate = filter.value.start instanceof Date ? filter.value.start : new Date(filter.value.start);
                const endDate = filter.value.end instanceof Date ? filter.value.end : new Date(filter.value.end);
                return date >= startDate && date <= endDate;
              }
              return false;
            default:
              return true;
          }
        });
      });
    }
    
    return filtered;
  }, [processedRows, searchTerm, activeFilters]);
  
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
    
    // Apply filter based on tab
    if (newTab === 'all') {
      // Remove any status filter
      setActiveFilters(activeFilters.filter(filter => filter.field !== 'is_active'));
    } else if (newTab === 'active') {
      // Add or update status filter to show only active
      const newFilters = activeFilters.filter(filter => filter.field !== 'is_active');
      newFilters.push({
        field: 'is_active',
        operator: 'equals',
        value: true
      });
      setActiveFilters(newFilters);
    } else if (newTab === 'inactive') {
      // Add or update status filter to show only inactive
      const newFilters = activeFilters.filter(filter => filter.field !== 'is_active');
      newFilters.push({
        field: 'is_active',
        operator: 'equals',
        value: false
      });
      setActiveFilters(newFilters);
    }
  };
  
  // Handle drawer open for adding a new tax rate profile
  const handleAddProfile = () => {
    setSelectedProfileId(null);
    setSelectedProfile(null);
    setDrawerMode('add');
    setIsViewMode(false);
    setActiveSidebarItem('edit');
    setDrawerOpen(true);
    drawerContext.openDrawer('add');
  };
  
  // Handle drawer open for editing a tax rate profile
  const handleOpenEditDrawer = (id: number) => {
    // Prevent multiple calls if already loading or if the same profile is already selected
    if (isLoading || (selectedProfileId === id && drawerOpen)) {
      return;
    }
    
    // Set loading state first
    setIsLoading(true);
    
    // Set the ID and mode
    setSelectedProfileId(id);
    setDrawerMode('edit');
    setIsViewMode(true); // Set to true initially
    setActiveSidebarItem('view'); // Set active sidebar item to view
    
    // Always fetch from API to ensure we have the most up-to-date data
    api.get(`/pricing/tax-rate-profiles/${id}/`)
      .then(response => {
        if (response.data) {
          // Store the full profile data
          setSelectedProfile(response.data);
          
          // Open drawer 
          setDrawerOpen(true);
          
          // Update drawer context
          drawerContext.openDrawer('edit');
        }
      })
      .catch(error => {
        console.error('Error fetching tax rate profile:', error);
        showError(t('taxRateProfiles.fetchError', 'Failed to fetch tax rate profile details'));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  
  // Handle drawer close
  const handleDrawerClose = () => {
    setDrawerOpen(false);
    drawerContext.closeDrawer();
    setSelectedProfileId(null);
    setSelectedProfile(null);
  };

  // Handle form submission for creating or updating tax rate profile
  const handleFormSubmit = (data: TaxRateProfileFormValues) => {
    if (drawerMode === 'add') {
      createTaxRateProfile({
        name: data.name,
        code: data.code || '', // Ensure code is never null
        description: data.description || '', // Ensure description is never null
        is_active: data.is_active,
        tax_rates: data.tax_rates,
        is_default: data.is_default
      }, {
        onSuccess: (response) => {
          showSuccess(t('Tax Rate Profile Created Successfully'));
          setDrawerOpen(false);
          refetch();
        },
        onError: (error: any) => {
          showError(error?.response?.data?.detail || t('pricing.taxRateProfile.createError'));
        }
      });
    } else if (drawerMode === 'edit' && selectedProfileId) {
      updateTaxRateProfile({
        id: selectedProfileId,
        name: data.name,
        code: data.code || '', // Ensure code is never null
        description: data.description || '', // Ensure description is never null
        is_active: data.is_active,
        tax_rates: data.tax_rates,
        is_default: data.is_default
      }, {
        onSuccess: (response) => {
          showSuccess(t('Tax Rate Profile Updated Successfully'));
          setDrawerOpen(false);
          refetch();
        },
        onError: (error: any) => {
          showError(error?.response?.data?.detail || t('pricing.taxRateProfile.updateError'));
        }
      });
    }
  };
  
  // Handle form save
  const handleSave = (values: TaxRateProfileFormValues) => {
    handleFormSubmit(values);
  };
  
  // Handle delete button click
  const handleDelete = (id: number) => {
    setConfirmDelete({ open: true, id });
  };
  
  // Handle delete confirmation
  const confirmDeleteAction = () => {
    if (confirmDelete.id) {
      deleteTaxRateProfile(confirmDelete.id, {
        onSuccess: () => {
          showSuccess(t('Tax Rate Profile Deleted Successfully'));
          setConfirmDelete({ open: false, id: null });
          refetch();
        },
        onError: (error) => {
          console.error('Error deleting tax rate profile:', error);
          showError(t('pricing.taxRateProfile.deleteError'));
          setConfirmDelete({ open: false, id: null });
        }
      });
    }
  };
  
  // Sidebar icons for the drawer
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
          setIsViewMode(true);
          setActiveSidebarItem('view');
          drawerContext.setActiveSidebarItem('view');
        }
      },
      { 
        id: 'edit', 
        icon: <EditIcon />, 
        tooltip: t('edit', 'Edit'), 
        onClick: () => {
          setIsViewMode(false);
          setActiveSidebarItem('edit');
          drawerContext.setActiveSidebarItem('edit');
        }
      }
    ];
  }, [drawerMode, t, drawerContext]);
  
  // DataGrid columns definition
  const columns: GridColDef[] = [
    { field: 'id', headerName: t('id'), width: 70 },
    { field: 'name', headerName: t('name'), width: 150 },
    { field: 'code', headerName: t('code'), width: 120 },
    { 
      field: 'tax_rates_details', 
      headerName: t('Tax Rates'), 
      width: 200,
      renderCell: (params: GridRenderCellParams) => {
        const taxRatesDetails = params.value as any[] | undefined;
        const taxTypeNames = taxRatesDetails?.map(rate => rate.tax_type).join(', ') || '';
        
        return (
          <Box sx={{ 
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start'
          }}>
            <Typography variant="body2">
              {taxTypeNames || '-'}
            </Typography>
          </Box>
        );
      }
    },
    { 
      field: 'is_default', 
      headerName: t('isDefault'), 
      width: 100,
      renderCell: (params) => {
        const isDefault = params.value as boolean;
        return (
          <Box sx={{ 
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start'
          }}>
            <Typography variant="body2">
              {isDefault ? t('yes') : t('no')}
            </Typography>
          </Box>
        );
      }
    },
    { 
      field: 'is_active', 
      headerName: t('status'), 
      width: 100,
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
      field: 'formattedCreatedAt', 
      headerName: t('createdAt'), 
      width: 150
    },
    { 
      field: 'createdByUsername', 
      headerName: t('createdBy'), 
      width: 120
    },
    { 
      field: 'formattedUpdatedAt', 
      headerName: t('updatedAt'), 
      width: 150
    },
    { 
      field: 'updatedByUsername', 
      headerName: t('updatedBy'), 
      width: 120
    },
    { 
      field: 'actions', 
      headerName: t('actions'), 
      width: 120,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={t('delete')}>
            <IconButton 
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation(); // Prevent row click
                handleDelete(params.row.id);
              }}
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
      label: t('name'),
      type: 'text' as const
    },
    {
      field: 'code',
      label: t('code'),
      type: 'text' as const
    },
    {
      field: 'is_default',
      label: t('isDefault'),
      type: 'boolean' as const
    },
    {
      field: 'is_active',
      label: t('status'),
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
      label: t('all'), 
      count: processedRows.length 
    },
    { 
      value: 'active', 
      label: t('active'), 
      count: processedRows.filter(row => row.is_active).length 
    },
    { 
      value: 'inactive', 
      label: t('inactive'), 
      count: processedRows.filter(row => !row.is_active).length 
    }
  ];
  
  if (isLoadingProfiles) return <Loader />;
  
  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" variant="h6">
          {t('error')}
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {t('Tax Rate Profiles')}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleAddProfile}
        >
          {t('add')}
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
      
      {/* AnimatedDrawer for adding/editing tax rate profiles */}
      <AnimatedDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        initialWidth={550}
        expandedWidth={550}
        title={
          isViewMode
            ? t('View Tax Rate Profile')
            : drawerMode === 'add'
            ? t('Add Tax Rate Profile')
            : t('Edit Tax Rate Profile')
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
            {drawerMode === 'edit' && selectedProfileId && (
              <Typography variant="caption" color="text.secondary">
                {t('lastUpdated')}: {selectedProfile?.updated_at ? formatDateTime(selectedProfile.updated_at) : ''}
              </Typography>
            )}
          </Box>
        }
      >
        <TaxRateProfileForm
          ref={formRef}
          defaultValues={
            selectedProfile ? {
              name: selectedProfile.name,
              code: selectedProfile.code || '',
              description: selectedProfile.description || '',
              is_active: selectedProfile.is_active,
              tax_rates: Array.isArray(selectedProfile.tax_rates) 
                ? (typeof selectedProfile.tax_rates[0] === 'number' 
                  ? selectedProfile.tax_rates as number[]
                  : (selectedProfile.tax_rates as TaxRate[]).map(tr => tr.id))
                : [],
              is_default: selectedProfile.is_default
            } : undefined
          }
          onSubmit={handleFormSubmit}
          isSubmitting={isCreating || isUpdating}
          isEditMode={drawerMode === 'edit'}
          isViewMode={isViewMode}
        />
      </AnimatedDrawer>
      
      <ConfirmDialog
        open={confirmDelete.open}
        title={t('Delete Tax Rate Profile')}
        content={t('Delete Tax Rate Profile Confirmation')}
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
