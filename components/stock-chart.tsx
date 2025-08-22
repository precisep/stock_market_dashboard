"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface StockChartProps {
  symbol: string
  data?: any[]
  type?: "line" | "area"
}

// Generate mock historical data
const generateHistoricalData = (symbol: string, days = 30) => {
  const data = []
  let basePrice = Math.random() * 200 + 100

  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    // Add some realistic price movement
    const change = (Math.random() - 0.5) * 10
    basePrice = Math.max(basePrice + change, 10)

    data.push({
      date: date.toISOString().split("T")[0],
      price: Number.parseFloat(basePrice.toFixed(2)),
      volume: Math.floor(Math.random() * 5000000) + 1000000,
    })
  }

  return data
}

export function StockChart({ symbol, data, type = "area" }: StockChartProps) {
  const chartData = data || generateHistoricalData(symbol)

  const chartConfig = {
    price: {
      label: "Price",
      color: "hsl(var(--chart-1))",
    },
  }

  if (type === "area") {
    return (
      <ChartContainer config={chartConfig} className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
            <YAxis tickFormatter={(value) => `$${value}`} />
            <ChartTooltip
              content={<ChartTooltipContent />}
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="var(--color-price)"
              fill="var(--color-price)"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
          <YAxis tickFormatter={(value) => `$${value}`} />
          <ChartTooltip
            content={<ChartTooltipContent />}
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <Line type="monotone" dataKey="price" stroke="var(--color-price)" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
