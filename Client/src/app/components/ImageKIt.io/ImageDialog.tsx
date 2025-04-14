'use client';

import { useState, useCallback, useEffect } from 'react';
import { 
  Button, 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  IconButton, 
  Card,
  CardMedia,
  Box,
  Stack,
  Chip,
  TextField,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip
} from '@mui/material';
import { Image as ImageKitImage } from '@imagekit/next';
import CloseIcon from '@mui/icons-material/Close';
import CompareIcon from '@mui/icons-material/Compare';
import ComparisonDialog from './ComparisonDialog';
import { transformImage } from '@/app/actions/imagekit';

export interface ImageItem {
  url: string;
  file: File;
  isEnhancing?: boolean;
  transformedUrl?: string;
}

interface ImageDialogProps {
  open: boolean;
  onClose: () => void;
  images: ImageItem[];
  onUseOriginal?: (image: ImageItem) => void;
  onUseTransformed?: (image: ImageItem, transformedUrl: string) => void;
}

const ImageDialog = ({ open, onClose, images: initialImages, onUseOriginal, onUseTransformed }: ImageDialogProps) => {
  const [images, setImages] = useState<ImageItem[]>(initialImages);
  
  // Update images state when initialImages prop changes
  useEffect(() => {
    setImages(initialImages);
    console.log('Dialog received images:', initialImages);
  }, [initialImages]);
  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          onClose();
        }
      }}
    >
      <DialogTitle>
        Selected Images
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          <Stack spacing={2}>
            {images.map((image, index) => (
              <Box key={index}>
                {image.isEnhancing ? (
                  <EnhanceAIView
                    imageUrl={image.url}
                    file={image.file}
                    onBack={() => {
                      const newImages = [...images];
                      newImages[index] = { ...image, isEnhancing: false };
                      setImages(newImages);
                    }}
                    onUseTransformed={(transformedUrl) => {
                      if (onUseTransformed) {
                        onUseTransformed(image, transformedUrl);
                      }
                    }}
                  />
                ) : (
                  <Card sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    p: 1,
                    gap: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    width: '100%',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}>
                    <Box sx={{ 
                      width: 200,
                      height: 200,
                      borderRadius: 1,
                      overflow: 'hidden',
                      bgcolor: 'grey.100',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <CardMedia
                        component="img"
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        image={image.url}
                        alt={`Selected image ${index + 1}`}
                      />
                    </Box>
                    <Stack spacing={2} sx={{ flex: 1 }}>
                      <Button 
                        variant="outlined" 
                        size="small"
                        fullWidth
                        onClick={() => onUseOriginal && onUseOriginal(image)}
                        sx={{ 
                          borderRadius: 1,
                          textTransform: 'none',
                          fontSize: '1rem'
                        }}
                      >
                        Use Original
                      </Button>
                      <Button 
                        variant="contained" 
                        size="small"
                        fullWidth
                        onClick={() => {
                          const newImages = [...images];
                          newImages[index] = { ...image, isEnhancing: true };
                          setImages(newImages);
                        }}
                        sx={{ 
                          borderRadius: 1,
                          textTransform: 'none',
                          fontSize: '1rem'
                        }}
                      >
                        Enhance with AI
                      </Button>
                    </Stack>
                  </Card>
                )}
              </Box>
            ))}
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};


// AI Enhancement View Component
interface EnhanceAIViewProps {
  imageUrl: string;
  onBack: () => void;
  file?: File;
  onUseTransformed?: (transformedUrl: string) => void;
}

const enhancementOptions = [
  { label: 'Remove Bg', value: 'remove_bg' },
  { label: 'Blur Background', value: 'blur_bg' },
  { label: 'Auto Tone', value: 'auto_tone' },
  { label: 'Polish', value: 'polish' },
  { label: 'Upscale', value: 'upscale' },
  { label: 'Enhance Faces', value: 'enhance_faces' },
  { label: 'Generate Variations', value: 'generate_variations' },
  { label: 'Resize & Crop', value: 'resize_crop' },
];

const aspectRatioOptions = [
  { label: 'Original', value: '' },
  { label: '1:1', value: '1:1' },
  { label: '4:3', value: '4:3' },
  { label: '16:9', value: '16:9' },
  { label: '3:2', value: '3:2' },
  { label: '2:3', value: '2:3' },
];

const cropModeOptions = [
  { label: 'Maintain Ratio', value: 'maintain_ratio' },
  { label: 'Pad Resize', value: 'pad_resize' },
  { label: 'Force Crop', value: 'force' },
  { label: 'Extract', value: 'extract' },
  { label: 'Max Size', value: 'at_max' },
  { label: 'Min Size', value: 'at_least' },
];

const focusOptions = [
  { label: 'Center', value: 'center' },
  { label: 'Top', value: 'top' },
  { label: 'Left', value: 'left' },
  { label: 'Bottom', value: 'bottom' },
  { label: 'Right', value: 'right' },
  { label: 'Face', value: 'face' },
];

const EnhanceAIView = ({ imageUrl, onBack, file, onUseTransformed }: EnhanceAIViewProps) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transformedUrl, setTransformedUrl] = useState<string | null>(null);
  const [variationId, setVariationId] = useState<number>(1);
  const [variations, setVariations] = useState<string[]>([]);
  const [comparisonDialogOpen, setComparisonDialogOpen] = useState(false);
  const [appliedTransformations, setAppliedTransformations] = useState<string[]>([]);
  
  // Aspect ratio and cropping options
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<string>('');
  const [selectedCropMode, setSelectedCropMode] = useState<string>('maintain_ratio');
  const [selectedFocus, setSelectedFocus] = useState<string>('center');
  const [width, setWidth] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');

  const handleOptionToggle = (value: string) => {
    setSelectedOptions(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const handleGenerateWithAI = useCallback(async () => {
    // Allow processing if either options are selected OR a prompt is provided
    if (selectedOptions.length === 0 && (!prompt || prompt.trim() === '')) {
      setError('Please select at least one enhancement option or enter a prompt');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      
      // Convert image URL to base64
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        try {
          const base64data = reader.result as string;
          
          // Prepare transformation parameters
          const transformParams: any = {
            imageData: base64data,
            transformations: selectedOptions,
            prompt: prompt.trim() || undefined,
            variationId: selectedOptions.includes('generate_variations') ? variationId : undefined
          };
          
          // Add aspect ratio and cropping parameters if resize_crop is selected
          if (selectedOptions.includes('resize_crop')) {
            if (width) transformParams.width = Number(width);
            if (height) transformParams.height = Number(height);
            if (selectedAspectRatio) transformParams.aspectRatio = selectedAspectRatio;
            if (selectedCropMode) transformParams.cropMode = selectedCropMode;
            if (selectedFocus) transformParams.focus = selectedFocus;
          }
          
          // Call the server action to transform the image
          const transformedImageUrl = await transformImage(transformParams);
          
          setTransformedUrl(transformedImageUrl);
          
          // Build a list of applied transformations for the comparison dialog
          const transformationsList = [];
          
          if (selectedOptions.includes('remove_bg')) {
            transformationsList.push('Background Removal');
          }
          
          if (selectedOptions.includes('blur_bg')) {
            transformationsList.push('Background Blur');
          }
          
          if (selectedOptions.includes('auto_tone')) {
            transformationsList.push('Auto Tone');
          }
          
          if (selectedOptions.includes('polish')) {
            transformationsList.push('Polish (Quality Enhancement)');
          }
          
          if (selectedOptions.includes('upscale')) {
            transformationsList.push('Upscale');
          }
          
          if (selectedOptions.includes('enhance_faces')) {
            transformationsList.push('Face Enhancement');
          }
          
          if (selectedOptions.includes('generate_variations')) {
            transformationsList.push('Variation Generation');
          }
          
          if (selectedOptions.includes('resize_crop')) {
            let resizeDetails = 'Resize & Crop';
            if (width && height) {
              resizeDetails += ` (${width}x${height})`;
            }
            if (selectedAspectRatio) {
              resizeDetails += `, Aspect Ratio: ${selectedAspectRatio}`;
            }
            if (selectedCropMode) {
              resizeDetails += `, Crop Mode: ${selectedCropMode.replace('_', ' ')}`;
            }
            transformationsList.push(resizeDetails);
          }
          
          if (prompt && prompt.trim()) {
            transformationsList.push(`Prompt: "${prompt.trim()}"`); 
          }
          
          setAppliedTransformations(transformationsList);
          
          // If generating variations, create additional variations
          if (selectedOptions.includes('generate_variations')) {
            const newVariations = [];
            // Generate 3 variations with different IDs
            for (let i = 2; i <= 4; i++) {
              // Prepare transformation parameters for variations
              const variantParams: any = {
                imageData: base64data,
                transformations: selectedOptions,
                prompt: prompt.trim() || undefined,
                variationId: i
              };
              
              // Add aspect ratio and cropping parameters if resize_crop is selected
              if (selectedOptions.includes('resize_crop')) {
                if (width) variantParams.width = Number(width);
                if (height) variantParams.height = Number(height);
                if (selectedAspectRatio) variantParams.aspectRatio = selectedAspectRatio;
                if (selectedCropMode) variantParams.cropMode = selectedCropMode;
                if (selectedFocus) variantParams.focus = selectedFocus;
              }
              
              const variantUrl = await transformImage(variantParams);
              newVariations.push(variantUrl);
            }
            setVariations(newVariations);
          } else {
            setVariations([]);
          }
          
          setIsProcessing(false);
        } catch (err) {
          console.error('Error processing image:', err);
          setError('Failed to process image. Please try again.');
          setIsProcessing(false);
        }
      };
      
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error('Error preparing image:', err);
      setError('Failed to prepare image. Please try again.');
      setIsProcessing(false);
    }
  }, [imageUrl, selectedOptions, prompt]);
  
  const handleCloseError = () => {
    setError(null);
  };

  return (
    <>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      <Card sx={{
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        gap: 2,
        bgcolor: 'background.paper',
        borderRadius: 2,
        width: '100%',
        border: '1px solid',
        borderColor: 'divider'
      }}>
        {/* Success notification for variations */}
        {variations.length > 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Generated {variations.length + 1} variations of the image
          </Alert>
        )}
      {/* First row: Image and Chips side by side */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{
          width: 200,
          height: 200,
          borderRadius: 1,
          overflow: 'hidden',
          bgcolor: 'grey.100',
          flexShrink: 0
        }}>
          {transformedUrl ? (
            <Box 
              sx={{ 
                position: 'relative',
                width: '100%',
                height: '100%',
                cursor: 'pointer',
                '&:hover': {
                  '& .comparison-overlay': {
                    opacity: 1
                  }
                }
              }}
              onClick={() => setComparisonDialogOpen(true)}
            >
              <ImageKitImage
                src={transformedUrl.replace(/^https:\/\/ik\.imagekit\.io\/[^/]+\//i, '/')}
                width={200}
                height={200}
                alt="Enhanced image"
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
              <Box className="comparison-overlay" sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
                opacity: 0,
                transition: 'opacity 0.2s',
              }}>
                <Tooltip title="Compare before and after">
                  <CompareIcon sx={{ color: 'white', fontSize: 40 }} />
                </Tooltip>
              </Box>
            </Box>
          ) : (
            <img
              src={imageUrl}
              alt="Image to enhance"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          )}
        </Box>

        <Box sx={{display: 'flex', gap: 1 ,flexWrap: 'wrap'}}>
          {enhancementOptions.map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              onClick={() => handleOptionToggle(option.value)}
              color={selectedOptions.includes(option.value) ? "primary" : "default"}
              variant={selectedOptions.includes(option.value) ? "filled" : "outlined"}
            />
          ))}
        </Box>
      </Box>
      
      {/* Second row: Text field */}
      <TextField
        fullWidth
        multiline
        rows={2}
        placeholder="Tell AI what do you want to do with the image"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        size="small"
        sx={{ 
          bgcolor: 'background.default',
          borderRadius: 1,
          '& .MuiOutlinedInput-root': {
            borderRadius: 1
          }
        }}
      />
      
      {/* Aspect ratio and cropping options (only shown when resize_crop is selected) */}
      {selectedOptions.includes('resize_crop') && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Resize & Crop Options
          </Typography>
          
          {/* Width and Height inputs */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Width"
              type="number"
              size="small"
              value={width}
              onChange={(e) => setWidth(e.target.value ? Number(e.target.value) : '')}
              InputProps={{ inputProps: { min: 1 } }}
              sx={{ flex: 1 }}
            />
            <TextField
              label="Height"
              type="number"
              size="small"
              value={height}
              onChange={(e) => setHeight(e.target.value ? Number(e.target.value) : '')}
              InputProps={{ inputProps: { min: 1 } }}
              sx={{ flex: 1 }}
            />
          </Box>
          
          {/* Aspect Ratio selection */}
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
            Aspect Ratio
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            {aspectRatioOptions.map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                onClick={() => setSelectedAspectRatio(option.value)}
                color={selectedAspectRatio === option.value ? "primary" : "default"}
                variant={selectedAspectRatio === option.value ? "filled" : "outlined"}
                size="small"
              />
            ))}
          </Box>
          
          {/* Crop Mode selection */}
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
            Crop Mode
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            {cropModeOptions.map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                onClick={() => setSelectedCropMode(option.value)}
                color={selectedCropMode === option.value ? "primary" : "default"}
                variant={selectedCropMode === option.value ? "filled" : "outlined"}
                size="small"
              />
            ))}
          </Box>
          
          {/* Focus selection */}
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
            Focus
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {focusOptions.map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                onClick={() => setSelectedFocus(option.value)}
                color={selectedFocus === option.value ? "primary" : "default"}
                variant={selectedFocus === option.value ? "filled" : "outlined"}
                size="small"
              />
            ))}
          </Box>
        </Box>
      )}
      
      {/* Third row: Buttons */}
      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          size="small"
          onClick={onBack}
          sx={{
            borderRadius: 1,
            textTransform: 'none',
            flex: 1
          }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={handleGenerateWithAI}
          disabled={isProcessing || (selectedOptions.length === 0 && (!prompt || prompt.trim() === ''))}
          sx={{
            borderRadius: 1,
            textTransform: 'none',
            flex: 1
          }}
        >
          {isProcessing ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Generate with AI'
          )}
        </Button>
        
        {transformedUrl && (
          <Button
            variant="contained"
            size="small"
            color="success"
            onClick={() => onUseTransformed && onUseTransformed(transformedUrl)}
            sx={{
              borderRadius: 1,
              textTransform: 'none',
              flex: 1
            }}
          >
            Use Enhanced
          </Button>
        )}
      </Stack>
      
      {/* Variations section */}
      {variations.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Image Variations
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {/* First variation (already shown in the main image) */}
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: 1,
                overflow: 'hidden',
                bgcolor: 'grey.100',
                border: '2px solid',
                borderColor: 'primary.main',
              }}
            >
              <ImageKitImage
                src={transformedUrl?.replace(/^https:\/\/ik\.imagekit\.io\/Yashyp\//i, '/') || ''}
                width={120}
                height={120}
                alt="Variation 1"
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </Box>
            
            {/* Other variations */}
            {variations.map((varUrl, index) => (
              <Box
                key={index}
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: 1,
                  overflow: 'hidden',
                  bgcolor: 'grey.100',
                  cursor: 'pointer',
                  position: 'relative',
                  '&:hover': {
                    '& .comparison-overlay': {
                      opacity: 1
                    }
                  },
                }}
                onClick={() => {
                  setTransformedUrl(varUrl);
                  setVariationId(index + 2); // Variation IDs start from 2 for the additional variations
                }}
              >
                <ImageKitImage
                  src={varUrl.replace(/^https:\/\/ik\.imagekit\.io\/[^/]+\//i, '/') || ''}
                  width={120}
                  height={120}
                  alt={`Variation ${index + 2}`}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
                <Box className="comparison-overlay" sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                }}>
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                    Select
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Card>
    
    {/* Comparison Dialog */}
    <ComparisonDialog
      open={comparisonDialogOpen}
      onClose={() => setComparisonDialogOpen(false)}
      originalImageUrl={imageUrl}
      transformedImageUrl={transformedUrl || ''}
      transformationDetails={appliedTransformations}
    />
    </>
  );
};

export default ImageDialog;
