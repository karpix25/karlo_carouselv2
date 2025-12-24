import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import Tooltip from './Tooltip';
import FolderTree from './FolderTree';

export default function TemplateLibrary({
  templates,
  onLoad,
  currentTemplateId,
  onCreateNew,
  onImport,
  onExport,
  onRefresh
}) {
  const { t } = useTranslation();
  const [isImporting, setIsImporting] = useState(false);
  const [importCode, setImportCode] = useState('');
  const [folders, setFolders] = useState([]);

  // Fetch folders
  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const res = await fetch('/folders');
      const data = await res.json();
      setFolders(data);
    } catch (err) {
      console.error('Failed to fetch folders:', err);
    }
  };

  const handleCreateFolder = async () => {
    try {
      const res = await fetch('/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'New Folder' })
      });
      const newFolder = await res.json();
      setFolders([...folders, newFolder]);
    } catch (err) {
      console.error('Failed to create folder:', err);
    }
  };

  const handleRenameFolder = async (folderId, newName) => {
    try {
      await fetch(`/folders/${folderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName })
      });
      setFolders(folders.map(f => f.id === folderId ? { ...f, name: newName } : f));
    } catch (err) {
      console.error('Failed to rename folder:', err);
    }
  };

  const handleDeleteFolder = async (folderId) => {
    try {
      const res = await fetch(`/folders/${folderId}`, { method: 'DELETE' });
      if (res.ok) {
        setFolders(folders.filter(f => f.id !== folderId));
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to delete folder');
      }
    } catch (err) {
      console.error('Failed to delete folder:', err);
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    try {
      await fetch(`/templates/${templateId}`, { method: 'DELETE' });
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to delete template:', err);
    }
  };

  const handleMoveTemplate = async (templateId, folderId) => {
    try {
      await fetch(`/templates/${templateId}/move`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderId })
      });
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to move template:', err);
    }
  };

  return (
    <section>
      <header className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[11px] font-bold text-[var(--accent-color)] uppercase tracking-wider">{t('templates.title')}</h3>
          <p className="text-[10px] font-medium text-[var(--text-secondary)]/60">
            {t('templates.savedLayouts') || `Saved layouts (${templates.length})`}
          </p>
        </div>
        <Tooltip text={t('tooltips.templates.createNew')}>
          <button
            type="button"
            onClick={onCreateNew}
            className="text-[10px] font-bold text-[var(--text-primary)] bg-[var(--bg-main)] border border-[var(--border-color)] rounded-full px-4 py-1.5 hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-all shadow-sm"
          >
            + {t('templates.createNew')}
          </button>
        </Tooltip>
      </header>

      {/* Import/Export Section */}
      <div className="mb-4 space-y-2">
        <div className="flex gap-2">
          <Tooltip text={t('tooltips.templates.import')}>
            <button
              onClick={() => setIsImporting(!isImporting)}
              className="text-[10px] font-bold text-[var(--text-secondary)] hover:text-[var(--accent-color)] uppercase tracking-wider transition-all"
            >
              {isImporting ? t('templates.cancel') : t('templates.import')}
            </button>
          </Tooltip>
          <span className="text-[var(--border-color)]">|</span>
          <Tooltip text={t('tooltips.templates.export')}>
            <button
              onClick={onExport}
              className="text-[10px] font-bold text-[var(--text-secondary)] hover:text-[var(--accent-color)] uppercase tracking-wider transition-all"
            >
              {t('templates.export')}
            </button>
          </Tooltip>
        </div>

        {isImporting && (
          <div className="space-y-3 p-4 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-color)]">
            <textarea
              value={importCode}
              onChange={(e) => setImportCode(e.target.value)}
              placeholder={t('templates.pasteHtml')}
              className="w-full text-xs font-mono bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-3 h-32 focus:outline-none focus:border-[var(--accent-color)] transition-all resize-none text-[var(--text-primary)]"
            />
            <button
              onClick={() => {
                if (importCode.trim()) {
                  onImport(importCode);
                  setImportCode('');
                  setIsImporting(false);
                }
              }}
              disabled={!importCode.trim()}
              className="w-full bg-[var(--accent-color)] text-white text-[11px] font-bold py-2.5 rounded-xl hover:bg-[var(--accent-hover)] transition-all shadow-md shadow-[var(--accent-glow)] disabled:opacity-50 disabled:shadow-none uppercase tracking-wider"
            >
              {t('templates.import')}
            </button>
          </div>
        )}
      </div>

      {/* Folder Tree */}
      <div className="max-h-96 overflow-auto pr-1">
        {templates.length === 0 ? (
          <div className="text-[10px] text-[var(--text-secondary)] border border-dashed border-[var(--border-color)] rounded-2xl px-4 py-8 text-center font-medium">
            {t('templates.noTemplates') || 'No templates yet. Save the current design to create one.'}
          </div>
        ) : (
          <FolderTree
            folders={folders}
            templates={templates}
            onMove={handleMoveTemplate}
            onDeleteTemplate={handleDeleteTemplate}
            onDeleteFolder={handleDeleteFolder}
            onCreateFolder={handleCreateFolder}
            onRenameFolder={handleRenameFolder}
            onTemplateClick={onLoad}
          />
        )}
      </div>
    </section>
  );
}
