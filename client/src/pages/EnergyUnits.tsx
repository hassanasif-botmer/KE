import { useQuery } from "@tanstack/react-query";
import StatsCard from "@/components/StatsCard";
import DailyConsumptionChart from "@/components/charts/DailyConsumptionChart";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

export default function EnergyUnits() {
  const { data: energyStats } = useQuery({
    queryKey: ["/api/energy/stats"],
  });

  // Mock calculations for peak/off-peak (in real app, these would come from the API)
  const peakUsage = 156.7;
  const offPeakUsage = 892.1;
  const averageDaily = energyStats?.todayUsage || 41.5;

  return (
    <div data-testid="energy-units-page">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Energy Units Analysis</h2>
        <p className="text-gray-600">Detailed breakdown of energy consumption patterns</p>
      </div>

      {/* Energy Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Peak Hours Usage"
          value={`${peakUsage} kWh`}
          subtitle="+8% increase"
          icon={<TrendingUp className="w-6 h-6 text-red-600" />}
          iconBgColor="bg-red-100"
          subtitleColor="text-red-600"
          testId="stats-peak-usage"
        />

        <StatsCard
          title="Off-Peak Usage"
          value={`${offPeakUsage} kWh`}
          subtitle="-3% decrease"
          icon={<TrendingDown className="w-6 h-6 text-secondary" />}
          iconBgColor="bg-secondary/10"
          subtitleColor="text-secondary"
          testId="stats-offpeak-usage"
        />

        <StatsCard
          title="Average Daily"
          value={`${averageDaily} kWh`}
          subtitle="Stable"
          icon={<Activity className="w-6 h-6 text-gray-600" />}
          iconBgColor="bg-gray-100"
          subtitleColor="text-gray-500"
          testId="stats-average-daily"
        />
      </div>

      {/* Energy Consumption Details */}
      <DailyConsumptionChart variant="energy" />
    </div>
  );
}
