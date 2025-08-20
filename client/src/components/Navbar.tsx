import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { LogOut, User } from "lucide-react";

export default function Navbar() {
  const [currentTime, setCurrentTime] = useState("");
  const { userEmail } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/logout");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/status"] });
    },
    onError: () => {
      toast({
        title: "Logout Failed",
        description: "There was an error logging out",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-US", {
        hour12: true,
        hour: "numeric",
        minute: "2-digit",
      });
      setCurrentTime(timeStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4" data-testid="navbar">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" data-testid="page-title">
            Karachi Energy Monitoring System
          </h1>
          <p className="text-sm text-gray-500 mt-1" data-testid="page-subtitle">
            Real-time energy consumption and billing analysis
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {/* User info */}
          <div className="flex items-center space-x-2" data-testid="user-info">
            <User className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">{userEmail}</span>
          </div>
          
          {/* Status indicator */}
          <div className="flex items-center" data-testid="status-indicator">
            <div className="w-3 h-3 bg-secondary rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">System Online</span>
          </div>
          
          {/* Current time */}
          <div className="text-sm text-gray-500" data-testid="current-time">
            {currentTime}
          </div>
          
          {/* Logout button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="flex items-center space-x-1"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4" />
            <span>{logoutMutation.isPending ? "Logging out..." : "Logout"}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
