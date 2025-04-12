'use client';

/**
 * Hook for fetching adjustment reasons
 */
import { fetchAdjustmentReasons } from '../services/api';
import { useQuery } from '@tanstack/react-query';

// Define types inline to avoid import issues
interface User {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
}

interface AdjustmentReason {
  id: number;
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
  adjustment_type: 'INCREASE' | 'DECREASE';
  created_at: string;
  updated_at: string;
  created_by?: User;
  updated_by?: User;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface UseAdjustmentReasonsReturn {
  reasons: AdjustmentReason[];
  isLoading: boolean;
  error: any;
}

/**
 * Hook to fetch and cache adjustment reasons
 * @returns {UseAdjustmentReasonsReturn} Object containing reasons, loading state, and error
 */
export const useAdjustmentReasons = (): UseAdjustmentReasonsReturn => {
  // Use TanStack Query for data fetching and caching
  const { data, isLoading, error } = useQuery<PaginatedResponse<AdjustmentReason>>({
    queryKey: ['adjustment-reasons'],
    queryFn: () => fetchAdjustmentReasons({ is_active: true, page_size: 500 }),
    staleTime: 3600000, // Cache for 1 hour (in milliseconds)
    refetchOnWindowFocus: false, // Don't refetch on window focus if list is static
    refetchOnReconnect: false
  });

  return {
    reasons: data?.results || [], // Return empty array if data is undefined
    isLoading,
    error,
  };
}

/**
 * Alternative implementation using React's useEffect
 * This can be used if TanStack Query is not available
 */
/*
import { useState, useEffect } from 'react';

export function useAdjustmentReasons(): UseAdjustmentReasonsReturn {
  const [reasons, setReasons] = useState<AdjustmentReason[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchReasons = async () => {
      try {
        setIsLoading(true);
        const response = await fetchAdjustmentReasons({ is_active: true, page_size: 500 });
        setReasons(response.results || []);
        setError(null);
      } catch (err) {
        setError(err);
        setReasons([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReasons();
  }, []);

  return { reasons, isLoading, error };
}
*/
