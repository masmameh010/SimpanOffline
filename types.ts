
export enum CollectionPlatform {
    TENSOR = 'tensor',
    MIDJOURNEY = 'midjourney',
    GEMINI = 'gemini',
    PICLUMEN = 'piclumen',
    LEONARDO = 'leonardo'
}

export interface CollectionItem {
    id?: number;
    image: string; // base64
    platform: CollectionPlatform;
    prompt: string;
    negativePrompt: string;
    model: string;
    tags: string[];
    notes: string;
    // Tensor-specific
    vae?: string;
    sampler?: string;
    scheduler?: string;
    cfg?: number;
    steps?: number;
    seed?: string;
    upscaler?: boolean;
    adetailer?: boolean;
    lora?: string[];
}
