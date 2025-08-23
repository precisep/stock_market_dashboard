"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Shield, AlertTriangle } from "lucide-react"

// Props interface
interface PerformanceMetricsProps {
  stockData?: Partial<{
    ytdReturn: number
    oneYearReturn: number
    volatility: number
    beta: number
    sharpeRatio: number
    dividendYield: number
    roe: number
    debtToEquity: number
    currentRatio: number
    quickRatio: number
  }>
}

// Component
export function PerformanceMetrics({ stockData = {} }: PerformanceMetricsProps) {

  // Risk level calculation
  const getRiskLevel = (volatility?: number) => {
    if (volatility === undefined) return { level: "Unknown", color: "default", icon: Shield }
    if (volatility > 30) return { level: "High", color: "destructive", icon: AlertTriangle }
    if (volatility > 20) return { level: "Medium", color: "secondary", icon: Shield }
    return { level: "Low", color: "default", icon: Shield }
  }

  const riskLevel = getRiskLevel(stockData.volatility)

  // Formatting helpers
  const formatPercent = (value?: number) =>
    value != null ? `${value >= 0 ? "+" : ""}${value.toFixed(2)}%` : "N/A"

  const formatNumber = (value?: number, decimals = 2) =>
    value != null ? value.toFixed(decimals) : "N/A"

  return (
    <div className="space-y-4">

      {/* Returns */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Returns</CardTitle>
          <CardDescription>Performance over time</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "YTD Return", value: stockData.ytdReturn },
            { label: "1 Year Return", value: stockData.oneYearReturn }
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span className="text-sm">{label}</span>
              <div className="flex items-center gap-2">
                <span className={`font-mono ${value != null && value >= 0 ? "text-chart-2" : "text-chart-5"}`}>
                  {formatPercent(value)}
                </span>
                {value != null && value !== 0 && (
                  value >= 0
                    ? <TrendingUp className="h-4 w-4 text-chart-2" />
                    : <TrendingDown className="h-4 w-4 text-chart-5" />
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Risk Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Risk Assessment</CardTitle>
          <CardDescription>Volatility and risk indicators</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span className="text-sm">Volatility</span>
            <div className="flex items-center gap-2">
              <span className="font-mono">{formatPercent(stockData.volatility)}</span>
              <Badge variant={riskLevel.color as any} className="flex items-center gap-1">
                <riskLevel.icon className="h-3 w-3" />
                {riskLevel.level}
              </Badge>
            </div>
          </div>
          <Progress value={stockData.volatility ? Math.min(stockData.volatility, 50) * 2 : 0} className="h-2" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span>Beta</span>
              <span className="font-mono">{formatNumber(stockData.beta)}</span>
            </div>
            <div className="flex justify-between">
              <span>Sharpe Ratio</span>
              <span className="font-mono">{formatNumber(stockData.sharpeRatio)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Health */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Financial Health</CardTitle>
          <CardDescription>Key financial ratios</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>ROE</span>
              <span className="font-mono">{formatPercent(stockData.roe)}</span>
            </div>
            <div className="flex justify-between">
              <span>Debt/Equity</span>
              <span className="font-mono">{formatNumber(stockData.debtToEquity)}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Current Ratio</span>
              <span className="font-mono">{formatNumber(stockData.currentRatio)}</span>
            </div>
            <div className="flex justify-between">
              <span>Quick Ratio</span>
              <span className="font-mono">{formatNumber(stockData.quickRatio)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dividend */}
      {stockData.dividendYield != null && stockData.dividendYield > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Dividend Information</CardTitle>
            <CardDescription>Income generation</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span className="text-sm">Dividend Yield</span>
            <span className="font-mono text-chart-2">{formatPercent(stockData.dividendYield)}</span>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
