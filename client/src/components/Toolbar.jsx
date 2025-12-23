import React from 'react';
import { Type, Image, Square, Sparkles, Layers } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import Tooltip from './Tooltip';

const tools = [
  { icon: Type, labelKey: 'toolbar.addText', tooltipKey: 'tooltips.toolbar.text', type: 'text' },
  { icon: Square, labelKey: 'toolbar.addShape', tooltipKey: 'tooltips.toolbar.shape', type: 'shape' },
  { icon: Image, labelKey: 'toolbar.addImage', tooltipKey: 'tooltips.toolbar.image', type: 'image' },
  { icon: Sparkles, labelKey: 'toolbar.addHighlight', tooltipKey: 'tooltips.toolbar.highlight', type: 'shape', props: { backgroundColor: '#fef08a' } },
];

export default function Toolbar({ onAdd }) {
  const { t } = useTranslation();

  return (
    <div className="w-20 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] text-[var(--text-primary)] flex flex-col items-center py-6 space-y-4 h-full">
      <div className="w-12 h-12 rounded-2xl bg-[var(--accent-color)]/10 text-[var(--accent-color)] flex items-center justify-center mb-2">
        <Layers size={22} />
      </div>
      {tools.map((tool) => (
        <Tooltip key={tool.labelKey} text={t(tool.tooltipKey)} position="right">
          <button
            type="button"
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--accent-color)] hover:border-[var(--accent-color)]/30 transition-all shadow-sm active:scale-95"
            onClick={() => onAdd(tool.type, tool.props)}
          >
            <tool.icon size={20} />
            <span className="sr-only">{t(tool.labelKey)}</span>
          </button>
        </Tooltip>
      ))}
    </div>
  );
}
