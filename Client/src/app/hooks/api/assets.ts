/**
 * API hooks for asset-related operations
 */
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * Interface for temporary upload response
 */
export interface TemporaryUploadResponse {
  temp_id: string;
  original_filename: string;
  file_size: number;
  content_type: string;
}

/**
 * Hook to upload a temporary image
 * 
 * This hook handles the temporary file upload process and returns the temporary ID
 * that can be used when creating or updating products and variants.
 */
export const useUploadTemporaryImage = () => {
  return useMutation<TemporaryUploadResponse, Error, File>({
    mutationFn: async (file: File) => {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      
      // Get CSRF token from cookie if it exists
      const getCookie = (name: string): string | null => {
        if (typeof document === 'undefined') return null;
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
        return null;
      };
      
      const csrfToken = getCookie('csrftoken');
      
      // Upload the file
      const response = await axios.post<TemporaryUploadResponse>(
        `${API_BASE_URL}/assets/temporary-uploads/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-CSRFToken': csrfToken || '',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }
      );
      
      return response.data;
    }
  });
};
