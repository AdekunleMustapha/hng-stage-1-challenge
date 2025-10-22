import { Document, model, Schema } from "mongoose";

export interface IStringProperty extends Document {
    length: number;
    is_palindrome: boolean;
    unique_characters: number;
    word_count: number;
    value: string;
    sha256_hash: string;
    character_frequency: Record<string, number>;
    createdAt: Date;
}

const StringPropertySchema: Schema = new Schema<IStringProperty>({
    length: { type: Number, required: true },
    is_palindrome: { type: Boolean, required: true },
    unique_characters: { type: Number, required: true },
    word_count: { type: Number, required: true },
    value: { type: String, required: true },
    sha256_hash: { type: String, required: true },
    character_frequency: { type: Map, of: Number, required: true },
    createdAt: { type: Date, default: Date.now}
}, { versionKey: false });

export const StringPropertyModel = model<IStringProperty>('StringProperty', StringPropertySchema);