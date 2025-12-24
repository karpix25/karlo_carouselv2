import React from 'react';
import { Minus, Plus } from 'lucide-react';

const MIN_ZOOM = 0.2;
const MAX_ZOOM = 1.5;

export default function ZoomControls({ zoom, onZoomChange }) {
  const formatZoom = Math.round(zoom * 100);

  const handleStep = (direction) => {
    const delta = direction === 'in' ? 0.05 : -0.05;
    const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, +(zoom + delta).toFixed(2)));
    onZoomChange(next);
  };

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl px-5 py-2.5 flex items-center justify-center gap-4 shadow-sm backdrop-blur-md">
      <ZoomButton disabled={zoom <= MIN_ZOOM} onClick={() => handleStep('out')}>
        <Minus size={16} />
      </ZoomButton>
      <span className="text-[11px] font-bold text-[var(--text-primary)] w-10 text-center">{formatZoom}%</span>
      <ZoomButton disabled={zoom >= MAX_ZOOM} onClick={() => handleStep('in')}>
        <Plus size={16} />
      </ZoomButton>
      <input
        type="range"
        min={MIN_ZOOM}
        max={MAX_ZOOM}
        step={0.05}
        value={zoom}
        onChange={(e) => onZoomChange(parseFloat(e.target.value))}
        className="w-24 accent-[var(--accent-color)] h-1"
      />
    </div>
  );
}

function ZoomButton({ children, ...rest }) {
  return (
    <button
      type="button"
      className="w-8 h-8 rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent-color)] hover:border-[var(--accent-color)]/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm active:scale-95"
      {...rest}
    >
      {React.cloneElement(children, { size: 14 })}
    </button>
  );
}
