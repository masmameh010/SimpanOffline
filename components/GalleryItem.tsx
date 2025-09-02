
import React from 'react';
import { CollectionItem, CollectionPlatform } from '../types';

interface GalleryItemProps {
    item: CollectionItem;
    onViewDetail: (item: CollectionItem) => void;
    onDelete: (id: number) => void;
}

const platformColors: Record<CollectionPlatform, string> = {
    [CollectionPlatform.TENSOR]: 'indigo',
    [CollectionPlatform.MIDJOURNEY]: 'purple',
    [CollectionPlatform.GEMINI]: 'blue',
    [CollectionPlatform.PICLUMEN]: 'green',
    [CollectionPlatform.LEONARDO]: 'amber',
};

const GalleryItemComponent: React.FC<GalleryItemProps> = ({ item, onViewDetail, onDelete }) => {
    const color = platformColors[item.platform] || 'gray';

    const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation(); // Prevent card click event
        onDelete(item.id!);
    };

    return (
        <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
            <div className="relative">
                <img src={item.image} alt={item.prompt.substring(0, 30)} className="w-full h-48 object-cover" />
                <div className="absolute top-2 right-2">
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full bg-${color}-200 text-${color}-800`}>
                        {item.platform.charAt(0).toUpperCase() + item.platform.slice(1)}
                    </span>
                </div>
                <button onClick={handleDeleteClick} className="absolute top-2 left-2 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-content-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <i className="fa-solid fa-trash text-sm mx-auto"></i>
                </button>
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1 truncate" title={item.model}>{item.model}</h3>
                <p className="text-sm text-gray-700 mb-3 h-10 overflow-hidden">{item.prompt}</p>
                <div className="flex flex-wrap gap-1 mb-3 h-6 overflow-hidden">
                    {item.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs font-medium px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full">{tag}</span>
                    ))}
                </div>
                <button onClick={() => onViewDetail(item)} className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors">
                    Lihat Detail
                </button>
            </div>
        </div>
    );
};

export default GalleryItemComponent;
