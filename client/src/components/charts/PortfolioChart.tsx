import { Card } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMemo, useState } from "react";
import { format, subDays } from "date-fns";

// Date range options
const dateRanges = [
  { label: "Last 7 Days", value: 7 },
  { label: "Last 30 Days", value: 30 },
  { label: "Last 90 Days", value: 90 }
];

interface PortfolioChartProps {
  value: number;
  percentChange: number;
}

export default function PortfolioChart({ value, percentChange }: PortfolioChartProps) {
  const [selectedRange, setSelectedRange] = useState(30);
  
  // Generate chart data
  const data = useMemo(() => {
    const today = new Date();
    const result = [];
    
    // Start value (slightly less than current value)
    const startValue = value * 0.93;
    
    // Generate data points for selected range
    for (let i = selectedRange - 1; i >= 0; i--) {
      const date = subDays(today, i);
      
      // Create a trend with some random variation
      const dayValue = startValue + (value - startValue) * ((selectedRange - i) / selectedRange) + 
        (Math.random() - 0.5) * value * 0.05;
      
      result.push({
        date: format(date, "MMM d"),
        value: dayValue,
      });
    }
    
    return result;
  }, [value, selectedRange]);
  
  // Format currency for display
  const formatCurrency = (val: number) => {
    if (val >= 1000000) {
      return `$${(val / 1000000).toFixed(1)}M`;
    } else if (val >= 1000) {
      return `$${(val / 1000).toFixed(0)}K`;
    }
    return `$${val.toFixed(0)}`;
  };
  
  // Format currency for value display
  const formattedValue = useMemo(() => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
  }, [value]);
  
  return (
    <Card className="bg-card p-5 mb-6 shadow-lg overflow-hidden relative">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-muted-foreground text-sm mb-1">Portfolio Value</p>
          <h2 className="text-3xl font-bold">{formattedValue}</h2>
          <div className="flex items-center">
            <span className="text-secondary text-sm font-semibold mr-1">
              {percentChange > 0 ? "+" : ""}{percentChange}%
            </span>
            <span className="text-xs text-muted-foreground">this month</span>
          </div>
        </div>
        <select 
          className="px-3 py-1 bg-muted dark:bg-card rounded-full text-sm text-muted-foreground"
          value={selectedRange}
          onChange={(e) => setSelectedRange(Number(e.target.value))}
        >
          {dateRanges.map(range => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>
      
      {/* Chart */}
      <div className="h-40 relative mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--secondary))" />
              </linearGradient>
              <linearGradient id="bgGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              hide={true}
              domain={[(dataMin: number) => dataMin * 0.95, (dataMax: number) => dataMax * 1.05]}
            />
            <Tooltip 
              formatter={(value: number) => [formatCurrency(value), "Value"]}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '0.5rem'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="url(#colorValue)" 
              fill="url(#bgGradient)" 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
