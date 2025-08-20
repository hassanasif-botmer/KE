import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { EnergyReading } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";

interface DailyConsumptionChartProps {
  variant?: "energy" | "billing";
}

export default function DailyConsumptionChart({ variant = "energy" }: DailyConsumptionChartProps) {
  const { data: readings, isLoading } = useQuery<EnergyReading[]>({
    queryKey: ["/api/energy/readings", { hours: 168 }], // Last 7 days
  });

  // Group readings by day and calculate daily totals
  const dailyData = readings?.reduce((acc, reading) => {
    const date = new Date(reading.timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    
    if (!acc[date]) {
      acc[date] = { date, consumption: 0 };
    }
    acc[date].consumption += reading.consumption;
    return acc;
  }, {} as Record<string, { date: string; consumption: number }>) || {};

  const chartData = Object.values(dailyData).slice(-7); // Last 7 days

  if (isLoading) {
    return (
      <Card className="shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className={variant === "billing" ? "h-64" : "h-96"}>
            <div className="flex items-center justify-center h-full">
              <div className="text-muted-foreground">Loading chart...</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border border-gray-200" data-testid={`${variant}-consumption-chart`}>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          {variant === "billing" ? "Daily Unit Consumption" : "Daily Energy Consumption"}
        </h3>
        <div className={variant === "billing" ? "h-64" : "h-96"}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={12}
                tickMargin={10}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickMargin={10}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                labelStyle={{ color: "#374151" }}
                formatter={(value: number) => [`${value.toFixed(1)} kWh`, "Daily Consumption"]}
              />
              <Legend />
              <Bar
                dataKey="consumption"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                name="Daily Consumption (kWh)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
