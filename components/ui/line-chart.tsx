"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LineChartData {
  name: string;
  [key: string]: any;
}

interface LineChartProps {
  data: LineChartData[];
  lines: Array<{
    key: string;
    color: string;
    label: string;
  }>;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  formatValue?: (value: any) => string;
}

export default function CustomLineChart({
  data,
  lines,
  height = 300,
  showGrid = true,
  showLegend = true,
  formatValue
}: LineChartProps) {
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
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis 
          dataKey="name" 
         
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
         
          tickLine={false}
          axisLine={false}
          tickFormatter={formatValue}
        />
        <Tooltip content={<CustomTooltip />} />
        {showLegend && <Legend />}
        {lines.map((line) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            stroke={line.color}
            strokeWidth={2}
            dot={{ fill: line.color, strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, stroke: line.color, strokeWidth: 2, fill: 'white' }}
            name={line.label}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}