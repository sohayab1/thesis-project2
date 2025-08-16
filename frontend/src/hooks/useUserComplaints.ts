import { ComplaintDto } from "@/types/dto";
import { complaints } from "@/services/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export function useUserComplaints(userId?: number, options?: Omit<UseQueryOptions<ComplaintDto[], Error>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: ['userComplaints', userId],
        queryFn: () => complaints.getUserComplaints(userId!),
        enabled: !!userId,
        retry: false,
        ...options
    });
}