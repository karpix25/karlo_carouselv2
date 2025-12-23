import React from 'react';
import { Save, Grid3X3, Grid, Lock, Unlock, Globe, Undo2, Redo2, ChevronLeft } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import Tooltip from './Tooltip';

export default function DesignerTopBar({
  presets,
  templateName,
  onTemplateNameChange,
  canvasSize,
  onSizeChange,
  sizePreset,
  onPresetChange,
  lockDimensions,
  onToggleLock,
  showGrid,
  onToggleGrid,
  onSave,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onBack,
}) {
  const { t, language, setLanguage } = useTranslation();

  const toggleLanguage = () => {
    setLanguage(language === 'ru' ? 'en' : 'ru');
  };

  return (
    <header className="h-20 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] px-6 flex items-center justify-between gap-6">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onBack}
          className="p-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-[var(--text-secondary)] hover:text-[var(--accent-color)] hover:border-[var(--accent-color)]/30 transition-all mr-2"
        >
          <ChevronLeft size={20} />
        </button>
        <Tooltip text={t('tooltips.topbar.templateName')}>
          <input
            type="text"
            value={templateName}
            onChange={(e) => onTemplateNameChange(e.target.value)}
            className="text-lg font-bold text-[var(--text-primary)] bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/20 focus:border-[var(--accent-color)] transition-all"
            placeholder={t('topbar.templateName')}
          />
        </Tooltip>

        <Tooltip text={t('tooltips.topbar.preset')}>
          <select
            value={sizePreset}
            onChange={(e) => onPresetChange(e.target.value)}
            className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-color)]/50 transition-all font-medium"
          >
            {presets.map((preset) => (
              <option key={preset.value} value={preset.value}>
                {t(`topbar.${preset.value}`) || preset.label}
              </option>
            ))}
          </select>
        </Tooltip>

        <div className="flex items-center gap-2">
          <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
            {t('topbar.width')}
          </label>
          <Tooltip text={t('tooltips.topbar.width')}>
            <input
              type="number"
              value={canvasSize.width}
              onChange={(e) => onSizeChange('width', parseInt(e.target.value, 10))}
              className="w-20 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] transition-all"
              min="100"
            />
          </Tooltip>
          <Tooltip text={t('tooltips.topbar.lockDimensions')}>
            <button
              type="button"
              onClick={onToggleLock}
              className={`border rounded-full p-2.5 transition-all ${lockDimensions ? 'bg-[var(--accent-color)] border-[var(--accent-color)] text-white shadow-lg shadow-[var(--accent-glow)]' : 'bg-[var(--bg-main)] border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              {lockDimensions ? <Lock size={14} /> : <Unlock size={14} />}
            </button>
          </Tooltip>
          <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
            {t('topbar.height')}
          </label>
          <Tooltip text={t('tooltips.topbar.height')}>
            <input
              type="number"
              value={canvasSize.height}
              onChange={(e) => onSizeChange('height', parseInt(e.target.value, 10))}
              className="w-20 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] transition-all"
              min="100"
            />
          </Tooltip>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Tooltip text={language === 'ru' ? 'Switch to English' : 'Переключить на русский'}>
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-2 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-full px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
          >
            <Globe size={14} />
            {language.toUpperCase()}
          </button>
        </Tooltip>

        <Tooltip text={t('tooltips.topbar.showGrid')}>
          <button
            type="button"
            onClick={onToggleGrid}
            className={`flex items-center gap-2 border rounded-full px-4 py-2 text-sm font-medium transition-all ${showGrid ? 'bg-[var(--accent-color)] border-[var(--accent-color)] text-white' : 'bg-[var(--bg-main)] border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            {showGrid ? <Grid3X3 size={14} /> : <Grid size={14} />}
            {showGrid ? t('topbar.showGrid').replace('Показать', 'Скрыть').replace('Show', 'Hide') : t('topbar.showGrid')}
          </button>
        </Tooltip>

        <div className="flex items-center gap-1 border-r border-[var(--border-color)] pr-3 mr-3">
          <Tooltip text={t('tooltips.topbar.undo')}>
            <button
              type="button"
              onClick={onUndo}
              disabled={!canUndo}
              className={`p-2.5 rounded-full transition-all ${!canUndo ? 'text-[var(--text-secondary)]/30 cursor-not-allowed' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-main)]'}`}
            >
              <Undo2 size={18} />
            </button>
          </Tooltip>
          <Tooltip text={t('tooltips.topbar.redo')}>
            <button
              type="button"
              onClick={onRedo}
              disabled={!canRedo}
              className={`p-2.5 rounded-full transition-all ${!canRedo ? 'text-[var(--text-secondary)]/30 cursor-not-allowed' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-main)]'}`}
            >
              <Redo2 size={18} />
            </button>
          </Tooltip>
        </div>

        <Tooltip text={t('tooltips.topbar.save')}>
          <button
            type="button"
            onClick={onSave}
            className="flex items-center gap-2 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white px-6 py-2.5 rounded-2xl font-bold transition-all shadow-lg shadow-[var(--accent-glow)] active:scale-95"
          >
            <Save size={18} /> {t('topbar.save')}
          </button>
        </Tooltip>
      </div>
    </header>
  );
}
