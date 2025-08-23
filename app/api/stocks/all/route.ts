// /app/api/stocks/all/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

const ALPACA_API_KEY = process.env.ALPACA_API_KEY;
const ALPACA_SECRET_KEY = process.env.ALPACA_SECRET_KEY;
const ALPACA_BASE_URL = "https://data.alpaca.markets/v2/stocks";

if (!ALPACA_API_KEY || !ALPACA_SECRET_KEY) {
  throw new Error("Missing Alpaca API key or secret in .env.local");
}

const VALID_SYMBOLS = ["SPY", "QQQ", "IWM", "F", "AAPL"];

const STOCK_INFO: Record<string, { name: string; sector: string; marketCap: number; pe: number }> = {
  SPY: { name: "SPDR S&P 500 ETF Trust", sector: "ETF", marketCap: 400, pe: 20 },
  QQQ: { name: "Invesco QQQ Trust", sector: "ETF", marketCap: 200, pe: 25 },
  IWM: { name: "iShares Russell 2000 ETF", sector: "ETF", marketCap: 60, pe: 18 },
  F: { name: "Ford Motor Company", sector: "Consumer Cyclical", marketCap: 50, pe: 8 },
  AAPL: { name: "Apple Inc.", sector: "Technology", marketCap: 2500, pe: 30 },
};

interface StockBar {
  t: string;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
}

// ===== Helper Functions =====
function calculateSMA(bars: StockBar[], period: number) {
  if (bars.length < period) return 0;
  const slice = bars.slice(-period);
  return slice.reduce((sum, b) => sum + b.c, 0) / period;
}

function calculateRSI(bars: StockBar[], period = 14) {
  if (bars.length <= period) return 50;
  let gains = 0;
  let losses = 0;
  for (let i = bars.length - period; i < bars.length; i++) {
    const diff = bars[i].c - bars[i - 1].c;
    if (diff > 0) gains += diff;
    else losses -= diff;
  }
  const rs = gains / (losses || 1);
  return 100 - 100 / (1 + rs);
}

function calculateEMA(data: number[], period: number) {
  const k = 2 / (period + 1);
  let emaPrev = data.slice(0, period).reduce((a, b) => a + b, 0) / period;
  for (let i = period; i < data.length; i++) {
    emaPrev = data[i] * k + emaPrev * (1 - k);
  }
  return emaPrev;
}

function calculateMACD(bars: StockBar[], fast = 12, slow = 26) {
  if (bars.length < slow) return 0;
  const closes = bars.map(b => b.c);
  return calculateEMA(closes, fast) - calculateEMA(closes, slow);
}

function calculateVolatility(bars: StockBar[]) {
  const closes = bars.map(b => b.c);
  const mean = closes.reduce((sum, c) => sum + c, 0) / closes.length;
  const variance = closes.reduce((sum, c) => sum + Math.pow(c - mean, 2), 0) / closes.length;
  return Math.sqrt(variance);
}

// ===== Fetch Individual Stock =====
async function fetchStockData(symbol: string) {
  try {
    const end = new Date().toISOString().split("T")[0];
    const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const url = `${ALPACA_BASE_URL}/${symbol}/bars?timeframe=1Day&start=${start}&end=${end}&limit=30&feed=iex`;
    const res = await axios.get(url, {
      headers: {
        "APCA-API-KEY-ID": ALPACA_API_KEY!,
        "APCA-API-SECRET-KEY": ALPACA_SECRET_KEY!,
      },
    });

    const bars: StockBar[] = res.data.bars ?? [];
    if (!bars.length) throw new Error("No bars returned");

    const latest = bars[bars.length - 1];
    const info = STOCK_INFO[symbol] || { name: symbol, sector: "N/A", marketCap: 0, pe: 0 };
    const prices = bars.map(b => b.c);
    const signal = latest.c > bars[0].c ? "BUY" : latest.c < bars[0].c ? "SELL" : "HOLD";

    const sma20 = calculateSMA(bars, 20);
    const sma50 = calculateSMA(bars, 50);
    const rsi = calculateRSI(bars);
    const macd = calculateMACD(bars);
    const volatility = calculateVolatility(bars);
    const support = Math.min(...bars.map(b => b.l));
    const resistance = Math.max(...bars.map(b => b.h));

    return {
      symbol,
      name: info.name,
      sector: info.sector,
      marketCap: info.marketCap,
      pe: info.pe,
      bars,
      price: latest.c,
      volume: latest.v,
      latestPrice: latest.c,
      change: latest.c - latest.o,
      changePercent: ((latest.c - latest.o) / latest.o) * 100,
      latestVolume: latest.v,
      high30: Math.max(...prices),
      low30: Math.min(...prices),
      avgPrice: prices.reduce((sum, p) => sum + p, 0) / prices.length,
      totalVolume: bars.reduce((sum, b) => sum + b.v, 0),
      startDate: bars[0].t,
      endDate: latest.t,
      signal,
      volatility,
      beta: 1.0,              // placeholder, can fetch from a fundamental API
      dividendYield: 2.0,     // placeholder
      roe: 15.0,              // placeholder
      sma20,
      sma50,
      rsi,
      macd,
      support,
      resistance,
    };
  } catch (err: any) {
    console.error(`Failed to fetch ${symbol}:`, err.message);
    return { symbol, error: err.message };
  }
}

// ===== API Route =====
export async function GET() {
  const results = await Promise.all(VALID_SYMBOLS.map(fetchStockData));
  return NextResponse.json({
    success: true,
    data: results,
    timestamp: new Date().toISOString(),
  });
}
