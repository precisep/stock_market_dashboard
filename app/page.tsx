"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, DollarSign, Activity, Users, BarChart3 } from "lucide-react"
import StockChart from "@/components/stock-chart"
import { TechnicalIndicators } from "@/components/technical-indicators"
import { Sparklines, SparklinesLine } from "react-sparklines"
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts"
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"

interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: number
  pe?: number
  sector: string
  signal: "BUY" | "SELL" | "HOLD"
  bars?: { t: string; o: number; h: number; l: number; c: number; v: number }[]
  ytdReturn?: number
  oneYearReturn?: number
  volatility?: number
  beta?: number
  sharpeRatio?: number
  dividendYield?: number
  roe?: number
  debtToEquity?: number
  currentRatio?: number
  quickRatio?: number
}

const formatLargeNumber = (num: number | undefined) => {
  if (!num) return "0"
  if (num >= 1e12) return (num / 1e12).toFixed(2) + "T"
  if (num >= 1e9) return (num / 1e9).toFixed(2) + "B"
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M"
  if (num >= 1e3) return (num / 1e3).toFixed(2) + "K"
  return num.toString()
}

export default function StockDashboard() {
  const [stockData, setStockData] = useState<Stock[]>([])
  const [selectedStock, setSelectedStock] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<string>("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true) // client-only render

    const fetchData = async () => {
      try {
        const res = await fetch("/api/stocks/all")
        const json = await res.json()
        const data: Stock[] = json.data || []
        setStockData(data)
        setLastUpdate(new Date().toLocaleTimeString())
        if (!selectedStock && data.length > 0) setSelectedStock(data[0].symbol)
      } catch {
        setStockData([])
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [selectedStock])

  const selectedStockData = stockData.find((s) => s.symbol === selectedStock)
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value)

  const TabStatCard = ({
    title,
    value,
    change,
    changePercent,
  }: {
    title: string
    value: string | number
    change?: number
    changePercent?: number
  }) => (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="text-xl font-bold">{value}</div>
        {change !== undefined && changePercent !== undefined && (
          <div className={`flex items-center justify-center text-sm ${change >= 0 ? "text-chart-2" : "text-chart-5"}`}>
            {change >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            {changePercent.toFixed(2)}%
          </div>
        )}
      </CardContent>
    </Card>
  )

  const signalData = [
    { name: "Buy", value: stockData.filter(s => s.signal === "BUY").length },
    { name: "Sell", value: stockData.filter(s => s.signal === "SELL").length },
    { name: "Hold", value: stockData.filter(s => s.signal === "HOLD").length }
  ]
  const COLORS = ["#22c55e", "#ef4444", "#facc15"]

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold text-center md:text-left">Stock Market Dashboard</h1>
            <p className="text-muted-foreground text-center md:text-left">Real-time analysis of top American companies</p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-muted-foreground">Last updated</p>
            {mounted && <p className="text-sm font-mono">{lastUpdate}</p>}
          </div>
        </div>

        {/* Market Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="w-full text-center hover:shadow-lg transition-shadow">
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatLargeNumber(stockData.reduce((sum, s) => sum + (s.marketCap || 0), 0))}
              </div>
              {mounted && (
                <Sparklines data={stockData.map(s => s.marketCap || 0)}>
                  <SparklinesLine color="#3b82f6" />
                </Sparklines>
              )}
              <p className="text-xs text-muted-foreground">Total of listed stocks</p>
            </CardContent>
          </Card>

          <Card className="w-full text-center hover:shadow-lg transition-shadow">
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle className="text-sm font-medium">Active Stocks</CardTitle>
              <Activity className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockData.length}</div>
              {mounted && (
                <Sparklines data={stockData.map(() => Math.random() * 10)}>
                  <SparklinesLine color="#facc15" />
                </Sparklines>
              )}
              <p className="text-xs text-muted-foreground">Top US companies</p>
            </CardContent>
          </Card>

          <Card className="w-full text-center hover:shadow-lg transition-shadow">
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle className="text-sm font-medium">Avg Volume</CardTitle>
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stockData.length > 0
                  ? formatLargeNumber(
                      Math.round(stockData.reduce((acc, s) => acc + (s.volume || 0), 0) / stockData.length)
                    )
                  : "0"}
              </div>
              {mounted && (
                <Sparklines data={stockData.map(s => s.volume || 0)}>
                  <SparklinesLine color="#22c55e" />
                </Sparklines>
              )}
              <p className="text-xs text-muted-foreground">Daily average trend</p>
            </CardContent>
          </Card>

          <Card className="w-full text-center hover:shadow-lg transition-shadow">
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle className="text-sm font-medium">Buy Signals</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{signalData[0].value}</div>
              {mounted && (
                <Sparklines data={[signalData[0].value, signalData[1].value, signalData[2].value]}>
                  <SparklinesLine color="#22c55e" />
                </Sparklines>
              )}
              <p className="text-xs text-muted-foreground">Active buy signals</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stock List */}
          <Card className="lg:col-span-1 w-full max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Top Stocks</CardTitle>
              <CardDescription>Click to analyze</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {stockData.map((stock) => (
                <div
                  key={stock.symbol}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedStock === stock.symbol ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedStock(stock.symbol)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{stock.symbol}</div>
                      <div className="text-sm text-muted-foreground truncate">{stock.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm">{formatCurrency(stock.price)}</div>
                      <div
                        className={`flex items-center text-xs ${
                          stock.change >= 0 ? "text-chart-2" : "text-chart-5"
                        }`}
                      >
                        {stock.change >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {stock.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="outline" className="text-xs">{stock.sector}</Badge>
                    <Badge
                      variant={stock.signal === "BUY" ? "default" : stock.signal === "SELL" ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {stock.signal}
                    </Badge>
                  </div>
                  {mounted && (
                    <Sparklines data={stock.bars?.map(b => b.c) || []} width={100} height={20}>
                      <SparklinesLine color={stock.change >= 0 ? "#22c55e" : "#ef4444"} />
                    </Sparklines>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Selected Stock Tabs */}
          <Card className="lg:col-span-2 w-full max-w-4xl">
            <CardHeader>
              <CardTitle>{selectedStockData?.name || "Select a stock"}</CardTitle>
              <CardDescription>{selectedStockData?.symbol || ""} - Detailed Analysis</CardDescription>
            </CardHeader>
            <CardContent>
              {mounted && selectedStockData ? (
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="chart">Chart</TabsTrigger>
                    <TabsTrigger value="technical">Technical</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="signals">Signals</TabsTrigger>
                  </TabsList>

                  {/* Overview */}
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-stretch">
                      <TabStatCard
                        title="Price"
                        value={formatCurrency(selectedStockData.price)}
                        change={selectedStockData.change}
                        changePercent={selectedStockData.changePercent}
                      />
                      <TabStatCard title="Market Cap" value={formatLargeNumber(selectedStockData.marketCap)} />
                      <TabStatCard title="Volume" value={formatLargeNumber(selectedStockData.volume)} />
                      {selectedStockData.pe !== undefined && <TabStatCard title="P/E Ratio" value={selectedStockData.pe.toFixed(2)} />}
                      <TabStatCard title="Sector" value={selectedStockData.sector} />
                      <TabStatCard title="Signal" value={selectedStockData.signal} />
                    </div>
                  </TabsContent>

                  {/* Chart */}
                  <TabsContent value="chart" className="space-y-4">
                    <StockChart symbol={selectedStockData.symbol} type="line" />
                    <div className="text-sm text-muted-foreground text-center">
                      30-day price movement with volume indicators
                    </div>
                  </TabsContent>

                  {/* Technical */}
                  <TabsContent value="technical" className="space-y-4">
                    {selectedStockData.bars && <TechnicalIndicators bars={selectedStockData.bars} />}
                  </TabsContent>

                  {/* Performance */}
                  <TabsContent value="performance" className="space-y-4">
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart
                        cx="50%" cy="50%" outerRadius="80%" data={[
                          { metric: "Volatility", value: selectedStockData.volatility || 0 },
                          { metric: "Beta", value: selectedStockData.beta || 0 },
                          { metric: "Sharpe", value: selectedStockData.sharpeRatio || 0 },
                          { metric: "ROE", value: selectedStockData.roe || 0 },
                          { metric: "Div Yield", value: selectedStockData.dividendYield || 0 }
                        ]}
                      >
                        <PolarGrid />
                        <PolarAngleAxis dataKey="metric" />
                        <PolarRadiusAxis />
                        <Radar dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </TabsContent>

                  {/* Signals */}
                  <TabsContent value="signals" className="space-y-4">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie data={signalData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                          {signalData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-center p-6 text-muted-foreground">
                  <p>Select a stock from the list to view detailed analysis</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
