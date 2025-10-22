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
        const rawData = await StringPropertyModel.find({
            is_palindrome: filters.is_palindrome ? filters.is_palindrome : undefined,
            length: { $gte: filters.min_length || 0, $lte: filters.max_length || Infinity },
            word_count: filters.word_count ? filters.word_count : undefined,
            value: filters.contains_character ? { $regex: filters.contains_character } : undefined
        });

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