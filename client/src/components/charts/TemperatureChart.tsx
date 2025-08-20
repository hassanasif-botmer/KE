import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { TemperatureReading } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";

interface TemperatureChartProps {
  variant?: "sparkline" | "full";
  hours?: number;
}

export default function TemperatureChart({ variant = "full", hours = 24 }: TemperatureChartProps) {
  const { data: readings, isLoading } = useQuery<TemperatureReading[]>({
    queryKey: ["/api/temperature/readings"],
    queryFn: () => fetch(`/api/temperature/readings?hours=${hours}`).then(res => res.json()),
  });

  const { data: stats } = useQuery<{
    current: number;
    todayHigh: number;
    todayLow: number;
    average24h: number;
  }>({
    queryKey: ["/api/temperature/stats"],
  });

  const chartData = readings?.map((reading) => ({
    time: variant === "sparkline" 
      ? new Date(reading.timestamp).getHours()
      : new Date(reading.timestamp).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
    temperature: reading.temperature,
  })) || [];

  if (isLoading) {
    return (
      <Card className={variant === "sparkline" ? "" : "shadow-sm border border-gray-200"}>
        <CardContent className="p-6">
          <div className={variant === "sparkline" ? "h-32" : "h-96"}>
            <div className="flex items-center justify-center h-full">
              <div className="text-muted-foreground">Loading...</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === "sparkline") {
    return (
      <Card className="shadow-sm border border-gray-200" data-testid="temperature-sparkline">
        <CardContent className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Temperature Trend</h3>
            <p className="text-sm text-gray-500">Last 12 hours</p>
          </div>
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-gray-900" data-testid="current-temperature">
              {stats?.current || 28.5}°C
            </div>
            <div className="text-sm text-gray-500">Current Temperature</div>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <Area
                  type="monotone"
                  dataKey="temperature"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1) / 0.2)"
                  strokeWidth={2}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-between text-xs text-gray-500">
            <span>Min: {stats?.todayLow || 26.2}°C</span>
            <span>Max: {stats?.todayHigh || 30.1}°C</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border border-gray-200" data-testid="temperature-history-chart">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Temperature History - Last 24 Hours
        </h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="time" 
                stroke="#6b7280"
                fontSize={12}
                tickMargin={10}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickMargin={10}
                domain={["dataMin - 1", "dataMax + 1"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                labelStyle={{ color: "#374151" }}
                formatter={(value: number) => [`${value}°C`, "Temperature"]}
              />
              <Area
                type="monotone"
                dataKey="temperature"
                stroke="hsl(var(--chart-1))"
                fill="hsl(var(--chart-1) / 0.2)"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
