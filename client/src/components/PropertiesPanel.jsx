import React from 'react';
import FONT_OPTIONS, { DEFAULT_FONT, getFontStack } from '../constants/fonts';

export default function PropertiesPanel({ element, onChange }) {
  if (!element) {
    return (
      <div className="border rounded-2xl p-6 text-center text-sm text-gray-500">
        Select a layer to edit its properties.
      </div>
    );
  }

  const isText = element.type === 'text';
  const isImage = element.type === 'image';
  const isShape = element.type === 'shape';

  const handleNumberChange = (field) => (value) => {
    if (!Number.isNaN(value)) {
      onChange({ [field]: value });
    }
  };

  const currentFontFamily = element.fontFamily || DEFAULT_FONT;

  return (
    <div className="border rounded-2xl p-4 space-y-4">
      <h3 className="text-sm font-semibold text-purple-900 uppercase">Element properties</h3>

      <Field label="Variable name">
        <input
          type="text"
          value={element.variableName || ''}
          onChange={(e) => onChange({ variableName: e.target.value })}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="e.g. product_name"
        />
      </Field>

      {(isText || isImage) && (
        <Field label={isText ? 'Text content' : 'Image URL'}>
          {isText ? (
            <textarea
              value={element.content || ''}
              onChange={(e) => onChange({ content: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 h-24"
            />
          ) : (
            <input
              type="text"
              value={element.content || ''}
              onChange={(e) => onChange({ content: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            />
          )}
        </Field>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Field label="X">
          <input
            type="number"
            value={element.x}
            onChange={(e) => handleNumberChange('x')(parseInt(e.target.value, 10))}
            className="w-full border rounded-lg px-3 py-2"
          />
        </Field>
        <Field label="Y">
          <input
            type="number"
            value={element.y}
            onChange={(e) => handleNumberChange('y')(parseInt(e.target.value, 10))}
            className="w-full border rounded-lg px-3 py-2"
          />
        </Field>
        <Field label="Width">
          <input
            type="number"
            value={element.width}
            onChange={(e) => handleNumberChange('width')(parseInt(e.target.value, 10))}
            className="w-full border rounded-lg px-3 py-2"
          />
        </Field>
        <Field label="Height">
          <input
            type="number"
            value={element.height}
            onChange={(e) => handleNumberChange('height')(parseInt(e.target.value, 10))}
            className="w-full border rounded-lg px-3 py-2"
          />
        </Field>
      </div>

      <Field label="Opacity">
        <input
          type="range"
          min={0.1}
          max={1}
          step={0.05}
          value={element.opacity ?? 1}
          onChange={(e) => onChange({ opacity: parseFloat(e.target.value) })}
          className="w-full"
        />
      </Field>

      {isText && (
        <>
          <Field label="Font family">
            <div className="space-y-2">
              <select
                value={currentFontFamily}
                onChange={(e) => onChange({ fontFamily: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              >
                {FONT_OPTIONS.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
              <div
                className="border rounded-lg px-3 py-2 text-sm text-gray-700"
                style={{ fontFamily: getFontStack(currentFontFamily) }}
              >
                The quick brown fox
              </div>
            </div>
          </Field>
          <Field label="Font size">
            <input
              type="number"
              value={element.fontSize || 16}
              onChange={(e) => handleNumberChange('fontSize')(parseInt(e.target.value, 10))}
              className="w-full border rounded-lg px-3 py-2"
            />
          </Field>
          <Field label="Font weight">
            <select
              value={element.fontWeight || 400}
              onChange={(e) => onChange({ fontWeight: parseInt(e.target.value, 10) })}
              className="w-full border rounded-lg px-3 py-2"
            >
              {[300, 400, 500, 600, 700].map((weight) => (
                <option key={weight} value={weight}>
                  {weight}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Line height">
              <input
                type="number"
                step="0.1"
                min="0.8"
                max="3"
                value={element.lineHeight ?? 1.2}
                onChange={(e) => handleNumberChange('lineHeight')(parseFloat(e.target.value))}
                className="w-full border rounded-lg px-3 py-2"
              />
            </Field>
            <Field label="Letter spacing (px)">
              <input
                type="number"
                step="0.5"
                min="-10"
                max="20"
                value={element.letterSpacing ?? 0}
                onChange={(e) => handleNumberChange('letterSpacing')(parseFloat(e.target.value))}
                className="w-full border rounded-lg px-3 py-2"
              />
            </Field>
          </div>
          <Field label="Text transform">
            <select
              value={element.textTransform || 'none'}
              onChange={(e) => onChange({ textTransform: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            >
              {['none', 'uppercase', 'lowercase', 'capitalize'].map((transform) => (
                <option key={transform} value={transform}>
                  {transform}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Text align">
            <select
              value={element.textAlign || 'left'}
              onChange={(e) => onChange({ textAlign: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            >
              {['left', 'center', 'right'].map((align) => (
                <option key={align} value={align}>
                  {align}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Text color">
            <input
              type="color"
              value={element.color || '#ffffff'}
              onChange={(e) => onChange({ color: e.target.value })}
              className="w-full h-10 border rounded-lg"
            />
          </Field>
        </>
      )}

      {isImage && (
        <>
          <Field label="Object fit">
            <select
              value={element.fit || 'cover'}
              onChange={(e) => onChange({ fit: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            >
              {['cover', 'contain', 'fill'].map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Corner radius">
            <input
              type="number"
              value={element.borderRadius || 0}
              onChange={(e) => handleNumberChange('borderRadius')(parseInt(e.target.value, 10))}
              className="w-full border rounded-lg px-3 py-2"
            />
          </Field>
        </>
      )}

      {isShape && (
        <>
          <Field label="Fill color">
            <input
              type="color"
              value={element.backgroundColor || '#000000'}
              onChange={(e) => onChange({ backgroundColor: e.target.value })}
              className="w-full h-10 border rounded-lg"
            />
          </Field>
          <Field label="Corner radius">
            <input
              type="number"
              value={element.borderRadius || 0}
              onChange={(e) => handleNumberChange('borderRadius')(parseInt(e.target.value, 10))}
              className="w-full border rounded-lg px-3 py-2"
            />
          </Field>
        </>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="text-xs text-gray-500 uppercase tracking-wide space-y-1 block">
      {label}
      {children}
    </label>
  );
}
