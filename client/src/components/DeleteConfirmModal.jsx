import React from 'react';
import { X } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Delete', cancelText = 'Cancel' }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Modal */}
            <div className="relative bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl shadow-2xl max-w-sm w-full mx-4 p-8 space-y-6">
                {/* Close button */}
                <button
                    onClick={onCancel}
                    className="absolute top-6 right-6 text-[var(--text-secondary)]/40 hover:text-[var(--text-primary)] transition-all"
                >
                    <X size={20} />
                </button>

                {/* Title */}
                <h2 className="text-xl font-bold text-[var(--text-primary)] pr-8 leading-tight">
                    {title}
                </h2>

                {/* Message */}
                <p className="text-[var(--text-secondary)] text-sm font-medium leading-relaxed">
                    {message}
                </p>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    {cancelText && (
                        <button
                            onClick={onCancel}
                            className="flex-1 px-4 py-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all font-bold text-xs uppercase tracking-wider"
                        >
                            {cancelText}
                        </button>
                    )}
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-500/20"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
