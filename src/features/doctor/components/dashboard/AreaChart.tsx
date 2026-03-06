"use client";

import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardFooter } from "@/shared/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from "@/shared/ui/chart";
import { useTranslation } from "react-i18next";

interface ChartDataItem {
  day: string;
  consultas: number;
  ingresos: number;
}

interface AreaChartProps {
  data?: ChartDataItem[];
  showFooter?: boolean;
  height?: number;
  dateRange?: "week" | "month" | "3months" | "year" | "all";
}

const chartConfig: ChartConfig = {
  consultas: {
    label: "Consultas",
    color: "var(--accent)",
  },
  ingresos: {
    label: "Ingresos",
    color: "var(--secondary)",
  },
};

// Datos por período
const dataByPeriod: Record<string, ChartDataItem[]> = {
  week: [
    { day: "Lun", consultas: 120, ingresos: 3500 },
    { day: "Mar", consultas: 180, ingresos: 4200 },
    { day: "Mié", consultas: 150, ingresos: 3900 },
    { day: "Jue", consultas: 200, ingresos: 4800 },
    { day: "Vie", consultas: 170, ingresos: 4100 },
    { day: "Sáb", consultas: 90, ingresos: 2100 },
    { day: "Dom", consultas: 60, ingresos: 1500 },
  ],
  month: [
    { day: "Sem 1", consultas: 580, ingresos: 16500 },
    { day: "Sem 2", consultas: 720, ingresos: 19800 },
    { day: "Sem 3", consultas: 650, ingresos: 18200 },
    { day: "Sem 4", consultas: 800, ingresos: 22400 },
  ],
  "3months": [
    { day: "Ene", consultas: 2400, ingresos: 68000 },
    { day: "Feb", consultas: 2200, ingresos: 62000 },
    { day: "Mar", consultas: 2750, ingresos: 77000 },
  ],
  year: [
    { day: "Ene", consultas: 2400, ingresos: 68000 },
    { day: "Feb", consultas: 2200, ingresos: 62000 },
    { day: "Mar", consultas: 2750, ingresos: 77000 },
    { day: "Abr", consultas: 2600, ingresos: 72000 },
    { day: "May", consultas: 2900, ingresos: 81000 },
    { day: "Jun", consultas: 2500, ingresos: 70000 },
    { day: "Jul", consultas: 2300, ingresos: 65000 },
    { day: "Ago", consultas: 2700, ingresos: 75000 },
    { day: "Sep", consultas: 2800, ingresos: 78000 },
    { day: "Oct", consultas: 3000, ingresos: 84000 },
    { day: "Nov", consultas: 2850, ingresos: 79000 },
    { day: "Dic", consultas: 2400, ingresos: 67000 },
  ],
  all: [
    { day: "2021", consultas: 18000, ingresos: 510000 },
    { day: "2022", consultas: 22000, ingresos: 620000 },
    { day: "2023", consultas: 26000, ingresos: 730000 },
    { day: "2024", consultas: 30000, ingresos: 850000 },
    { day: "2025", consultas: 8500, ingresos: 240000 },
  ],
};

function AreaChart({
  data,
  showFooter = false,
  height = 250,
  dateRange = "week",
}: AreaChartProps) {
  // Usar datos personalizados o datos según el período seleccionado
  const chartData = data || dataByPeriod[dateRange];

  return (
    <Card className="h-full flex flex-col rounded-3xl border-none shadow-none p-0 m-0">
      <CardContent className="flex items-center justify-center h-full">
        <ChartContainer config={chartConfig} className="h-full w-full p-0 m-0">
          <ResponsiveContainer width="100%" height={height}>
            <RechartsAreaChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              {/* YAxis izquierdo para Consultas */}
              <YAxis
                yAxisId="left"
                orientation="left"
                stroke="var(--primary)"
              />
              {/* YAxis derecho para Ingresos */}
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="var(--primary)"
              />
              <Tooltip content={<ChartTooltipContent indicator="dot" />} />

              {/* Área de Consultas - sin stackId para que no se apile */}
              <Area
                yAxisId="left"
                dataKey="consultas"
                type="monotone"
                fill="var(--accent)"
                fillOpacity={0.3}
                stroke="var(--accent)"
                strokeWidth={2}
              />
              {/* Área de Ingresos - sin stackId para que no se apile */}
              <Area
                yAxisId="right"
                dataKey="ingresos"
                type="monotone"
                fill="var(--secondary)"
                fillOpacity={0.3}
                stroke="var(--secondary)"
                strokeWidth={2}
              />
            </RechartsAreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      {showFooter && <CardFooter></CardFooter>}
    </Card>
  );
}

export default AreaChart;
