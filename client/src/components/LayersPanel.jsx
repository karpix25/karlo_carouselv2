import { ArrowUp, ArrowDown, Copy, Trash2, Lock, Unlock } from 'lucide-react';

export default function LayersPanel({
  elements,
  selectedId,
  onSelect,
  onDuplicate,
  onDelete,
  onMoveLayer,
  onUpdate,
}) {
  const ordered = elements
    // ... logic remains same
    .map((el, index) => ({ ...el, originalIndex: index }))
    .reverse();

  return (
    <section>
      {/* header ... */}
      <header className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Layers</p>
          <p className="text-xs text-gray-500">Use arrows to adjust stacking order</p>
        </div>
        <span className="text-xs text-gray-400">{elements.length}</span>
      </header>

      <div className="space-y-2">
        {ordered.map((layer) => {
          const isSelected = layer.id === selectedId;
          const isTop = layer.originalIndex === elements.length - 1;
          const isBottom = layer.originalIndex === 0;
          return (
            <div
              key={layer.id}
              className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm ${isSelected ? 'border-purple-400 bg-purple-50' : 'border-gray-200'
                }`}
            >
              <button
                type="button"
                className="flex-1 text-left"
                onClick={() => onSelect(layer.id)}
              >
                <div className="flex items-center gap-2">
                  {layer.locked && <Lock size={12} className="text-gray-400" />}
                  <p className="font-semibold text-gray-800">{layer.name || layer.type.toUpperCase()}</p>
                </div>
                <p className="text-xs text-gray-500">
                  {layer.variableName ? `{{${layer.variableName}}}` : `${layer.width}×${layer.height}`}
                </p>
              </button>
              <div className="flex items-center gap-1">
                <LayerIconButton onClick={() => onUpdate(layer.id, { locked: !layer.locked })}>
                  {layer.locked ? <Lock size={14} className="text-red-500" /> : <Unlock size={14} />}
                </LayerIconButton>
                <LayerIconButton disabled={isTop} onClick={() => onMoveLayer(layer.id, 'up')}>
                  <ArrowUp size={14} />
                </LayerIconButton>
                <LayerIconButton disabled={isBottom} onClick={() => onMoveLayer(layer.id, 'down')}>
                  <ArrowDown size={14} />
                </LayerIconButton>
                <LayerIconButton onClick={() => onDuplicate(layer.id)}>
                  <Copy size={14} />
                </LayerIconButton>
                <LayerIconButton onClick={() => onDelete(layer.id)}>
                  <Trash2 size={14} />
                </LayerIconButton>
              </div>
            </div>
          );
        })}
        {elements.length === 0 && (
          <div className="border border-dashed border-gray-300 rounded-xl px-4 py-6 text-center text-sm text-gray-500">
            Add elements from the toolbar to start building a layout.
          </div>
        )}
      </div>
    </section>
  );
}

function LayerIconButton({ children, disabled, onClick }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`w-8 h-8 rounded-full border flex items-center justify-center ${disabled ? 'text-gray-300 border-gray-200' : 'text-gray-600 border-gray-200 hover:border-purple-400'
        }`}
    >
      {children}
    </button>
  );
}
