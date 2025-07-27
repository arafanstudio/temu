import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Couple, Payment, Guest } from '@/types';

// Custom hook untuk couples data dengan caching
export function useCouples() {
  return useQuery({
    queryKey: ['couples'],
    queryFn: async (): Promise<Couple[]> => {
      const response = await fetch('/api/admin/couples');
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Custom hook untuk pending payments dengan caching
export function usePendingPayments() {
  return useQuery({
    queryKey: ['payments', 'pending'],
    queryFn: async (): Promise<Payment[]> => {
      const response = await fetch('/api/admin/payments?status=pending');
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (lebih sering update untuk payments)
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Custom hook untuk guests data dengan caching per couple
export function useCoupleGuests(coupleId: string, enabled: boolean = false) {
  return useQuery({
    queryKey: ['guests', coupleId],
    queryFn: async (): Promise<Guest[]> => {
      const response = await fetch(`/api/admin/couples/${coupleId}/guests`);
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data || [];
    },
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
  });
}

// Mutation untuk verify payment dengan optimistic update
export function useVerifyPayment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (paymentId: string) => {
      const response = await fetch(`/api/admin/payments/${paymentId}/verify`, {
        method: 'POST'
      });
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onMutate: async (paymentId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['payments', 'pending'] });
      
      // Snapshot previous value
      const previousPayments = queryClient.getQueryData(['payments', 'pending']);
      
      // Optimistically update
      queryClient.setQueryData(['payments', 'pending'], (old: Payment[] | undefined) => {
        return old?.filter(payment => payment.id !== paymentId) || [];
      });
      
      return { previousPayments };
    },
    onError: (err, paymentId, context) => {
      // Rollback on error
      queryClient.setQueryData(['payments', 'pending'], context?.previousPayments);
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: ['payments', 'pending'] });
      queryClient.invalidateQueries({ queryKey: ['couples'] });
    },
  });
}

// Mutation untuk reject payment dengan optimistic update
export function useRejectPayment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (paymentId: string) => {
      const response = await fetch(`/api/admin/payments/${paymentId}/reject`, {
        method: 'POST'
      });
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onMutate: async (paymentId) => {
      await queryClient.cancelQueries({ queryKey: ['payments', 'pending'] });
      const previousPayments = queryClient.getQueryData(['payments', 'pending']);
      
      queryClient.setQueryData(['payments', 'pending'], (old: Payment[] | undefined) => {
        return old?.filter(payment => payment.id !== paymentId) || [];
      });
      
      return { previousPayments };
    },
    onError: (err, paymentId, context) => {
      queryClient.setQueryData(['payments', 'pending'], context?.previousPayments);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['payments', 'pending'] });
    },
  });
}

// Mutation untuk delete couple dengan optimistic update
export function useDeleteCouple() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (coupleId: string) => {
      const response = await fetch(`/api/admin/couples/${coupleId}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onMutate: async (coupleId) => {
      await queryClient.cancelQueries({ queryKey: ['couples'] });
      const previousCouples = queryClient.getQueryData(['couples']);
      
      queryClient.setQueryData(['couples'], (old: Couple[] | undefined) => {
        return old?.filter(couple => couple.id !== coupleId) || [];
      });
      
      return { previousCouples };
    },
    onError: (err, coupleId, context) => {
      queryClient.setQueryData(['couples'], context?.previousCouples);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['couples'] });
    },
  });
}

