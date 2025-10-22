import { stringQueryFiltersType } from "../utils/types-and-enums";
import { DBRepositoryService } from './db-repository-service';

export class NLPService {
    private dbRepositoryService: DBRepositoryService;

    constructor() {
        this.dbRepositoryService = new DBRepositoryService();
    }

    public async parseNaturalLanguageString(input: string) {
        const filters: stringQueryFiltersType = {};
        const text = input.toLowerCase();

        if (text.includes('palindromic')) filters.is_palindrome = true;
        if (text.includes('single word')) filters.word_count = 1;
        if (text.includes('multiple words')) filters.word_count = Infinity;

        const min_length = (text.match(/longer than (\d+)/));
        if (min_length) filters.min_length = parseInt(min_length[1]) + 1;

        const max_length = (text.match(/shorter than (\d+)/));
        if (max_length) filters.max_length = parseInt(max_length[1]) - 1;

        const char = text.match(/letter ([a-z])/);
        if (char) filters.contains_character = char[1];

        if ((min_length && max_length) || (text.includes('single word') && (text.includes('multiple words')))) {
            return { status: 422, response: 'Query parsed but resulted in conflicting filters' };
        }

        if (Object.keys(filters).length === 0) {
            return { status: 400, response: 'Unable to parse natural language query' };
        }

        const result = await this.dbRepositoryService.getStringByQuery(filters);
        return {
            status: 200,
            response: {
                data: result.data,
                count: result.count,
                interpreted_query: {
                    original: input,
                    parsed_filters: { ...filters}
                }
            }
        }
    }
}