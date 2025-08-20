import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import DailyConsumptionChart from "@/components/charts/DailyConsumptionChart";

export default function Billing() {
  const { data: energyStats } = useQuery({
    queryKey: ["/api/energy/stats"],
  });

  const { data: billCalculation } = useQuery({
    queryKey: ["/api/billing/calculate", { units: energyStats?.totalUnitsThisMonth || 1247 }],
  });

  return (
    <div data-testid="billing-page">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">KE Billing Analysis</h2>
        <p className="text-gray-600">Detailed billing breakdown and tariff analysis</p>
      </div>

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
                {billCalculation?.slabBreakdown?.map((slab, index) => {
                  const isLastSlab = index === billCalculation.slabBreakdown.length - 1;
                  const minUnits = index === 0 ? 1 : billCalculation.slabBreakdown[index - 1].units + 1;
                  const maxUnits = isLastSlab ? null : slab.units;
                  const range = maxUnits ? `${minUnits}-${maxUnits} kWh` : `${minUnits}+ kWh`;
                  
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
