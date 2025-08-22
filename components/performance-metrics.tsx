"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Shield, AlertTriangle } from "lucide-react"

interface PerformanceMetricsProps {
  stockData: any
}

// Generate mock performance metrics
const generatePerformanceMetrics = (stockData: any) => ({
  ytdReturn: (Math.random() - 0.3) * 50,
  oneYearReturn: (Math.random() - 0.2) * 80,
  volatility: Math.random() * 40 + 10,
  beta: Math.random() * 2 + 0.5,
  sharpeRatio: Math.random() * 2 - 0.5,
  dividendYield: Math.random() * 5,
  roe: Math.random() * 25 + 5,
  debtToEquity: Math.random() * 2,
  currentRatio: Math.random() * 3 + 0.5,
  quickRatio: Math.random() * 2 + 0.3,
})

export function PerformanceMetrics({ stockData }: PerformanceMetricsProps) {
  const metrics = generatePerformanceMetrics(stockData)

  const getRiskLevel = (volatility: number) => {
    if (volatility > 30) return { level: "High", color: "destructive", icon: AlertTriangle }
    if (volatility > 20) return { level: "Medium", color: "secondary", icon: Shield }
    return { level: "Low", color: "default", icon: Shield }
  }

  const riskLevel = getRiskLevel(metrics.volatility)

  return (
    <div className="space-y-4">
      {/* Returns */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Returns</CardTitle>
          <CardDescription>Performance over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">YTD Return</span>
              <div className="flex items-center gap-2">
                <span className={`font-mono ${metrics.ytdReturn >= 0 ? "text-chart-2" : "text-chart-5"}`}>
                  {metrics.ytdReturn >= 0 ? "+" : ""}
                  {metrics.ytdReturn.toFixed(2)}%
                </span>
                {metrics.ytdReturn >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-chart-2" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-chart-5" />
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">1 Year Return</span>
              <div className="flex items-center gap-2">
                <span className={`font-mono ${metrics.oneYearReturn >= 0 ? "text-chart-2" : "text-chart-5"}`}>
                  {metrics.oneYearReturn >= 0 ? "+" : ""}
                  {metrics.oneYearReturn.toFixed(2)}%
                </span>
                {metrics.oneYearReturn >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-chart-2" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-chart-5" />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Risk Assessment</CardTitle>
          <CardDescription>Volatility and risk indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Volatility</span>
              <div className="flex items-center gap-2">
                <span className="font-mono">{metrics.volatility.toFixed(1)}%</span>
                <Badge variant={riskLevel.color as any} className="flex items-center gap-1">
                  <riskLevel.icon className="h-3 w-3" />
                  {riskLevel.level}
                </Badge>
              </div>
            </div>
            <Progress value={Math.min(metrics.volatility, 50) * 2} className="h-2" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span>Beta</span>
                <span className="font-mono">{metrics.beta.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Sharpe Ratio</span>
                <span className="font-mono">{metrics.sharpeRatio.toFixed(2)}</span>
              </div>
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
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>ROE</span>
                <span className="font-mono">{metrics.roe.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Debt/Equity</span>
                <span className="font-mono">{metrics.debtToEquity.toFixed(2)}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Current Ratio</span>
                <span className="font-mono">{metrics.currentRatio.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Quick Ratio</span>
                <span className="font-mono">{metrics.quickRatio.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dividend */}
      {metrics.dividendYield > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Dividend Information</CardTitle>
            <CardDescription>Income generation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm">Dividend Yield</span>
              <span className="font-mono text-chart-2">{metrics.dividendYield.toFixed(2)}%</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
