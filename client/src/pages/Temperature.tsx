import { useQuery } from "@tanstack/react-query";
import StatsCard from "@/components/StatsCard";
import TemperatureChart from "@/components/charts/TemperatureChart";
import { Thermometer } from "lucide-react";

export default function Temperature() {
  const { data: stats } = useQuery({
    queryKey: ["/api/temperature/stats"],
  });

  return (
    <div data-testid="temperature-page">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Temperature Monitoring</h2>
        <p className="text-gray-600">Room temperature analysis and historical data</p>
      </div>

      {/* Temperature Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Current Temperature"
          value={`${stats?.current || 28.5}°C`}
          icon={<Thermometer className="w-6 h-6 text-gray-900" />}
          iconBgColor="bg-gray-100"
          testId="stats-current-temp"
        />

        <StatsCard
          title="Today's High"
          value={`${stats?.todayHigh || 30.1}°C`}
          icon={<Thermometer className="w-6 h-6 text-red-600" />}
          iconBgColor="bg-red-100"
          testId="stats-today-high"
        />

        <StatsCard
          title="Today's Low"
          value={`${stats?.todayLow || 26.2}°C`}
          icon={<Thermometer className="w-6 h-6 text-blue-600" />}
          iconBgColor="bg-blue-100"
          testId="stats-today-low"
        />

        <StatsCard
          title="24hr Average"
          value={`${stats?.average24h || 28.1}°C`}
          icon={<Thermometer className="w-6 h-6 text-gray-900" />}
          iconBgColor="bg-gray-100"
          testId="stats-24h-average"
        />
      </div>

      {/* Temperature History Chart */}
      <TemperatureChart variant="full" hours={24} />
    </div>
  );
}
