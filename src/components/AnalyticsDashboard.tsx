import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { SEASONAL_ANALYTICS } from '../data/mockData';
import {
  TrendingUp,
  BarChart2,
  PieChart,
  Globe2,
  CheckCircle2,
  ArrowUpRight,
  HelpCircle,
} from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const { formatPrice } = useStore();
  const [selectedSeason, setSelectedSeason] = useState<'SS26' | 'FW25'>('SS26');

  const currentData = SEASONAL_ANALYTICS[selectedSeason];
  const maxMonthlyRevenue = Math.max(...currentData.monthlyTrends.map((m) => m.revenueUSD));

  return (
    <div className="bg-white border border-[#d5d9d9] rounded-md shadow-xs p-6 space-y-6 text-xs text-[#0f1111]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#d5d9d9]">
        <div>
          <h2 className="text-lg font-bold text-[#0f1111]">
            Business Reports: Sales Dashboard &amp; Seasonal Trends
          </h2>
          <p className="text-xs text-stone-500">
            Compare ordered product sales, unit velocity, and regional allocation across international marketplaces.
          </p>
        </div>

        {/* Season selector */}
        <div className="flex items-center gap-1.5 bg-[#f0f2f2] p-1 rounded border border-[#d5d9d9]">
          <button
            onClick={() => setSelectedSeason('SS26')}
            className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
              selectedSeason === 'SS26' ? 'bg-[#232f3e] text-white' : 'text-stone-700 hover:text-black'
            }`}
          >
            Spring / Summer 2026
          </button>
          <button
            onClick={() => setSelectedSeason('FW25')}
            className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
              selectedSeason === 'FW25' ? 'bg-[#232f3e] text-white' : 'text-stone-700 hover:text-black'
            }`}
          >
            Fall / Winter 2025
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-[#f0f2f2] p-3.5 rounded border border-[#d5d9d9]">
          <span className="text-[11px] font-bold text-stone-600 block">Ordered Product Sales</span>
          <p className="text-xl font-bold text-[#0f1111] mt-1 font-mono">
            {formatPrice(currentData.totalRevenueUSD)}
          </p>
          <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3 h-3" /> +18.4% YoY
          </span>
        </div>

        <div className="bg-[#f0f2f2] p-3.5 rounded border border-[#d5d9d9]">
          <span className="text-[11px] font-bold text-stone-600 block">Units Ordered</span>
          <p className="text-xl font-bold text-[#0f1111] mt-1 font-mono">
            {currentData.unitsSold.toLocaleString()} units
          </p>
          <span className="text-[10px] text-stone-500 mt-1 block">Global FBA &amp; Merchant</span>
        </div>

        <div className="bg-[#f0f2f2] p-3.5 rounded border border-[#d5d9d9]">
          <span className="text-[11px] font-bold text-stone-600 block">Average Order Value</span>
          <p className="text-xl font-bold text-[#0f1111] mt-1 font-mono">
            {formatPrice(currentData.averageOrderValueUSD)}
          </p>
          <span className="text-[10px] text-stone-500 mt-1 block">Multi-garment basket</span>
        </div>

        <div className="bg-[#f0f2f2] p-3.5 rounded border border-[#d5d9d9]">
          <span className="text-[11px] font-bold text-stone-600 block">Sell-Through Rate</span>
          <p className="text-xl font-bold text-emerald-700 mt-1 font-mono">
            {currentData.sellThroughPct}%
          </p>
          <span className="text-[10px] text-emerald-800 font-medium mt-1 block">Low storage fees</span>
        </div>

        <div className="bg-[#f0f2f2] p-3.5 rounded border border-[#d5d9d9]">
          <span className="text-[11px] font-bold text-stone-600 block">Return Rate</span>
          <p className="text-xl font-bold text-[#0f1111] mt-1 font-mono">
            {currentData.returnRatePct}%
          </p>
          <span className="text-[10px] text-stone-500 mt-1 block">Industry Avg: 18-22%</span>
        </div>
      </div>

      {/* Main Bar Chart */}
      <div className="p-4 bg-white border border-[#d5d9d9] rounded space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-sm text-[#0f1111]">
            Monthly Ordered Product Sales Performance ({selectedSeason})
          </h3>
          <span className="text-[11px] text-stone-500 font-mono">Live FBA Reporting</span>
        </div>

        <div className="h-48 flex items-end justify-between gap-6 px-4 pt-4 border-b border-stone-200">
          {currentData.monthlyTrends.map((month) => {
            const heightPct = Math.round((month.revenueUSD / maxMonthlyRevenue) * 100);
            return (
              <div key={month.month} className="flex-1 flex flex-col items-center h-full justify-end group">
                <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity text-center">
                  <span className="text-[10px] font-mono text-[#0f1111] bg-[#f0f2f2] px-1.5 py-0.5 border border-stone-300 rounded font-bold block">
                    {formatPrice(month.revenueUSD)}
                  </span>
                  <span className="text-[9px] text-stone-500 block">{month.orders} orders</span>
                </div>

                <div
                  className="w-full max-w-[48px] bg-[#febd69] hover:bg-[#f3a847] border border-[#f2a740] rounded-t transition-all duration-300"
                  style={{ height: `${heightPct}%` }}
                />

                <span className="text-[11px] font-bold text-stone-700 mt-2">
                  {month.month.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Contribution progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-[#f0f2f2] border border-[#d5d9d9] rounded space-y-3">
          <h4 className="font-bold text-xs text-[#0f1111]">Category Sales Volume Breakdown</h4>
          {currentData.topCategories.map((cat) => (
            <div key={cat.category} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-stone-800">{cat.category}</span>
                <span className="font-bold font-mono text-[#0f1111]">
                  {formatPrice(cat.revenueUSD)} ({cat.sharePct}%)
                </span>
              </div>
              <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-stone-300">
                <div
                  className="bg-[#232f3e] h-full"
                  style={{ width: `${cat.sharePct}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-[#f0f2f2] border border-[#d5d9d9] rounded space-y-3">
          <h4 className="font-bold text-xs text-[#0f1111]">Amazon Global Market Share</h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 bg-white rounded border border-[#d5d9d9]">
              <span>Amazon.com (United States &amp; Canada)</span>
              <span className="font-bold">44% Share</span>
            </div>
            <div className="flex justify-between p-2 bg-white rounded border border-[#d5d9d9]">
              <span>Amazon.de / .fr / .it (Europe Prime)</span>
              <span className="font-bold">32% Share</span>
            </div>
            <div className="flex justify-between p-2 bg-white rounded border border-[#d5d9d9]">
              <span>Amazon.co.jp (Japan Express Air)</span>
              <span className="font-bold">18% Share</span>
            </div>
            <div className="flex justify-between p-2 bg-white rounded border border-[#d5d9d9]">
              <span>Amazon.co.uk &amp; International</span>
              <span className="font-bold">6% Share</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
