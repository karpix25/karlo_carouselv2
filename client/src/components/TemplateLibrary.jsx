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
      <header className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-purple-900 uppercase">{t('templates.title')}</h3>
          <p className="text-xs text-gray-500">
            {t('templates.savedLayouts') || `Saved layouts (${templates.length})`}
          </p>
        </div>
        <Tooltip text={t('tooltips.templates.createNew')}>
          <button
            type="button"
            onClick={onCreateNew}
            className="text-xs font-semibold text-purple-700 border border-purple-200 rounded-full px-3 py-1 hover:bg-purple-50"
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
              className="text-xs text-purple-600 hover:underline"
            >
              {isImporting ? t('templates.cancel') : t('templates.import')}
            </button>
          </Tooltip>
          <span className="text-gray-300">|</span>
          <Tooltip text={t('tooltips.templates.export')}>
            <button
              onClick={onExport}
              className="text-xs text-purple-600 hover:underline"
            >
              {t('templates.export')}
            </button>
          </Tooltip>
        </div>

        {isImporting && (
          <div className="space-y-2 p-3 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <textarea
              value={importCode}
              onChange={(e) => setImportCode(e.target.value)}
              placeholder={t('templates.pasteHtml')}
              className="w-full text-xs font-mono border rounded-lg p-2 h-24 focus:outline-none focus:ring-1 focus:ring-purple-500"
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
              className="w-full bg-purple-600 text-white text-xs font-semibold py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {t('templates.import')}
            </button>
          </div>
        )}
      </div>

      {/* Folder Tree */}
      <div className="max-h-96 overflow-auto pr-1">
        {templates.length === 0 ? (
          <div className="text-xs text-gray-500 border border-dashed rounded-xl px-3 py-4 text-center">
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
