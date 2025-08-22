"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, DollarSign, Activity, Users, BarChart3 } from "lucide-react"
import { StockChart } from "@/components/stock-chart"
import { TechnicalIndicators } from "@/components/technical-indicators"
import { PerformanceMetrics } from "@/components/performance-metrics"

// Top American companies for analysis
const TOP_STOCKS = [
  { symbol: "AAPL", name: "Apple Inc.", sector: "Technology" },
  { symbol: "MSFT", name: "Microsoft Corporation", sector: "Technology" },
  { symbol: "GOOGL", name: "Alphabet Inc.", sector: "Technology" },
  { symbol: "AMZN", name: "Amazon.com Inc.", sector: "Consumer Discretionary" },
  { symbol: "TSLA", name: "Tesla Inc.", sector: "Consumer Discretionary" },
  { symbol: "META", name: "Meta Platforms Inc.", sector: "Technology" },
  { symbol: "NVDA", name: "NVIDIA Corporation", sector: "Technology" },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", sector: "Financial Services" },
  { symbol: "JNJ", name: "Johnson & Johnson", sector: "Healthcare" },
  { symbol: "V", name: "Visa Inc.", sector: "Financial Services" },
]

// Mock stock data - in production, this would come from a real API
const generateMockStockData = (symbol: string) => ({
  symbol,
  price: Math.random() * 300 + 50,
  change: (Math.random() - 0.5) * 20,
  changePercent: (Math.random() - 0.5) * 10,
  volume: Math.floor(Math.random() * 10000000) + 1000000,
  marketCap: Math.floor(Math.random() * 2000) + 100,
  pe: Math.random() * 30 + 5,
  signal: Math.random() > 0.5 ? "BUY" : Math.random() > 0.3 ? "HOLD" : "SELL",
})

export default function StockDashboard() {
  const [stockData, setStockData] = useState<any[]>([])
  const [selectedStock, setSelectedStock] = useState("AAPL")
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Simulate real-time data updates
  useEffect(() => {
    const updateData = () => {
      const newData = TOP_STOCKS.map((stock) => ({
        ...stock,
        ...generateMockStockData(stock.symbol),
      }))
      setStockData(newData)
      setLastUpdate(new Date())
    }

    updateData()
    const interval = setInterval(updateData, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const selectedStockData = stockData.find((stock) => stock.symbol === selectedStock)

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)

  const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value)

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Stock Market Dashboard</h1>
            <p className="text-muted-foreground">Real-time analysis of top American companies</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Last updated</p>
            <p className="text-sm font-mono">{lastUpdate.toLocaleTimeString()}</p>
          </div>
        </div>

        {/* Market Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2.4T</div>
              <p className="text-xs text-muted-foreground">+2.1% from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Stocks</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockData.length}</div>
              <p className="text-xs text-muted-foreground">Top US companies</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Volume</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stockData.length > 0
                  ? formatNumber(stockData.reduce((acc, stock) => acc + stock.volume, 0) / stockData.length)
                  : "0"}
              </div>
              <p className="text-xs text-muted-foreground">Daily average</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Signals</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockData.filter((stock) => stock.signal === "BUY").length}</div>
              <p className="text-xs text-muted-foreground">Buy signals active</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stock List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Top Stocks</CardTitle>
              <CardDescription>Click to analyze</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {stockData.map((stock) => (
                <div
                  key={stock.symbol}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
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
                        className={`flex items-center text-xs ${stock.change >= 0 ? "text-chart-2" : "text-chart-5"}`}
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
                    <Badge variant="outline" className="text-xs">
                      {stock.sector}
                    </Badge>
                    <Badge
                      variant={
                        stock.signal === "BUY" ? "default" : stock.signal === "SELL" ? "destructive" : "secondary"
                      }
                      className="text-xs"
                    >
                      {stock.signal}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Selected Stock Analysis */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{selectedStockData?.name || "Select a stock"}</CardTitle>
              <CardDescription>{selectedStockData?.symbol} - Detailed Analysis</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedStockData ? (
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="chart">Chart</TabsTrigger>
                    <TabsTrigger value="technical">Technical</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="signals">Signals</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Current Price</p>
                        <p className="text-2xl font-bold font-mono">{formatCurrency(selectedStockData.price)}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Change</p>
                        <p
                          className={`text-2xl font-bold ${
                            selectedStockData.change >= 0 ? "text-chart-2" : "text-chart-5"
                          }`}
                        >
                          {selectedStockData.change >= 0 ? "+" : ""}
                          {selectedStockData.change.toFixed(2)}({selectedStockData.changePercent.toFixed(2)}%)
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Volume</p>
                        <p className="text-lg font-semibold">{formatNumber(selectedStockData.volume)}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Market Cap</p>
                        <p className="text-lg font-semibold">${selectedStockData.marketCap}B</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">P/E Ratio</p>
                        <p className="text-lg font-semibold">{selectedStockData.pe.toFixed(2)}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Sector</p>
                        <Badge variant="outline">{selectedStockData.sector}</Badge>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="chart" className="space-y-4">
                    <StockChart symbol={selectedStockData.symbol} type="area" />
                    <div className="text-sm text-muted-foreground text-center">
                      30-day price movement with volume indicators
                    </div>
                  </TabsContent>

                  <TabsContent value="technical" className="space-y-4">
                    <TechnicalIndicators stockData={selectedStockData} />
                  </TabsContent>

                  <TabsContent value="performance" className="space-y-4">
                    <PerformanceMetrics stockData={selectedStockData} />
                  </TabsContent>

                  <TabsContent value="signals" className="space-y-4">
                    <div className="text-center p-6 space-y-4">
                      <Badge
                        variant={
                          selectedStockData.signal === "BUY"
                            ? "default"
                            : selectedStockData.signal === "SELL"
                              ? "destructive"
                              : "secondary"
                        }
                        className="text-lg px-4 py-2"
                      >
                        {selectedStockData.signal}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        Current trading signal based on technical analysis
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <p className="font-semibold">Confidence</p>
                          <p className="text-muted-foreground">
                            {selectedStockData.signal === "BUY"
                              ? "High"
                              : selectedStockData.signal === "SELL"
                                ? "Medium"
                                : "Low"}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold">Time Horizon</p>
                          <p className="text-muted-foreground">Short-term</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold">Risk Level</p>
                          <p className="text-muted-foreground">
                            {selectedStockData.signal === "BUY"
                              ? "Medium"
                              : selectedStockData.signal === "SELL"
                                ? "High"
                                : "Low"}
                          </p>
                        </div>
                      </div>
                    </div>
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
