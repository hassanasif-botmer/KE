import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  iconBgColor?: string;
  subtitleColor?: string;
  testId?: string;
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  iconBgColor = "bg-primary/10",
  subtitleColor = "text-secondary",
  testId,
}: StatsCardProps) {
  return (
    <Card className="shadow-sm border border-gray-200" data-testid={testId}>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
              {icon}
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900" data-testid={`${testId}-value`}>
              {value}
            </p>
            {subtitle && (
              <p className={`text-xs ${subtitleColor}`} data-testid={`${testId}-subtitle`}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
