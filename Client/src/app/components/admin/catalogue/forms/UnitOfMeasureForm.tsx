/**
 * Unit of Measure Form Component
 * 
 * Form for creating and editing units of measure in the catalogue
 */
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Grid,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
  Divider
} from '@mui/material';
import { unitOfMeasureSchema, UnitOfMeasureFormValues } from '../schemas';
import { UnitOfMeasure } from '@/app/types/catalogue';

interface UnitOfMeasureFormProps {
  defaultValues?: Partial<UnitOfMeasure>;
  onSubmit: (data: UnitOfMeasureFormValues) => void;
  isSubmitting?: boolean;
  readOnly?: boolean;
}

const UnitOfMeasureForm: React.FC<UnitOfMeasureFormProps> = ({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  readOnly = false
}) => {
  // Check if we're in edit mode (has an existing id) or create mode
  const isEditMode = !!defaultValues?.id;

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<UnitOfMeasureFormValues>({
    resolver: zodResolver(unitOfMeasureSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      symbol: defaultValues?.symbol || '',
      description: defaultValues?.description || '',
      is_active: defaultValues?.is_active ?? true,
      unit_type: defaultValues?.unit_type || 'COUNTABLE',
      associated_value: defaultValues?.associated_value ?? null
    }
  });

  // Watch the unit type to conditionally show associated value field
  const unitType = watch('unit_type');

  // Custom submit handler to remove is_active in create mode
  const handleFormSubmit = (data: UnitOfMeasureFormValues) => {
    if (!isEditMode) {
      // In create mode, remove is_active from the data being sent
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { is_active, ...dataWithoutIsActive } = data;
      onSubmit(dataWithoutIsActive as UnitOfMeasureFormValues);
    } else {
      // In edit mode, send all data including is_active
      onSubmit(data);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <Typography variant="h6" gutterBottom>
          Unit of Measure Information
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Name"
                  fullWidth
                  size='small'
                  required
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={isSubmitting || readOnly}
                  InputProps={{
                    readOnly: readOnly
                  }}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Controller
              name="symbol"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Symbol"
                  fullWidth
                  size='small'
                  required
                  error={!!errors.symbol}
                  helperText={errors.symbol?.message || "1-10 characters, letters and numbers only"}
                  disabled={isSubmitting || readOnly}
                  InputProps={{
                    readOnly: readOnly
                  }}
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
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  size='small'
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  disabled={isSubmitting || readOnly}
                  InputProps={{
                    readOnly: readOnly
                  }}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Controller
              name="unit_type"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth required error={!!errors.unit_type} size='small' disabled={isSubmitting || readOnly}>
                  <InputLabel>Type</InputLabel>
                  <Select
                    {...field}
                    size='small'
                    label="Type"
                    inputProps={{
                      readOnly: readOnly
                    }}
                  >
                    <MenuItem value="COUNTABLE">Countable</MenuItem>
                    <MenuItem value="MEASURABLE">Measurable</MenuItem>
                  </Select>
                  {errors.unit_type && (
                    <FormHelperText>{errors.unit_type.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
            <Box sx={{ mt: 1, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle2" gutterBottom>Note:</Typography>
              <Typography variant="body2">
                <strong>Countable:</strong> Represents units that are typically counted in whole numbers. You cannot logically have a fraction of a discrete unit in most contexts (like selling or standard inventory).
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Measurable:</strong> Represents units that are measured on a scale, where fractional values are meaningful and possible.
              </Typography>
            </Box>
          </Grid>
          
          {unitType && (
            <Grid item xs={12} md={6}>
              <Controller
                name="associated_value"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Associated Value"
                    fullWidth
                    size='small'
                    type="number"
                    error={!!errors.associated_value}
                    helperText={
                      errors.associated_value?.message || 
                      (unitType === 'COUNTABLE' 
                        ? 'Must be a whole number (integer)' 
                        : 'Can include decimal places')
                    }
                    disabled={isSubmitting || readOnly}
                    InputProps={{
                      readOnly: readOnly,
                      inputProps: {
                        step: unitType === 'COUNTABLE' ? '1' : '0.0001',
                        min: '0'
                      }
                    }}
                    value={field.value === null ? '' : field.value}
                    onChange={(e) => {
                      const value = e.target.value === '' ? null : Number(e.target.value);
                      field.onChange(value);
                    }}
                  />
                )}
              />
            </Grid>
          )}
  
          
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
                        disabled={isSubmitting || readOnly}
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
                {isSubmitting ? 'Saving...' : 'Save Unit of Measure'}
              </Button>
            </Grid>
          )}
        </Grid>
      </Box>
    </Paper>
  );
};

export default UnitOfMeasureForm;
