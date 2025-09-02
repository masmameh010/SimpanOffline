
import React from 'react';
import { CollectionItem } from '../types';
import GalleryItem from './GalleryItem';

interface GalleryProps {
    collections: CollectionItem[];
    onViewDetail: (item: CollectionItem) => void;
    onDelete: (id: number) => void;
}

const Gallery: React.FC<GalleryProps> = ({ collections, onViewDetail, onDelete }) => {
    if (collections.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-500">Belum ada koleksi yang cocok dengan filter Anda.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {collections.map(item => (
                <GalleryItem
                    key={item.id}
                    item={item}
                    onViewDetail={onViewDetail}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default Gallery;
