
import { CollectionPlatform } from "./types";

export const PLATFORM_OPTIONS = [
    { id: CollectionPlatform.TENSOR, name: 'Tensor', icon: 'fa-robot' },
    { id: CollectionPlatform.MIDJOURNEY, name: 'Midjourney', icon: 'fa-brands fa-artstation' },
    { id: CollectionPlatform.GEMINI, name: 'Gemini', icon: 'fa-gem' },
    { id: CollectionPlatform.PICLUMEN, name: 'Piclumen', icon: 'fa-palette' },
    { id: CollectionPlatform.LEONARDO, name: 'Leonardo', icon: 'fa-paintbrush' }
];

export const TENSOR_MODELS = {
    "Model Populer": ["Flux.1-Dev-FP8", "HUBG_Realistic", "SD_2.1", "SDXL", "PONY"],
    "Model Lainnya": ["Illustrious", "DreamShaper", "RevAnimated", "RealisticVision"]
};

export const TENSOR_VAES = {
    "VAE Populer": ["vae-ft-mse-840000-ema-pruned", "orangemix.vae", "kl-f8-anime2.vae"],
    "VAE Lainnya": ["anything-v4.0.vae", "wd-1-5-vae"]
};

export const TENSOR_SAMPLERS = [
    "euler", "euler_ancestral", "heun", "heunpp2", "dpm_2", "dpm_2_ancestral",
    "lms", "dpm_fast", "dpm_adaptive", "dpmpp_2s_ancestral", "dpmpp_sde_gpu",
    "dpmpp_2m", "dpmpp_2m_sde_gpu", "dpmpp_3m_sde_gpu", "ddpm", "lcm", "restart",
    "euler_dy", "euler_smea_dy", "ddim", "uni_pc", "uni_pc_bh2", "sde_multistep"
];

export const TENSOR_SCHEDULERS = [
    "normal", "karras", "sgm_uniform", "exponential", "simple", "ddim_uniform",
    "beta", "linear quadratic"
];

export const MIDJOURNEY_MODELS = [
    "V7", "V6", "V5.2", "V5.1", "V5", "V4", "V3", "V2", "V1", "Niji V5", "Niji V4"
];

export const PICLUMEN_MODELS = [
    "PicLumen Art V1", "PicLumen Realistic V2", "PicLumen Anime V2", "PicLumen Lineart V1",
    "Namiya", "FLUX.1 Kontext", "Primo", "Pony Diffusion V6", "FLUX.1-schnell", "FLUX.1-dev"
];

export const LEONARDO_MODELS = {
    "Preset Model Styles": ["Cinematic Kino", "Concept Art", "Graphic Design", "Illustrative Albedo", "Leonardo Lightning", "Lifelike Vision", "Portrait Perfect", "Stock Photography"],
    "Featured Models": ["Lucid Realism", "GPT-Image-1", "FLUX.1 Kontext", "Phoenix 1.0", "Flux Dev", "Flux Schnell", "Phoenix 0.9", "Anime"]
};

export const GEMINI_MODELS = ["Gemini 2.5 Flash", "Gemini 2.5 Pro", "Custom Gem"];
