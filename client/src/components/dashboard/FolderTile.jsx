import React from 'react';
import { motion } from 'framer-motion';
import { Folder, Clock, Layers } from 'lucide-react';
import DesignPreview from './DesignPreview';

export default function FolderTile({ folder, templates, onClick }) {
    const folderTemplates = templates.filter(t => t.folderId === folder.id);
    const count = folderTemplates.length;

    const lastModified = folder.updatedAt
        ? new Date(folder.updatedAt).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'short'
        })
        : count > 0 && folderTemplates[0].updatedAt
            ? new Date(folderTemplates[0].updatedAt).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'short'
            })
            : '--';

    // Get up to 3 previews
    const previews = folderTemplates.slice(0, 3);

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group cursor-pointer"
            onClick={() => onClick(folder.id)}
        >
            <div className="relative aspect-[3/4] bg-[var(--bg-secondary)] rounded-3xl overflow-hidden border border-[var(--border-color)] group-hover:border-[var(--accent-color)]/30 transition-all duration-300 shadow-sm group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                {/* Animated Stack Effect */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {previews.length > 0 ? (
                        <div className="relative w-[70%] h-[70%] mt-2">
                            {previews.map((template, i) => (
                                <div
                                    key={template.id}
                                    className="absolute inset-0 flex items-center justify-center transition-transform duration-500"
                                    style={{
                                        transform: `translate(${i * 10}px, ${-i * 10}px) scale(${1 - i * 0.05})`,
                                        zIndex: 10 - i,
                                    }}
                                >
                                    <div className="shadow-2xl border border-[var(--border-color)]/50 rounded-lg bg-[var(--bg-main)] overflow-hidden ring-1 ring-black/5">
                                        <DesignPreview template={template} scale={0.08} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-[var(--text-secondary)]/30">
                            <Folder size={64} strokeWidth={1} />
                            <span className="text-[10px] font-bold uppercase tracking-widest mt-3">Empty Project</span>
                        </div>
                    )}
                </div>

                {/* Folder Label */}
                <div className="absolute top-4 left-4">
                    <div className="bg-[var(--accent-color)] text-white p-2 rounded-xl backdrop-blur-md shadow-lg shadow-[var(--accent-glow)]">
                        <Folder size={18} fill="currentColor" />
                    </div>
                </div>

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <span className="text-white text-xs font-semibold tracking-wide uppercase px-2 py-1 bg-black/40 backdrop-blur-md rounded-lg w-fit">Просмотреть проект</span>
                </div>
            </div>

            <div className="mt-4 px-1">
                <h3 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition-colors truncate">
                    {folder.name}
                </h3>
                <div className="flex items-center justify-between mt-1.5 px-0.5">
                    <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                        <Layers size={12} className="opacity-60" />
                        <span className="text-[11px] font-medium uppercase tracking-wider">{count} файлов</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                        <Clock size={12} className="opacity-60" />
                        <span className="text-[11px] font-medium uppercase tracking-wider">{lastModified}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
