import React from 'react';
import { motion } from 'framer-motion';
import { Clock, FileText } from 'lucide-react';
import DesignPreview from './DesignPreview';

export default function FileTile({ template, onClick }) {
    const lastModified = template.updatedAt
        ? new Date(template.updatedAt).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
        : 'Неизвестно';

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group cursor-pointer"
            onClick={() => onClick(template.id)}
        >
            <div className="relative aspect-[3/4] bg-[var(--bg-secondary)] rounded-3xl overflow-hidden border border-[var(--border-color)] group-hover:border-[var(--accent-color)]/30 transition-all duration-300 shadow-sm group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                {/* Preview Container */}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                    <div className="w-full h-full flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                        <DesignPreview template={template} scale={0.12} />
                    </div>
                </div>

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <span className="text-white text-xs font-semibold tracking-wide uppercase px-2 py-1 bg-black/40 backdrop-blur-md rounded-lg w-fit">Открыть редактор</span>
                </div>
            </div>

            <div className="mt-4 px-1">
                <h3 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition-colors truncate">
                    {template.name}
                </h3>
                <div className="flex items-center gap-2 mt-1.5 text-[var(--text-secondary)]">
                    <Clock size={12} className="opacity-60" />
                    <span className="text-[11px] font-medium uppercase tracking-wider">{lastModified}</span>
                </div>
            </div>
        </motion.div>
    );
}
