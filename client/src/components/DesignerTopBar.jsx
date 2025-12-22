import React from 'react';
import { Save, Grid3X3, Grid, Lock, Unlock, Globe, Undo2, Redo2 } from 'lucide-react';
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
}) {
  const { t, language, setLanguage } = useTranslation();

  const toggleLanguage = () => {
    setLanguage(language === 'ru' ? 'en' : 'ru');
  };

  return (
    <header className="h-20 bg-white border-b px-6 flex items-center justify-between gap-6">
      <div className="flex items-center gap-4 flex-1">
        <Tooltip text={t('tooltips.topbar.templateName')}>
          <input
            type="text"
            value={templateName}
            onChange={(e) => onTemplateNameChange(e.target.value)}
            className="text-lg font-semibold text-gray-800 border rounded-lg px-4 py-2 w-72"
            placeholder={t('topbar.templateName')}
          />
        </Tooltip>

        <Tooltip text={t('tooltips.topbar.preset')}>
          <select
            value={sizePreset}
            onChange={(e) => onPresetChange(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm text-gray-600"
          >
            {presets.map((preset) => (
              <option key={preset.value} value={preset.value}>
                {t(`topbar.${preset.value}`) || preset.label}
              </option>
            ))}
          </select>
        </Tooltip>

        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500 uppercase tracking-wide">
            {t('topbar.width')}
          </label>
          <Tooltip text={t('tooltips.topbar.width')}>
            <input
              type="number"
              value={canvasSize.width}
              onChange={(e) => onSizeChange('width', parseInt(e.target.value, 10))}
              className="w-24 border rounded-lg px-3 py-2"
              min="100"
            />
          </Tooltip>
          <Tooltip text={t('tooltips.topbar.lockDimensions')}>
            <button
              type="button"
              onClick={onToggleLock}
              className="border rounded-full p-2 text-gray-600 hover:bg-gray-50"
            >
              {lockDimensions ? <Lock size={16} /> : <Unlock size={16} />}
            </button>
          </Tooltip>
          <label className="text-xs text-gray-500 uppercase tracking-wide">
            {t('topbar.height')}
          </label>
          <Tooltip text={t('tooltips.topbar.height')}>
            <input
              type="number"
              value={canvasSize.height}
              onChange={(e) => onSizeChange('height', parseInt(e.target.value, 10))}
              className="w-24 border rounded-lg px-3 py-2"
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
            className="flex items-center gap-2 border rounded-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            <Globe size={16} />
            {language.toUpperCase()}
          </button>
        </Tooltip>

        <Tooltip text={t('tooltips.topbar.showGrid')}>
          <button
            type="button"
            onClick={onToggleGrid}
            className="flex items-center gap-2 border rounded-full px-4 py-2 text-sm text-gray-600"
          >
            {showGrid ? <Grid3X3 size={16} /> : <Grid size={16} />}
            {showGrid ? t('topbar.showGrid').replace('Показать', 'Скрыть').replace('Show', 'Hide') : t('topbar.showGrid')}
          </button>
        </Tooltip>

        <div className="flex items-center gap-1 border-r pr-3 mr-3 border-gray-200">
          <Tooltip text={t('tooltips.topbar.undo')}>
            <button
              type="button"
              onClick={onUndo}
              disabled={!canUndo}
              className={`p-2 rounded-full transition-colors ${!canUndo ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Undo2 size={20} />
            </button>
          </Tooltip>
          <Tooltip text={t('tooltips.topbar.redo')}>
            <button
              type="button"
              onClick={onRedo}
              disabled={!canRedo}
              className={`p-2 rounded-full transition-colors ${!canRedo ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Redo2 size={20} />
            </button>
          </Tooltip>
        </div>

        <Tooltip text={t('tooltips.topbar.save')}>
          <button
            type="button"
            onClick={onSave}
            className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2 rounded-full shadow hover:bg-purple-700"
          >
            <Save size={18} /> {t('topbar.save')}
          </button>
        </Tooltip>
      </div>
    </header>
  );
}
