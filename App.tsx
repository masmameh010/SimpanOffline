
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
// Fix: Import `CollectionItem` from `types.ts` where it is defined and exported.
import { db, CollectionItemFormData } from './services/db';
import Header from './components/Header';
import ImageForm from './components/ImageForm';
import Gallery from './components/Gallery';
import DetailModal from './components/DetailModal';
import MessageBox, { Message } from './components/MessageBox';
import GalleryHeader from './components/GalleryHeader';
import { CollectionItem, CollectionPlatform } from './types';

const App: React.FC = () => {
    const [collections, setCollections] = useState<CollectionItem[]>([]);
    const [editingItem, setEditingItem] = useState<CollectionItem | null>(null);
    const [detailItem, setDetailItem] = useState<CollectionItem | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [platformFilter, setPlatformFilter] = useState<CollectionPlatform | ''>('');
    const [message, setMessage] = useState<Message | null>(null);
    
    const formRef = useRef<HTMLDivElement>(null);

    const fetchCollections = useCallback(async () => {
        const allCollections = await db.collections.toArray();
        setCollections(allCollections.reverse()); // Show newest first
    }, []);

    useEffect(() => {
        fetchCollections();
    }, [fetchCollections]);

    const handleAddOrUpdate = async (itemData: CollectionItemFormData) => {
        try {
            if (editingItem) {
                await db.collections.update(editingItem.id!, itemData);
                setMessage({ text: 'Koleksi berhasil diperbarui!', type: 'info' });
            } else {
                await db.collections.add(itemData as CollectionItem);
                setMessage({ text: 'Koleksi berhasil disimpan!', type: 'info' });
            }
            setEditingItem(null);
            fetchCollections();
        } catch (error) {
            console.error("Failed to save collection:", error);
            setMessage({ text: 'Gagal menyimpan koleksi.', type: 'info' });
        }
    };

    const handleEdit = (item: CollectionItem) => {
        setEditingItem(item);
        setDetailItem(null);
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDelete = (id: number) => {
        setMessage({
            text: 'Yakin ingin menghapus koleksi ini secara permanen?',
            type: 'confirm',
            onConfirm: async (confirmed) => {
                if (confirmed) {
                    try {
                        await db.collections.delete(id);
                        setMessage({ text: 'Koleksi berhasil dihapus.', type: 'info' });
                        setDetailItem(null);
                        fetchCollections();
                    } catch (error) {
                        console.error("Failed to delete collection:", error);
                        setMessage({ text: 'Gagal menghapus koleksi.', type: 'info' });
                    }
                }
            }
        });
    };
    
    const handleExport = async () => {
        try {
            const allCollections = await db.collections.toArray();
            const dataStr = JSON.stringify(allCollections, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'koleksi-gambar-ai.json';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            setMessage({ text: 'Data berhasil diekspor!', type: 'info' });
        } catch(error) {
             console.error("Failed to export collections:", error);
             setMessage({ text: 'Gagal mengekspor data.', type: 'info' });
        }
    };
    
    const handleImport = (file: File) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const importedData = JSON.parse(e.target?.result as string) as CollectionItem[];
                if (!Array.isArray(importedData)) throw new Error("Invalid format");
                
                await db.transaction('rw', db.collections, async () => {
                    await db.collections.clear();
                    await db.collections.bulkAdd(importedData);
                });
                setMessage({ text: 'Data berhasil diimpor!', type: 'info' });
                fetchCollections();
            } catch (error) {
                console.error("Failed to import collections:", error);
                setMessage({ text: 'Gagal mengimpor data. Pastikan format file JSON benar.', type: 'info' });
            }
        };
        reader.readAsText(file);
    };

    const filteredCollections = useMemo(() => {
        return collections.filter(item => {
            const lowerSearch = searchTerm.toLowerCase();
            const matchesSearch = 
                item.prompt.toLowerCase().includes(lowerSearch) ||
                item.tags.some(tag => tag.toLowerCase().includes(lowerSearch)) ||
                item.model.toLowerCase().includes(lowerSearch) ||
                (item.negativePrompt && item.negativePrompt.toLowerCase().includes(lowerSearch)) ||
                (item.notes && item.notes.toLowerCase().includes(lowerSearch));
            
            const matchesPlatform = platformFilter === '' || item.platform === platformFilter;

            return matchesSearch && matchesPlatform;
        });
    }, [collections, searchTerm, platformFilter]);

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            <Header />
            <div ref={formRef}>
                <ImageForm
                    editingItem={editingItem}
                    onSubmit={handleAddOrUpdate}
                    onCancelEdit={() => setEditingItem(null)}
                    onExport={handleExport}
                    onImport={handleImport}
                />
            </div>
            <GalleryHeader
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                platformFilter={platformFilter}
                onPlatformFilterChange={setPlatformFilter}
            />
            <Gallery
                collections={filteredCollections}
                onViewDetail={setDetailItem}
                onDelete={handleDelete}
            />
            {detailItem && (
                <DetailModal
                    item={detailItem}
                    onClose={() => setDetailItem(null)}
                    onEdit={handleEdit}
                    onShowMessage={setMessage}
                />
            )}
            {message && (
                <MessageBox
                    message={message}
                    onClose={() => setMessage(null)}
                />
            )}
        </div>
    );
};

export default App;
