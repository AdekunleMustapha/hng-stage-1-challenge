import { StringPropertyModel, IStringProperty } from "../models/string-property-model";
import crypto from "crypto";

export class DBRepositoryService {
    constructor(){}

    public async checkIfStringExists(value: string): Promise<boolean> {
        const encryptedValue = crypto.createHash('sha256').update(value).digest('hex');
        const existingString = await StringPropertyModel.findOne({ sha256_hash: encryptedValue });
        return existingString !== null;
    }

    public async getStringByString (value: string) {
        const encryptedValue = crypto.createHash('sha256').update(value).digest('hex');
        const stringData = await StringPropertyModel.findOne({ sha256_hash: encryptedValue });
        if (!stringData) {
            return null;
        }

        return {
            id: stringData.sha256_hash,
            value: stringData.value,
            properties: {
                length: stringData.length,
                is_palindrome: stringData.is_palindrome,
                unique_characters: stringData.unique_characters,
                word_count: stringData.word_count,
                sha256_hash: stringData.sha256_hash,
                character_frequency_map: stringData.character_frequency
            },
            created_at: stringData.createdAt.toISOString()
        };
    }
}