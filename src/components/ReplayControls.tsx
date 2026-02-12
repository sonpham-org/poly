'use client';

import { Play, Pause, SkipForward, SkipBack, FastForward } from 'lucide-react';
import { formatDateTime } from '@/lib/format';

interface ReplayControlsProps {
  currentIndex: number;
  totalTrades: number;
  isPlaying: boolean;
  playSpeed: number;
  currentTimestamp: Date | null;
  onIndexChange: (index: number) => void;
  onTogglePlay: () => void;
  onSpeedChange: (speed: number) => void;
  onStepForward: () => void;
  onStepBack: () => void;
}

const SPEEDS = [1, 2, 5, 10];

export function ReplayControls({
  currentIndex,
  totalTrades,
  isPlaying,
  playSpeed,
  currentTimestamp,
  onIndexChange,
  onTogglePlay,
  onSpeedChange,
  onStepForward,
  onStepBack,
}: ReplayControlsProps) {
  const maxIndex = Math.max(0, totalTrades - 1);

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      {/* Scrubber */}
      <div className="mb-3">
        <input
          type="range"
          min={0}
          max={maxIndex}
          value={currentIndex}
          onChange={(e) => onIndexChange(Number(e.target.value))}
          className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-3.5
            [&::-webkit-slider-thumb]:h-3.5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-accent
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:shadow-[0_0_6px_rgba(59,130,246,0.5)]
            [&::-moz-range-thumb]:w-3.5
            [&::-moz-range-thumb]:h-3.5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-accent
            [&::-moz-range-thumb]:border-none
            [&::-moz-range-thumb]:cursor-pointer"
          disabled={totalTrades === 0}
        />
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1">
          {/* Step back */}
          <button
            onClick={onStepBack}
            disabled={currentIndex <= 0}
            className="p-1.5 rounded hover:bg-card-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Previous trade"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Play/Pause */}
          <button
            onClick={onTogglePlay}
            disabled={totalTrades === 0}
            className="p-2 rounded-full bg-accent/15 hover:bg-accent/25 text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" />
            )}
          </button>

          {/* Step forward */}
          <button
            onClick={onStepForward}
            disabled={currentIndex >= maxIndex}
            className="p-1.5 rounded hover:bg-card-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Next trade"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Timestamp + trade counter */}
        <div className="flex-1 text-center">
          <div className="text-xs font-mono text-muted">
            {currentTimestamp
              ? formatDateTime(currentTimestamp)
              : '—'}
          </div>
          <div className="text-[10px] text-muted mt-0.5">
            Trade {totalTrades > 0 ? currentIndex + 1 : 0} of {totalTrades}
          </div>
        </div>

        {/* Speed selector */}
        <div className="flex items-center gap-1">
          <FastForward className="w-3.5 h-3.5 text-muted mr-1" />
          {SPEEDS.map((speed) => (
            <button
              key={speed}
              onClick={() => onSpeedChange(speed)}
              className={`text-[11px] font-mono px-1.5 py-0.5 rounded transition-colors ${
                playSpeed === speed
                  ? 'bg-accent/20 text-accent'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
