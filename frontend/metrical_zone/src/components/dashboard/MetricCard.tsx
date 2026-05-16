// src/components/dashboard/MetricCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number | null | undefined;
  icon?: React.ReactNode;
  suffix?: string;
  fallback?: string;
  className?: string;
}

export function MetricCard({ title, value, icon, suffix = '', fallback = '—', className }: MetricCardProps) {
  const displayValue = value === null || value === undefined ? fallback 
    : typeof value === 'number' ? value.toFixed(1) + suffix 
    : value + suffix;
  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{displayValue}</div>
      </CardContent>
    </Card>
  );
}