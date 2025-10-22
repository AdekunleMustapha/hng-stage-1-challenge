import { StringPropertyModel } from "../models/string-property-model";
import crypto from "crypto";
import { stringDataType, stringPropertiesType, stringHeaderType, stringQueryFiltersType } from "../utils/types-and-enums";

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
        const stringPropertyData: stringPropertiesType = stringData;
        const stringHeaderData: stringHeaderType = stringData;
        const data: stringDataType = {
            id: stringPropertyData.sha256_hash,
            value: stringHeaderData.value,
            properties: stringPropertyData,
            created_at: stringHeaderData.created_at.toISOString()
        }
        return data;
    }

    public async getStringByQuery ( filters: stringQueryFiltersType ) {
        const query: Record<string, any> = {};
        if (filters.is_palindrome !== undefined) query.is_palindrome = filters.is_palindrome;
        if (filters.word_count !== undefined) query.word_count = filters.word_count;
        if (filters.contains_character) query.value = { $regex: filters.contains_character };
        if (filters.min_length !== undefined || filters.max_length !== undefined) {
            query.length = {};
            if (filters.min_length !== undefined) query.length.$gte = filters.min_length;
            if (filters.max_length !== undefined) query.length.$lte = filters.max_length;
        }

        const rawData = await StringPropertyModel.find(query);

        const stringPropertyData: stringPropertiesType[] = rawData;
        const stringHeaderData: stringHeaderType[] = rawData;
        let data: stringDataType[] = [];
        for(let i = 0; i < rawData.length; i++) {
             data.push({
                id: stringPropertyData[i].sha256_hash,
                value: stringHeaderData[i].value,
                properties: stringPropertyData[i],
                created_at: stringHeaderData[i].created_at.toISOString()
            });
        }

        return {
            data,
            count: data.length,
            filters_applied: {...filters}
        };
    }

    public async deleteStringByString (value: string): Promise<boolean> {
        const encryptedValue = crypto.createHash('sha256').update(value).digest('hex');
        const deletionResult = await StringPropertyModel.deleteOne({ sha256_hash: encryptedValue });
        return deletionResult.deletedCount === 1;
    }
}