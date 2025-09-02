
import React from 'react';
import { CollectionItem, CollectionPlatform } from '../types';
import { Message } from './MessageBox';

interface DetailModalProps {
    item: CollectionItem;
    onClose: () => void;
    onEdit: (item: CollectionItem) => void;
    onShowMessage: (message: Message) => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ item, onClose, onEdit, onShowMessage }) => {
    
    const copyToClipboard = async (text: string, fieldName: string) => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            onShowMessage({ text: `${fieldName} berhasil disalin!`, type: 'info' });
        } catch (err) {
            console.error('Failed to copy text: ', err);
            onShowMessage({ text: 'Gagal menyalin.', type: 'info' });
        }
    };
    
    const copyAllData = () => {
        let text = `Prompt: ${item.prompt}\n`;
        if (item.negativePrompt) text += `Negative Prompt: ${item.negativePrompt}\n`;
        text += `Platform: ${item.platform}\n`;
        text += `Model: ${item.model}\n`;
        if (item.tags?.length) text += `Tags: ${item.tags.join(', ')}\n`;
        if (item.platform === CollectionPlatform.TENSOR) {
            if(item.steps) text += `Steps: ${item.steps}\n`;
            if(item.cfg) text += `CFG: ${item.cfg}\n`;
            if(item.sampler) text += `Sampler: ${item.sampler}\n`;
            if(item.scheduler) text += `Scheduler: ${item.scheduler}\n`;
            if(item.seed) text += `Seed: ${item.seed}\n`;
            if (item.lora?.length) text += `LoRA: ${item.lora.join(', ')}\n`;
            if (item.upscaler) text += `Upscaler: Ya\n`;
            if (item.adetailer) text += `ADetailer: Ya\n`;
        }
        if (item.notes) text += `Catatan: ${item.notes}\n`;
        copyToClipboard(text, 'Semua data');
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-auto detail-modal">
                <div className="header-gradient text-white p-5 flex justify-between items-center sticky top-0 z-10">
                    <h3 className="text-xl font-bold">Detail Koleksi</h3>
                    <button onClick={onClose} className="text-white hover:text-gray-200"><i className="fa-solid fa-xmark text-2xl"></i></button>
                </div>
                <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="lg:w-2/5">
                            <img src={item.image} className="rounded-xl shadow-lg border w-full" alt="AI Generated" />
                             <div className="mt-6 bg-gray-50 rounded-xl p-4">
                                <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-gray-900"><i className="fa-solid fa-copy"></i>Salin Data</h4>
                                <div className="space-y-2">
                                    <button onClick={() => copyToClipboard(item.prompt, 'Prompt')} className="copy-btn w-full text-left px-3 py-2 bg-indigo-100 text-indigo-800 hover:bg-indigo-200 font-medium rounded-lg flex items-center gap-2 transition-colors">
                                        <i className="fa-regular fa-copy"></i>
                                        <span>Salin Prompt</span>
                                    </button>
                                    <button onClick={() => copyToClipboard(item.negativePrompt, 'Negative Prompt')} className="copy-btn w-full text-left px-3 py-2 bg-indigo-100 text-indigo-800 hover:bg-indigo-200 font-medium rounded-lg flex items-center gap-2 transition-colors">
                                        <i className="fa-regular fa-copy"></i>
                                        <span>Salin Negative Prompt</span>
                                    </button>
                                    <button onClick={copyAllData} className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium mt-2 transition-colors"><i className="fa-solid fa-copy mr-2"></i>Salin Semua Data</button>
                                </div>
                            </div>
                            <button onClick={() => onEdit(item)} className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium mt-4 transition-colors">
                                <i className="fa-solid fa-edit mr-2"></i> Edit Koleksi
                            </button>
                        </div>
                        <div className="lg:w-3/5 space-y-6">
                             <div>
                                <h4 className="font-semibold text-lg mb-2 text-gray-900"><i className="fa-solid fa-comment mr-2"></i>Prompt</h4>
                                <p className="text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-lg">{item.prompt}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-lg mb-2 text-gray-900"><i className="fa-solid fa-ban mr-2"></i>Negative Prompt</h4>
                                <p className="text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-lg">{item.negativePrompt || '-'}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold text-lg mb-2 text-gray-900"><i className="fa-solid fa-cube mr-2"></i>Platform</h4>
                                    <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-indigo-200 text-indigo-800">{item.platform}</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg mb-2 text-gray-900"><i className="fa-solid fa-microchip mr-2"></i>Model</h4>
                                    <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-purple-200 text-purple-800">{item.model}</span>
                                </div>
                            </div>
                             <div>
                                <h4 className="font-semibold text-lg mb-2 text-gray-900"><i className="fa-solid fa-tags mr-2"></i>Tags</h4>
                                <div className="flex flex-wrap gap-2">{item.tags.map(tag => <span key={tag} className="text-xs font-medium px-2 py-1 bg-gray-200 text-gray-700 rounded-full">{tag}</span>)}</div>
                            </div>
                            {item.platform === CollectionPlatform.TENSOR && (
                                <div>
                                    <h4 className="font-semibold text-lg mb-2 text-gray-900"><i className="fa-solid fa-info-circle mr-2"></i>Parameter</h4>
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm text-gray-800">
                                        <p><strong>Steps:</strong> {item.steps}</p>
                                        <p><strong>CFG:</strong> {item.cfg}</p>
                                        <p><strong>Sampler:</strong> {item.sampler}</p>
                                        <p><strong>Scheduler:</strong> {item.scheduler}</p>
                                        <p><strong>Seed:</strong> {item.seed}</p>
                                        {item.lora && item.lora.length > 0 && <p><strong>LoRA:</strong> {item.lora.join(', ')}</p>}
                                        <div className="flex gap-2 pt-2">
                                            {item.upscaler && <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-yellow-200 text-yellow-800">Upscaler</span>}
                                            {item.adetailer && <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-yellow-200 text-yellow-800">ADetailer</span>}
                                        </div>
                                    </div>
                                </div>
                            )}
                             <div>
                                <h4 className="font-semibold text-lg mb-2 text-gray-900"><i className="fa-solid fa-sticky-note mr-2"></i>Catatan</h4>
                                <p className="text-gray-800 bg-gray-50 p-4 rounded-lg">{item.notes || '-'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailModal;
