import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

interface SurveyResponse {
  id: number;
  name: string;
  sector: string;
  origin: string;
  profileDescription: string;
  eventGoal: string;
  networkingInterest: string;
  otherNetworkingInterest?: string;
  desiredConnections: string;
  offerToOthers: string;
  keySkill: string;
}

export default function RealTimeResults() {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('http://localhost:3001/responses');
      const data = await res.json();
      setResponses(data);
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Actualizar cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  const sectorData = Object.entries(
    responses.reduce((acc, { sector }) => {
      acc[sector] = (acc[sector] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const networkingInterestData = Object.entries(
    responses.reduce((acc, { networkingInterest, otherNetworkingInterest }) => {
      const interest =
        networkingInterest === 'otros'
          ? otherNetworkingInterest || 'Otros'
          : networkingInterest;
      acc[interest] = (acc[interest] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const keySkillsData = responses
    .map((response) => response.keySkill.toLowerCase())
    .reduce((acc, skill) => {
      acc[skill] = (acc[skill] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const topKeySkills = Object.entries(keySkillsData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Resultados en Tiempo Real</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total de Participantes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{responses.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Sector</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sectorData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sectorData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Intereses de Networking</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={networkingInterestData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {networkingInterestData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Habilidades Clave</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {topKeySkills.map(({ name, value }) => (
              <li key={name} className="flex justify-between items-center">
                <span className="font-semibold">{name}</span>
                <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm">
                  {value}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Últimos Perfiles</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {responses
              .slice(-5)
              .reverse()
              .map((response) => (
                <li key={response.id} className="border-b pb-2">
                  <p className="font-semibold">{response.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {response.profileDescription}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Busca: {response.desiredConnections}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Ofrece: {response.offerToOthers}
                  </p>
                </li>
              ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
