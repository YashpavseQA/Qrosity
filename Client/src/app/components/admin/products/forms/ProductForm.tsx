'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
    Box, Typography, Button, TextField, FormControlLabel, Checkbox,
    Paper, Grid, IconButton, Chip, CircularProgress, Radio, RadioGroup, FormHelperText,
    Snackbar, Alert, Autocomplete, AlertColor
} from '@mui/material';
import {
    Save as SaveIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    CloudUpload as CloudUploadIcon,
   
} from '@mui/icons-material';
import { 
    useForm, 
    useFieldArray,
    Resolver as HookFormResolver,
    Controller,
    ControllerRenderProps,
    FormProvider
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { 
    ProductFormData, 
    ProductType, 
    PublicationStatus, 
    ProductDetail, 
    ProductAttributeValue,
    AttributeValueInput,
    TemporaryImageData 
} from '@/app/types/products';
import { formSchema } from './ProductForm.schema';
import AttributeValueManager from './AttributeValueManager';
import VariantTable from './VariantTable';

// --- API HOOKS ---
import { useCreateProduct, useUpdateProduct } from '@/app/hooks/api/products';
import api, { apiEndpoints } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';
import EntityAutocomplete from '@/app/components/common/Autocomplete/EntityAutocomplete';
import { entityEndpoints } from '@/app/components/common/Autocomplete/apiEndpoints';
import ImageManager from './ImageManager.new';
import { AttributeValueProvider } from '@/app/contexts/AttributeValueContext';

interface ProductFormProps {
    productId?: string;
    onSubmit?: (result: ProductDetail) => Promise<void>;
    defaultValues?: ProductDetail;
    isEditMode?: boolean;
    attributes?: Array<{
        id: number;
        name: string;
        code: string;
        data_type: string;
        validation_rules?: Record<string, any>;
    }>;
    initialViewMode?: boolean;
}

// Extended form data type
interface FormData extends Omit<ProductFormData, 'temp_images'> {
    attributes: Record<string, ProductAttributeValue>;
    attribute_values_input: AttributeValueInput[];
    temp_images: TemporaryImageData[];
    parent_temp_images: TemporaryImageData[];
    attribute_groups: number[];
    variant_defining_attributes: number[];
    organizationTags: string[];
}

interface ExtendedProductDetail extends ProductDetail {
    attribute_groups?: number[];
}

const ProductForm = ({ productId, onSubmit, defaultValues, isEditMode = false, attributes = [], initialViewMode = false }: ProductFormProps) => {
    const { t } = useTranslation();
    const router = useRouter();
    const queryClient = useQueryClient();
    
    // State for selected category - used for subcategory filtering
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    
    // State for notification
    const [notification, setNotification] = useState<{
        open: boolean;
        message: string;
        severity: AlertColor;
    }>({
        open: false,
        message: '',
        severity: 'info'
    });
    
    // State to control view/edit mode
    const [viewMode, setViewMode] = useState<boolean>(initialViewMode || !!productId);
    
    // State to track the current product ID (from props or after creation)
    const [currentProductId, setCurrentProductId] = useState<string | undefined>(productId);
    
    // Update currentProductId when productId prop changes
    useEffect(() => {
        if (productId) {
            setCurrentProductId(productId);
        }
    }, [productId]);
    
    // Debug log for viewMode state
    useEffect(() => {
        console.log('ProductForm state:', { 
            productId, 
            currentProductId,
            viewMode, 
            isEditMode, 
            defaultValues: !!defaultValues,
            productIdType: typeof productId,
            productIdValue: productId
        });
    }, [productId, currentProductId, viewMode, isEditMode, defaultValues]);
    
    // Draft state logic
    const [draftProductId, setDraftProductId] = useState<number | null>(
        defaultValues?.publication_status === PublicationStatus.DRAFT && defaultValues?.id ? defaultValues.id : null
    );
    const [isDraftSaving, setIsDraftSaving] = useState<boolean>(false);
    
    // API mutations
    const createProductMutation = useCreateProduct();
    
    // Log when productId changes to help with debugging
    useEffect(() => {
        if (productId) {
            console.log('Product ID for update:', productId);
        }
    }, [productId]);
    
    // Make sure we're using the correct product ID for updates
    // We need to ensure the productId is a valid number
    const productIdNumber = productId ? parseInt(productId) : 0;
    const updateProductMutation = useUpdateProduct(productIdNumber);
    
    // Function to directly update a product using the API
    const updateProduct = async (data: any, id: number) => {
        console.log('Direct API update for product ID:', id);
        console.log('API endpoint URL:', apiEndpoints.products.detail(id));
        
        // Log the request headers and method
        console.log('Request method: PUT');
        
        try {
            // No need to include the ID in the payload as it's already in the URL
            // The server identifies which product to update based on the URL, not the payload
            const updatePayload = {
                ...data
                // Don't add ID to payload - it's not expected by the server
            };
            
            console.log('Final update payload with ID:', updatePayload);
            
            // Make the API call with explicit PUT method
            const response = await api.put(apiEndpoints.products.detail(id), updatePayload);
            
            console.log('Update response status:', response.status);
            console.log('Update response data:', response.data);
            
            if (response.data && response.data.id) {
                console.log('Updated product ID from response:', response.data.id);
                // Check if the returned ID matches the one we sent
                if (response.data.id !== id) {
                    console.warn('Warning: Returned product ID does not match the ID we sent for update');
                }
            }
            
            return response.data;
        } catch (error: any) {
            console.error('Direct update error:', error);
            if (error.response) {
                console.error('Error response status:', error.response.status);
                console.error('Error response data:', error.response.data);
            }
            throw error;
        }
    };

    // Map product details to form data
    const mapProductDetailsToFormData = (details: ExtendedProductDetail): FormData => {
        const attributeValues: Record<string, ProductAttributeValue> = {};
        details.attribute_values?.forEach(av => {
            attributeValues[av.attribute.id.toString()] = {
                id: av.id,
                attribute_id: av.attribute.id,
                attribute_name: av.attribute.name,
                attribute_code: av.attribute.code,
                attribute_type: av.attribute.data_type,
                value: av.value,
                use_variant: av.use_variant
            };
        });

        return {
            // Basic product info
            name: details.name || '',
            product_type: details.product_type || ProductType.REGULAR,
            description: details.description || '',
            short_description: details.short_description || '',
            
            // References
            division_id: details.division?.id || 0,
            category: details.category?.id || 0,
            subcategory: details.subcategory?.id || 0,
            productstatus: details.status?.id || 0,
            uom_id: details.uom?.id || 0,
            
            // Status and flags
            is_active: details.is_active ?? true,
            is_tax_exempt: details.is_tax_exempt ?? false,
            allow_reviews: details.allow_reviews ?? true,
            
            // Pricing
            currency_code: details.currency_code || 'USD',
            display_price: details.display_price || 0,
            compare_at_price: details.compare_at_price || null,
            default_tax_rate_profile: details.default_tax_rate_profile?.id || null,
            
            // Inventory
            sku: details.sku || '',
            inventory_tracking_enabled: details.inventory_tracking_enabled ?? false,
            quantity_on_hand: details.quantity_on_hand || 0,
            is_serialized: details.is_serialized ?? false,
            is_lotted: details.is_lotted ?? false,
            backorders_allowed: details.backorders_allowed ?? false,
            
            // Pre-order
            pre_order_available: details.pre_order_available ?? false,
            pre_order_date: details.pre_order_date || null,
            
            // SEO
            seo_title: details.seo_title || '',
            seo_description: details.seo_description || '',
            seo_keywords: details.seo_keywords || '',
            
            // Attributes
            attributes: attributeValues,
            attribute_values_input: details.attribute_values
                ?.filter(av => av.value !== null && av.value !== undefined)
                .map(av => ({
                    attribute: av.attribute.id,
                    value: av.value
                } as AttributeValueInput)) || [],
            variant_defining_attributes: details.variant_defining_attributes || [],
            attribute_groups: details.attribute_groups || [],
            
            // Additional fields
            faqs: details.faqs || [],
            tags: details.tags || [],
            organizationTags: [], // New field for organization tags
            temp_images: [],
            parent_temp_images: [],
            publication_status: details.publication_status || PublicationStatus.DRAFT,
            slug: details.slug || ''
        };
    };

    // Initialize form methods with proper typing
    const methods = useForm<FormData>({
        mode: 'onBlur',
        resolver: zodResolver(formSchema) as unknown as HookFormResolver<FormData>,
        defaultValues: defaultValues ? mapProductDetailsToFormData(defaultValues) : {
            name: '',
            product_type: ProductType.REGULAR,
            description: '',
            short_description: '',
            division_id: 0,
            category: 0,
            subcategory: 0,
            productstatus: 0,
            uom_id: 0,
            is_active: true,
            allow_reviews: true,
            is_tax_exempt: false,
            currency_code: '',
            display_price: 0,
            compare_at_price: null,
            default_tax_rate_profile: null,
            sku: '',
            inventory_tracking_enabled: false,
            quantity_on_hand: 0,
            is_serialized: false,
            is_lotted: false,
            backorders_allowed: false,
            pre_order_available: false,
            pre_order_date: null,
            seo_title: '',
            seo_description: '',
            seo_keywords: '',
            faqs: [],
            tags: [],
            temp_images: [],
            parent_temp_images: [],
            variant_defining_attributes: [],
            attribute_groups: [],
            attributes: {},
            attribute_values_input: [],
            publication_status: PublicationStatus.DRAFT,
            slug: ''
        }
    });

    // Watch for form values that affect other fields
    const preOrderAvailable = methods.watch('pre_order_available');
    const productType = methods.watch('product_type');

    // FAQ fields
    const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray<FormData>({
        control: methods.control,
        name: 'faqs'
    });

   

    // Render tag input field with proper typing - generic version for any string array field
    const renderTagInput = ({ 
        field, 
        label, 
        helperText 
    }: { 
        field: { value: string[], onChange: (value: string[]) => void }, 
        label: string, 
        helperText: string 
    }) => (
        <Autocomplete<string, true, boolean, true>
            multiple
            freeSolo
            options={[]}
            value={field.value || []}
            onChange={(event, value, reason, details) => {
                // In view mode, prevent changes to the tags
                if (!viewMode) {
                    field.onChange(value as string[]);
                }
            }}
            // Disable chip deletion in view mode
            clearOnBlur={!viewMode}
            disableClearable={viewMode}
            readOnly={viewMode}
            // Use custom renderTags only when in view mode
            {...(viewMode && {
                renderTags: (value, getTagProps) => 
                    value.map((option, index) => {
                        // Get the tag props first
                        const tagProps = getTagProps({ index });
                        
                        // In view mode, create a chip without delete functionality
                        return (
                            <Chip
                                {...tagProps}
                                label={option}
                                // Override onDelete to disable deletion in view mode
                                onDelete={undefined}
                            />
                        );
                    })
            })}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    helperText={helperText}
                    variant="outlined"
                    fullWidth
                    disabled={viewMode}
                />
            )}
        />
    );

    // Get tag string for display - ensure we handle both string and array inputs
    const getTagsString = (tags: string[] | undefined) => {
        if (!tags) return '';
        if (typeof tags === 'string') return tags;
        return Array.isArray(tags) ? tags.join(', ') : '';
    };

    // Add FAQ
    const handleAddFaq = () => {
        appendFaq({
            question: '',
            answer: ''
        });
    };

    // Remove FAQ
    const handleRemoveFaq = (index: number) => {
        removeFaq(index);
    };

    // Effect to set form values when product details are available
    useEffect(() => {
        if (defaultValues) {
            const formData = mapProductDetailsToFormData(defaultValues);
            Object.entries(formData).forEach(([key, value]) => {
                methods.setValue(key as keyof FormData, value);
            });
            
            // If we have a productId and defaultValues, set the selected category
            if (productId && defaultValues.category) {
                setSelectedCategory(defaultValues.category);
            }
        }
    }, [defaultValues, methods.setValue, productId]);

    // Watch values for conditional logic
    const isInventoryTrackingEnabled = methods.watch('inventory_tracking_enabled');

    // Watch temp_images for debugging
    useEffect(() => {
        const subscription = methods.watch((value, { name }) => {
            if (name === 'temp_images') {
                console.log('temp_images changed:', value.temp_images);
            }
        });
        return () => subscription.unsubscribe();
    }, [methods.watch]);

    return (
        <>
        <FormProvider {...methods}>
        <form onSubmit={(e) => e.preventDefault()} noValidate>
            {/* Form Actions */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                {/* Edit button - should appear when in view mode */}
                {viewMode && (
                    <Button
                        type="button"
                        variant="outlined"
                        color="primary"
                        startIcon={<EditIcon />}
                        onClick={() => {
                            console.log('Edit button clicked - switching to edit mode');
                            setViewMode(false);
                            console.log('After setViewMode(false):', { viewMode: false, productId });
                        }}
                    >
                        {t('products.form.edit', 'Edit Product')}
                    </Button>
                )}
                
                {/* Save button - different versions for create vs update */}
                {!viewMode && (
                    // Debug which condition is being evaluated
                    console.log('Button rendering condition:', { 
                        productId, 
                        currentProductId,
                        productIdType: typeof currentProductId, 
                        productIdTruthy: !!currentProductId,
                        viewMode,
                        productIdNumberCheck: currentProductId ? parseInt(currentProductId) > 0 : false
                    }),
                    
                    // Check if we have a valid product ID (for update)
                    // Use currentProductId which tracks both initial productId and newly created IDs
                    (!!currentProductId && currentProductId !== '0') ? (
                        // Update button for existing products
                        <Button
                            type="button"
                            variant="contained"
                            color="success"
                            disabled={methods.formState.isSubmitting}
                            startIcon={methods.formState.isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
                            onClick={async () => {
                                // Debug which button was clicked
                                console.log('UPDATE button clicked for existing product with ID:', productId);
                                console.log('Update button clicked');
                                
                                try {
                                    // Get current form values
                                    const formData = methods.getValues();
                                    console.log('Current form values for update:', formData);
                                    
                                    // Process attribute values directly
                                    const processedAttributeValues = Object.entries(formData.attributes || {})
                                        .filter(([attributeId, attr]) => {
                                            // Skip deleted attributes
                                            if (attr.is_deleted) return false;
                                            
                                            // Skip null/undefined values
                                            if (attr.value === null || attr.value === undefined) return false;
                                            
                                            // Skip empty strings
                                            if (attr.value === '') return false;
                                            
                                            // Skip variant-defining attributes
                                            const attrId = Number(attributeId);
                                            if (formData.variant_defining_attributes && 
                                                formData.variant_defining_attributes.includes(attrId)) {
                                                return false;
                                            }
                                            
                                            return true;
                                        })
                                        .map(([attributeId, attr]) => ({
                                            attribute: Number(attributeId),
                                            value: attr.value
                                        }));
                                    
                                    // Transfer parent_temp_images to temp_images if needed
                                    if (formData.parent_temp_images && formData.parent_temp_images.length > 0) {
                                        formData.temp_images = [...formData.parent_temp_images];
                                    }
                                    
                                    // Create a clean payload without parent_temp_images and organizationTags
                                    const { parent_temp_images, organizationTags, ...cleanFormData } = formData;
                                    
                                    const apiPayload = {
                                        ...cleanFormData,
                                        attribute_values_input: processedAttributeValues,
                                        variant_defining_attributes: formData.variant_defining_attributes || [],
                                        attribute_groups: formData.attribute_groups || [],
                                        publication_status: PublicationStatus.ACTIVE
                                    };
                                    
                                    console.log('Update API payload:', apiPayload);
                                    
                                    // Double check that we have a valid product ID
                                    const updateId = currentProductId ? parseInt(currentProductId) : (productId ? parseInt(productId) : 0);
                                    console.log('Updating product with ID:', updateId);
                                    
                                    // No need to add ID to the payload - it's already in the URL
                                    // The server identifies which product to update based on the URL
                                    const payloadWithId = {
                                        ...apiPayload
                                        // Don't add ID to payload - it's not expected by the server
                                    };
                                    console.log('Using product ID in URL:', updateId);
                                    
                                    // Use direct API call to ensure we're using the correct ID
                                    const result = await updateProduct(payloadWithId, updateId);
                                    
                                    // Invalidate queries to refresh data
                                    queryClient.invalidateQueries({ queryKey: ['products'] });
                                    queryClient.invalidateQueries({ queryKey: ['product', updateId] });
                                    
                                    console.log('Update successful, result:', result);
                                    
                                    // Show success message
                                    setNotification({
                                        open: true,
                                        message: t('products.form.updateSuccess', 'Product updated successfully'),
                                        severity: 'success'
                                    });
                                    
                                    // Set view mode after successful update
                                    setViewMode(true);
                                    
                                    // Call onSubmit callback if provided
                                    if (onSubmit && result) {
                                        await onSubmit(result);
                                    }
                                } catch (error) {
                                    console.error('Update failed:', error);
                                    setNotification({
                                        open: true,
                                        message: t('products.form.error', 'An error occurred while updating the product'),
                                        severity: 'error'
                                    });
                                }
                            }}
                        >
                            {methods.formState.isSubmitting ? t('products.form.editing', 'Editing...') : t('products.form.update', 'Edit Changes')}
                        </Button>
                    ) : (
                        // Create button for new products
                        <Button
                            type="button"
                            variant="contained"
                            color="primary"
                            disabled={methods.formState.isSubmitting}
                    startIcon={methods.formState.isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
                    onClick={async () => {
                        // Debug which button was clicked
                        console.log('CREATE button clicked for new product (no ID)');
                        console.log('Save button clicked manually');
                        
                        try {
                            // Get current form values
                            const formData = methods.getValues();
                            console.log('Current form values:', formData);
                            
                            // Process attribute values directly
                            const processedAttributeValues = Object.entries(formData.attributes || {})
                                .filter(([attributeId, attr]) => {
                                    // Skip deleted attributes
                                    if (attr.is_deleted) return false;
                                    
                                    // Skip null/undefined values
                                    if (attr.value === null || attr.value === undefined) return false;
                                    
                                    // Skip empty strings
                                    if (attr.value === '') return false;
                                    
                                    // Skip variant-defining attributes
                                    const attrId = Number(attributeId);
                                    if (formData.variant_defining_attributes && 
                                        formData.variant_defining_attributes.includes(attrId)) {
                                        return false;
                                    }
                                    
                                    return true;
                                })
                                .map(([attributeId, attr]) => ({
                                    attribute: Number(attributeId),
                                    value: attr.value
                                }));
                            
                            console.log('Processed attribute values:', processedAttributeValues);
                            
                            // Transfer parent_temp_images to temp_images if needed
                            if (formData.parent_temp_images && formData.parent_temp_images.length > 0) {
                                formData.temp_images = [...formData.parent_temp_images];
                            }
                            
                            // Create a clean payload without parent_temp_images and organizationTags
                            const { parent_temp_images, organizationTags, ...cleanFormData } = formData;
                            
                            const apiPayload = {
                                ...cleanFormData,
                                attribute_values_input: processedAttributeValues,
                                variant_defining_attributes: formData.variant_defining_attributes || [],
                                attribute_groups: formData.attribute_groups || [],
                                publication_status: PublicationStatus.ACTIVE
                            };
                            
                            // For update operations, we don't need to include the ID in the payload
                            // The ID is already included in the API endpoint URL
                            if (productId) {
                                console.log('Using product ID in endpoint:', productId);
                            }
                            
                            console.log('Bypassing validation - Direct API payload:', apiPayload);
                            
                            // This is now only for creating new products
                            console.log('Directly calling createProductMutation.mutateAsync');
                            const result = await createProductMutation.mutateAsync(apiPayload);
                            
                            console.log('Direct API call successful, result:', result);
                            
                            // Show success message
                            setNotification({
                                open: true,
                                message: productId 
                                    ? t('products.form.updateSuccess', 'Product updated successfully') 
                                    : t('products.form.createSuccess', 'Product created successfully'),
                                severity: 'success'
                            });
                            
                            // Handle post-save actions
                            if (result && result.id) {
                                if (!productId) {
                                    // This was a new product creation
                                    console.log('New product created with ID:', result.id);
                                    // Store the new product ID so we can use it for editing
                                    setCurrentProductId(result.id.toString());
                                } else {
                                    // This was an update to existing product
                                    console.log('Product updated with ID:', result.id);
                                }
                                
                                // Set view mode after successful save (both for create and update)
                                setViewMode(true);
                                
                                // Update URL if needed - this would typically be handled by the parent component
                                // through the onSubmit callback
                            }
                            
                            // Call onSubmit callback if provided
                            if (onSubmit && result) {
                                await onSubmit(result);
                            }
                            
                           
                        } catch (error) {
                            console.error('Direct API call failed:', error);
                            setNotification({
                                open: true,
                                message: t('products.form.error', 'An error occurred while saving the product'),
                                severity: 'error'
                            });
                        }
                    }}
                >
                    {methods.formState.isSubmitting ? t('products.form.saving', 'Saving...') : t('products.form.save', 'Save Product')}
                        </Button>
                    )
                )}
            </Box>

            {/* Main Content Grid (70/30 split) */}
            <Grid container spacing={3}>

                <Grid item xs={12} md={8}> 
                    {/* General Information Section */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            {t('productGeneralInfo')}
                        </Typography>
                        {/* Inner grid for smaller fields */}
                        <Grid container spacing={2}> 

                            {/* Product Type Selection */}
                            <Grid item xs={12}> 
                                <Box>
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                        {t('products.fields.productType', 'Product Type')} *
                                    </Typography>
                                    <Controller
                                        name="product_type"
                                        control={methods.control}
                                        render={({ field }) => (
                                            <RadioGroup
                                                row
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.value)}
                                            >
                                                <FormControlLabel
                                                    value={ProductType.REGULAR}
                                                    control={<Radio size="small" disabled={viewMode}/>} 
                                                    label={<Typography variant="body2">{t('products.types.regular', 'Simple')}</Typography>} 
                                                />
                                                <FormControlLabel
                                                    value={ProductType.PARENT}
                                                    control={<Radio size="small" disabled={viewMode}/>}
                                                    label={<Typography variant="body2">{t('products.types.parent', 'Variable')}</Typography>}
                                                />
                                                <FormControlLabel
                                                    value={ProductType.KIT}
                                                    control={<Radio size="small" disabled={viewMode}/>}
                                                    label={<Typography variant="body2">{t('products.types.kit', 'Kit')}</Typography>}
                                                />
                                            </RadioGroup>
                                        )}
                                    />
                                    {methods.formState.errors.product_type && <FormHelperText error>{methods.formState.errors.product_type.message}</FormHelperText>}
                                </Box>
                            </Grid>

                            {/* Product Name */}
                            <Grid item xs={12} sm={6}> 
                                <Controller
                                    name="name"
                                    control={methods.control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={t('productNameRequired')}
                                            placeholder={t('productNamePlaceholder')}
                                            fullWidth
                                            required
                                            size="small" 
                                            error={!!methods.formState.errors.name}
                                            helperText={methods.formState.errors.name?.message}
                                            disabled={viewMode}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* Slug */}
                            <Grid item xs={12} sm={6}> 
                                <Controller
                                    name="slug"
                                    control={methods.control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={t('productSlug')}
                                            placeholder={t('productSlugPlaceholder')}
                                            fullWidth
                                            size="small"
                                            error={!!methods.formState.errors.slug}
                                            helperText={methods.formState.errors.slug?.message || t('products.helpers.slug', 'Unique URL identifier (auto-generated suggested)')}
                                            disabled={viewMode}
                                        />
                                    )}
                                />
                            </Grid>

                           {/* === Division (Autocomplete) === */}
                           <Grid item xs={12} sm={6}>
                                <EntityAutocomplete
                                    name="division_id"
                                    control={methods.control}
                                    label={t('productDivisionRequired')}
                                    apiEndpoint={entityEndpoints.divisions}
                                    required={true}
                                    error={!!methods.formState.errors.division_id}
                                    helperText={methods.formState.errors.division_id?.message}
                                    disabled={viewMode}
                                />
                            </Grid>

                            {/* === Category (Autocomplete) === */}
                            <Grid item xs={12} sm={6}>
                                 <EntityAutocomplete
                                    name="category"
                                    control={methods.control}
                                    label={t('productCategoryLabel')}
                                    apiEndpoint={entityEndpoints.categories}
                                    required={true}
                                    error={!!methods.formState.errors.category}
                                    helperText={methods.formState.errors.category?.message}
                                    onChange={(newValue) => {
                                        methods.setValue('subcategory', 0); 
                                        setSelectedCategory(newValue); 
                                    }}
                                    disabled={viewMode}
                                />
                            </Grid>

                            {/* === Subcategory (Autocomplete) === */}
                            <Grid item xs={12} sm={6}>
                                <EntityAutocomplete
                                    name="subcategory"
                                    control={methods.control}
                                    label={t('productSubcategoryLabel')}
                                    apiEndpoint={entityEndpoints.subcategories}
                                    error={!!methods.formState.errors.subcategory}
                                    helperText={methods.formState.errors.subcategory?.message}
                                    disabled={!selectedCategory || viewMode}
                                    dependsOn={{
                                        field: 'id',
                                        param: 'category'
                                    }}
                                    value={selectedCategory}
                                />
                            </Grid>

                            {/* === Unit of Measure (UOM) (Autocomplete) === */}
                             <Grid item xs={12} sm={6}>
                                <EntityAutocomplete
                                    name="uom_id"
                                    control={methods.control}
                                    label={t('productUomLabel')}
                                    apiEndpoint={entityEndpoints.unitOfMeasures}
                                    required={true}
                                    error={!!methods.formState.errors.uom_id}
                                    helperText={methods.formState.errors.uom_id?.message}    
                                    disabled={viewMode}
                                />
                            </Grid>


                             {/* Description */}
                            <Grid item xs={12}> 
                                <Controller
                                    name="description"
                                    control={methods.control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={t('productDescription')}
                                            placeholder={t('productDescriptionPlaceholder')}
                                            fullWidth
                                            multiline
                                            rows={4}
                                            size="small"
                                            disabled={viewMode}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* Short Description / Summary */}
                            <Grid item xs={12}> 
                                <Controller
                                    name="short_description"
                                    control={methods.control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={t('productShortDescription')}
                                            placeholder={t('productShortDescriptionPlaceholder')}
                                            fullWidth
                                            multiline
                                            rows={2}
                                            size="small"
                                            disabled={viewMode}
                                        />
                                    )}
                                />
                            </Grid>

                        </Grid> 
                    </Paper> 

                    {/* --- Other Left Column Sections Remain Here --- */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        {t('products.sections.pricingAndTax', 'Pricing & Tax')}
                    </Typography>
                    <Grid container spacing={2}>
                        {/* === Currency (Autocomplete) - NEW === */}
                        <Grid item xs={12} sm={6}>
                            <EntityAutocomplete
                                name="currency_code"
                                control={methods.control}
                                label={t('productCurrencyRequired')}
                                apiEndpoint={entityEndpoints.currencies}
                                filterParams={{ is_active: true }}
                                required={true}
                                error={!!methods.formState.errors.currency_code}
                                helperText={methods.formState.errors.currency_code?.message}
                                valueField="code" 
                                getOptionLabel={(option: any) => `${option.code} - ${option.name}`}
                                disabled={viewMode}
                            />

                        </Grid>

                        {/* === Display Price === */}
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="display_price"
                                control={methods.control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label={t('productDisplayPrice')}
                                        type="number"
                                        size="small"
                                        InputProps={{
                                            inputProps: { min: 0, step: "0.01" }
                                        }}
                                        fullWidth
                                        required={productType === ProductType.REGULAR || productType === ProductType.KIT} 
                                        error={!!methods.formState.errors.display_price}
                                        helperText={methods.formState.errors.display_price?.message || t('products.helpers.displayPrice', 'Price in selected currency')} 
                                        value={field.value ?? ''}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            field.onChange(value === '' ? null : Number(value));
                                        }}
                                        disabled={viewMode}
                                    />
                                )}
                            />
                        </Grid>

                        {/* === Default Tax Rate Profile (Autocomplete) - UPDATED === */}
                        <Grid item xs={12} sm={6}>
                            <EntityAutocomplete
                                name="default_tax_rate_profile"
                                control={methods.control}
                                label={t('productTaxProfile')}
                                apiEndpoint={entityEndpoints.taxRateProfiles}
                                filterParams={{ is_active: true }}
                                error={!!methods.formState.errors.default_tax_rate_profile}
                                helperText={methods.formState.errors.default_tax_rate_profile?.message || t('products.helpers.taxProfile', 'Optional. Overrides category/global defaults.')}
                                disabled={viewMode}
                            />
                        </Grid>

                        {/* === Compare At Price === */}
                         <Grid item xs={12} sm={6}>
                             <Controller
                                 name="compare_at_price"
                                 control={methods.control}
                                 render={({ field }) => (
                                     <TextField
                                         {...field}
                                         label={t('productCompareAtPrice')}
                                         type="number"
                                         size="small"
                                         InputProps={{
                                             inputProps: { min: 0, step: "0.01" }
                                         }}
                                         fullWidth
                                         error={!!methods.formState.errors.compare_at_price}
                                         helperText={methods.formState.errors.compare_at_price?.message || t('products.helpers.compareAtPrice', 'Optional. To show a sale price.')}
                                         value={field.value ?? ''}
                                         onChange={(e) => {
                                             const value = e.target.value;
                                             field.onChange(value === '' ? null : Number(value));
                                         }}
                                         disabled={viewMode}
                                     />
                                 )}
                             />
                         </Grid>

                        {/* === Is Tax Exempt  === */}
                        <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
                            <Controller
                                name="is_tax_exempt"
                                control={methods.control}
                                render={({ field }) => (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={field.value}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.checked)}
                                                size="small"
                                            />
                                        }
                                        label={t('productIsTaxExempt')}
                                        disabled={viewMode}
                                    />
                                )}
                            />
                        </Grid>

                    </Grid> 
                </Paper> 

                    {/* Inventory Section */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        {t('products.sections.inventory', 'Inventory')}
                    </Typography>
                    <Grid container spacing={2}>
                        {/* SKU */}
                         <Grid item xs={12} sm={6}>
                             <Controller
                                 name="sku"
                                 control={methods.control}
                                 render={({ field }) => (
                                     <TextField
                                         {...field}
                                         label={t('productSkuLabel')}
                                         fullWidth
                                         size="small"
                                         required={productType === ProductType.REGULAR || productType === ProductType.KIT} 
                                         error={!!methods.formState.errors.sku}
                                         helperText={methods.formState.errors.sku?.message || t('products.helpers.sku', 'Unique per tenant. May be auto-generated.')} 
                                         value={field.value ?? ''}
                                         disabled={viewMode}
                                     />
                                 )}
                             />
                         </Grid>

                         {/* Current Stock Level Display - REPLACED quantity_on_hand */}
                         <Grid item xs={12} sm={6}>
                            <Box sx={{ p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <Typography variant="caption" color="text.secondary">
                                     {t('products.fields.currentStock', 'Current Stock Level')}
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                     { isInventoryTrackingEnabled
                                        ? `${150} ${methods.watch('uom_id') || 'units'}` 
                                        : t('products.stock.notTracked', 'Not Tracked') 
                                     }
                                     {/* Optional: Add Link here if needed */}
                                     {/* {isEditMode && <Link href={`/inventory/${productId}/stock`} passHref><MuiLink sx={{ml: 1, fontSize: '0.8rem'}}>View Details</MuiLink></Link>} */}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                                    {t('products.helpers.currentStock', 'Calculated across locations. Not editable here.')}
                                 </Typography>
                            </Box>
                         </Grid>


                         {/* Inventory Tracking Enabled - Conditional Visibility */}
                         {productType === ProductType.REGULAR && ( 
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="inventory_tracking_enabled"
                                    control={methods.control}
                                    render={({ field }) => (
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={field.value}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.checked)}
                                                    size="small"
                                                />
                                            }
                                            disabled={viewMode}
                                            label={t('productTrackInventory')}
                                        />
                                    )}
                                />
                            </Grid>
                         )}

                        {/* is_serialized - NEW */}
                        <Grid item xs={12} sm={6}>
                             <Controller
                                 name="is_serialized"
                                 control={methods.control}
                                 render={({ field }) => (
                                     <FormControlLabel
                                         control={
                                             <Checkbox
                                                 checked={field.value}
                                                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.checked)}
                                                 size="small"
                                                 disabled={!isInventoryTrackingEnabled} 
                                             />
                                         }
                                         disabled={viewMode}
                                         label={t('productIsSerialized')}
                                         title={t('products.helpers.isSerialized', 'Check if individual units require unique serial number tracking.')} 
                                     />
                                 )}
                             />
                         </Grid>

                         {/* is_lotted - NEW */}
                         <Grid item xs={12} sm={6}>
                             <Controller
                                 name="is_lotted"
                                 control={methods.control}
                                 render={({ field }) => (
                                     <FormControlLabel
                                         control={
                                             <Checkbox
                                                 checked={field.value}
                                                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.checked)}
                                                 size="small"
                                                 disabled={!isInventoryTrackingEnabled} 
                                             />
                                         }
                                         disabled={viewMode}
                                         label={t('productIsLotted')}
                                         title={t('products.helpers.isLotted', 'Check if product is tracked in batches/lots.')} 
                                     />
                                 )}
                             />
                         </Grid>

                         {/* Backorders Allowed - Conditional Visibility */}
                         {productType === ProductType.REGULAR && ( 
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="backorders_allowed"
                                    control={methods.control}
                                    render={({ field }) => (
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={field.value}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.checked)}
                                                    disabled={!isInventoryTrackingEnabled} 
                                                    size="small"
                                                />
                                            }
                                            label={t('productAllowBackorders')}
                                            disabled={viewMode}
                                        />
                                    )}
                                />
                            </Grid>
                         )}

                    </Grid> 
                </Paper> 
                
                  {/* Attribute Values Section */}
                  <Paper sx={{ mb: 3, p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            {t('products.attributeValues')}
                        </Typography>
                        <AttributeValueProvider>
                        <AttributeValueManager 
                            control={methods.control}
                            setValue={methods.setValue}
                            watch={methods.watch}
                            selectedGroupIds={methods.watch('attribute_groups')}
                            variantDefiningAttributeIds={methods.watch('variant_defining_attributes')}
                            isVariableProduct={
                                methods.getValues('product_type') === ProductType.VARIANT || 
                                methods.getValues('product_type') === ProductType.PARENT
                            }
                            defaultValues={defaultValues?.attribute_values}
                            onValuesChange={(vals) => methods.setValue('attribute_values_input', vals)}
                            onVariantToggle={(attribute, isSelected) => {
                                // Update variant_defining_attributes when an attribute is toggled
                                const currentVariantAttributes = methods.getValues('variant_defining_attributes') || [];
                                if (isSelected && !currentVariantAttributes.includes(attribute.id)) {
                                    methods.setValue('variant_defining_attributes', [...currentVariantAttributes, attribute.id]);
                                } else if (!isSelected && currentVariantAttributes.includes(attribute.id)) {
                                    methods.setValue('variant_defining_attributes', 
                                        currentVariantAttributes.filter(id => id !== attribute.id)
                                    );
                                }
                            }}
                        />
                        </AttributeValueProvider>
                  </Paper>

                  {/* Variant Table Section - Only show for products with variant attributes */}
                  
                    {methods.watch('product_type') === ProductType.PARENT && (
                        <Paper sx={{ mb: 3, p: 3 }}>
                            <VariantTable  
                                productId={productId ? parseInt(productId) : undefined}
                                variantDefiningAttributes={methods.watch('variant_defining_attributes')}
                                viewMode={viewMode}
                                onEditModeRequest={() => {
                                    // Put the form in edit mode when requested by VariantTable
                                    console.log('Entering edit mode from VariantTable request');
                                    // Ensure we're in edit mode and not view mode
                                    setViewMode(false);
                                    
                                    // Log the current state to debug
                                    console.log('Form state after edit mode request:', { 
                                        viewMode: false, 
                                        currentProductId,
                                        productId,
                                        shouldShowEditButton: !!currentProductId && currentProductId !== '0'
                                    });
                                }}
                                onProductIdChange={(id) => {
                                    // Update the currentProductId when a product is created or selected in VariantTable
                                    console.log('Updating currentProductId from VariantTable:', id);
                                    setCurrentProductId(id.toString());
                                    
                                    // Log the updated state
                                    console.log('Updated form state after product ID change:', {
                                        newProductId: id,
                                        currentProductId: id.toString(),
                                        viewMode: false,
                                        shouldShowEditButton: true
                                    });
                                }}
                            />
                        </Paper>

                    )}
                  

                    {/* SEO Information Section */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            {t('productSeo')}
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Controller
                                    name="seo_title"
                                    control={methods.control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={t('productMetaTitle')}
                                            fullWidth
                                            size="small"
                                            helperText={t('productMetaTitleHelper')}
                                            disabled={viewMode}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Controller
                                    name="seo_description"
                                    control={methods.control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={t('productMetaDescription')}
                                            fullWidth
                                            multiline
                                            rows={2}
                                            size="small"
                                            helperText={t('productMetaDescriptionHelper')}
                                            disabled={viewMode}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Controller
                                    name="tags"
                                    control={methods.control}
                                    defaultValue={[]}
                                    render={({ field, fieldState: { error } }) => renderTagInput({
                                        field,
                                        label: t('products.form.fields.tags.label', 'Tags'),
                                        helperText: error?.message || t('products.form.fields.tags.helper', 'Enter tags separated by commas'),
                                    })}
                                    disabled={viewMode}
                                />
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* FAQs Section */}
                    <Paper  sx={{ p: 3, mb: 3 }}>
                     
                        <Box sx={{ mb: 2 , display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h6" gutterBottom>
                            {t('products.faqs.title')}
                        </Typography>
                            <Button
                                startIcon={<AddIcon />}
                                onClick={handleAddFaq}
                                variant="outlined"
                                size="small"
                                disabled={viewMode}
                            >
                                {t('products.faqs.add')}
                            </Button>
                        </Box>

                        {faqFields.map((field, index) => (
                            <Box key={field.id} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 1, position: 'relative' }}>
                                <Grid container spacing={2}>
                                <Grid item xs={12} sx={{ textAlign: 'right' }}>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleRemoveFaq(index)}
                                            aria-label={t('products.faqs.remove')}
                                            disabled={viewMode}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Controller
                                            name={`faqs.${index}.question`}
                                            control={methods.control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label={t('products.faqs.questionLabel')}
                                                    fullWidth
                                                    size="small"
                                                    error={!!methods.formState.errors.faqs?.[index]?.question}
                                                    helperText={methods.formState.errors.faqs?.[index]?.question?.message}
                                                    disabled={viewMode}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Controller
                                            name={`faqs.${index}.answer`}
                                            control={methods.control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label={t('products.faqs.answerLabel')}
                                                    fullWidth
                                                    size="small"
                                                    multiline
                                                    rows={3}
                                                    error={!!methods.formState.errors.faqs?.[index]?.answer}
                                                    helperText={methods.formState.errors.faqs?.[index]?.answer?.message}
                                                    disabled={viewMode}
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        ))}
                    </Paper>

                </Grid>


                {/* === Right Column (30%) === */}
                <Grid item xs={12} md={4}> 
                <Paper sx={{ p: 3, mb: 3 }}>
                         <Typography variant="h6" sx={{ mb: 2 }}>
                            {t('productStatus')}
                        </Typography>
                        <Grid container spacing={2}>
                            {/* Status Select */}
                            <Grid item xs={12}>
                                <EntityAutocomplete
                                    name="productstatus"
                                    control={methods.control}
                                    label={t('products.fields.productStatus', 'Product Status')}
                                    apiEndpoint={entityEndpoints.productStatuses}
                                    required={true}
                                    error={!!methods.formState.errors.productstatus}
                                    helperText={methods.formState.errors.productstatus?.message}
                                    disabled={viewMode}
                                />
                            </Grid>

                            {/* Is Active  */}
                            <Grid item xs={12}>
                                 <Controller
                                    name="is_active"
                                    control={methods.control}
                                    render={({ field }) => (
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={field.value}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.checked)}
                                                    size="small"
                                                />
                                            }
                                            label={t('productIsActive')}
                                            labelPlacement="start" 
                                            sx={{ justifyContent: 'space-between', ml: 0, width: '100%' }}
                                            disabled={viewMode} 
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                
                
                    
                    {/* Settings Section - Simplified */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            {t('productSettings')}
                        </Typography>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Controller
                                    name="pre_order_available"
                                    control={methods.control}
                                    render={({ field }) => (
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={field.value}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.checked)}
                                                    size="small"
                                                />
                                            }
                                            label={t('productPreOrderEnabled')}
                                            sx={{ justifyContent: 'space-between', ml: 0, width: '100%' }}
                                            labelPlacement="start"
                                            disabled={viewMode}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Controller
                                    name="pre_order_date"
                                    control={methods.control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={t('products.fields.preOrderDate', 'Pre-order Date')}
                                            type="date"
                                            size="small"
                                            InputLabelProps={{ shrink: true }}
                                            fullWidth
                                            disabled={!preOrderAvailable || viewMode}
                                            sx={{ mt: 1, transition: 'opacity 0.3s ease-in-out', opacity: preOrderAvailable ? 1 : 0.5 }}
                                            value={field.value || ''}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Controller
                                    name="allow_reviews"
                                    control={methods.control}
                                    render={({ field }) => (
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={field.value}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.checked)}
                                                    size="small"
                                                />
                                            }
                                            label={t('productAllowReviews')}
                                            sx={{ justifyContent: 'space-between', ml: 0, width: '100%' }}
                                            labelPlacement="start"
                                            disabled={viewMode}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Images Section */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            {t('products.sections.images', 'Images')}
                        </Typography>
                        <ImageManager
                            ownerType="product"
                            ownerId={draftProductId || (productId ? parseInt(productId) : undefined)}
                            onTempImagesChange={(tempImages) => {
                                console.log('Received temp images update:', tempImages);
                                methods.setValue('parent_temp_images', tempImages, {
                                    shouldDirty: true,
                                    shouldTouch: true,
                                    shouldValidate: true
                                });
                            }}
                        />
                    </Paper>

                    {/* Product Organization Section - Simplified */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            {t('productOrganization')}
                        </Typography>
                        <Grid container spacing={2}>
                             {/* Organization Tags - separate from regular tags */}
                            <Grid item xs={12}>
                                <Controller
                                    name="organizationTags"
                                    control={methods.control}
                                    defaultValue={[]}
                                    render={({ field, fieldState: { error } }) => renderTagInput({
                                        field,
                                        label: t('products.form.fields.organizationTags.label', 'Organization Tags'),
                                        helperText: error?.message || t('products.form.fields.organizationTags.helper', 'Enter organization tags separated by commas'),
                                    })}
                                    disabled={viewMode}
                                />
                            </Grid>
                             {/* Category, Subcategory, UOM Removed - Moved to General */}
                        </Grid>
                    </Paper>

                  

                </Grid> 

            </Grid> 

        </form>
        </FormProvider>

        <Snackbar
            open={notification.open}
            autoHideDuration={6000}
            onClose={() => setNotification(prev => ({ ...prev, open: false }))}
        >
            <Alert
                onClose={() => setNotification(prev => ({ ...prev, open: false }))}
                severity={notification.severity}
                sx={{ width: '100%' }}
            >
                {notification.message}
            </Alert>
        </Snackbar>
        </>
    );
};

// Export with dynamic to prevent SSR hydration issues
export default dynamic(() => Promise.resolve(ProductForm), { ssr: false });