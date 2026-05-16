// src/components/dashboard/ScoreChart.tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ScoreChartProps {
  avgScore: number | null;
  avgExpert: number | null;
  avgConsumer: number | null;
}

export function ScoreChart({ avgScore, avgExpert, avgConsumer }: ScoreChartProps) {
  const data = [
    { name: 'General', puntuación: avgScore ?? 0 },
    { name: 'Expertos', puntuación: avgExpert ?? 0 },
    { name: 'Consumidores', puntuación: avgConsumer ?? 0 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Puntuaciones promedio</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip formatter={(value) => `${value} pts`} />
            <Legend />
            <Bar dataKey="puntuación" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}