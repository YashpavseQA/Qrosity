/**
 * Subcategory Form Component
 * 
 * Form for creating and editing subcategories in the catalogue
 */
import React, { useMemo, useEffect } from 'react';
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
  Autocomplete
} from '@mui/material';
import { subcategorySchema, SubcategoryFormValues } from '../schemas';
import { useFetchCategories } from '@/app/hooks/api/catalogue';
import { Category, Subcategory } from '@/app/types/catalogue';
import Grid from '@mui/material/Grid';

interface SubcategoryFormProps {
  defaultValues?: Partial<Subcategory>;
  onSubmit: (data: SubcategoryFormValues) => void;
  isSubmitting?: boolean;
  readOnly?: boolean;
}

const SubcategoryForm: React.FC<SubcategoryFormProps> = ({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  readOnly = false
}) => {
  // Check if we're in edit mode (has an existing id) or create mode
  const isEditMode = !!defaultValues?.id;

  // Fetch categories for the dropdown
  const { data: categoriesData, isLoading: isLoadingCategories } = useFetchCategories();
  
  // Filter active categories for new subcategories, but show all for editing
  const filteredCategories = useMemo(() => {
    if (!categoriesData || !Array.isArray(categoriesData)) {
      return [];
    }
    
    // If we have a defaultValue (editing mode), show all categories
    // Otherwise (add mode), only show active categories
    if (defaultValues?.category) {
      return categoriesData;
    } else {
      return categoriesData.filter(category => category.is_active);
    }
  }, [categoriesData, defaultValues?.category]);
  
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<SubcategoryFormValues>({
    resolver: zodResolver(subcategorySchema),
    defaultValues: {
      name: defaultValues?.name || '',
      description: defaultValues?.description || '',
      is_active: defaultValues?.is_active ?? true,
      category: defaultValues?.category || 0,
      image: defaultValues?.image || '',
      image_alt_text: defaultValues?.image_alt_text || '',
      sort_order: defaultValues?.sort_order ?? 0
    }
  });

  // Custom submit handler to remove is_active in create mode
  const handleFormSubmit = (data: SubcategoryFormValues) => {
    if (!isEditMode) {
      // In create mode, remove is_active from the data being sent
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { is_active, ...dataWithoutIsActive } = data;
      onSubmit(dataWithoutIsActive as SubcategoryFormValues);
    } else {
      // In edit mode, send all data including is_active
      onSubmit(data);
    }
  };

  // Find the selected category object based on the category ID
  const findCategoryById = (categoryId: number): Category | null => {
    if (!categoriesData || !Array.isArray(categoriesData)) {
      return null;
    }
    return categoriesData.find(cat => cat.id === categoryId) || null;
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <Typography variant="h6" gutterBottom>
        Subcategory Information
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Subcategory Name"
                fullWidth
                required
                size='small'
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
            name="category"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!readOnly && !!errors.category} size='small'>
                <Autocomplete
                  id="category-autocomplete"
                  options={filteredCategories}
                  getOptionLabel={(option) => {
                    // Handle both Category objects and category IDs
                    if (typeof option === 'object' && option !== null) {
                      return option.name;
                    }
                    // If it's just an ID, try to find the corresponding category
                    const category = findCategoryById(Number(option));
                    return category ? category.name : `Category ${option}`;
                  }}
                  loading={isLoadingCategories}
                  disabled={readOnly}
                  value={findCategoryById(Number(field.value)) || null}
                  onChange={(_, newValue) => {
                    field.onChange(newValue ? newValue.id : 0);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Category"
                      required
                      size='small'
                      error={!readOnly && !!errors.category}
                      helperText={!readOnly && errors.category?.message}
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
                multiline
                size='small'
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
                label="Image"
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
            name="sort_order"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Sort Order"
                fullWidth
                size='small'
                type="number"
                onChange={(e) => {
                  const val = e.target.value;
                  
                  // Convert empty string to 0
                  if (val === '') {
                    field.onChange(0);
                    return;
                  }
                  
                  // Remove leading zeros
                  if (val.startsWith('0') && val.length > 1) {
                    field.onChange(parseInt(val, 10));
                    return;
                  }
                  
                  // Ensure value is a number
                  field.onChange(parseInt(val, 10));
                }}
                error={!readOnly && !!errors.sort_order}
                helperText={!readOnly && errors.sort_order?.message}
                disabled={readOnly}
                InputProps={{
                  readOnly: readOnly,
                  inputProps: { min: 0 }
                }}
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
              {isSubmitting ? 'Saving...' : 'Save Subcategory'}
            </Button>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default SubcategoryForm;
