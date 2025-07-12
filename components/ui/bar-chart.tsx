"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BarChartData {
  name: string;
  [key: string]: any;
}

interface BarChartProps {
  data: BarChartData[];
  bars: Array<{
    key: string;
    color: string;
    label: string;
  }>;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  formatValue?: (value: any) => string;
  orientation?: 'vertical' | 'horizontal';
}

export default function CustomBarChart({
  data,
  bars,
  height = 300,
  showGrid = true,
  showLegend = true,
  formatValue,
  orientation = 'vertical'
}: BarChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div>
          <p>{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index}>
              {entry.name}: {formatValue ? formatValue(entry.value) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer>
      <BarChart 
        data={data} 
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        layout={orientation === 'horizontal' ? 'horizontal' : 'vertical'}
      >
        {showGrid && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis 
          dataKey="name" 
         
          tickLine={false}
          axisLine={false}
          type={orientation === 'horizontal' ? 'number' : 'category'}
          tickFormatter={orientation === 'horizontal' ? formatValue : undefined}
        />
        <YAxis 
         
          tickLine={false}
          axisLine={false}
          type={orientation === 'horizontal' ? 'category' : 'number'}
          tickFormatter={orientation === 'vertical' ? formatValue : undefined}
        />
        <Tooltip content={<CustomTooltip />} />
        {showLegend && <Legend />}
        {bars.map((bar) => (
          <Bar
            key={bar.key}
            dataKey={bar.key}
            fill={bar.color}
            name={bar.label}
            radius={[2, 2, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}