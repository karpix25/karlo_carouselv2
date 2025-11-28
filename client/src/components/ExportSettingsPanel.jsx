import React from 'react';
import { ChevronDown } from 'lucide-react';

const imageFormats = [
  { label: 'Automatic', value: 'automatic' },
  { label: 'PNG', value: 'png' },
  { label: 'JPEG', value: 'jpeg' },
];

const colorModes = [
  { label: 'RGB', value: 'RGB' },
  { label: 'CMYK (beta)', value: 'CMYK' },
];

const pdfQuality = [
  { label: 'High (default)', value: 'high' },
  { label: 'Standard', value: 'standard' },
];

export default function ExportSettingsPanel({ settings, onChange }) {
  const [collapsedSections, setCollapsedSections] = React.useState({});

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <section className="space-y-4">
      <SettingsCard
        title="Image settings"
        isCollapsed={collapsedSections.image}
        onToggle={() => toggleSection('image')}
      >
        <SettingsField label="Image format">
          <select
            className="w-full bg-transparent focus:outline-none"
            value={settings.imageFormat}
            onChange={(e) => onChange('imageFormat', e.target.value)}
          >
            {imageFormats.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </SettingsField>
        <SettingsField label="DPI">
          <input
            className="w-full bg-transparent focus:outline-none"
            type="number"
            min="72"
            max="600"
            value={settings.imageDpi}
            onChange={(e) => onChange('imageDpi', parseInt(e.target.value, 10) || 72)}
          />
        </SettingsField>
        <SettingsField label="Color mode">
          <select
            className="w-full bg-transparent focus:outline-none"
            value={settings.imageColorMode}
            onChange={(e) => onChange('imageColorMode', e.target.value)}
          >
            {colorModes.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </SettingsField>
      </SettingsCard>

      <SettingsCard
        title="PDF settings"
        isCollapsed={collapsedSections.pdf}
        onToggle={() => toggleSection('pdf')}
      >
        <SettingsField label="Image quality">
          <select
            className="w-full bg-transparent focus:outline-none"
            value={settings.pdfQuality}
            onChange={(e) => onChange('pdfQuality', e.target.value)}
          >
            {pdfQuality.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </SettingsField>
        <SettingsField label="DPI">
          <input
            className="w-full bg-transparent focus:outline-none"
            type="number"
            min="72"
            max="600"
            value={settings.pdfDpi}
            onChange={(e) => onChange('pdfDpi', parseInt(e.target.value, 10) || 96)}
          />
        </SettingsField>
        <SettingsField label="Color mode">
          <select
            className="w-full bg-transparent focus:outline-none"
            value={settings.pdfColorMode}
            onChange={(e) => onChange('pdfColorMode', e.target.value)}
          >
            {colorModes.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </SettingsField>
      </SettingsCard>
    </section>
  );
}

function SettingsCard({ title, children, isCollapsed, onToggle }) {
  return (
    <div className="border rounded-2xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between bg-purple-50 hover:bg-purple-100 px-4 py-3 transition-colors"
      >
        <h3 className="text-sm font-semibold text-purple-900 uppercase">{title}</h3>
        <ChevronDown
          size={20}
          className={`text-purple-900 transition-transform ${isCollapsed ? '' : 'rotate-180'}`}
        />
      </button>
      {!isCollapsed && <div className="p-4 space-y-3">{children}</div>}
    </div>
  );
}

function SettingsField({ label, children }) {
  return (
    <label className="text-xs text-gray-600 uppercase tracking-wide space-y-1 block">
      {label}
      <div className="text-sm text-gray-800 border rounded-lg px-3 py-2 bg-white">{children}</div>
    </label>
  );
}
