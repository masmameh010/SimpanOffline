
import React from 'react';
import { PLATFORM_OPTIONS } from '../constants';
import { CollectionPlatform } from '../types';

interface GalleryHeaderProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    platformFilter: CollectionPlatform | '';
    onPlatformFilterChange: (value: CollectionPlatform | '') => void;
}

const GalleryHeader: React.FC<GalleryHeaderProps> = ({ searchTerm, onSearchChange, platformFilter, onPlatformFilterChange }) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
                <i className="fa-solid fa-images text-indigo-600"></i>
                Galeri Koleksi
            </h2>
            <div className="flex gap-3">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Cari prompt atau tag..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-64 text-gray-900"
                    />
                    <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                </div>
                <select
                    value={platformFilter}
                    onChange={(e) => onPlatformFilterChange(e.target.value as CollectionPlatform | '')}
                    className="border rounded-lg px-3 py-2 bg-white text-gray-900"
                >
                    <option value="">Semua Platform</option>
                    {PLATFORM_OPTIONS.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default GalleryHeader;