"use client";

/**
 * Tax Rates Listing Page
 * 
 * Page component for listing, filtering, and managing tax rates
 */
import React, { useState, useMemo, useRef } from 'react';
import { Typography, Box, Button, Tooltip, IconButton } from '@mui/material';
import { GridColDef, GridRenderCellParams, GridRowSelectionModel } from '@mui/x-data-grid';
import CustomDataGrid from '@/app/components/common/CustomDataGrid';
import ContentCard, { FilterOption, FilterState as ContentCardFilterState } from '@/app/components/common/ContentCard';
import { useTranslation } from 'react-i18next';
import { useFetchTaxRates, useDeleteTaxRate, useCreateTaxRate, useUpdateTaxRate, useFetchTaxRegions } from '@/app/hooks/api/pricing';
import { TaxRate } from '@/app/types/pricing';
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
import TaxRateForm from '@/app/components/admin/pricing/forms/TaxRateForm';
import { DrawerProvider, useDrawer } from '@/app/contexts/DrawerContext';
import { TaxRateFormValues } from '@/app/components/admin/pricing/schemas';
import api from '@/lib/api';
import Link from 'next/link';

// Extended type to handle audit fields and nested data
interface TaxRateExtended extends TaxRate {
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
  tax_regions_details?: Array<{
    id: number;
    name: string;
    code: string;
    description: string | null;
    countries: number[];
    country_details: Array<{
      id: number;
      name: string;
      iso_code: string;
    }>;
    is_active: boolean;
  }>;
  category?: {
    id: number;
    name: string;
    description: string | null;
    division: number;
    division_name: string;
    default_tax_rate: string;
    tax_inclusive: boolean;
  };
}

// Type for the processed row data
interface ProcessedTaxRate extends TaxRateExtended {
  formattedCreatedAt: string;
  formattedUpdatedAt: string;
  createdByUsername: string;
  updatedByUsername: string;
  taxRegionsDisplay: string;
  categoryDisplay: string;
  countryDisplay: string;
}

// Type for filter state
interface FilterState {
  field: string;
  operator: string;
  value: any;
}

// Wrapper component that provides the DrawerContext
export default function TaxRatesPageWrapper() {
  return (
    <DrawerProvider>
      <TaxRatesPage />
    </DrawerProvider>
  );
}

// Main component that uses the DrawerContext
function TaxRatesPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { notification, showSuccess, showError, hideNotification } = useNotification();
  
  // Use drawer context
  const drawerContext = useDrawer();
  
  // Local state for drawer management
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'add' | 'edit'>('add');
  const [selectedTaxRateId, setSelectedTaxRateId] = useState<number | null>(null);
  const [selectedTaxRate, setSelectedTaxRate] = useState<TaxRate | null>(null);
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
    'id', 'name', 'code', 'rate', 'taxRegionsDisplay', 'categoryDisplay', 
    'countryDisplay', 'is_active', 'formattedCreatedAt', 'createdByUsername', 
    'formattedUpdatedAt', 'updatedByUsername', 'actions'
  ]);
  const [activeTab, setActiveTab] = useState('all');
  
  // State for delete confirmation dialog
  const [confirmDelete, setConfirmDelete] = useState<{open: boolean, id: number | null}>({
    open: false,
    id: null
  });
  
  // API hooks
  const { data, isLoading: isLoadingTaxRates, isError, error, refetch } = useFetchTaxRates();
  const { mutate: deleteTaxRate, isPending: isDeleting } = useDeleteTaxRate();
  const { mutate: createTaxRate, isPending: isCreating } = useCreateTaxRate();
  const { mutate: updateTaxRate, isPending: isUpdating } = useUpdateTaxRate();
  
  // Process data to add username fields directly and format dates
  const processedRows = useMemo(() => {
    if (!data) return [];
    
    // Handle both array response and paginated response structure
    const taxRates = Array.isArray(data) ? data : data.results || [];
    
    // Sort the data by ID in ascending order
    const sortedData = [...taxRates].sort((a, b) => a.id - b.id);
    
    return sortedData.map((item: TaxRateExtended) => ({
      ...item,
      // Map API fields to display fields
      name: item.tax_type || 'N/A',
      code: item.tax_code || 'N/A',
      rate: item.tax_percentage || '0.00',
      // Format other fields
      createdByUsername: item.created_by?.username || 'N/A',
      updatedByUsername: item.updated_by?.username || 'N/A',
      formattedCreatedAt: formatDateTime(item.created_at),
      formattedUpdatedAt: formatDateTime(item.updated_at),
      taxRegionsDisplay: item.tax_regions_details?.map((region: { name: string }) => region.name).join(', ') || 'N/A',
      categoryDisplay: item.category?.name || 'N/A',
      countryDisplay: item.tax_regions_details?.reduce((acc: string[], region: { country_details: Array<{ name: string }> }) => 
        acc.concat(region.country_details.map((country: { name: string }) => country.name)), [] as string[]).join(', ') || 'N/A'
    }));
  }, [data]);
  
  // Filter data based on search term and filters
  const filteredData = useMemo(() => {
    let filtered = processedRows;
    
    // Apply search term filter
    if (searchTerm.trim()) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(taxRate => 
        taxRate.name?.toLowerCase().includes(lowerCaseSearch) ||
        taxRate.code?.toLowerCase().includes(lowerCaseSearch) ||
        String(taxRate.rate).includes(lowerCaseSearch) ||
        taxRate.taxRegionsDisplay.toLowerCase().includes(lowerCaseSearch) ||
        taxRate.categoryDisplay.toLowerCase().includes(lowerCaseSearch) ||
        taxRate.countryDisplay.toLowerCase().includes(lowerCaseSearch)
      );
    }
    
    // Apply active filters
    if (activeFilters.length > 0) {
      filtered = filtered.filter(taxRate => {
        return activeFilters.every(filter => {
          const value = taxRate[filter.field as keyof typeof taxRate];
          
          switch (filter.operator) {
            case 'equals':
              if (filter.field === 'is_active') {
                return taxRate.is_active === filter.value;
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
  
  // Handle edit button click
  const handleEdit = (id: number) => {
    router.push(`/Masters/pricing/tax-rates/edit/${id}`);
  };
  
  // Handle delete button click
  const handleDelete = (id: number) => {
    setConfirmDelete({ open: true, id });
  };
  
  // Handle delete confirmation
  const confirmDeleteAction = () => {
    if (confirmDelete.id) {
      deleteTaxRate(confirmDelete.id, {
        onSuccess: () => {
          showSuccess(t('pricing.taxRate.deleteSuccess', 'Tax rate deleted successfully'));
          setConfirmDelete({ open: false, id: null });
          refetch();
        },
        onError: (error) => {
          console.error('Error deleting tax rate:', error);
          showError(t('pricing.taxRate.deleteError', 'Error deleting tax rate'));
          setConfirmDelete({ open: false, id: null });
        }
      });
    }
  };
  
  // Handle drawer open for adding a new tax rate
  const handleAddTaxRate = () => {
    setSelectedTaxRateId(null);
    setSelectedTaxRate(null);
    setDrawerMode('add');
    setIsViewMode(false);
    setActiveSidebarItem('edit');
    setDrawerOpen(true);
    drawerContext.openDrawer('add');
  };
  
  // Handle drawer open for editing a tax rate
  const handleOpenEditDrawer = (id: number) => {
    // Prevent multiple calls if already loading or if the same tax rate is already selected
    if (isLoading || (selectedTaxRateId === id && drawerOpen)) {
      return;
    }
    
    // Set loading state first
    setIsLoading(true);
    
    // Set the ID and mode
    setSelectedTaxRateId(id);
    setDrawerMode('edit');
    setIsViewMode(true); // Set to true initially
    setActiveSidebarItem('view'); // Set active sidebar item to view
    
    // Always fetch from API to ensure we have the most up-to-date data
    api.get(`/pricing/tax-rates/${id}/`)
      .then(response => {
        if (response.data) {
          // Store the full tax rate data
          setSelectedTaxRate(response.data);
          
          // Open drawer 
          setDrawerOpen(true);
          
          // Update drawer context
          drawerContext.openDrawer('edit');
        }
      })
      .catch(error => {
        console.error('Error fetching tax rate:', error);
        showError(t('taxRates.fetchError', 'Failed to fetch tax rate details'));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  
  // Handle drawer close
  const handleDrawerClose = () => {
    setDrawerOpen(false);
    drawerContext.closeDrawer();
    setSelectedTaxRateId(null);
    setSelectedTaxRate(null);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.submitForm();
    }
  };

  // Handle form save
  const handleSave = (values: TaxRateFormValues) => {
    if (drawerMode === 'add') {
      // Map form values to match the TaxRate interface
      const taxRateData = {
        name: values.tax_type, // Use tax_type as name
        code: values.tax_code, // Use tax_code as code
        rate: values.tax_percentage, // Use tax_percentage as rate
        description: values.description,
        is_active: true, // Always set to true for new tax rates
        tax_regions: values.tax_regions, // Send all selected tax regions
        category_id: values.category_id,
        price_from: values.tax_regions.length === 1 ? values.price_from : undefined, // Only send price range for single region
        price_to: values.tax_regions.length === 1 ? values.price_to : undefined,
        tax_type: values.tax_type,
        tax_code: values.tax_code,
        tax_percentage: values.tax_percentage
      };
      
      createTaxRate(taxRateData, {
        onSuccess: () => {
          showSuccess(t('taxRates.addSuccess', 'Tax rate added successfully'));
          handleDrawerClose();
          refetch();
        },
        onError: (error) => {
          console.error('Error creating tax rate:', error);
          showError(t('taxRates.addError', 'Error adding tax rate'));
        }
      });
    } else {
      if (selectedTaxRateId) {
        // Map form values to match the TaxRate interface
        const taxRateData = {
          id: selectedTaxRateId,
          name: values.tax_type, // Use tax_type as name
          code: values.tax_code, // Use tax_code as code
          rate: values.tax_percentage, // Use tax_percentage as rate
          description: values.description,
          is_active: values.is_active,
          tax_regions: values.tax_regions, // Send all selected tax regions
          category_id: values.category_id,
          price_from: values.tax_regions.length === 1 ? values.price_from : undefined, // Only send price range for single region
          price_to: values.tax_regions.length === 1 ? values.price_to : undefined,
          tax_type: values.tax_type,
          tax_code: values.tax_code,
          tax_percentage: values.tax_percentage
        };
        
        updateTaxRate(taxRateData, {
          onSuccess: () => {
            showSuccess(t('taxRates.updateSuccess', 'Tax rate updated successfully'));
            handleDrawerClose();
            refetch();
          },
          onError: (error) => {
            console.error('Error updating tax rate:', error);
            showError(t('taxRates.updateError', 'Error updating tax rate'));
          }
        });
      }
    }
  };
  
  // DataGrid columns definition
  const columns: GridColDef[] = [
    { field: 'id', headerName: t('id'), width: 70 },
    { field: 'name', headerName: t('name'), width: 150 },
    { field: 'code', headerName: t('code'), width: 120 },
    { 
      field: 'rate', 
      headerName: t('rate'), 
      width: 120,
    },
    { 
      field: 'is_active', 
      headerName: t('status', 'Status'), 
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
      field: 'taxRegionsDisplay', 
      headerName: t('taxRegions'), 
      width: 200
    },
    { 
      field: 'categoryDisplay', 
      headerName: t('category'), 
      width: 150
    },
    { 
      field: 'actions', 
      headerName: t('actions'), 
      width: 120,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={t('delete', 'Delete')}>
            <IconButton 
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation(); // Prevent row click
                handleDelete(params.row.id);
              }}
              // onClick={() => handleDelete(params.row.id)}
              aria-label={t('delete', 'Delete tax rate')}
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
      field: 'rate',
      label: t('rate'),
      type: 'number' as const
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
  
  // Drawer sidebar icons for view/edit modes
  const drawerSidebarIcons = useMemo(() => {
    // If in add mode, return empty array
    if (drawerMode === 'add') {
      return [];
    }
    
    // Otherwise, return the icons for edit mode
    return [
      { 
        id: 'view', 
        icon: <VisibilityIcon />, 
        tooltip: t('view'), 
        onClick: () => {
          setIsViewMode(true);
          setActiveSidebarItem('view');
          drawerContext.setActiveSidebarItem('view');
        }
      },
      { 
        id: 'edit', 
        icon: <EditIcon />, 
        tooltip: t('edit'), 
        onClick: () => {
          setIsViewMode(false);
          setActiveSidebarItem('edit');
          drawerContext.setActiveSidebarItem('edit');
        }
      }
    ];
  }, [drawerMode, t, drawerContext]);
  
  if (isLoadingTaxRates) return <Loader />;
  
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
          {t('Tax Rates')}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleAddTaxRate}
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
      
      {/* AnimatedDrawer for adding/editing tax rates */}
      <AnimatedDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        title={drawerMode === 'add' ? t('Add Tax Rate') : t('Edit Tax Rate')}
        initialWidth={550}
        expandedWidth={550}
        onSave={!isViewMode ? handleSubmit : undefined}
        saveDisabled={isCreating || isUpdating || isLoading}
        sidebarIcons={drawerSidebarIcons}
        defaultSidebarItem={activeSidebarItem}
        footerContent={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {drawerMode === 'edit' && selectedTaxRateId && (
              <Typography variant="caption" color="text.secondary">
                {/* {t('lastUpdated', 'Last updated')}: {formatDateTime(taxRateData?.updated_at || '')} */}
              </Typography>
            )}
          </Box>
        }
      >
        {isLoading ? (
          <Loader message={t('loading')} />
        ) : (
          <TaxRateForm
            ref={formRef}
            defaultValues={
              selectedTaxRate ? {
                tax_regions: selectedTaxRate.tax_regions || [],
                tax_type: selectedTaxRate.tax_type,
                tax_code: selectedTaxRate.tax_code,
                tax_percentage: selectedTaxRate.tax_percentage,
                price_from: selectedTaxRate.price_from,
                price_to: selectedTaxRate.price_to,
                category_id: selectedTaxRate.category_id === null ? undefined : selectedTaxRate.category_id,
                description: selectedTaxRate.description || '',
                is_active: selectedTaxRate.is_active
              } : undefined
            }
            isViewMode={isViewMode}
            onSubmit={handleSave}
            isSubmitting={isCreating || isUpdating}
            isEditMode={drawerMode === 'edit'}
          />
        )}
      </AnimatedDrawer>
      
      <ConfirmDialog
        open={confirmDelete.open}
        title={t('Delete Tax Rate')}
        content={t('Delete Tax Rate Confirmation')}
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
