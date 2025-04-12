/**
 * Division Form Component
 * 
 * Form for creating and editing divisions in the catalogue
 */
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Typography,
  Stack
} from '@mui/material';
import { divisionSchema, DivisionFormValues } from '../schemas';
import Grid from '@mui/material/Grid';
import { Division } from '@/app/types/catalogue';

interface DivisionFormProps {
  defaultValues?: Partial<Division>;
  onSubmit: (data: DivisionFormValues) => void;
  isSubmitting?: boolean;
  readOnly?: boolean;
}

const DivisionForm: React.FC<DivisionFormProps> = ({
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
    formState: { errors }
  } = useForm<DivisionFormValues>({
    resolver: zodResolver(divisionSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      description: defaultValues?.description || '',
      is_active: defaultValues?.is_active ?? true,
      image: defaultValues?.image || '',
      image_alt_text: defaultValues?.image_alt_text || ''
    }
  });

  // Custom submit handler to remove is_active in create mode
  const handleFormSubmit = (data: DivisionFormValues) => {
    if (!isEditMode) {
      // In create mode, remove is_active from the data being sent
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { is_active, ...dataWithoutIsActive } = data;
      onSubmit(dataWithoutIsActive as DivisionFormValues);
    } else {
      // In edit mode, send all data including is_active
      onSubmit(data);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <Typography variant="h6" gutterBottom>
        Division Information
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Division Name"
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
              {isSubmitting ? 'Saving...' : 'Save Division'}
            </Button>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default DivisionForm;
