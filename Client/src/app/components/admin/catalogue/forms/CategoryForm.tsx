/**
 * Category Form Component
 * 
 * Form for creating and editing categories in the catalogue
 */
import React, { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Typography,
  FormControl,
  Autocomplete,
  InputAdornment
} from '@mui/material';
import { categorySchema, CategoryFormValues } from '../schemas';
import { useFetchDivisions } from '@/app/hooks/api/catalogue';
import { Division, Category } from '@/app/types/catalogue';
import Grid from '@mui/material/Grid';

interface CategoryFormProps {
  defaultValues?: Partial<Category>;
  onSubmit: (data: CategoryFormValues) => void;
  isSubmitting?: boolean;
  readOnly?: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  readOnly = false
}) => {
  // Check if we're in edit mode (has an existing id) or create mode
  const isEditMode = !!defaultValues?.id;

  // Fetch divisions for the dropdown
  const { data: divisionsData, isLoading: isLoadingDivisions } = useFetchDivisions();
  
  // Filter active divisions for new categories, but show all for editing
  const filteredDivisions = useMemo(() => {
    if (!divisionsData || !Array.isArray(divisionsData)) {
      return [];
    }
    
    // If we have a defaultValue (editing mode), show all divisions
    // Otherwise (add mode), only show active divisions
    if (defaultValues?.division) {
      return divisionsData;
    } else {
      return divisionsData.filter(division => division.is_active);
    }
  }, [divisionsData, defaultValues?.division]);
  
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: defaultValues?.name || '',
      description: defaultValues?.description || '',
      is_active: defaultValues?.is_active ?? true,
      division: defaultValues?.division || 0,
      image: defaultValues?.image || '',
      image_alt_text: defaultValues?.image_alt_text || '',
      default_tax_rate: defaultValues?.default_tax_rate ?? 0,
      tax_inclusive: defaultValues?.tax_inclusive ?? false,
      sort_order: defaultValues?.sort_order ?? 0
    }
  });

  // Custom submit handler to remove is_active in create mode
  const handleFormSubmit = (data: CategoryFormValues) => {
    if (!isEditMode) {
      // In create mode, remove is_active from the data being sent
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { is_active, ...dataWithoutIsActive } = data;
      onSubmit(dataWithoutIsActive as CategoryFormValues);
    } else {
      // In edit mode, send all data including is_active
      onSubmit(data);
    }
  };

  // Find the selected division object based on the division ID
  const findDivisionById = (divisionId: number): Division | null => {
    if (!divisionsData || !Array.isArray(divisionsData)) {
      return null;
    }
    return divisionsData.find(div => div.id === divisionId) || null;
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <Typography variant="h6" gutterBottom>
        Category Information
      </Typography>
      
      <Grid container spacing={3}>
      <Grid item xs={12}>
      <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Category Name"
                fullWidth
                size='small'
                required
                error={!readOnly && !!errors.name}
                helperText={!readOnly && errors.name?.message}
                disabled={readOnly}
                InputProps={{
                  readOnly: readOnly
                }}
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Controller
            name="division"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!readOnly && !!errors.division}                 size='small'>
                <Autocomplete
                  id="division-autocomplete"
                  options={filteredDivisions}
                  getOptionLabel={(option) => {
                    // Handle both Division objects and division IDs
                    if (typeof option === 'object' && option !== null) {
                      return option.name;
                    }
                    // If it's just an ID, try to find the corresponding division
                    const division = findDivisionById(Number(option));
                    return division ? division.name : `Division ${option}`;
                  }}
                  loading={isLoadingDivisions}
                  disabled={readOnly}
                  value={findDivisionById(Number(field.value)) || null}
                  onChange={(_, newValue) => {
                    field.onChange(newValue ? newValue.id : 0);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Division"
                      required
                      size='small'
                      error={!readOnly && !!errors.division}
                      helperText={!readOnly && errors.division?.message}
                      InputProps={{
                        ...params.InputProps,
                        readOnly: readOnly
                      }}
                    />
                  )}
                />
              </FormControl>
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
                label="Description"
                fullWidth
                size='small'
                multiline
                rows={3}
                error={!readOnly && !!errors.description}
                helperText={!readOnly && errors.description?.message}
                disabled={readOnly}
                InputProps={{
                  readOnly: readOnly
                }}
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Image URL"
                fullWidth
                size='small'
                error={!readOnly && !!errors.image}
                helperText={!readOnly && errors.image?.message}
                disabled={readOnly}
                InputProps={{
                  readOnly: readOnly
                }}
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Controller
            name="image_alt_text"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Image Alt Text"
                fullWidth
                size='small'
                error={!readOnly && !!errors.image_alt_text}
                helperText={!readOnly && errors.image_alt_text?.message}
                disabled={readOnly}
                InputProps={{
                  readOnly: readOnly
                }}
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Controller
            name="default_tax_rate"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <TextField
                {...field}
                value={value === 0 && !String(value).includes('.') ? '0' : value}
                label="Default Tax Rate (%)"
                fullWidth
                type="number"
                size='small'
                onChange={(e) => {
                  const val = e.target.value;
                  
                  // Handle empty input
                  if (val === '') {
                    onChange(0);
                    return;
                  }
                  
                  // Handle decimal values starting with 0
                  if (val === '0' || val === '0.') {
                    onChange(Number(val));
                    return;
                  }
                  
                  // Remove leading zeros for non-decimal numbers
                  if (val.startsWith('0') && !val.startsWith('0.')) {
                    const newVal = val.replace(/^0+/, '');
                    onChange(newVal === '' ? 0 : Number(newVal));
                    return;
                  }
                  
                  // Regular case
                  onChange(Number(val));
                }}
                error={!readOnly && !!errors.default_tax_rate}
                helperText={!readOnly && errors.default_tax_rate?.message}
                disabled={readOnly}
                InputProps={{
                  readOnly: readOnly,
                  endAdornment: <InputAdornment position="end">%</InputAdornment>
                }}
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Controller
            name="sort_order"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <TextField
                {...field}
                value={value === 0 ? '0' : value}
                label="Sort Order"
                fullWidth
                type="number"
                size='small'
                onChange={(e) => {
                  const val = e.target.value;
                  
                  // Handle empty input
                  if (val === '') {
                    onChange(0);
                    return;
                  }
                  
                  // Handle single zero
                  if (val === '0') {
                    onChange(0);
                    return;
                  }
                  
                  // Remove leading zeros
                  if (val.startsWith('0')) {
                    const newVal = val.replace(/^0+/, '');
                    onChange(newVal === '' ? 0 : Number(newVal));
                    return;
                  }
                  
                  // Regular case
                  onChange(Number(val));
                }}
                error={!readOnly && !!errors.sort_order}
                helperText={!readOnly && errors.sort_order?.message}
                disabled={readOnly}
                InputProps={{
                  readOnly: readOnly
                }}
              />
            )}
          />
        </Grid>
      
        <Grid item xs={12}>
          <Controller
            name="tax_inclusive"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    disabled={readOnly}
                  />
                }
                label="Tax Inclusive"
              />
            )}
          />
        </Grid>
        
        {/* Only show is_active field in edit mode */}
        {isEditMode && (
        <Grid item xs={12}>
            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      disabled={readOnly}
                    />
                  }
                  label="Active"
                />
              )}
            />
          </Grid>
        )}
        
        {!readOnly && (
        <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              sx={{ mt: 2 }}
            >
              {isSubmitting ? 'Saving...' : 'Save Category'}
            </Button>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default CategoryForm;
