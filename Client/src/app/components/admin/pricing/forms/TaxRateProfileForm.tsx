/**
 * Tax Rate Profile Form Component
 * 
 * Form for creating and editing tax rate profiles with tax rate selection
 */
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Paper,
  FormHelperText,
  Autocomplete,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  FormLabel,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { taxRateProfileSchema, TaxRateProfileFormValues } from '../schemas';
import { useFetchTaxRates } from '@/app/hooks/api/pricing';
import { TaxRate } from '@/app/types/pricing';
import { useTheme } from '@mui/material/styles';

interface TaxRateProfileFormProps {
  defaultValues?: Partial<TaxRateProfileFormValues>;
  onSubmit: (data: TaxRateProfileFormValues) => void;
  isSubmitting?: boolean;
  isEditMode?: boolean;
  isViewMode?: boolean;
}

const TaxRateProfileForm = React.forwardRef<
  { submitForm: () => void },
  TaxRateProfileFormProps
>(({
  defaultValues = {
    name: '',
    code: '',
    description: '',
    is_active: true,
    tax_rates: [],
    is_default: false
  },
  onSubmit,
  isSubmitting = false,
  isEditMode = false,
  isViewMode = false
}, ref) => {
  const { t } = useTranslation();
  const theme = useTheme();
  
  // Fetch tax rates for the dropdown
  const { data: taxRatesData, isLoading: isLoadingTaxRates } = useFetchTaxRates();
  
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<TaxRateProfileFormValues>({
    resolver: zodResolver(taxRateProfileSchema),
    defaultValues: defaultValues as TaxRateProfileFormValues
  });

  // Expose submitForm method to parent component via ref
  React.useImperativeHandle(ref, () => ({
    submitForm: () => {
      handleSubmit(onSubmit)();
    }
  }));

  // Create a map of tax rate IDs to tax rate objects for the Autocomplete
  const taxRatesMap = React.useMemo(() => {
    if (!taxRatesData) return new Map<number, TaxRate>();
    
    const map = new Map<number, TaxRate>();
    // Handle both array response and paginated response structure
    const taxRates = Array.isArray(taxRatesData) ? taxRatesData : taxRatesData.results || [];
    
    taxRates.forEach(taxRate => {
      map.set(taxRate.id, taxRate);
    });
    
    return map;
  }, [taxRatesData]);

  return (
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('Name')}
                  fullWidth
                  required
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={isViewMode}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('Code')}
                  fullWidth
                  required
                  error={!!errors.code}
                  helperText={errors.code?.message}
                  disabled={isViewMode}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('Description')}
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  disabled={isViewMode}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.tax_rates}>
              <Controller
                name="tax_rates"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    multiple
                    id="tax_rates"
                    options={Array.isArray(taxRatesData) 
                      ? taxRatesData.filter(taxRate => taxRate.is_active) 
                      : (taxRatesData?.results || []).filter(taxRate => taxRate.is_active)}
                    getOptionLabel={(option) => {
                      // Handle both TaxRate objects and tax rate IDs
                      if (typeof option === 'number') {
                        const taxRate = taxRatesMap.get(option);
                        return taxRate ? `${taxRate.tax_type} (${taxRate.tax_percentage}%)` : String(option);
                      }
                      return `${option.tax_type} (${option.tax_percentage}%)`;
                    }}
                    filterOptions={(options, state) => {
                      const inputValue = state.inputValue.toLowerCase().trim();
                      if (!inputValue) return options;
                      
                      return options.filter(option => 
                        option.tax_type.toLowerCase().includes(inputValue) || 
                        option.tax_code.toLowerCase().includes(inputValue) || 
                        option.tax_percentage.toString().includes(inputValue)
                      );
                    }}
                    loading={isLoadingTaxRates}
                    value={field.value.map(id => {
                      const taxRate = taxRatesMap.get(id);
                      return taxRate || { 
                        id, 
                        tax_type: String(id),
                        tax_code: '',
                        tax_percentage: 0,
                        is_active: true,
                        created_at: '',
                        updated_at: ''
                      };
                    })}
                    onChange={(_, newValue) => {
                      field.onChange(newValue.map(item => item.id));
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          label={`${option.tax_type} (${option.tax_percentage}%)`}
                          {...getTagProps({ index })}
                          key={option.id}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t('TaxRates')}
                        error={!!errors.tax_rates}
                        placeholder={t('pricing.taxRateProfile.selectTaxRates')}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {isLoadingTaxRates ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                        disabled={isViewMode}
                      />
                    )}
                    disabled={isViewMode}
                  />
                )}
              />
              {errors.tax_rates && (
                <FormHelperText error>
                  {errors.tax_rates.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl>
              <FormLabel>{t('Default')}</FormLabel>
              <Controller
                name="is_default"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={!!value}
                        onChange={(e) => onChange(e.target.checked)}
                        {...field}
                        disabled={isViewMode}
                      />
                    }
                    label={value ? t('Yes') : t('No')}
                  />
                )}
              />
            </FormControl>
          </Grid>
          
          {isEditMode && (
            <Grid item xs={12} md={6}>
              <FormControl>
                <FormLabel>{t('Status')}</FormLabel>
                <Controller
                  name="is_active"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={!!value}
                          onChange={(e) => onChange(e.target.checked)}
                          {...field}
                          disabled={isViewMode}
                        />
                      }
                      label={value ? t('Active') : t('Inactive')}
                    />
                  )}
                />
              </FormControl>
            </Grid>
          )}
     
        </Grid>
      </Box>
  );
});

export default TaxRateProfileForm;
