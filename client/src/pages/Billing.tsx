import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import DailyConsumptionChart from "@/components/charts/DailyConsumptionChart";

export default function Billing() {
  const { data: energyStats } = useQuery<{
    totalUnitsThisMonth: number;
    todayUsage: number;
    estimatedBill: number;
  }>({
    queryKey: ["/api/energy/stats"],
  });

  const { data: billCalculation } = useQuery({
    queryKey: ["/api/billing/calculate"],
    queryFn: () => fetch(`/api/billing/calculate?units=${energyStats?.totalUnitsThisMonth || 1247}`).then(res => res.json()),
    enabled: !!energyStats,
  });

  const { data: prediction } = useQuery({
    queryKey: ["/api/billing/predict"],
    queryFn: () => fetch(`/api/billing/predict?units=${energyStats?.totalUnitsThisMonth || 1247}`).then(res => res.json()),
    enabled: !!energyStats,
  });

  return (
    <div data-testid="billing-page">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">KE Billing Analysis</h2>
        <p className="text-gray-600">Detailed billing breakdown and tariff analysis</p>
      </div>

      {/* AI Prediction Card */}
      {prediction && prediction.nextSlabThreshold > 0 && (
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a9 9 0 117.072 0l-.548.547A3.374 3.374 0 0014.846 21H9.154a3.374 3.374 0 00-2.869-1.453l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">AI Billing Prediction</h3>
                <p className="text-sm text-gray-600">Smart insights based on your usage patterns</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <div className="text-2xl font-bold text-blue-600" data-testid="prediction-days">
                  {prediction.daysToNextSlab} days
                </div>
                <div className="text-sm text-gray-600">Until next tariff slab</div>
                <div className="text-xs text-gray-500 mt-1">
                  Threshold: {prediction.nextSlabThreshold} kWh
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <div className="text-2xl font-bold text-orange-600" data-testid="prediction-daily-avg">
                  {prediction.averageDailyUsage} kWh
                </div>
                <div className="text-sm text-gray-600">Average daily usage</div>
                <div className="text-xs text-gray-500 mt-1">
                  Based on last 30 days
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <div className="text-2xl font-bold text-red-600" data-testid="prediction-cost-increase">
                  +PKR {prediction.estimatedCostIncrease}
                </div>
                <div className="text-sm text-gray-600">Cost increase per kWh</div>
                <div className="text-xs text-gray-500 mt-1">
                  Next slab rate: PKR {prediction.nextSlabRate}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Billing Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Daily Consumption Chart */}
        <DailyConsumptionChart variant="billing" />

        {/* Current Bill Estimate */}
        <Card className="shadow-sm border border-gray-200" data-testid="bill-estimate-card">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Current Month Estimate</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">Total Units</span>
                <span className="text-lg font-bold" data-testid="total-units">
                  {energyStats?.totalUnitsThisMonth || 1247} kWh
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">Base Charges</span>
                <span className="text-lg font-bold" data-testid="base-charges">
                  PKR {billCalculation?.totalEnergyCharges?.toLocaleString() || "15,680"}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">Taxes & Fees</span>
                <span className="text-lg font-bold" data-testid="taxes-fees">
                  PKR {billCalculation?.taxes?.toLocaleString() || "2,770"}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total Estimated Bill</span>
                  <span className="text-xl font-bold text-accent" data-testid="total-bill">
                    PKR {billCalculation?.totalBill?.toLocaleString() || "18,450"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KE Tariff Slabs */}
      <Card className="shadow-sm border border-gray-200" data-testid="tariff-slabs-table">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">KE Tariff Slabs Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slab
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Units Range
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate per kWh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Units Used
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {billCalculation?.slabBreakdown?.map((slab: any, index: number) => {
                  // Define slab ranges based on the new tariff structure
                  const slabRanges = [
                    { min: 0, max: 100 },
                    { min: 101, max: 200 },
                    { min: 201, max: 300 },
                    { min: 301, max: 400 },
                    { min: 401, max: 600 },
                    { min: 601, max: null }
                  ];
                  
                  const currentRange = slabRanges[slab.slab - 1];
                  const range = currentRange?.max ? `${currentRange.min}-${currentRange.max} kWh` : `${currentRange?.min || 601}+ kWh`;
                  
                  return (
                    <tr key={slab.slab} data-testid={`slab-row-${slab.slab}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Slab {slab.slab}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {range}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        PKR {slab.rate.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {slab.units}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                        PKR {slab.amount.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-sm font-semibold text-gray-900">
                    Total Energy Charges
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right" data-testid="total-energy-charges">
                    PKR {billCalculation?.totalEnergyCharges?.toLocaleString() || "17,317"}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
