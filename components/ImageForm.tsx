import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CollectionItem } from '../types';
import { CollectionPlatform } from '../types';
import { CollectionItemFormData } from '../services/db';
import { 
    PLATFORM_OPTIONS, TENSOR_MODELS, TENSOR_VAES, TENSOR_SAMPLERS, TENSOR_SCHEDULERS, 
    MIDJOURNEY_MODELS, PICLUMEN_MODELS, LEONARDO_MODELS, GEMINI_MODELS 
} from '../constants';

interface ImageFormProps {
    editingItem: CollectionItem | null;
    onSubmit: (item: CollectionItemFormData) => void;
    onCancelEdit: () => void;
    onExport: () => void;
    onImport: (file: File) => void;
}

const MAX_FILE_SIZE_MB = 2;
const LORA_COUNT = 6;

const initialFormData: CollectionItemFormData = {
    image: '',
    platform: CollectionPlatform.GEMINI,
    prompt: '',
    negativePrompt: '',
    model: 'Gemini 2.5 Flash',
    tags: [],
    notes: '',
    vae: '',
    sampler: 'dpmpp_2m',
    scheduler: 'normal',
    cfg: 3.5,
    steps: 30,
    seed: '',
    upscaler: false,
    adetailer: true,
    lora: Array(LORA_COUNT).fill('')
};

const ImageForm: React.FC<ImageFormProps> = ({ editingItem, onSubmit, onCancelEdit, onExport, onImport }) => {
    const [formData, setFormData] = useState<CollectionItemFormData>(initialFormData);
    const [imageBase64, setImageBase64] = useState<string>('');
    const [customModel, setCustomModel] = useState('');
    const [isCustomModel, setIsCustomModel] = useState(false);
    const importInputRef = useRef<HTMLInputElement>(null);

    const resetForm = useCallback(() => {
        setFormData(initialFormData);
        setImageBase64('');
        setCustomModel('');
        setIsCustomModel(false);
        onCancelEdit();
    }, [onCancelEdit]);

    useEffect(() => {
        if (editingItem) {
            const isTensorModelInList = Object.values(TENSOR_MODELS).flat().includes(editingItem.model);
            const isCustom = editingItem.platform === CollectionPlatform.TENSOR && !isTensorModelInList;
            
            setFormData({
                ...initialFormData,
                ...editingItem,
                tags: editingItem.tags || [],
                lora: editingItem.lora ? [...editingItem.lora, ...Array(LORA_COUNT - editingItem.lora.length).fill('')] : Array(LORA_COUNT).fill(''),
                model: isCustom ? 'custom' : editingItem.model,
            });
            setImageBase64(editingItem.image);
            if (isCustom) {
                setCustomModel(editingItem.model);
                setIsCustomModel(true);
            } else {
                 setCustomModel('');
                 setIsCustomModel(false);
            }
        } else {
            resetForm();
        }
    }, [editingItem, resetForm]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handlePlatformChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const platform = e.target.value as CollectionPlatform;
        let model = '';
        if (platform === CollectionPlatform.GEMINI) model = GEMINI_MODELS[0];
        if (platform === CollectionPlatform.TENSOR) model = TENSOR_MODELS["Model Populer"][0];
        if (platform === CollectionPlatform.MIDJOURNEY) model = MIDJOURNEY_MODELS[0];
        if (platform === CollectionPlatform.PICLUMEN) model = PICLUMEN_MODELS[1]; // Realistic V2
        if (platform === CollectionPlatform.LEONARDO) model = LEONARDO_MODELS["Preset Model Styles"][0];

        setFormData(prev => ({ ...prev, platform, model }));
        setIsCustomModel(false);
        setCustomModel('');
    };
    
    const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        if (value === 'custom') {
            setIsCustomModel(true);
            setFormData(prev => ({ ...prev, model: 'custom' }));
        } else {
            setIsCustomModel(false);
            setCustomModel('');
            setFormData(prev => ({ ...prev, model: value }));
        }
    }

    const handleLoraChange = (index: number, field: 'name' | 'strength', value: string) => {
        const newLora = [...(formData.lora || [])];
        const currentLora = newLora[index] || ':0.0';
        let [name, strength] = currentLora.split(':');
        
        if (field === 'name') name = value;
        if (field === 'strength') strength = value;

        newLora[index] = `${name}:${strength}`;
        setFormData(prev => ({ ...prev, lora: newLora }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                alert(`Ukuran file melebihi ${MAX_FILE_SIZE_MB}MB.`);
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                setImageBase64(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageBase64) {
            alert('Mohon unggah gambar.');
            return;
        }

        const finalModel = isCustomModel ? customModel : formData.model;
        if (!finalModel) {
            alert('Mohon pilih atau masukkan model.');
            return;
        }
        
        const submissionData = {
            ...formData,
            image: imageBase64,
            model: finalModel,
            tags: typeof formData.tags === 'string' ? (formData.tags as string).split(',').map(t => t.trim()).filter(Boolean) : formData.tags,
            lora: formData.platform === CollectionPlatform.TENSOR ? formData.lora?.map(l => {
                const [name, strength] = (l || ':').split(':');
                return name.trim() && parseFloat(strength) > 0 ? `${name.trim()}:${parseFloat(strength) || 0.8}` : null;
            }).filter(Boolean) as string[] : [],
        };
        onSubmit(submissionData);
        resetForm();
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
            <div className="header-gradient p-5 text-white">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <i className="fa-solid fa-plus-circle"></i>
                    {editingItem ? 'Edit Koleksi' : 'Tambah Koleksi Baru'}
                </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-5">
                 <div className="mb-6">
                    <label className="block mb-3 font-medium text-gray-700 text-lg">
                        <i className="fa-solid fa-image mr-2"></i> Unggah Gambar AI
                    </label>
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="imageInput" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300 hover:border-indigo-400">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <i className="fa-solid fa-cloud-arrow-up text-4xl text-gray-400 mb-3"></i>
                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Klik untuk upload</span> atau drag & drop</p>
                                <p className="text-xs text-gray-500">PNG, JPG (Max. 2MB)</p>
                            </div>
                            <input id="imageInput" type="file" accept="image/*" className="hidden" onChange={handleImageChange} required={!editingItem} />
                        </label>
                    </div>
                    {imageBase64 && (
                        <div className="mt-3">
                            <img src={imageBase64} className="max-h-64 rounded-lg shadow border mx-auto" alt="Preview" />
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label htmlFor="prompt" className="block mb-2 font-medium text-gray-700"><i className="fa-solid fa-keyboard mr-2"></i>Prompt</label>
                        <textarea id="prompt" name="prompt" rows={4} value={formData.prompt} onChange={handleInputChange} className="block w-full p-4 border rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500" placeholder="Masukkan prompt..." required></textarea>
                    </div>
                    <div>
                        <label htmlFor="negativePrompt" className="block mb-2 font-medium text-gray-700"><i className="fa-solid fa-ban mr-2"></i>Negative Prompt</label>
                        <textarea id="negativePrompt" name="negativePrompt" rows={3} value={formData.negativePrompt} onChange={handleInputChange} className="block w-full p-4 border rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500" placeholder="Elemen yang tidak diinginkan..."></textarea>
                    </div>
                </div>
                
                <div className="mb-6">
                    <label className="block mb-3 font-medium text-gray-700 text-lg"><i className="fa-solid fa-cube mr-2"></i>Pilih Platform</label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {PLATFORM_OPTIONS.map(p => (
                            <div key={p.id}>
                                <input type="radio" name="platform" id={p.id} value={p.id} className="hidden peer" checked={formData.platform === p.id} onChange={handlePlatformChange} />
                                <label htmlFor={p.id} className="platform-card flex flex-col items-center justify-center p-4 bg-white border border-gray-300 rounded-xl cursor-pointer peer-checked:border-indigo-500 peer-checked:ring-2 peer-checked:ring-indigo-200 hover:bg-gray-50 transition-all duration-300 ease-in-out">
                                    <i className={`fa-solid ${p.icon} text-3xl mb-3 text-indigo-600`}></i>
                                    <span className="font-medium text-gray-800">{p.name}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {formData.platform === CollectionPlatform.TENSOR && (
                     <div id="tensorFields">
                        <div className="bg-indigo-50 border-l-4 border-indigo-500 rounded-lg p-4 mb-6">
                            <h3 className="text-lg font-semibold mb-4 text-indigo-700 flex items-center gap-2"><i className="fa-solid fa-sliders"></i>Pengaturan Tensor</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">Model / Checkpoint</label>
                                    <select name="model" value={formData.model} onChange={handleModelChange} className="block w-full p-3 border rounded-lg bg-white text-gray-900">
                                        <option value="" disabled>Pilih Model</option>
                                        {Object.entries(TENSOR_MODELS).map(([group, models]) => (
                                            <optgroup key={group} label={group}>
                                                {models.map(m => <option key={m} value={m}>{m}</option>)}
                                            </optgroup>
                                        ))}
                                        <option value="custom">Lainnya...</option>
                                    </select>
                                    {isCustomModel && <input type="text" value={customModel} onChange={(e) => setCustomModel(e.target.value)} className="block w-full p-3 border rounded-lg mt-2" placeholder="Nama model custom" />}
                                </div>
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">VAE</label>
                                    <select name="vae" value={formData.vae} onChange={handleInputChange} className="block w-full p-3 border rounded-lg bg-white text-gray-900">
                                        <option value="">Default</option>
                                         {Object.entries(TENSOR_VAES).map(([group, vaes]) => (
                                            <optgroup key={group} label={group}>
                                                {vaes.map(v => <option key={v} value={v}>{v}</option>)}
                                            </optgroup>
                                        ))}
                                    </select>
                                </div>
                            </div>
                             <div className="mb-6">
                                <label className="block mb-3 font-medium text-gray-700"><i className="fa-solid fa-layer-group mr-2"></i>LoRA (Maksimal {LORA_COUNT})</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    {Array.from({ length: LORA_COUNT }).map((_, i) => {
                                        const [name = '', strength = '0.0'] = (formData.lora?.[i] || ':').split(':');
                                        return (
                                            <div key={i} className="flex flex-col gap-1">
                                                <input type="text" value={name} onChange={e => handleLoraChange(i, 'name', e.target.value)} className="w-full p-2 border rounded-lg text-sm" placeholder={`Nama LoRA ${i+1}`} />
                                                <input type="number" min="0" max="2" step="0.1" value={parseFloat(strength) || 0} onChange={e => handleLoraChange(i, 'strength', e.target.value)} className="w-full p-2 border rounded-lg text-sm" placeholder="Strength" />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">Sampler</label>
                                    <select name="sampler" value={formData.sampler} onChange={handleInputChange} className="block w-full p-3 border rounded-lg bg-white text-gray-900">
                                        {TENSOR_SAMPLERS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">Scheduler</label>
                                    <select name="scheduler" value={formData.scheduler} onChange={handleInputChange} className="block w-full p-3 border rounded-lg bg-white text-gray-900">
                                        {TENSOR_SCHEDULERS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">Guidance Scale</label>
                                    <input type="number" name="cfg" min="0" max="20" step="0.1" value={formData.cfg} onChange={handleInputChange} className="block w-full p-3 border rounded-lg" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">Steps</label>
                                    <input type="number" name="steps" min="1" max="150" value={formData.steps} onChange={handleInputChange} className="block w-full p-3 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="block mb-2 font-medium text-gray-700">Seed</label>
                                    <input type="number" name="seed" value={formData.seed} onChange={handleInputChange} className="block w-full p-3 border rounded-lg" placeholder="Acak jika kosong" />
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center">
                                        <input type="checkbox" id="upscaler" name="upscaler" checked={formData.upscaler} onChange={handleInputChange} className="w-5 h-5 text-indigo-600 rounded" />
                                        <label htmlFor="upscaler" className="ml-2 font-medium text-gray-700">Upscaler</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input type="checkbox" id="adetailer" name="adetailer" checked={formData.adetailer} onChange={handleInputChange} className="w-5 h-5 text-indigo-600 rounded" />
                                        <label htmlFor="adetailer" className="ml-2 font-medium text-gray-700">ADetailer</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                 {formData.platform !== CollectionPlatform.TENSOR && (
                    <div id="altModelFields">
                        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-6">
                            <h3 className="text-lg font-semibold mb-4 text-blue-700 flex items-center gap-2"><i className="fa-solid fa-gear"></i>Pengaturan Model</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <label className="block font-medium text-gray-700">
                                    Model {PLATFORM_OPTIONS.find(p => p.id === formData.platform)?.name}
                                    <select name="model" value={formData.model} onChange={handleInputChange} className="block w-full p-3 border rounded-lg bg-white text-gray-900 mt-2">
                                        {formData.platform === CollectionPlatform.MIDJOURNEY && MIDJOURNEY_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                                        {formData.platform === CollectionPlatform.PICLUMEN && PICLUMEN_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                                        {formData.platform === CollectionPlatform.GEMINI && GEMINI_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                                        {formData.platform === CollectionPlatform.LEONARDO && Object.entries(LEONARDO_MODELS).map(([group, models]) => (
                                            <optgroup key={group} label={group}>
                                                {models.map(m => <option key={m} value={m}>{m}</option>)}
                                            </optgroup>
                                        ))}
                                    </select>
                                </label>
                            </div>
                        </div>
                    </div>
                )}


                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4 text-indigo-700 flex items-center gap-2"><i className="fa-solid fa-tags"></i>Metadata</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="tags" className="block mb-2 font-medium text-gray-700">Tags</label>
                            <input type="text" id="tags" name="tags" value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags} onChange={handleInputChange} className="block w-full p-3 border rounded-lg" placeholder="Pisahkan dengan koma (cth: potret, seni digital)" />
                        </div>
                        <div>
                            <label htmlFor="notes" className="block mb-2 font-medium text-gray-700">Catatan</label>
                            <textarea id="notes" name="notes" rows={3} value={formData.notes} onChange={handleInputChange} className="block w-full p-3 border rounded-lg" placeholder="Catatan tambahan..."></textarea>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                    <button type="submit" className={`px-6 py-3 text-white rounded-xl flex items-center gap-2 font-medium transition-colors ${editingItem ? 'bg-blue-600 hover:bg-blue-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                        <i className="fa-solid fa-save"></i>
                        {editingItem ? 'Perbarui Koleksi' : 'Simpan Koleksi'}
                    </button>
                    <button type="button" onClick={onExport} className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 flex items-center gap-2 font-medium">
                        <i className="fa-solid fa-file-export"></i> Export JSON
                    </button>
                    <input type="file" ref={importInputRef} onChange={(e) => e.target.files && onImport(e.target.files[0])} accept="application/json" className="hidden" />
                    <button type="button" onClick={() => importInputRef.current?.click()} className="px-6 py-3 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 flex items-center gap-2 font-medium">
                        <i className="fa-solid fa-file-import"></i> Import JSON
                    </button>
                     <button type="button" onClick={resetForm} className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 flex items-center gap-2 font-medium">
                        <i className="fa-solid fa-rotate-left"></i>
                        {editingItem ? 'Batal Edit' : 'Reset Form'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ImageForm;