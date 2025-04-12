/**
 * Units of Measure Listing Page
 * 
 * Page component for listing, filtering, and managing units of measure
 */
'use client';

import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Typography,
  IconButton,
  Tooltip
} from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFetchUnitOfMeasures, useDeleteUnitOfMeasure } from '@/app/hooks/api/catalogue';
import { UnitOfMeasure } from '@/app/types/catalogue';
import Loader from '@/app/components/common/Loader';
import Notification from '@/app/components/common/Notification';
import useNotification from '@/app/hooks/useNotification';
import { formatDateTime } from '@/app/utils/dateUtils';
import CustomDataGrid from '@/app/components/common/CustomDataGrid';
import ContentCard from '@/app/components/common/ContentCard';
import ConfirmDialog from '@/app/components/common/ConfirmDialog';
import Link from 'next/link';

// Extended type to handle audit fields
interface UnitOfMeasureExtended extends UnitOfMeasure {
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
interface ProcessedUnitOfMeasure extends UnitOfMeasureExtended {
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

const UnitsOfMeasurePage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { notification, showSuccess, showError, hideNotification } = useNotification();
  
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
    'id', 'name', 'symbol', 'unit_type', 'associated_value', 'is_active', 
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
  const { data, isLoading, isError, error, refetch } = useFetchUnitOfMeasures({
    search: searchTerm
  });
  const { mutate: deleteUnitOfMeasure, isPending: isDeleting } = useDeleteUnitOfMeasure();
  
  // Process data to add username fields directly and format dates
  const processedRows = useMemo(() => {
    if (!data) return [];
    
    // Handle both array response and paginated response structure
    const units = Array.isArray(data) ? data : data.results || [];
    
    // Sort the data by ID in ascending order
    const sortedData = [...units].sort((a, b) => a.id - b.id);
    
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
      filtered = filtered.filter(unit => 
        unit.name.toLowerCase().includes(lowerCaseSearch) ||
        unit.symbol.toLowerCase().includes(lowerCaseSearch) ||
        (unit.unit_type && unit.unit_type.toLowerCase().includes(lowerCaseSearch))
      );
    }
    
    // Apply active filters
    if (activeFilters.length > 0) {
      filtered = filtered.filter(unit => {
        return activeFilters.every(filter => {
          const value = unit[filter.field as keyof typeof unit];
          
          switch (filter.operator) {
            case 'equals':
              if (filter.field === 'is_active') {
                return unit.is_active === filter.value;
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
        value: true  // Use boolean true instead of string
      });
      setActiveFilters(newFilters);
    } else if (newTab === 'inactive') {
      // Add or update status filter to show only inactive
      const newFilters = activeFilters.filter(filter => filter.field !== 'is_active');
      newFilters.push({
        field: 'is_active',
        operator: 'equals',
        value: false  // Use boolean false instead of string
      });
      setActiveFilters(newFilters);
    }
  };
  
  // Handle delete button click
  const handleDelete = (id: number) => {
    setConfirmDelete({ open: true, id });
  };
  
  // Handle delete confirmation
  const confirmDeleteAction = () => {
    if (confirmDelete.id) {
      deleteUnitOfMeasure(confirmDelete.id, {
        onSuccess: () => {
          showSuccess(t('catalogue.unitOfMeasure.deleteSuccess', 'Unit of measure deleted successfully'));
          setConfirmDelete({ open: false, id: null });
          refetch();
        },
        onError: (error) => {
          console.error('Error deleting unit of measure:', error);
          showError(t('catalogue.unitOfMeasure.deleteError', 'Error deleting unit of measure'));
          setConfirmDelete({ open: false, id: null });
        }
      });
    }
  };
  
  // DataGrid columns definition
  const columns: GridColDef[] = [
    { field: 'id', headerName: t('id', 'ID'), width: 70 },
    { field: 'name', headerName: t('name', 'Name'), width: 150 },
    { field: 'symbol', headerName: t('symbol', 'Symbol'), width: 100 },
    { field: 'unit_type', headerName: t('unitType', 'Type'), width: 120 },
    { 
      field: 'associated_value', 
      headerName: t('associatedValue', 'Associated Value'), 
      width: 150,
      renderCell: (params: GridRenderCellParams) => {
        const value = params.value;
      
         return (
          <Box sx={{ 
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start'
          }}>
                   <Typography variant="body2">{value !== null && value !== undefined ? value : '-'}</Typography>

          </Box>
        );
      }
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
      headerName: t('createdAt', 'Created At'), 
      width: 150
    },
    { 
      field: 'createdByUsername', 
      headerName: t('createdBy', 'Created By'), 
      width: 120
    },
    { 
      field: 'formattedUpdatedAt', 
      headerName: t('updatedAt', 'Updated At'), 
      width: 150
    },
    { 
      field: 'updatedByUsername', 
      headerName: t('updatedBy', 'Updated By'), 
      width: 120
    },
    { 
      field: 'actions', 
      headerName: t('actions', 'Actions'), 
      width: 120,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={t('edit')}>
            <IconButton 
              component={Link} 
              href={`/Masters/catalogue/units-of-measure/edit/${params.row.id}`}
              size="small"
              color="primary"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('delete')}>
            <IconButton 
              onClick={() => handleDelete(params.row.id)}
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
      label: t('name'),
      type: 'text' as const
    },
    {
      field: 'symbol',
      label: t('symbol'),
      type: 'text' as const
    },
    {
      field: 'unit_type',
      label: t('unitType'),
      type: 'text' as const
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
  
  if (isLoading) return <Loader />;
  
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
          {t('unitsOfMeasure')}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => router.push('/Masters/catalogue/units-of-measure/add')}
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
            disableRowSelectionOnClick
            autoHeight
            loading={isLoading}
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
      
      <ConfirmDialog
        open={confirmDelete.open}
        title={t('deleteUnitOfMeasure')}
        content={t('deleteUnitOfMeasureConfirm')}
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
};

export default UnitsOfMeasurePage;
