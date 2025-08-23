"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

interface StockChartProps {
  symbol: string
  type?: "line" | "candlestick"
}

interface StockBar {
  t: string
  o: number
  h: number
  l: number
  c: number
  v: number
}

export default function StockChart({ symbol, type = "line" }: StockChartProps) {
  const [interval, setInterval] = useState<"1d" | "1w" | "1m">("1d")
  const [series, setSeries] = useState<any[]>([])
  const [mounted, setMounted] = useState(false) // <--- added

  useEffect(() => {
    setMounted(true) // ensure this runs only on client
  }, [])

  const aggregateBars = (bars: StockBar[], interval: "1d" | "1w" | "1m"): StockBar[] => {
    if (interval === "1d") return bars
    const grouped: Record<string, StockBar> = {}
    bars.forEach(b => {
      const date = new Date(b.t)
      let key = ""
      if (interval === "1w") {
        const week = `${date.getFullYear()}-W${Math.ceil((date.getDate() + 6 - date.getDay()) / 7)}`
        key = week
      } else if (interval === "1m") {
        key = `${date.getFullYear()}-${date.getMonth() + 1}`
      }
      if (!grouped[key]) {
        grouped[key] = { ...b }
      } else {
        grouped[key].h = Math.max(grouped[key].h, b.h)
        grouped[key].l = Math.min(grouped[key].l, b.l)
        grouped[key].c = b.c
        grouped[key].v += b.v
      }
    })
    return Object.values(grouped)
  }

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/stocks/all`)
      const json = await res.json()
      const stockData = json.data.find((s: any) => s.symbol === symbol)
      if (!stockData?.bars) return

      const bars = aggregateBars(stockData.bars, interval)

      if (type === "line") {
        setSeries([
          {
            name: symbol,
            data: bars.map((b: StockBar) => ({
              x: new Date(b.t),
              y: b.c,
            })),
          },
        ])
      } else if (type === "candlestick") {
        setSeries([
          {
            name: symbol,
            data: bars.map((b: StockBar) => ({
              x: new Date(b.t),
              y: [b.o, b.h, b.l, b.c],
            })),
          },
        ])
      }
    } catch (err) {
      console.error("Failed to fetch chart data:", err)
    }
  }

  useEffect(() => {
    if (!mounted) return
    fetchData()
  }, [symbol, interval, type, mounted])

  const options: any = {
    chart: {
      type: type === "line" ? "line" : "candlestick",
      height: 400,
      toolbar: { show: false },
      background: "transparent",
    },
    grid: { show: false },
    xaxis: { type: "datetime", labels: { datetimeUTC: false } },
    yaxis: { labels: { show: true } },
    tooltip: {
      enabled: true,
      theme: "dark",
      style: { fontSize: "14px", fontFamily: "Arial", color: "#fff", background: "#1e293b" },
      x: { show: true, format: "dd MMM yyyy" },
    },
    stroke: { width: 2 },
    colors: type === "line" ? ["#22c55e"] : undefined,
    plotOptions: {
      candlestick: { colors: { upward: "#22c55e", downward: "#ef4444" } },
    },
  }

  if (!mounted) return null // render nothing until mounted

  return (
    <div>
      <div className="flex gap-2 mb-2">
        {["1d", "1w", "1m"].map((tf) => (
          <button
            key={tf}
            className={`px-3 py-1 rounded ${
              interval === tf ? "bg-green-600" : "bg-slate-700 hover:bg-slate-600"
            } text-slate-200`}
            onClick={() => setInterval(tf as "1d" | "1w" | "1m")}
          >
            {tf.toUpperCase()}
          </button>
        ))}
      </div>
      <ReactApexChart options={options} series={series} type={type} height={400} />
    </div>
  )
}
