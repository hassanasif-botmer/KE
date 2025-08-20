import { useQuery } from "@tanstack/react-query";

interface AuthStatus {
  isAuthenticated: boolean;
  userEmail: string | null;
}

export function useAuth() {
  const { data, isLoading } = useQuery<AuthStatus>({
    queryKey: ["/api/auth/status"],
    retry: false,
  });

  return {
    isAuthenticated: data?.isAuthenticated ?? false,
    userEmail: data?.userEmail ?? null,
    isLoading,
  };
}