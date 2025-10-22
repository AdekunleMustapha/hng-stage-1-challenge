import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const MONGO_URI = process.env.MONGO_URI!;
export const PORT = process.env.PORT || 3000;