import crypto from 'crypto';
import { StringPropertyModel, IStringProperty } from '../models/string-property-model';

export class StringAnalyzer {
    constructor(){}

    private isPalindrome (value: string): boolean {
        let reversedValue = value.split('').reverse().join('');
        return value.toLowerCase() === reversedValue.toLowerCase();
    };

    private readLength (value: string): number {
        return value.replace(/\s/g, '').length;
    };

    private uniqueCharacters (value: string): number {
        const uniqueChars = new Set(value.replace(/\s/g, '')).size;
        return uniqueChars;
    }

    private wordCount (value: string): number {
        if (value.trim() === '') return 0;
        return value.trim().split(/\s+/).length;
    };

    private stringEncryption (value: string): string {
        return crypto.createHash('sha256').update(value).digest('hex');
    };

    private characterFrequency (value: string): Record<string, number> {
        let frequency: Record<string, number> = {};
        for (let char of value) {
            if(/\s/.test(char)) continue;
            frequency[char] = (frequency[char] || 0) + 1;
        };
        return frequency;
    };

    public async analyze (value: string) {
        const newStringValue: IStringProperty = await new StringPropertyModel({
            length: this.readLength(value),
            is_palindrome: this.isPalindrome(value),
            unique_characters: this.uniqueCharacters(value),
            word_count: this.wordCount(value),
            value,
            sha256_hash: this.stringEncryption(value),
            character_frequency: this.characterFrequency(value)
        });
        await newStringValue.save();

        return {
            id: this.stringEncryption(value),
            value,
            properties: {
                length: this.readLength(value),
                is_palindrome: this.isPalindrome(value),
                unique_characters: this.uniqueCharacters(value),
                word_count: this.wordCount(value),
                sha256_hash: this.stringEncryption(value),
                character_frequency_map: this.characterFrequency(value)
            },
            created_at: newStringValue.createdAt.toISOString()
        };
    }
}