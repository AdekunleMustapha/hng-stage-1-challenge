import z from 'zod';

export type stringPropertiesType = {
    length: number;
    is_palindrome: boolean;
    unique_characters: number;
    word_count: number;
    sha256_hash: string;
    character_frequency_map: Record<string, number>;
}

export type stringHeaderType = {
    value: string;
    created_at: Date;
}

export type stringDataType = {
    id: string;
    value: string;
    properties: stringPropertiesType;
    created_at: string;
}

export type stringQueryFiltersType = {
    is_palindrome?: boolean,
    min_length?: number,
    max_length?: number,
    word_count?: number,
    contains_character?: string
}

export const stringQueryFiltersSchema = z.object({
    is_palindrome:  z.string()
        .optional()
        .transform((val) => {
            if (val === undefined) return undefined;
            if (val.toLowerCase() === 'true') return true;
            if (val.toLowerCase() === 'false') return false;
            throw new Error('Invalid boolean string');
        }),

    min_length: z.string()
        .optional()
        .transform((val) => val? parseInt(val, 10) : undefined)
        .refine((val) => val === undefined || !isNaN(val), {message: 'min_length must be a valid number'}),

    max_length: z.string()
        .optional()
        .transform((val) => val? parseInt(val, 10) : undefined)
        .refine((val) => val === undefined || !isNaN(val), {message: 'max_length must be a valid number'}),
    
    word_count: z.string()
        .optional()
        .transform((val) => val? parseInt(val, 10) : undefined)
        .refine((val) => val === undefined || !isNaN(val), {message: 'word_count must be a valid number'}),
    
    contains_character: z.string()
        .optional()
        .refine((val) => val === undefined || (val.length === 1 && /^[a-zA-Z]$/.test(val)), { 
            message: 'contains_character must be a single alphabetic character'
        })
});