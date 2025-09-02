
// Fix: Use a standard ES module import for Dexie to resolve the name conflict.
import Dexie, { type Table } from 'dexie';
import { CollectionItem } from '../types';

export type CollectionItemFormData = Omit<CollectionItem, 'id'>;

export class AICollectionDB extends Dexie {
    collections!: Table<CollectionItem>;

    constructor() {
        super('AICollectionDB');
        this.version(1).stores({
            collections: '++id, platform, prompt, *tags' // Primary key and indexed props
        });
    }
}

export const db = new AICollectionDB();