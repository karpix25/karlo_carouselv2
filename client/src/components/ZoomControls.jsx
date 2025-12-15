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
    <div className="bg-white border-t px-6 py-3 flex items-center justify-center gap-3">
      <ZoomButton disabled={zoom <= MIN_ZOOM} onClick={() => handleStep('out')}>
        <Minus size={16} />
      </ZoomButton>
      <span className="text-sm font-semibold text-gray-700 w-14 text-center">{formatZoom}%</span>
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
        className="flex-1"
      />
    </div>
  );
}

function ZoomButton({ children, ...rest }) {
  return (
    <button
      type="button"
      className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center"
      {...rest}
    >
      {children}
    </button>
  );
}
