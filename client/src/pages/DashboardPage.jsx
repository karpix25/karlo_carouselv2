import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    FolderPlus,
    Search,
    Grid,
    List,
    ChevronRight,
    LayoutDashboard,
    Filter,
    Folder,
    FileText,
    MoreVertical,
    Calendar,
    ArrowRight,
    Languages
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import FolderTile from '../components/dashboard/FolderTile';
import FileTile from '../components/dashboard/FileTile';

export default function DashboardPage() {
    const navigate = useNavigate();
    const { t, language, setLanguage } = useTranslation();
    const [folders, setFolders] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // grid | list
    const [selectedFolderId, setSelectedFolderId] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');

    useEffect(() => {
        document.title = `Carousel Service - ${t('dashboard.myDesigns')}`;
        fetchData();
    }, [language]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [foldersRes, templatesRes] = await Promise.all([
                fetch('/folders'),
                fetch('/templates')
            ]);
            const foldersData = await foldersRes.json();
            const templatesData = await templatesRes.json();

            setFolders(foldersData);
            setTemplates(templatesData);
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNew = () => {
        navigate('/editor');
    };

    const handleCreateFolder = async () => {
        if (!newFolderName.trim()) return;

        try {
            const res = await fetch('/folders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newFolderName })
            });
            if (res.ok) {
                fetchData();
                setIsCreateModalOpen(false);
                setNewFolderName('');
            }
        } catch (err) {
            console.error('Failed to create folder:', err);
        }
    };

    const handleOpenTemplate = (id) => {
        navigate(`/editor/${id}`);
    };

    const handleOpenFolder = (id) => {
        setSelectedFolderId(id);
    };

    const selectedFolder = folders.find(f => f.id === selectedFolderId);

    const filteredTemplates = templates.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const displayTemplates = selectedFolderId
        ? filteredTemplates.filter(t => t.folderId === selectedFolderId)
        : filteredTemplates.filter(t => !t.folderId);

    const displayFolders = selectedFolderId
        ? []
        : folders.filter(f =>
            f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            templates.some(t => t.folderId === f.id && t.name.toLowerCase().includes(searchQuery.toLowerCase()))
        );

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] font-sans transition-colors duration-200">
            {/* Sidebar / Navigation */}
            <nav className="fixed left-0 top-0 bottom-0 w-64 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] p-6 hidden lg:block transition-colors duration-200">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-10 h-10 bg-[var(--accent-color)] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[var(--accent-glow)]">
                        <LayoutDashboard size={22} />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Carousel</span>
                </div>

                <div className="space-y-1">
                    <NavItem
                        icon={<Grid size={18} />}
                        label={t('dashboard.allDesigns')}
                        active={!selectedFolderId}
                        onClick={() => setSelectedFolderId(null)}
                    />
                    <NavItem icon={<Plus size={18} />} label={t('dashboard.createNew')} onClick={handleCreateNew} />
                </div>

                <div className="absolute bottom-8 left-6 right-6">
                    <button
                        onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
                        className="w-full flex items-center justify-between px-4 py-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <Languages size={18} />
                            <span className="text-sm font-medium">{language === 'ru' ? 'Русский' : 'English'}</span>
                        </div>
                        <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="lg:ml-64 p-8">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-3xl font-bold tracking-tight">
                                {selectedFolder ? selectedFolder.name : t('dashboard.myDesigns')}
                            </h1>
                            {selectedFolderId && (
                                <button
                                    onClick={() => setSelectedFolderId(null)}
                                    className="text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors"
                                >
                                    <Plus size={20} className="rotate-45" />
                                </button>
                            )}
                        </div>
                        <p className="text-[var(--text-secondary)]">
                            {selectedFolder ? `${t('dashboard.project')} • ${displayTemplates.length} ${t('dashboard.files')}` : t('dashboard.manageTemplates')}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex items-center justify-center gap-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:bg-[var(--bg-main)] text-[var(--text-primary)] px-5 py-2.5 rounded-2xl font-semibold transition-all shadow-sm active:scale-95"
                        >
                            <FolderPlus size={18} />
                            <span>{t('dashboard.newFolder')}</span>
                        </button>

                        <button
                            onClick={handleCreateNew}
                            className="flex items-center justify-center gap-2 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white px-5 py-2.5 rounded-2xl font-semibold transition-all shadow-lg shadow-[var(--accent-glow)] active:scale-95"
                        >
                            <Plus size={18} />
                            <span>{t('dashboard.newDesign')}</span>
                        </button>
                    </div>
                </header>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={20} />
                        <input
                            type="text"
                            placeholder={t('dashboard.searchPlaceholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/20 focus:border-[var(--accent-color)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 transition-all shadow-sm"
                        />
                    </div>

                    <div className="flex items-center gap-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] p-1.5 rounded-xl shadow-sm">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[var(--accent-color)]/10 text-[var(--accent-color)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                        >
                            <Grid size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[var(--accent-color)]/10 text-[var(--accent-color)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                        >
                            <List size={20} />
                        </button>
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[3/4] bg-gray-200 rounded-2xl mb-4" />
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                                <div className="h-3 bg-gray-200 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={viewMode === 'grid'
                                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8"
                                : "space-y-2"}
                        >
                            {viewMode === 'grid' ? (
                                <>
                                    {displayFolders.map(folder => (
                                        <FolderTile
                                            key={folder.id}
                                            folder={folder}
                                            templates={templates}
                                            onClick={handleOpenFolder}
                                        />
                                    ))}

                                    {displayTemplates.map(template => (
                                        <FileTile
                                            key={template.id}
                                            template={template}
                                            onClick={handleOpenTemplate}
                                        />
                                    ))}
                                </>
                            ) : (
                                <div className="bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-color)] overflow-hidden transition-colors duration-200">
                                    {displayFolders.map(folder => (
                                        <FolderListRow
                                            key={folder.id}
                                            folder={folder}
                                            templates={templates}
                                            onClick={() => handleOpenFolder(folder.id)}
                                        />
                                    ))}
                                    {displayTemplates.map(template => (
                                        <FileListRow
                                            key={template.id}
                                            template={template}
                                            onClick={() => handleOpenTemplate(template.id)}
                                        />
                                    ))}
                                </div>
                            )}

                            {displayFolders.length === 0 && displayTemplates.length === 0 && (
                                <div className="col-span-full py-20 flex flex-col items-center justify-center text-[var(--text-secondary)]">
                                    <div className="w-20 h-20 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mb-4 border border-[var(--border-color)]">
                                        <Filter size={32} />
                                    </div>
                                    <h3 className="text-lg font-medium text-[var(--text-primary)]">{t('dashboard.nothingFound')}</h3>
                                    <p className="text-sm">{t('dashboard.tryChangingQuery')}</p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                )}
            </main>

            {/* Create Folder Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCreateModalOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-[var(--bg-secondary)] rounded-3xl shadow-2xl overflow-hidden border border-[var(--border-color)]"
                        >
                            <div className="p-8">
                                <div className="w-12 h-12 bg-[var(--accent-color)]/10 text-[var(--accent-color)] rounded-2xl flex items-center justify-center mb-6">
                                    <FolderPlus size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{t('dashboard.createFolderTitle')}</h2>
                                <p className="text-[var(--text-secondary)] mb-8">{t('dashboard.createFolderHint')}</p>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">{t('dashboard.folderNameLabel')}</label>
                                        <input
                                            autoFocus
                                            type="text"
                                            value={newFolderName}
                                            onChange={(e) => setNewFolderName(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                                            placeholder={t('dashboard.folderNamePlaceholder')}
                                            className="w-full px-4 py-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/20 focus:border-[var(--accent-color)] text-[var(--text-primary)] font-medium transition-all"
                                        />
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setIsCreateModalOpen(false)}
                                            className="flex-1 px-6 py-3 bg-[var(--bg-main)] hover:bg-[var(--border-color)] text-[var(--text-primary)] rounded-xl font-semibold transition-colors"
                                        >
                                            {t('common.cancel')}
                                        </button>
                                        <button
                                            onClick={handleCreateFolder}
                                            disabled={!newFolderName.trim()}
                                            className="flex-1 px-6 py-3 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white rounded-xl font-semibold transition-all shadow-lg shadow-[var(--accent-glow)] disabled:opacity-50 disabled:shadow-none"
                                        >
                                            {t('common.save')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function FolderListRow({ folder, templates, onClick }) {
    const { t } = useTranslation();
    const count = templates.filter(t => t.folderId === folder.id).length;
    return (
        <div
            onClick={onClick}
            className="group flex items-center gap-4 p-4 hover:bg-[var(--accent-color)]/5 cursor-pointer border-b border-[var(--border-color)] last:border-0 transition-colors"
        >
            <div className="w-10 h-10 bg-[var(--accent-color)]/10 text-[var(--accent-color)] rounded-xl flex items-center justify-center flex-shrink-0">
                <Folder size={20} />
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-[var(--text-primary)] truncate">{folder.name}</h4>
                <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-[var(--text-secondary)]">{count} {t('dashboard.files')}</span>
                    <span className="text-[10px] text-[var(--text-secondary)]/30">•</span>
                    <span className="text-xs text-[var(--text-secondary)]">{t('dashboard.project')}</span>
                </div>
            </div>
            <ArrowRight size={16} className="text-[var(--text-secondary)] group-hover:text-[var(--accent-color)] group-hover:translate-x-1 transition-all" />
        </div>
    );
}

function FileListRow({ template, onClick }) {
    const { t, language } = useTranslation();
    const lastModified = template.updatedAt
        ? new Date(template.updatedAt).toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'short' })
        : '--';

    return (
        <div
            onClick={onClick}
            className="group flex items-center gap-4 p-4 hover:bg-[var(--accent-color)]/5 cursor-pointer border-b border-[var(--border-color)] last:border-0 transition-colors"
        >
            <div className="w-10 h-10 bg-[var(--bg-main)] text-[var(--text-secondary)] rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-[var(--border-color)]">
                <FileText size={20} />
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-[var(--text-primary)] truncate">{template.name}</h4>
                <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                        <Calendar size={10} /> {lastModified}
                    </span>
                    <span className="text-[10px] text-[var(--text-secondary)]/30">•</span>
                    <span className="text-xs text-[var(--text-secondary)]">{t('dashboard.template')}</span>
                </div>
            </div>
            <ArrowRight size={16} className="text-[var(--text-secondary)] group-hover:text-[var(--accent-color)] group-hover:translate-x-1 transition-all" />
        </div>
    );
}

function NavItem({ icon, label, active = false, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${active
                ? 'bg-[var(--accent-color)] text-white shadow-lg shadow-[var(--accent-glow)] font-semibold'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                }`}
        >
            <div className={active ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors'}>
                {icon}
            </div>
            <span className="text-sm">{label}</span>
        </button>
    );
}
