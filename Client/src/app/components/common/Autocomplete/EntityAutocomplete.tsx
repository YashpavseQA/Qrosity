'use client';

import React, { useState, useEffect } from 'react';
import {
  Autocomplete,
  TextField,
  CircularProgress,
  AutocompleteProps
} from '@mui/material';
import { Controller, Control } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import api from '@/lib/api';

// Generic entity type with common properties
export interface Entity {
  id: number | string;
  name: string;
  is_active?: boolean;
  [key: string]: any; // Allow for additional properties
}

export interface EntityAutocompleteProps {
  name: string;
  control: Control<any>;
  label: string;
  apiEndpoint: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  filterParams?: Record<string, string | number | boolean>;
  onChange?: (value: Entity | null) => void;
  dependsOn?: {
    field: string;
    param: string;
  };
  value?: any;
  valueField?: string; // Field to use as the value (default: 'id')
  getOptionLabel?: (option: Entity) => string; // Custom function to get option label
}

/**
 * A reusable autocomplete component for entity selection
 * Handles API fetching, filtering, and form integration
 */
const EntityAutocomplete: React.FC<EntityAutocompleteProps> = ({
  name,
  control,
  label,
  apiEndpoint,
  required = false,
  disabled = false,
  error = false,
  helperText = '',
  filterParams = { is_active: true },
  onChange,
  dependsOn,
  value,
  valueField = 'id',
  getOptionLabel = (option) => option?.name || ''
}) => {
  const { t } = useTranslation();
  const [options, setOptions] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(false);

  // Build query string from filter params
  const buildQueryString = (params: Record<string, any>): string => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
    
    const queryString = queryParams.toString();
    return queryString ? `?${queryString}` : '';
  };

  // Fetch data from API
  const fetchData = async (params: Record<string, any> = {}) => {
    setLoading(true);
    try {
      // Combine default filter params with any additional params
      const allParams = { ...filterParams, ...params };
      const queryString = buildQueryString(allParams);
      
      const response = await api.get(`${apiEndpoint}${queryString}`);
            // console.log(`${name} API Response:`, response.data);

      // Handle different response structures
      let entitiesData: Entity[] = [];
      if (Array.isArray(response.data)) {
        entitiesData = response.data;
      } else if (response.data && response.data.results) {
        entitiesData = response.data.results;
      }
      
      // Filter out inactive entities (if not already filtered by API)
      const activeEntities = entitiesData.filter((entity: Entity) => entity.is_active !== false);
      setOptions(activeEntities);
      // console.log(`Active ${name}:`, activeEntities);
    } catch (error) {
      console.error(`Error fetching ${name}:`, error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  // Combined effect for data fetching
  useEffect(() => {
    if (dependsOn && dependsOn.field && value && dependsOn.param) {
      // If we have a dependency, only fetch when that value exists
      const params = { [dependsOn.param]: value[dependsOn.field] };
      fetchData(params);
    } else if (!dependsOn) {
      // If no dependency, fetch only once
      fetchData();
    }
  }, [apiEndpoint, dependsOn?.field && value?.[dependsOn.field]]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Autocomplete
          options={options}
          loading={loading}
          disabled={disabled}
          getOptionLabel={getOptionLabel}
          value={options.find(option => option[valueField] === field.value) || null}
          onChange={(event, newValue) => {
            field.onChange(newValue ? newValue[valueField] : '');
            if (onChange) {
              onChange(newValue);
            }
            // console.log(`Selected ${name}:`, newValue);
          }}
          isOptionEqualToValue={(option, value) => option?.[valueField] === value?.[valueField]}
          renderInput={(params) => (
            <TextField
              {...params}
              label={required ? `${label} *` : label}
              size="small"
              error={!!fieldState.error || error}
              helperText={fieldState.error?.message || helperText}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      )}
    />
  );
};

export default EntityAutocomplete;
