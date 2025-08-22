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

// Color mapping for different symbols
const colors: Record<string, string> = {
  AAPL: "#3b82f6", // blue
  TSLA: "#ef4444", // red
  AMZN: "#f59e0b", // amber
  MSFT: "#10b981", // emerald
  NFLX: "#8b5cf6", // purple
  DEFAULT: "#06b6d4", // cyan
}

export function StockChart({ symbol, data, type = "area" }: StockChartProps) {
  const chartData = data || generateHistoricalData(symbol)
  const strokeColor = colors[symbol] || colors.DEFAULT

  const chartConfig = {
    price: {
      label: "Price",
      color: strokeColor,
    },
  }

  if (type === "area") {
    return (
      <ChartContainer config={chartConfig} className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /> {/* light gray grid */}
            <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
            <YAxis tickFormatter={(value) => `$${value}`} />
            <ChartTooltip
              content={<ChartTooltipContent />}
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={strokeColor}
              fill={strokeColor}
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
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /> {/* light gray grid */}
          <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
          <YAxis tickFormatter={(value) => `$${value}`} />
          <ChartTooltip
            content={<ChartTooltipContent />}
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <Line type="monotone" dataKey="price" stroke={strokeColor} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
