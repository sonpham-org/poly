'use client';

import { useEffect, useRef, useCallback } from 'react';
import {
  createChart,
  createSeriesMarkers,
  LineSeries,
  IChartApi,
  ISeriesApi,
  ISeriesMarkersPluginApi,
  LineData,
  SeriesMarker,
  Time,
} from 'lightweight-charts';
import { PricePoint, ReplayTrade } from '@/lib/types';

interface PriceTimelineProps {
  priceHistory: PricePoint[];
  trades: ReplayTrade[];
  currentIndex: number;
}

export function PriceTimeline({ priceHistory, trades, currentIndex }: PriceTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const priceSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const markersRef = useRef<ISeriesMarkersPluginApi<Time> | null>(null);

  // Initialize chart
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { color: '#0a0a0a' },
        textColor: '#737373',
        fontFamily: 'var(--font-geist-sans), sans-serif',
        fontSize: 11,
      },
      grid: {
        vertLines: { color: '#1a1a1a' },
        horzLines: { color: '#1a1a1a' },
      },
      crosshair: {
        mode: 0,
        vertLine: { color: '#3b82f6', width: 1, style: 2, labelBackgroundColor: '#3b82f6' },
        horzLine: { color: '#3b82f6', width: 1, style: 2, labelBackgroundColor: '#3b82f6' },
      },
      timeScale: {
        borderColor: '#262626',
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: '#262626',
      },
      handleScroll: { vertTouchDrag: false },
    });

    const priceSeries = chart.addSeries(LineSeries, {
      color: '#3b82f6',
      lineWidth: 2,
      priceFormat: {
        type: 'custom',
        formatter: (price: number) => `${(price * 100).toFixed(1)}¢`,
      },
      crosshairMarkerRadius: 4,
      crosshairMarkerBorderColor: '#3b82f6',
      crosshairMarkerBackgroundColor: '#0a0a0a',
    });

    const seriesMarkers = createSeriesMarkers(priceSeries, []);

    chartRef.current = chart;
    priceSeriesRef.current = priceSeries;
    markersRef.current = seriesMarkers;

    const handleResize = () => {
      if (containerRef.current) {
        chart.applyOptions({ width: containerRef.current.clientWidth });
      }
    };
    const observer = new ResizeObserver(handleResize);
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      seriesMarkers.detach();
      chart.remove();
      chartRef.current = null;
      priceSeriesRef.current = null;
      markersRef.current = null;
    };
  }, []);

  // Set price data
  useEffect(() => {
    if (!priceSeriesRef.current || priceHistory.length === 0) return;

    const data: LineData<Time>[] = priceHistory.map((p) => ({
      time: p.t as Time,
      value: p.p,
    }));

    priceSeriesRef.current.setData(data);
    chartRef.current?.timeScale().fitContent();
  }, [priceHistory]);

  // Update trade markers based on currentIndex
  const updateMarkers = useCallback(() => {
    if (!markersRef.current || trades.length === 0) return;

    const visibleTrades = trades.slice(0, currentIndex + 1);

    const markers: SeriesMarker<Time>[] = visibleTrades.map((trade, i) => {
      const isBuy = trade.side === 'BUY';
      const isCurrent = i === currentIndex;
      return {
        time: Math.floor(trade.timestamp.getTime() / 1000) as Time,
        position: isBuy ? 'belowBar' as const : 'aboveBar' as const,
        color: isBuy ? '#22c55e' : '#ef4444',
        shape: isBuy ? 'arrowUp' as const : 'arrowDown' as const,
        size: isCurrent ? 2 : 0.5,
      };
    });

    // Sort markers by time (required by lightweight-charts)
    markers.sort((a, b) => (a.time as number) - (b.time as number));

    markersRef.current.setMarkers(markers);
  }, [trades, currentIndex]);

  useEffect(() => {
    updateMarkers();
  }, [updateMarkers]);

  // Scroll chart to keep current trade visible
  useEffect(() => {
    if (!chartRef.current || currentIndex < 0 || currentIndex >= trades.length) return;

    const trade = trades[currentIndex];
    const tradeTime = Math.floor(trade.timestamp.getTime() / 1000);

    const ts = chartRef.current.timeScale();
    const visibleRange = ts.getVisibleRange();
    if (visibleRange) {
      const rangeStart = visibleRange.from as unknown as number;
      const rangeEnd = visibleRange.to as unknown as number;
      if (tradeTime < rangeStart || tradeTime > rangeEnd) {
        ts.scrollToRealTime();
      }
    }
  }, [currentIndex, trades]);

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-3 py-2 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold">Price Timeline</h3>
        <span className="text-[11px] text-muted font-mono">
          {priceHistory.length > 0
            ? `${(priceHistory[priceHistory.length - 1].p * 100).toFixed(1)}¢`
            : '—'}
        </span>
      </div>
      <div ref={containerRef} className="w-full" style={{ height: 320 }} />
    </div>
  );
}
