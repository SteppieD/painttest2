// Chart utility functions for analytics dashboards

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatCurrencyDetailed = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};

export const formatCompactNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
};

// Color schemes for charts
export const CHART_COLORS = {
  primary: ['#3B82F6', '#1D4ED8', '#1E40AF', '#1E3A8A'],
  success: ['#10B981', '#059669', '#047857', '#065F46'],
  warning: ['#F59E0B', '#D97706', '#B45309', '#92400E'],
  danger: ['#EF4444', '#DC2626', '#B91C1C', '#991B1B'],
  purple: ['#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6'],
  rainbow: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'],
};

// Gradient definitions for enhanced visuals
export const CHART_GRADIENTS = {
  blue: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
  green: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  orange: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
  red: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
  purple: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
};

// Helper function to get trend color
export const getTrendColor = (value: number): string => {
  if (value > 0) return '#10B981'; // green
  if (value < 0) return '#EF4444'; // red
  return '#6B7280'; // gray
};

// Helper function to get performance color
export const getPerformanceColor = (value: number, target: number): string => {
  const ratio = value / target;
  if (ratio >= 1.1) return '#10B981'; // green - exceeding target
  if (ratio >= 0.9) return '#F59E0B'; // orange - near target
  return '#EF4444'; // red - below target
};

// Helper function to format time periods
export const formatTimePeriod = (period: string): string => {
  const periods: { [key: string]: string } = {
    'week': 'This Week',
    'month': 'This Month',
    'quarter': 'This Quarter',
    'year': 'This Year',
  };
  return periods[period] || period;
};

// Helper function to generate chart data for trends
export const generateTrendData = (
  baseValue: number,
  periods: string[],
  trendPercentage: number
): Array<{ name: string; value: number }> => {
  return periods.map((period, index) => {
    const variance = (Math.random() - 0.5) * 0.2; // ±10% random variance
    const trendFactor = 1 + (trendPercentage / 100) * (index / periods.length);
    const value = baseValue * trendFactor * (1 + variance);
    return {
      name: period,
      value: Math.round(value)
    };
  });
};

// Helper function to calculate percentage change
export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

// Helper function to get confidence level color
export const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 80) return '#10B981'; // green - high confidence
  if (confidence >= 60) return '#F59E0B'; // orange - medium confidence
  return '#EF4444'; // red - low confidence
};

// Helper function to format confidence level
export const formatConfidence = (confidence: number): string => {
  if (confidence >= 80) return 'High';
  if (confidence >= 60) return 'Medium';
  return 'Low';
};