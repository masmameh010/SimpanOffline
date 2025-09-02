
import { CollectionItem } from '../types';

export type CollectionItemFormData = Omit<CollectionItem, 'id'>;

// Dexie is loaded from a CDN script in index.html, making it a global variable.
// We declare it here to inform TypeScript about its existence at compile time.
declare var Dexie: any;

export class AICollectionDB extends Dexie {
    // The `Table` type is not available as a global, so we use `any` for simplicity at runtime.
    collections!: any;

    constructor() {
        super('AICollectionDB');
        this.version(1).stores({
            collections: '++id, platform, prompt, *tags' // Primary key and indexed props
        });
    }
}

export const db = new AICollectionDB();
