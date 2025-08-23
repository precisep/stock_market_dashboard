"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface StockBar {
  t: string
  o: number
  h: number
  l: number
  c: number
  v: number
}

interface TechnicalIndicatorsProps {
  bars: StockBar[]
}

function calculateSMA(bars: StockBar[], period: number): number {
  if (bars.length < period) return 0
  const slice = bars.slice(-period)
  return slice.reduce((sum, b) => sum + b.c, 0) / period
}

function calculateRSI(bars: StockBar[], period = 14): number {
  if (bars.length <= period) return 50
  let gains = 0
  let losses = 0
  for (let i = bars.length - period; i < bars.length; i++) {
    const diff = bars[i].c - bars[i - 1].c
    if (diff > 0) gains += diff
    else losses -= diff
  }
  const rs = gains / (losses || 1)
  return 100 - 100 / (1 + rs)
}

function calculateMACD(bars: StockBar[], fast = 12, slow = 26): number {
  if (bars.length < slow) return 0
  const ema = (data: number[], period: number) => {
    const k = 2 / (period + 1)
    let emaPrev = data.slice(0, period).reduce((a, b) => a + b, 0) / period
    for (let i = period; i < data.length; i++) {
      emaPrev = data[i] * k + emaPrev * (1 - k)
    }
    return emaPrev
  }
  const closes = bars.map(b => b.c)
  const fastEMA = ema(closes, fast)
  const slowEMA = ema(closes, slow)
  return fastEMA - slowEMA
}

export function TechnicalIndicators({ bars }: TechnicalIndicatorsProps) {
  const sma20 = calculateSMA(bars, 20)
  const sma50 = calculateSMA(bars, 50)
  const rsi = calculateRSI(bars)
  const macd = calculateMACD(bars)

  const support = Math.min(...bars.map(b => b.l))
  const resistance = Math.max(...bars.map(b => b.h))
  const current = bars[bars.length - 1]?.c ?? 0

  const getRSIStatus = (value: number) => {
    if (value > 70) return { status: "Overbought", color: "destructive", icon: TrendingDown }
    if (value < 30) return { status: "Oversold", color: "default", icon: TrendingUp }
    return { status: "Neutral", color: "secondary", icon: Minus }
  }

  const getMACDStatus = (value: number) => {
    if (value > 0.5) return { status: "Bullish", color: "default", icon: TrendingUp }
    if (value < -0.5) return { status: "Bearish", color: "destructive", icon: TrendingDown }
    return { status: "Neutral", color: "secondary", icon: Minus }
  }

  const rsiStatus = getRSIStatus(rsi)
  const macdStatus = getMACDStatus(macd)

  return (
    <div className="space-y-4">
      {/* RSI & MACD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">RSI (14)</CardTitle>
            <CardDescription>Relative Strength Index</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{rsi.toFixed(1)}</span>
                <Badge variant={rsiStatus.color as any} className="flex items-center gap-1">
                  <rsiStatus.icon className="h-3 w-3" />
                  {rsiStatus.status}
                </Badge>
              </div>
              <Progress value={rsi} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Oversold (30)</span>
                <span>Overbought (70)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">MACD</CardTitle>
            <CardDescription>Moving Average Convergence Divergence</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{macd.toFixed(3)}</span>
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
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">SMA 20</span>
            <span className="font-mono">${sma20.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">SMA 50</span>
            <span className="font-mono">${sma50.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Support & Resistance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Support & Resistance</CardTitle>
          <CardDescription>Key price levels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Resistance</span>
            <span className="font-mono text-chart-5">${resistance.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Current</span>
            <span className="font-mono font-semibold">${current.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Support</span>
            <span className="font-mono text-chart-2">${support.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
