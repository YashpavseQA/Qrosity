/**
 * Tax Rate Form Component
 * 
 * Form for creating and editing tax rates
 */
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Grid,
  Paper,
  FormHelperText,
  InputAdornment,
  CircularProgress,
  Typography,
  Autocomplete
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { taxRateSchema, TaxRateFormValues } from '../schemas';
import { useFetchTaxRegions } from '@/app/hooks/api/pricing';
import { useFetchCategories } from '@/app/hooks/api/catalogue';

interface TaxRateFormProps {
  defaultValues?: Partial<TaxRateFormValues>;
  onSubmit: (data: TaxRateFormValues) => void;
  isSubmitting?: boolean;
  isEditMode?: boolean;
  isViewMode?: boolean;
}

// Export the form ref type for use in parent components
export type TaxRateFormRef = {
  submitForm: () => void;
};

const TaxRateForm = forwardRef<TaxRateFormRef, TaxRateFormProps>(({
  defaultValues = {
    tax_regions: [],
    tax_type: '',
    tax_code: '',
    tax_percentage: 0,
    category_id: null,
    price_from: undefined,
    price_to: undefined,
    description: '',
    is_active: true
  },
  onSubmit,
  isSubmitting = false,
  isEditMode = false,
  isViewMode = false
}, ref) => {
  const { t } = useTranslation();
  
  // Fetch data from APIs using the proper hooks
  const { data: taxRegionsData, isLoading: isLoadingTaxRegions } = useFetchTaxRegions();
  // Handle both array and object with results property
  const taxRegionsArray = Array.isArray(taxRegionsData) 
    ? taxRegionsData 
    : (taxRegionsData?.results || []);
  const taxRegions = taxRegionsArray.filter((region: any) => region.is_active === true);
  
  const { data: categoriesData, isLoading: isLoadingCategories } = useFetchCategories();
  // Handle both array and object with results property
  const categoriesArray = Array.isArray(categoriesData) 
    ? categoriesData 
    : (categoriesData?.results || []);
  const categories = categoriesArray.filter((category: any) => category.is_active === true);
  
  // Add console logs to debug the data
  useEffect(() => {
    console.log('Tax Regions Data:', taxRegionsData);
    console.log('Filtered Tax Regions:', taxRegions);
    console.log('Categories Data:', categoriesData);
    console.log('Filtered Categories:', categories);
  }, [taxRegionsData, categoriesData, taxRegions, categories]);
  
  // State for selected items (for Autocomplete components)
  const [selectedRegions, setSelectedRegions] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [showPriceFields, setShowPriceFields] = useState<boolean>(false);
  
  // Form setup with React Hook Form and Zod validation
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting: formIsSubmitting },
    setValue,
    watch,
    reset
  } = useForm<TaxRateFormValues>({
    resolver: zodResolver(taxRateSchema),
    defaultValues: {
      ...defaultValues,
      is_active: true
    }
  });

  // Watch for changes in the tax_region field
  const watchedTaxRegion = watch('tax_regions');
  
  // Effect to handle region change
  useEffect(() => {
    // Show price fields only when exactly one region is selected
    if (Array.isArray(watchedTaxRegion) && watchedTaxRegion.length === 1) {
      setShowPriceFields(true);
    } else {
      // If no regions or multiple regions selected, hide price fields and reset values
      setShowPriceFields(false);
      setValue('price_from', undefined);
      setValue('price_to', undefined);
    }
  }, [watchedTaxRegion, setValue]);

  // Initialize selected items from defaultValues when data is loaded
  useEffect(() => {
    // Only run when both data and defaultValues are available
    if (defaultValues && taxRegions.length > 0 && categories.length > 0) {
      console.log('Initializing from defaultValues:', defaultValues);
      console.log('Available tax regions:', taxRegions);
      
      // For tax regions, find the matching region objects for the IDs in defaultValues
      if (defaultValues.tax_regions && Array.isArray(defaultValues.tax_regions) && defaultValues.tax_regions.length > 0) {
        console.log('Tax region IDs from defaultValues:', defaultValues.tax_regions);
        
        const selectedRegionObjects = taxRegions.filter(region => 
          defaultValues.tax_regions?.includes(region.id)
        );
        
        console.log('Found matching region objects:', selectedRegionObjects);
        
        if (selectedRegionObjects.length > 0) {
          setSelectedRegions(selectedRegionObjects);
          
          // Show price fields if exactly one region is selected
          setShowPriceFields(defaultValues.tax_regions.length === 1);
        }
      }
      
      // For category, find the matching category object
      if (defaultValues.category_id && categories.length > 0) {
        const category = categories.find(cat => cat.id === defaultValues.category_id);
        if (category) {
          setSelectedCategory(category);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taxRegions, categories, defaultValues]); // Run when data or defaultValues change

  // Expose the submitForm method to parent components via ref
  useImperativeHandle(ref, () => ({
    submitForm: () => {
      handleSubmit(onSubmit)();
    }
  }));

  return (
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={3}>
          {/* Tax Region - Autocomplete */}
          <Grid item xs={12} >
            <Controller
              name="tax_regions"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <>
                  <Autocomplete
                    {...field}
                    multiple
                    options={taxRegions || []}
                    getOptionLabel={(option: any) => {
                      // Handle both object and primitive values
                      return typeof option === 'object' ? option?.name || '' : '';
                    }}
                    isOptionEqualToValue={(option, value) => {
                      // Handle both object and primitive values
                      if (typeof option === 'object' && typeof value === 'object') {
                        return option?.id === value?.id;
                      }
                      return false;
                    }}
                    value={selectedRegions}
                    onChange={(_, newValues) => {
                      console.log('New tax region values:', newValues);
                      setSelectedRegions(newValues);
                      
                      // Extract IDs for form value
                      const regionIds = newValues.map(region => region.id);
                      console.log('Setting tax_regions to:', regionIds);
                      onChange(regionIds);
                      
                      // Show price fields only when exactly one region is selected
                      if (newValues.length === 1) {
                        setShowPriceFields(true);
                      } else {
                        // If no regions or multiple regions selected, hide price fields and reset values
                        setShowPriceFields(false);
                        setValue('price_from', undefined);
                        setValue('price_to', undefined);
                      }
                    }}
                    loading={isLoadingTaxRegions}
                    disabled={isViewMode}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t('pricing.taxRate.region')}
                        required
                        error={!!errors.tax_regions}
                        helperText={errors.tax_regions?.message}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {isLoadingTaxRegions ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                        disabled={isSubmitting || isViewMode}
                      />
                    )}
                  />
                </>
              )}
            />
          </Grid>
          
          {/* Category - Autocomplete */}
          <Grid item xs={12} >
            <Controller
              name="category_id"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <Autocomplete
                  {...field}
                  options={categories || []}
                  getOptionLabel={(option: any) => option?.name || ''}
                  isOptionEqualToValue={(option, value) => option?.id === value?.id}
                  value={selectedCategory}
                  onChange={(_, newValue) => {
                    setSelectedCategory(newValue);
                    onChange(newValue ? newValue.id : null);
                  }}
                  loading={isLoadingCategories}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('pricing.taxRate.category')}
                      error={!!errors.category_id}
                      helperText={errors.category_id?.message}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {isLoadingCategories ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                      disabled={isSubmitting || isViewMode}
                    />
                  )}
                />
              )}
            />
          </Grid>
          
          {/* Tax Type (Text field) */}
          <Grid item xs={12} >
            <Controller
              name="tax_type"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('pricing.taxRate.type')}
                  fullWidth
                  required
                  placeholder={t('pricing.taxRate.typePlaceholder', 'e.g. VAT, GST, Sales Tax')}
                  error={!!errors.tax_type}
                  helperText={errors.tax_type?.message}
                  disabled={isSubmitting || isViewMode}
                />
              )}
            />
          </Grid>
          
          {/* Tax Code */}
          <Grid item xs={12} md={6}>
            <Controller
              name="tax_code"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('pricing.taxRate.code')}
                  fullWidth
                  required
                  error={!!errors.tax_code}
                  helperText={errors.tax_code?.message}
                  disabled={isSubmitting || isViewMode}
                />
              )}
            />
          </Grid>
          
          {/* Tax Percentage */}
          <Grid item xs={12} md={6}>
            <Controller
              name="tax_percentage"
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <TextField
                  {...field}
                  type="number"
                  label={t('pricing.taxRate.percentage')}
                  value={value}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : Number(e.target.value);
                    onChange(val);
                  }}
                  fullWidth
                  required
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    inputProps: { min: 0, max: 100, step: 0.01 }
                  }}
                  error={!!errors.tax_percentage}
                  helperText={errors.tax_percentage?.message}
                  disabled={isSubmitting || isViewMode}
                />
              )}
            />
          </Grid>
          
          {/* Price Range Fields - Only visible if first region is selected */}
          {showPriceFields && (
            <>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {t('pricing.taxRate.priceRange', 'Price Range (Optional)')}
                </Typography>
              </Grid>
              
              {/* Price From */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="price_from"
                  control={control}
                  render={({ field: { value, onChange, ...field } }) => (
                    <TextField
                      {...field}
                      type="number"
                      label={t('pricing.taxRate.priceFrom')}
                      value={value === undefined ? '' : value}
                      onChange={(e) => {
                        const val = e.target.value === '' ? undefined : Number(e.target.value);
                        onChange(val);
                      }}
                      fullWidth
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        inputProps: { min: 0, step: 0.01 }
                      }}
                      error={!!errors.price_from}
                      helperText={errors.price_from?.message}
                      disabled={isSubmitting || isViewMode}
                    />
                  )}
                />
              </Grid>
              
              {/* Price To */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="price_to"
                  control={control}
                  render={({ field: { value, onChange, ...field } }) => (
                    <TextField
                      {...field}
                      type="number"
                      label={t('pricing.taxRate.priceTo')}
                      value={value === undefined ? '' : value}
                      onChange={(e) => {
                        const val = e.target.value === '' ? undefined : Number(e.target.value);
                        onChange(val);
                      }}
                      fullWidth
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        inputProps: { min: 0, step: 0.01 }
                      }}
                      error={!!errors.price_to}
                      helperText={errors.price_to?.message}
                      disabled={isSubmitting || isViewMode}
                    />
                  )}
                />
              </Grid>
            </>
          )}
          
          {/* Description */}
          <Grid item xs={12}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('pricing.taxRate.description')}
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  disabled={isSubmitting || isViewMode}
                />
              )}
            />
          </Grid>
          
          {/* Is Active */}
          {isEditMode && (
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Controller
                    name="is_active"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onChange={field.onChange}
                        disabled={isSubmitting || isViewMode}
                      />
                    )}
                  />
                }
                label={t('pricing.taxRate.isActive', 'Active')}
              />
            </Grid>
          )}
        </Grid>
      </Box>
  );
});

export default TaxRateForm;
