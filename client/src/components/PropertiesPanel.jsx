import React from 'react';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  ArrowUpToLine,
  ArrowDownToLine,
  MoveVertical,
  Type,
  Check,
  ChevronDown,
  RotateCw,
  Plus,
  Trash2,
  ArrowRightLeft,
  Link,
  Unlink,
  Layers,
} from 'lucide-react';
import FONT_OPTIONS, { DEFAULT_FONT, getFontStack } from '../constants/fonts';
import { useTranslation } from '../hooks/useTranslation';

export default function PropertiesPanel({ element, onChange, canvasSize }) {
  const { t } = useTranslation();

  if (!element) {
    return (
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-10 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-[var(--bg-main)] rounded-2xl flex items-center justify-center mb-4 text-[var(--text-secondary)]/50">
          <Layers size={32} />
        </div>
        <p className="text-sm font-medium text-[var(--text-secondary)] max-w-[180px]">
          {t('properties.selectLayer')}
        </p>
      </div>
    );
  }

  const isText = element.type === 'text';
  const isImage = element.type === 'image';
  const isShape = element.type === 'shape';

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    if (value === '') {
      onChange({ [field]: '' });
      return;
    }
    const num = parseFloat(value);
    if (!Number.isNaN(num)) {
      onChange({ [field]: num });
    }
  };

  const toggleStyle = (style) => {
    if (style === 'bold') {
      onChange({ fontWeight: element.fontWeight === 700 ? 400 : 700 });
    } else if (style === 'italic') {
      onChange({ fontStyle: element.fontStyle === 'italic' ? 'normal' : 'italic' });
    } else if (style === 'underline') {
      const current = element.textDecoration || 'none';
      onChange({ textDecoration: current.includes('underline') ? current.replace('underline', '').trim() || 'none' : `${current} underline`.trim() });
    } else if (style === 'strikethrough') {
      const current = element.textDecoration || 'none';
    }
  };

  const align = (direction) => {
    if (!element || !canvasSize) return;
    const updates = {};
    switch (direction) {
      case 'left': updates.x = 0; break;
      case 'center': updates.x = Math.round((canvasSize.width - element.width) / 2); break;
      case 'right': updates.x = canvasSize.width - element.width; break;
      case 'top': updates.y = 0; break;
      case 'middle': updates.y = Math.round((canvasSize.height - element.height) / 2); break;
      case 'bottom': updates.y = canvasSize.height - element.height; break;
    }
    onChange(updates);
  };

  const currentFontFamily = element.fontFamily || DEFAULT_FONT;

  const [showCustomFont, setShowCustomFont] = React.useState(false);
  const [collapsedSections, setCollapsedSections] = React.useState({});

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  React.useEffect(() => {
    setCollapsedSections({});
    setShowCustomFont(false);
  }, [element?.id]);

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-5 space-y-6 shadow-sm overflow-y-auto max-h-full scrollbar-hide">
      {isText && (
        <>
          {/* TEXT STYLE SECTION */}
          <CollapsibleSection
            title={t('properties.textStyle')}
            isCollapsed={collapsedSections.textStyle}
            onToggle={() => toggleSection('textStyle')}
          >

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{t('properties.font')}</label>
              <select
                value={currentFontFamily}
                onChange={(e) => onChange({ fontFamily: e.target.value })}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)]/50 transition-all font-medium"
              >
                {FONT_OPTIONS.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
                {!FONT_OPTIONS.find(f => f.value === currentFontFamily) && (
                  <option value={currentFontFamily}>{currentFontFamily}</option>
                )}
              </select>

              {showCustomFont ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={t('properties.enterFontName')}
                    className="flex-1 border rounded-lg px-3 py-2 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onChange({ fontFamily: e.currentTarget.value });
                        setShowCustomFont(false);
                      }
                    }}
                    onBlur={(e) => {
                      if (e.target.value) onChange({ fontFamily: e.target.value });
                    }}
                  />
                  <button
                    onClick={() => setShowCustomFont(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowCustomFont(true)}
                  className="text-purple-600 text-sm font-medium hover:underline"
                >
                  {t('properties.uploadCustomFont')}
                </button>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{t('properties.contentPreview')}</label>
              <textarea
                value={element.content_preview || ''}
                onChange={(e) => onChange({ content_preview: e.target.value })}
                placeholder={t('properties.enterPreviewText')}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] h-24 resize-none focus:outline-none focus:border-[var(--accent-color)]/50 transition-all placeholder:text-[var(--text-secondary)]/30"
              />
              <p className="text-[10px] text-[var(--text-secondary)]/60 font-medium leading-relaxed">
                {t('properties.contentPreviewHint')}
              </p>
            </div>

            <ColorField
              label={t('properties.color')}
              value={element.color}
              onChange={(color) => onChange({ color })}
              dynamicFlag={element.colorDynamic}
              onDynamicChange={(checked) => onChange({ colorDynamic: checked })}
              t={t}
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{t('properties.size')}</label>
                <div className="relative">
                  <input
                    type="number"
                    value={element.fontSize ?? 16}
                    onChange={handleInputChange('fontSize')}
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] transition-all"
                  />
                  <span className="absolute right-3 top-2 text-[var(--text-secondary)]/40 text-[10px] font-bold">PX</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{t('properties.spacing')}</label>
                <div className="relative">
                  <input
                    type="number"
                    value={element.letterSpacing ?? 0}
                    onChange={handleInputChange('letterSpacing')}
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] transition-all"
                  />
                  <span className="absolute right-3 top-2 text-[var(--text-secondary)]/40 text-[10px] font-bold">PX</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{t('properties.resizing')}</label>
              <select
                value={element.resizing || 'plain'}
                onChange={(e) => onChange({ resizing: e.target.value })}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)]/50 transition-all font-medium"
              >
                <option value="plain">{t('properties.plain')}</option>
                <option value="fitty">{t('properties.fitty')}</option>
                <option value="clamp">{t('properties.clamp')}</option>
                <option value="single">{t('properties.singleLine')}</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{t('properties.style')}</label>
              <div className="flex gap-2">
                <StyleButton
                  active={element.fontStyle === 'italic'}
                  onClick={() => toggleStyle('italic')}
                  icon={<Italic size={18} />}
                />
                <StyleButton
                  active={(element.textDecoration || '').includes('underline')}
                  onClick={() => toggleStyle('underline')}
                  icon={<Underline size={18} />}
                />
                <StyleButton
                  active={(element.textDecoration || '').includes('line-through')}
                  onClick={() => toggleStyle('strikethrough')}
                  icon={<Strikethrough size={18} />}
                />
                <StyleButton
                  active={element.fontWeight === 700}
                  onClick={() => toggleStyle('bold')}
                  icon={<Bold size={18} />}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{t('properties.transform')}</label>
              <select
                value={element.textTransform || 'none'}
                onChange={(e) => onChange({ textTransform: e.target.value })}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)]/50 transition-all font-medium"
              >
                <option value="none">{t('properties.noTransformation')}</option>
                <option value="uppercase">{t('properties.uppercase')}</option>
                <option value="lowercase">{t('properties.lowercase')}</option>
                <option value="capitalize">{t('properties.capitalize')}</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{t('properties.highlighting')}</label>
              <ColorField
                label=""
                value={element.highlightColor}
                onChange={(color) => onChange({ highlightColor: color })}
                dynamicFlag={element.highlightColorDynamic}
                onDynamicChange={(checked) => onChange({ highlightColorDynamic: checked })}
                t={t}
              />

              {/* Highlight Mode Toggle */}
              <div className="space-y-2 mt-2">
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{t('properties.highlightMode')}</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onChange({ highlightMode: 'background' })}
                    className={`px-3 py-2 text-xs rounded-xl border transition-all font-bold ${(!element.highlightMode || element.highlightMode === 'background')
                      ? 'bg-[var(--accent-color)] border-[var(--accent-color)] text-white shadow-md shadow-[var(--accent-glow)]'
                      : 'bg-[var(--bg-main)] border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                  >
                    {t('properties.backgroundMode')}
                  </button>
                  <button
                    onClick={() => onChange({ highlightMode: 'text' })}
                    className={`px-3 py-2 text-xs rounded-xl border transition-all font-bold ${element.highlightMode === 'text'
                      ? 'bg-[var(--accent-color)] border-[var(--accent-color)] text-white shadow-md shadow-[var(--accent-glow)]'
                      : 'bg-[var(--bg-main)] border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                  >
                    {t('properties.textColorMode')}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-2">
                <Field label="Padding">
                  <div className="relative">
                    <input
                      type="number"
                      value={element.highlightPadding ?? 3}
                      onChange={handleInputChange('highlightPadding')}
                      className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] transition-all"
                    />
                    <span className="absolute right-3 top-2 text-[var(--text-secondary)]/40 text-[10px] font-bold">PX</span>
                  </div>
                </Field>
                <Field label="Radius">
                  <div className="relative">
                    <input
                      type="number"
                      value={element.highlightRadius ?? 6}
                      onChange={handleInputChange('highlightRadius')}
                      className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] transition-all"
                    />
                    <span className="absolute right-3 top-2 text-[var(--text-secondary)]/40 text-[10px] font-bold">PX</span>
                  </div>
                </Field>
              </div>
              <p className="text-[10px] text-[var(--text-secondary)]/40 mt-2 font-medium italic">
                {t('properties.highlightingHint')}
              </p>
            </div>
          </CollapsibleSection>

          {/* QUOTE Section */}
          <CollapsibleSection
            title={t('properties.quote')}
            isCollapsed={collapsedSections.quote}
            onToggle={() => toggleSection('quote')}
          >
            <label className="flex items-center gap-3 mb-4 p-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl cursor-pointer hover:border-[var(--accent-color)]/30 transition-all">
              <input
                type="checkbox"
                checked={element.quote?.enabled || false}
                onChange={(e) => onChange({
                  quote: { ...element.quote, enabled: e.target.checked }
                })}
                className="w-4 h-4 accent-[var(--accent-color)] rounded-md cursor-pointer"
              />
              <span className="text-sm font-bold text-[var(--text-primary)]">{t('properties.enableQuote')}</span>
            </label>

            {element.quote?.enabled && (
              <div className="space-y-3">
                <ColorField
                  label={t('properties.borderColor')}
                  value={element.quote.borderColor || '#9333ea'}
                  onChange={(color) => onChange({
                    quote: { ...element.quote, borderColor: color }
                  })}
                  dynamicFlag={element.quoteBorderColorDynamic}
                  onDynamicChange={(checked) => onChange({ quoteBorderColorDynamic: checked })}
                  t={t}
                />

                <ColorField
                  label={t('properties.backgroundColor')}
                  value={element.quote.backgroundColor || '#f3e8ff'}
                  onChange={(color) => onChange({
                    quote: { ...element.quote, backgroundColor: color }
                  })}
                  dynamicFlag={element.quoteBackgroundColorDynamic}
                  onDynamicChange={(checked) => onChange({ quoteBackgroundColorDynamic: checked })}
                  t={t}
                />

                <Field label={t('properties.borderWidth')}>
                  <div className="flex items-center gap-4 py-1">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={element.quote.borderWidth || 4}
                      onChange={(e) => onChange({
                        quote: { ...element.quote, borderWidth: parseInt(e.target.value) }
                      })}
                      className="flex-1 accent-[var(--accent-color)] h-1.5"
                    />
                    <span className="text-xs font-bold text-[var(--text-secondary)] w-10 text-right">
                      {element.quote.borderWidth || 4}PX
                    </span>
                  </div>
                </Field>

                <p className="text-[10px] text-[var(--text-secondary)]/40 mt-2 font-medium italic">
                  {t('properties.quoteHint')}
                </p>
              </div>
            )}
          </CollapsibleSection>

          <hr className="border-gray-100" />

          {/* TEXTBOX SECTION */}
          <CollapsibleSection
            title={t('properties.textbox')}
            isCollapsed={collapsedSections.textbox}
            onToggle={() => toggleSection('textbox')}
          >

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{t('properties.lineHeight')}</label>
              <input
                type="number"
                step="0.1"
                value={element.lineHeight ?? 1.2}
                onChange={handleInputChange('lineHeight')}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-500">{t('properties.background')}</label>
              <ColorField
                label=""
                value={element.backgroundColor}
                onChange={(color) => onChange({ backgroundColor: color })}
                dynamicFlag={element.backgroundColorDynamic}
                onDynamicChange={(checked) => onChange({ backgroundColorDynamic: checked })}
                t={t}
              />

              <div className="flex items-center gap-3 pt-1">
                <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase w-16">{t('properties.opacity')}</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={Math.round((element.backgroundOpacity ?? 1) * 100)}
                  onChange={(e) => onChange({ backgroundOpacity: parseInt(e.target.value) / 100 })}
                  className="flex-1 accent-[var(--accent-color)] h-1.5"
                />
                <span className="text-[10px] font-bold text-[var(--text-secondary)] w-10 text-right">{Math.round((element.backgroundOpacity ?? 1) * 100)}%</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{t('properties.padding')}</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={element.padding ?? 0}
                      onChange={handleInputChange('padding')}
                      className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] transition-all"
                    />
                    <span className="absolute right-3 top-2 text-[var(--text-secondary)]/40 text-[10px] font-bold">PX</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{t('properties.radius')}</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={element.borderRadius ?? 0}
                      onChange={handleInputChange('borderRadius')}
                      className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] transition-all"
                    />
                    <span className="absolute right-3 top-2 text-[var(--text-secondary)]/40 text-[10px] font-bold">PX</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onChange({ backgroundColor: '', backgroundOpacity: 1, padding: 0, borderRadius: 0 })}
                className="text-[10px] font-bold text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-all pt-2 uppercase tracking-wider"
              >
                {t('properties.clearBackground')}
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{t('properties.alignment')}</label>
              <div className="flex gap-2">
                <StyleButton
                  active={element.textAlign === 'left' || !element.textAlign}
                  onClick={() => onChange({ textAlign: 'left' })}
                  icon={<AlignLeft size={18} />}
                />
                <StyleButton
                  active={element.textAlign === 'center'}
                  onClick={() => onChange({ textAlign: 'center' })}
                  icon={<AlignCenter size={18} />}
                />
                <StyleButton
                  active={element.textAlign === 'right'}
                  onClick={() => onChange({ textAlign: 'right' })}
                  icon={<AlignRight size={18} />}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{t('properties.anchor')}</label>
              <div className="flex gap-2">
                <StyleButton
                  active={element.verticalAlign === 'top' || !element.verticalAlign}
                  onClick={() => onChange({ verticalAlign: 'top' })}
                  icon={<ArrowUpToLine size={18} />}
                />
                <StyleButton
                  active={element.verticalAlign === 'middle'}
                  onClick={() => onChange({ verticalAlign: 'middle' })}
                  icon={<MoveVertical size={18} />}
                />
                <StyleButton
                  active={element.verticalAlign === 'bottom'}
                  onClick={() => onChange({ verticalAlign: 'bottom' })}
                  icon={<ArrowDownToLine size={18} />}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{t('properties.wordBreak')}</label>
              <button
                onClick={() => onChange({ wordBreak: !element.wordBreak })}
                className={`w-11 h-6 rounded-full transition-all relative ${element.wordBreak ? 'bg-[var(--accent-color)]' : 'bg-[var(--bg-main)] border border-[var(--border-color)]'
                  }`}
              >
                <div
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${element.wordBreak ? 'translate-x-5' : ''
                    }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{t('properties.exportCoordinates')}</label>
              <button
                onClick={() => onChange({ exportCoordinates: !element.exportCoordinates })}
                className={`w-11 h-6 rounded-full transition-all relative ${element.exportCoordinates ? 'bg-[var(--accent-color)]' : 'bg-[var(--bg-main)] border border-[var(--border-color)]'
                  }`}
              >
                <div
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${element.exportCoordinates ? 'translate-x-5' : ''
                    }`}
                />
              </button>
            </div>
          </CollapsibleSection>
        </>
      )}

      {/* Common Properties for all types */}
      <CollapsibleSection
        title={t('properties.layout')}
        isCollapsed={collapsedSections.layout}
        onToggle={() => toggleSection('layout')}
      >
        <div className="space-y-2 mb-4">
          <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{t('properties.quickAlign')}</label>
          <div className="flex gap-2">
            <StyleButton onClick={() => align('left')} icon={<AlignLeft size={16} />} />
            <StyleButton onClick={() => align('center')} icon={<AlignCenter size={16} />} />
            <StyleButton onClick={() => align('right')} icon={<AlignRight size={16} />} />
            <div className="w-1" />
            <StyleButton onClick={() => align('top')} icon={<ArrowUpToLine size={16} />} />
            <StyleButton onClick={() => align('middle')} icon={<MoveVertical size={16} />} />
            <StyleButton onClick={() => align('bottom')} icon={<ArrowDownToLine size={16} />} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label={t('properties.x')}>
            <input
              type="number"
              value={element.x ?? 0}
              onChange={handleInputChange('x')}
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] transition-all"
            />
          </Field>
          <Field label={t('properties.y')}>
            <input
              type="number"
              value={element.y ?? 0}
              onChange={handleInputChange('y')}
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] transition-all"
            />
          </Field>
          <Field label={t('properties.width')}>
            <input
              type="number"
              value={element.width ?? 0}
              onChange={handleInputChange('width')}
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] transition-all"
            />
          </Field>
          <Field label={t('properties.height')}>
            <input
              type="number"
              value={element.height ?? 0}
              onChange={handleInputChange('height')}
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] transition-all"
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-3">
          <Field label={t('properties.rotation')}>
            <div className="relative">
              <input
                type="number"
                value={element.rotation ?? 0}
                onChange={handleInputChange('rotation')}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] transition-all pr-8"
              />
              <div className="absolute right-3 top-2.5 text-[var(--text-secondary)]/30">
                <RotateCw size={14} />
              </div>
            </div>
          </Field>
          <Field label={t('properties.opacity')}>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={element.opacity ?? 1}
                onChange={(e) => onChange({ opacity: parseFloat(e.target.value) })}
                className="flex-1 accent-[var(--accent-color)] h-1.5"
              />
              <span className="text-[10px] font-bold text-[var(--text-secondary)] w-8 text-right">{Math.round((element.opacity ?? 1) * 100)}%</span>
            </div>
          </Field>
        </div>
      </CollapsibleSection>

      {/* Image Specific */}
      {isImage && (
        <CollapsibleSection
          title={t('properties.image')}
          isCollapsed={collapsedSections.image}
          onToggle={() => toggleSection('image')}
        >
          <Field label={t('properties.url')}>
            <input
              type="text"
              value={element.content || ''}
              onChange={(e) => onChange({ content: e.target.value })}
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] transition-all"
            />
          </Field>
          <Field label={t('properties.fit')}>
            <select
              value={element.fit || 'cover'}
              onChange={(e) => onChange({ fit: e.target.value })}
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)]/50 transition-all font-medium"
            >
              <option value="cover">{t('properties.cover')}</option>
              <option value="contain">{t('properties.contain')}</option>
              <option value="fill">{t('properties.fill')}</option>
            </select>
          </Field>
          <Field label={t('properties.radius')}>
            <div className="relative">
              <input
                type="number"
                value={element.borderRadius ?? 0}
                onChange={handleInputChange('borderRadius')}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] transition-all"
              />
              <span className="absolute right-3 top-2 text-[var(--text-secondary)]/40 text-[10px] font-bold">PX</span>
            </div>
          </Field>
        </CollapsibleSection>
      )}

      {/* Shadow Section */}
      <CollapsibleSection
        title={t('properties.shadow')}
        isCollapsed={collapsedSections.shadow}
        onToggle={() => toggleSection('shadow')}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{t('properties.enableShadow')}</label>
            <button
              onClick={() => onChange({ shadow: element.shadow ? null : { color: '#000000', blur: 10, x: 0, y: 4 } })}
              className={`w-11 h-6 rounded-full transition-all relative ${element.shadow ? 'bg-[var(--accent-color)]' : 'bg-[var(--bg-main)] border border-[var(--border-color)]'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${element.shadow ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>

          {element.shadow && (
            <>
              <ColorField
                label={t('properties.color') || 'Color'}
                value={element.shadow.color}
                onChange={(color) => onChange({ shadow: { ...element.shadow, color } })}
                dynamicFlag={element.shadowColorDynamic}
                onDynamicChange={(checked) => onChange({ shadowColorDynamic: checked })}
                t={t}
              />

              <div className="grid grid-cols-2 gap-3">
                <Field label={t('properties.xOffset')}>
                  <div className="relative">
                    <input
                      type="number"
                      value={element.shadow.x ?? 0}
                      onChange={(e) => {
                        const val = e.target.value;
                        onChange({ shadow: { ...element.shadow, x: val === '' ? '' : parseInt(val) || 0 } });
                      }}
                      className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] transition-all"
                    />
                    <span className="absolute right-3 top-2 text-[var(--text-secondary)]/40 text-[10px] font-bold">PX</span>
                  </div>
                </Field>
                <Field label={t('properties.yOffset')}>
                  <div className="relative">
                    <input
                      type="number"
                      value={element.shadow.y ?? 0}
                      onChange={(e) => {
                        const val = e.target.value;
                        onChange({ shadow: { ...element.shadow, y: val === '' ? '' : parseInt(val) || 0 } });
                      }}
                      className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] transition-all"
                    />
                    <span className="absolute right-3 top-2 text-[var(--text-secondary)]/40 text-[10px] font-bold">PX</span>
                  </div>
                </Field>
              </div>

              <Field label={t('properties.blurRadius')}>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={element.shadow.blur || 0}
                    onChange={(e) => onChange({ shadow: { ...element.shadow, blur: parseInt(e.target.value) } })}
                    className="flex-1 accent-[var(--accent-color)] h-1.5"
                  />
                  <div className="text-right text-[10px] font-bold text-[var(--text-secondary)] w-10">{element.shadow.blur || 0}PX</div>
                </div>
              </Field>

              <Field label={t('properties.opacity')}>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={(element.shadow.opacity ?? 1) * 100}
                    onChange={(e) => onChange({ shadow: { ...element.shadow, opacity: parseInt(e.target.value) / 100 } })}
                    className="flex-1 accent-[var(--accent-color)] h-1.5"
                  />
                  <div className="text-right text-[10px] font-bold text-[var(--text-secondary)] w-10">{Math.round((element.shadow.opacity ?? 1) * 100)}%</div>
                </div>
              </Field>
            </>
          )}
        </div>
      </CollapsibleSection>

      {/* Stroke Section */}
      <CollapsibleSection
        title={t('properties.stroke')}
        isCollapsed={collapsedSections.stroke}
        onToggle={() => toggleSection('stroke')}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{t('properties.enableStroke')}</label>
            <button
              onClick={() => onChange({ stroke: element.stroke ? null : { color: '#000000', width: 2 } })}
              className={`w-11 h-6 rounded-full transition-all relative ${element.stroke ? 'bg-[var(--accent-color)]' : 'bg-[var(--bg-main)] border border-[var(--border-color)]'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${element.stroke ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>

          {element.stroke && (
            <>
              <ColorField
                label={t('properties.color') || 'Color'}
                value={element.stroke.color}
                onChange={(color) => onChange({ stroke: { ...element.stroke, color } })}
                dynamicFlag={element.strokeColorDynamic}
                onDynamicChange={(checked) => onChange({ strokeColorDynamic: checked })}
                t={t}
              />

              <Field label={t('properties.width')}>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={element.stroke.width || 0}
                    onChange={(e) => onChange({ stroke: { ...element.stroke, width: parseInt(e.target.value) } })}
                    className="flex-1 accent-[var(--accent-color)] h-1.5"
                  />
                  <div className="text-right text-[10px] font-bold text-[var(--text-secondary)] w-10">{element.stroke.width || 0}PX</div>
                </div>
              </Field>

              {/* Contour Mode for Images */}
              {isImage && (
                <div className="flex items-center justify-between pt-2 border-t">
                  <label className="text-xs text-gray-500">{t('properties.contourMode')}</label>
                  <input
                    type="checkbox"
                    checked={element.contour || false}
                    onChange={(e) => onChange({ contour: e.target.checked })}
                    className="w-4 h-4 accent-purple-600 rounded"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </CollapsibleSection>

      {/* Shape Specific */}
      {isShape && (
        <CollapsibleSection
          title={t('properties.shape')}
          isCollapsed={collapsedSections.shape}
          onToggle={() => toggleSection('shape')}
        >
          <div className="space-y-3">
            <div className="flex gap-2 mb-4 p-1 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl">
              <button
                onClick={() => onChange({ gradient: { ...element.gradient, enabled: false } })}
                className={`flex-1 text-[11px] font-bold py-2 rounded-lg transition-all ${!element.gradient?.enabled ? 'bg-[var(--accent-color)] text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              >
                {t('properties.solid')}
              </button>
              <button
                onClick={() => {
                  const defaults = {
                    start: element.backgroundColor || '#000000',
                    end: '#ffffff',
                    angle: 90
                  };
                  onChange({
                    gradient: {
                      ...defaults,
                      ...element.gradient,
                      enabled: true
                    }
                  });
                }}
                className={`flex-1 text-[11px] font-bold py-2 rounded-lg transition-all ${element.gradient?.enabled ? 'bg-[var(--accent-color)] text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              >
                {t('properties.gradient')}
              </button>
            </div>

            {!element.gradient?.enabled ? (
              <ColorField
                label={t('properties.color') || 'Color'}
                value={element.backgroundColor}
                onChange={(color) => onChange({ backgroundColor: color })}
                dynamicFlag={element.backgroundColorDynamic}
                onDynamicChange={(checked) => onChange({ backgroundColorDynamic: checked })}
                t={t}
              />
            ) : (
              <>
                {/* Gradient Preview Bar */}
                <div
                  className="w-full h-10 rounded-xl border border-[var(--border-color)] shadow-sm mb-4 relative"
                  style={{
                    background: `linear-gradient(90deg, ${(element.gradient?.stops || [
                      { color: element.gradient?.start || '#000000', opacity: element.gradient?.startOpacity ?? 1, position: element.gradient?.startPosition ?? 0 },
                      { color: element.gradient?.end || '#ffffff', opacity: element.gradient?.endOpacity ?? 1, position: element.gradient?.endPosition ?? 100 }
                    ]).sort((a, b) => a.position - b.position)
                      .map(s => {
                        return `${hexToRgba(s.color, s.opacity ?? 1)} ${s.position}%`;
                      }).join(', ')
                      })`,
                    backgroundImage: `linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%), linear-gradient(90deg, ${(element.gradient?.stops || [
                      { color: element.gradient?.start || '#000000', opacity: element.gradient?.startOpacity ?? 1, position: element.gradient?.startPosition ?? 0 },
                      { color: element.gradient?.end || '#ffffff', opacity: element.gradient?.endOpacity ?? 1, position: element.gradient?.endPosition ?? 100 }
                    ]).sort((a, b) => a.position - b.position)
                      .map(s => {
                        return `${hexToRgba(s.color, s.opacity ?? 1)} ${s.position}%`;
                      }).join(', ')
                      })`,
                    backgroundSize: '8px 8px, 8px 8px, 8px 8px, 8px 8px, 100% 100%',
                    backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px, 0 0',
                    backgroundColor: '#fff'
                  }}
                />

                {/* Stops List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{t('properties.stops')}</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          let stops = element.gradient?.stops || [
                            { id: '1', color: element.gradient?.start || '#000000', opacity: element.gradient?.startOpacity ?? 1, position: element.gradient?.startPosition ?? 0 },
                            { id: '2', color: element.gradient?.end || '#ffffff', opacity: element.gradient?.endOpacity ?? 1, position: element.gradient?.endPosition ?? 100 }
                          ];
                          // Reverse positions
                          stops = stops.map(s => ({ ...s, position: 100 - s.position }));
                          onChange({ gradient: { ...element.gradient, stops } });
                        }}
                        className="p-1.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
                        title={t('properties.reverseGradient')}
                      >
                        <ArrowRightLeft size={14} />
                      </button>
                      <button
                        onClick={() => {
                          const stops = element.gradient?.stops ? [...element.gradient.stops] : [
                            { id: Date.now() + '1', color: element.gradient?.start || '#000000', opacity: element.gradient?.startOpacity ?? 1, position: element.gradient?.startPosition ?? 0 },
                            { id: Date.now() + '2', color: element.gradient?.end || '#ffffff', opacity: element.gradient?.endOpacity ?? 1, position: element.gradient?.endPosition ?? 100 }
                          ];
                          // Add new stop at 50%
                          stops.push({ id: Date.now().toString(), color: '#888888', opacity: 1, position: 50 });
                          onChange({ gradient: { ...element.gradient, stops } });
                        }}
                        className="p-1.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
                        title={t('properties.addStop')}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {(element.gradient?.stops || [
                    { id: '1', color: element.gradient?.start || '#000000', opacity: element.gradient?.startOpacity ?? 1, position: element.gradient?.startPosition ?? 0 },
                    { id: '2', color: element.gradient?.end || '#ffffff', opacity: element.gradient?.endOpacity ?? 1, position: element.gradient?.endPosition ?? 100 }
                  ])
                    .sort((a, b) => a.position - b.position)
                    .map((stop, index, arr) => (
                      <div key={stop.id || index} className="p-3 bg-[var(--bg-main)] rounded-xl border border-[var(--border-color)] relative group transition-all hover:border-[var(--accent-color)]/30">
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className="w-8 h-8 rounded border shadow-sm overflow-hidden relative"
                            style={{
                              backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                              backgroundSize: '8px 8px',
                              backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
                              backgroundColor: '#fff'
                            }}
                          >
                            <input
                              type="color"
                              value={stop.color}
                              onChange={(e) => {
                                const newStops = (element.gradient?.stops || arr).map(s => s.id === stop.id || (s === stop) ? { ...s, color: e.target.value } : s);
                                onChange({ gradient: { ...element.gradient, stops: newStops } });
                              }}
                              className="opacity-0 w-full h-full cursor-pointer absolute inset-0"
                            />
                            <div className="w-full h-full pointer-events-none" style={{ backgroundColor: hexToRgba(stop.color, stop.opacity ?? 1) }} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 text-xs">#</span>
                              <input
                                type="text"
                                value={stop.color.replace('#', '').toUpperCase()}
                                onChange={(e) => {
                                  const newStops = (element.gradient?.stops || arr).map(s => s.id === stop.id || (s === stop) ? { ...s, color: `#${e.target.value}` } : s);
                                  onChange({ gradient: { ...element.gradient, stops: newStops } });
                                }}
                                className="w-full bg-transparent text-xs font-mono outline-none"
                              />
                            </div>
                          </div>
                          {arr.length > 2 && (
                            <button
                              onClick={() => {
                                const newStops = arr.filter(s => s !== stop);
                                onChange({ gradient: { ...element.gradient, stops: newStops } });
                              }}
                              className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>

                        <div className="space-y-1">
                          {/* Position */}
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase w-8">{t('properties.posShort') || 'Pos'}</span>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={stop.position}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                const newStops = (element.gradient?.stops || arr).map(s => s.id === stop.id || (s === stop) ? { ...s, position: val } : s);
                                onChange({ gradient: { ...element.gradient, stops: newStops } });
                              }}
                              className="flex-1 accent-[var(--accent-color)] h-1.5"
                            />
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={stop.position}
                              onChange={(e) => {
                                const val = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                                const newStops = (element.gradient?.stops || arr).map(s => s.id === stop.id || (s === stop) ? { ...s, position: val } : s);
                                onChange({ gradient: { ...element.gradient, stops: newStops } });
                              }}
                              className="w-10 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-1 py-0.5 text-[10px] font-bold text-[var(--text-primary)] text-right focus:outline-none focus:border-[var(--accent-color)]"
                            />
                          </div>
                          {/* Opacity */}
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase w-8">{t('properties.opacShort') || 'Opac'}</span>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={Math.round(stop.opacity * 100)}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) / 100;
                                const newStops = (element.gradient?.stops || arr).map(s => s.id === stop.id || (s === stop) ? { ...s, opacity: val } : s);
                                onChange({ gradient: { ...element.gradient, stops: newStops } });
                              }}
                              className="flex-1 accent-[var(--accent-color)] h-1.5"
                            />
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={Math.round(stop.opacity * 100)}
                              onChange={(e) => {
                                const val = Math.min(1, Math.max(0, (parseInt(e.target.value) || 0) / 100));
                                const newStops = (element.gradient?.stops || arr).map(s => s.id === stop.id || (s === stop) ? { ...s, opacity: val } : s);
                                onChange({ gradient: { ...element.gradient, stops: newStops } });
                              }}
                              className="w-10 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-1 py-0.5 text-[10px] font-bold text-[var(--text-primary)] text-right focus:outline-none focus:border-[var(--accent-color)]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                <Field label={t('properties.angle')}>
                  <div className="flex items-center gap-4 py-1">
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={element.gradient?.angle || 90}
                      onChange={(e) => onChange({ gradient: { ...element.gradient, angle: parseInt(e.target.value) } })}
                      className="flex-1 accent-[var(--accent-color)] h-1.5"
                    />
                    <div className="text-right text-[10px] font-bold text-[var(--text-secondary)] w-10">{element.gradient?.angle || 90}°</div>
                  </div>
                </Field>
              </>
            )}
          </div>
          <Field label="Radius">
            <div className="relative">
              <input
                type="number"
                value={element.borderRadius || 0}
                onChange={handleInputChange('borderRadius')}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] transition-all"
              />
              <span className="absolute right-3 top-2 text-[var(--text-secondary)]/40 text-[10px] font-bold">PX</span>
            </div>
          </Field>
        </CollapsibleSection>
      )}

      <div className="pt-6 border-t border-[var(--border-color)]">
        <Field label={t('properties.variableName')}>
          <input
            type="text"
            value={element.variableName || ''}
            onChange={(e) => onChange({ variableName: e.target.value })}
            className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] transition-all placeholder:text-[var(--text-secondary)]/20"
            placeholder={t('properties.variableNamePlaceholder')}
          />
        </Field>
      </div>
    </div>
  );
}

function CollapsibleSection({ title, isCollapsed, onToggle, children }) {
  return (
    <div className="space-y-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between bg-[var(--bg-main)] border border-[var(--border-color)] hover:border-[var(--accent-color)]/30 rounded-2xl px-4 py-3.5 transition-all group"
      >
        <h3 className="text-xs font-bold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] uppercase tracking-wider">{title}</h3>
        <ChevronDown
          size={18}
          className={`text-[var(--text-secondary)] group-hover:text-[var(--accent-color)] transition-transform duration-300 ${isCollapsed ? '' : 'rotate-180'}`}
        />
      </button>
      {!isCollapsed && <div className="space-y-4 px-1 pb-2">{children}</div>}
    </div>
  );
}

// ColorField component with Dynamic checkbox
function ColorField({ label, value, onChange, dynamicFlag, onDynamicChange, t }) {
  return (
    <div className="space-y-2">
      {label && <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{label}</label>}
      <div className="flex gap-2">
        <div
          className="w-10 h-10 rounded-xl border border-[var(--border-color)] shadow-sm flex-shrink-0 relative overflow-hidden group"
          style={{ backgroundColor: value || '#ffffff' }}
        >
          <input
            type="color"
            value={value || '#ffffff'}
            onChange={(e) => onChange(e.target.value)}
            className="opacity-0 w-full h-full cursor-pointer absolute inset-0 z-10"
          />
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
        <div className="flex-1 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl flex items-center px-3 focus-within:border-[var(--accent-color)] transition-all">
          <span className="text-[var(--text-secondary)]/40 text-xs font-bold mr-2">#</span>
          <input
            type="text"
            value={(value || '').replace('#', '').toUpperCase()}
            onChange={(e) => onChange(`#${e.target.value}`)}
            className="bg-transparent w-full outline-none text-sm font-bold text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/10"
          />
        </div>
      </div>
      {onDynamicChange && (
        <label className="flex items-center gap-2 text-[11px] font-bold text-[var(--text-secondary)] cursor-pointer hover:text-[var(--text-primary)] transition-all group mt-1">
          <div className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${dynamicFlag ? 'bg-[var(--accent-color)] border-[var(--accent-color)]' : 'bg-[var(--bg-main)] border-[var(--border-color)]'}`}>
            {dynamicFlag && <Check size={10} className="text-white" />}
          </div>
          <input
            type="checkbox"
            checked={dynamicFlag || false}
            onChange={(e) => onDynamicChange(e.target.checked)}
            className="hidden"
          />
          {t('properties.dynamic')}
        </label>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider leading-none">{label}</label>
      {children}
    </div>
  );
}

function StyleButton({ active, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className={`p-2.5 rounded-xl border transition-all shadow-sm active:scale-95 ${active ? 'bg-[var(--accent-color)] text-white border-[var(--accent-color)] shadow-[var(--accent-glow)]' : 'bg-[var(--bg-main)] text-[var(--text-secondary)] border-[var(--border-color)] hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)]/30'
        }`}
    >
      {React.cloneElement(icon, { size: 18 })}
    </button>
  );
}

function hexToRgba(hex, opacity = 1) {
  if (!hex) return 'rgba(0, 0, 0, 1)';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
