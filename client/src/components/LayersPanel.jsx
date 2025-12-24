import React from 'react';
import { ArrowUp, ArrowDown, Copy, Trash2, Lock, Unlock, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import Tooltip from './Tooltip';

export default function LayersPanel({
  elements,
  selectedId,
  onSelect,
  onDuplicate,
  onDelete,
  onMoveLayer,
  onUpdate,
}) {
  const { t } = useTranslation();
  const [editingId, setEditingId] = React.useState(null);
  const [tempName, setTempName] = React.useState('');

  const startEditing = (e, layer) => {
    e.stopPropagation();
    setEditingId(layer.id);
    setTempName(layer.name || t(`layers.${layer.type}Layer`) || layer.type.toUpperCase());
  };

  const saveName = () => {
    if (editingId) {
      onUpdate(editingId, { name: tempName });
      setEditingId(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      saveName();
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  const ordered = [...elements]
    .map((el, index) => ({ ...el, originalIndex: index }))
    .reverse();

  const getLayerName = (layer) => {
    if (layer.name) return layer.name;
    const typeKey = `${layer.type}Layer`;
    return t(`layers.${typeKey}`) || layer.type.toUpperCase();
  };

  return (
    <section>
      <header className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[11px] font-bold text-[var(--accent-color)] uppercase tracking-wider mb-0.5">
            {t('layers.title')}
          </p>
          <p className="text-[10px] text-[var(--text-secondary)] font-medium">
            {t('layers.doubleClickRename')}
          </p>
        </div>
        <div className="bg-[var(--bg-secondary)] px-2.5 py-1 rounded-xl border border-[var(--border-color)] shadow-sm">
          <span className="text-[10px] font-bold text-[var(--text-secondary)]">{elements.length}</span>
        </div>
      </header>

      <div className="space-y-2">
        {ordered.map((layer) => {
          const isSelected = layer.id === selectedId;
          const isTop = layer.originalIndex === elements.length - 1;
          const isBottom = layer.originalIndex === 0;
          const isEditing = editingId === layer.id;

          return (
            <div
              key={layer.id}
              className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition-all group ${isSelected
                ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/[0.04] shadow-lg shadow-[var(--accent-glow)] scale-[1.02]'
                : 'border-[var(--border-color)] bg-[var(--bg-secondary)] hover:border-[var(--accent-color)]/30 hover:bg-[var(--bg-main)]'
                }`}
            >
              <button
                type="button"
                className="flex-1 text-left min-w-0"
                onClick={() => !isEditing && onSelect(layer.id)}
              >
                <div className="flex items-center gap-2">
                  {layer.locked && <Lock size={12} className="text-[var(--accent-color)]/60" />}

                  {isEditing ? (
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      onBlur={saveName}
                      onKeyDown={handleKeyDown}
                      autoFocus
                      className="font-bold text-[var(--text-primary)] bg-[var(--bg-main)] border border-[var(--accent-color)] rounded-xl px-2 py-0.5 min-w-0 w-full focus:outline-none text-[11px]"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <p
                      className={`font-bold truncate text-[11px] ${isSelected ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'}`}
                      onDoubleClick={(e) => !layer.locked && startEditing(e, layer)}
                    >
                      {getLayerName(layer)}
                    </p>
                  )}
                </div>
                {!isEditing && (
                  <p className="text-[10px] font-medium text-[var(--text-secondary)]/50 mt-0.5">
                    {layer.variableName ? (
                      <span className="text-[var(--accent-color)]/70">
                        {`{{${layer.variableName}}}`}
                      </span>
                    ) : (
                      `${Math.round(layer.width)} × ${Math.round(layer.height)}`
                    )}
                  </p>
                )}
              </button>
              <div className="flex items-center gap-0.5 ml-2">
                <Tooltip text={layer.locked ? t('layers.unlock') : t('layers.lock')}>
                  <LayerIconButton onClick={() => onUpdate(layer.id, { locked: !layer.locked })}>
                    {layer.locked ? <Lock size={14} className="text-[var(--accent-color)]" /> : <Unlock size={14} />}
                  </LayerIconButton>
                </Tooltip>

                <Tooltip text={layer.visible === false ? t('layers.show') : t('layers.hide')}>
                  <LayerIconButton onClick={() => onUpdate(layer.id, { visible: layer.visible === false })}>
                    {layer.visible === false ? <EyeOff size={14} className="text-[var(--text-secondary)]/40" /> : <Eye size={14} />}
                  </LayerIconButton>
                </Tooltip>

                <div className="w-[1px] h-4 bg-[var(--border-color)] mx-1" />

                <Tooltip text={t('layers.duplicate')}>
                  <LayerIconButton onClick={() => onDuplicate(layer.id)}>
                    <Copy size={14} />
                  </LayerIconButton>
                </Tooltip>
                <Tooltip text={t('layers.delete')}>
                  <LayerIconButton
                    hoverColor="hover:bg-red-500/10 hover:text-red-500"
                    onClick={() => onDelete(layer.id)}
                  >
                    <Trash2 size={14} />
                  </LayerIconButton>
                </Tooltip>
              </div>
            </div>
          );
        })}
        {elements.length === 0 && (
          <div className="border border-dashed border-[var(--border-color)] bg-[var(--bg-main)] rounded-2xl px-4 py-10 text-center text-[11px] text-[var(--text-secondary)]/60 font-medium">
            {t('layers.noLayers')}
          </div>
        )}
      </div>
    </section>
  );
}

function LayerIconButton({ children, disabled, onClick, hoverColor = "hover:bg-[var(--bg-main)] hover:text-[var(--accent-color)]" }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${disabled ? 'text-[var(--text-secondary)]/20 cursor-not-allowed' : `text-[var(--text-secondary)] ${hoverColor}`
        }`}
    >
      {children}
    </button>
  );
}
