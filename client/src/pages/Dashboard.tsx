import { useQuery } from "@tanstack/react-query";
import { Zap, DollarSign, Thermometer, Activity } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import EnergyConsumptionChart from "@/components/charts/EnergyConsumptionChart";
import TemperatureChart from "@/components/charts/TemperatureChart";

export default function Dashboard() {
  const { data: energyStats } = useQuery({
    queryKey: ["/api/energy/stats"],
  });

  const { data: temperatureStats } = useQuery({
    queryKey: ["/api/temperature/stats"],
  });

  return (
    <div data-testid="dashboard-page">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Monitor your energy consumption and costs in real-time</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Units This Month"
          value={energyStats?.totalUnitsThisMonth || 1247}
          subtitle="+12% from last month"
          icon={<Zap className="w-6 h-6 text-primary" />}
          iconBgColor="bg-primary/10"
          subtitleColor="text-secondary"
          testId="stats-monthly-units"
        />

        <StatsCard
          title="Estimated KE Bill"
          value={`PKR ${energyStats?.estimatedBill?.toLocaleString() || "18,450"}`}
          subtitle="Based on current usage"
          icon={<DollarSign className="w-6 h-6 text-accent" />}
          iconBgColor="bg-accent/10"
          subtitleColor="text-accent"
          testId="stats-estimated-bill"
        />

        <StatsCard
          title="Room Temperature"
          value={`${temperatureStats?.current || 28.5}°C`}
          subtitle="Optimal range"
          icon={<Thermometer className="w-6 h-6 text-red-600" />}
          iconBgColor="bg-red-100"
          subtitleColor="text-gray-500"
          testId="stats-temperature"
        />

        <StatsCard
          title="Today's Usage"
          value={`${energyStats?.todayUsage || 42.3} kWh`}
          subtitle="Within budget"
          icon={<Activity className="w-6 h-6 text-secondary" />}
          iconBgColor="bg-secondary/10"
          subtitleColor="text-secondary"
          testId="stats-today-usage"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <EnergyConsumptionChart />
        <TemperatureChart variant="sparkline" hours={12} />
      </div>
    </div>
  );
}
