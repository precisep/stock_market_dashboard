import { NextResponse } from "next/server"

// Mock stock data generator - in production, integrate with real APIs like Alpha Vantage, IEX Cloud, or Yahoo Finance
const generateStockData = (symbol: string) => ({
  symbol,
  price: Math.random() * 300 + 50,
  change: (Math.random() - 0.5) * 20,
  changePercent: (Math.random() - 0.5) * 10,
  volume: Math.floor(Math.random() * 10000000) + 1000000,
  marketCap: Math.floor(Math.random() * 2000) + 100,
  pe: Math.random() * 30 + 5,
  high52: Math.random() * 400 + 100,
  low52: Math.random() * 100 + 20,
  signal: Math.random() > 0.5 ? "BUY" : Math.random() > 0.3 ? "HOLD" : "SELL",
  timestamp: new Date().toISOString(),
})

const TOP_STOCKS = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "NVDA", "JPM", "JNJ", "V"]

export async function GET() {
  try {
    // In production, replace this with real API calls
    const stockData = TOP_STOCKS.map((symbol) => generateStockData(symbol))

    return NextResponse.json({
      success: true,
      data: stockData,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch stock data" }, { status: 500 })
  }
}
