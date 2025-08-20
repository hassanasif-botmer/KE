import { useEffect, useState } from "react";

export default function Navbar() {
  const [currentTime, setCurrentTime] = useState("");

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
          {/* Status indicator */}
          <div className="flex items-center" data-testid="status-indicator">
            <div className="w-3 h-3 bg-secondary rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">System Online</span>
          </div>
          {/* Current time */}
          <div className="text-sm text-gray-500" data-testid="current-time">
            {currentTime}
          </div>
        </div>
      </div>
    </header>
  );
}
