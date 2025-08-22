"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface TechnicalIndicatorsProps {
  stockData: any
}

// Generate mock technical indicators
const generateTechnicalIndicators = (stockData: any) => ({
  rsi: Math.random() * 100,
  macd: (Math.random() - 0.5) * 2,
  sma20: stockData.price * (0.95 + Math.random() * 0.1),
  sma50: stockData.price * (0.9 + Math.random() * 0.2),
  bollinger: {
    upper: stockData.price * 1.1,
    lower: stockData.price * 0.9,
  },
  support: stockData.price * (0.85 + Math.random() * 0.1),
  resistance: stockData.price * (1.05 + Math.random() * 0.1),
})

export function TechnicalIndicators({ stockData }: TechnicalIndicatorsProps) {
  const indicators = generateTechnicalIndicators(stockData)

  const getRSIStatus = (rsi: number) => {
    if (rsi > 70) return { status: "Overbought", color: "destructive", icon: TrendingDown }
    if (rsi < 30) return { status: "Oversold", color: "default", icon: TrendingUp }
    return { status: "Neutral", color: "secondary", icon: Minus }
  }

  const getMACDStatus = (macd: number) => {
    if (macd > 0.5) return { status: "Bullish", color: "default", icon: TrendingUp }
    if (macd < -0.5) return { status: "Bearish", color: "destructive", icon: TrendingDown }
    return { status: "Neutral", color: "secondary", icon: Minus }
  }

  const rsiStatus = getRSIStatus(indicators.rsi)
  const macdStatus = getMACDStatus(indicators.macd)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* RSI */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">RSI (14)</CardTitle>
            <CardDescription>Relative Strength Index</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{indicators.rsi.toFixed(1)}</span>
                <Badge variant={rsiStatus.color as any} className="flex items-center gap-1">
                  <rsiStatus.icon className="h-3 w-3" />
                  {rsiStatus.status}
                </Badge>
              </div>
              <Progress value={indicators.rsi} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Oversold (30)</span>
                <span>Overbought (70)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* MACD */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">MACD</CardTitle>
            <CardDescription>Moving Average Convergence Divergence</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{indicators.macd.toFixed(3)}</span>
                <Badge variant={macdStatus.color as any} className="flex items-center gap-1">
                  <macdStatus.icon className="h-3 w-3" />
                  {macdStatus.status}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">Signal line convergence indicator</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Moving Averages */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Moving Averages</CardTitle>
          <CardDescription>Price vs. key moving averages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Current Price</span>
              <span className="font-mono font-semibold">${stockData.price.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">SMA 20</span>
              <div className="flex items-center gap-2">
                <span className="font-mono">${indicators.sma20.toFixed(2)}</span>
                {stockData.price > indicators.sma20 ? (
                  <TrendingUp className="h-4 w-4 text-chart-2" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-chart-5" />
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">SMA 50</span>
              <div className="flex items-center gap-2">
                <span className="font-mono">${indicators.sma50.toFixed(2)}</span>
                {stockData.price > indicators.sma50 ? (
                  <TrendingUp className="h-4 w-4 text-chart-2" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-chart-5" />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support & Resistance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Support & Resistance</CardTitle>
          <CardDescription>Key price levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Resistance</span>
              <span className="font-mono text-chart-5">${indicators.resistance.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Current</span>
              <span className="font-mono font-semibold">${stockData.price.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Support</span>
              <span className="font-mono text-chart-2">${indicators.support.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
