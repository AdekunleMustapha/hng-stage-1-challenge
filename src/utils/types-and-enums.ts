
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