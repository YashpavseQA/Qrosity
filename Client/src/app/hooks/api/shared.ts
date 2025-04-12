import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/app/services/api';
import { Country, Currency } from '@/app/types/shared';

// Country API hooks
export const useFetchCountries = (params?: any) => {
  return useQuery({
    queryKey: ['countries', params],
    queryFn: async () => {
      const response = await api.get('/shared/countries/', { params });
      return response.data;
    }
  });
};

export const useFetchCountry = (id?: string) => {
  return useQuery({
    queryKey: ['country', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await api.get(`/shared/countries/${id}/`);
      return response.data;
    },
    enabled: !!id
  });
};

export const useCreateCountry = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (countryData: Partial<Country>) => {
      const response = await api.post('/shared/countries/', countryData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] });
    }
  });
};

export const useUpdateCountry = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ iso_code, data }: { iso_code: string, data: Partial<Country> }) => {
      const response = await api.patch(`/shared/countries/${iso_code}/`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['countries'] });
      queryClient.invalidateQueries({ queryKey: ['country', variables.iso_code] });
    }
  });
};

export const useDeleteCountry = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/shared/countries/${id}/`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] });
    }
  });
};

// Currency API hooks
export const useFetchCurrencies = (params?: any) => {
  return useQuery({
    queryKey: ['currencies', params],
    queryFn: async () => {
      const response = await api.get('/shared/currencies/', { params });
      return response.data;
    }
  });
};

export const useFetchCurrency = (id?: string) => {
  return useQuery({
    queryKey: ['currency', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await api.get(`/shared/currencies/${id}/`);
      return response.data;
    },
    enabled: !!id
  });
};

export const useCreateCurrency = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (currencyData: Partial<Currency>) => {
      const response = await api.post('/shared/currencies/', currencyData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currencies'] });
    }
  });
};

export const useUpdateCurrency = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string, data: Partial<Currency> }) => {
      const response = await api.patch(`/shared/currencies/${id}/`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['currencies'] });
      queryClient.invalidateQueries({ queryKey: ['currency', variables.id] });
    }
  });
};

export const useDeleteCurrency = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/shared/currencies/${id}/`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currencies'] });
    }
  });
};
