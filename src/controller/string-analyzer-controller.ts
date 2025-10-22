import { Request, Response, NextFunction } from "express";
import { StringAnalyzer } from "../service/string-analyzer-service";
import { DBRepositoryService } from "../service/db-repository-service";
import { stringQueryFiltersSchema } from "../utils/types-and-enums";
import { NLPService } from "../service/nlp-service";

export class StringAnalyzerController {
    private stringAnalyzer: StringAnalyzer;
    private dbRepositoryService: DBRepositoryService;
    private nlpService: NLPService;

    constructor(){
        this.stringAnalyzer = new StringAnalyzer();
        this.dbRepositoryService = new DBRepositoryService();
        this.nlpService = new NLPService();
    }

    public async analyzeString(req: Request, res: Response, _next: NextFunction) {
        const { value } = req.body;
        if (typeof value !== 'string') {
            return res.status(422)
                    .setHeader("Content-Type", "application/json")
                    .end(JSON.stringify({ error: 'Invalid data type for "value" (must be string)' }));
        }

        if (value.length === 0) {
            return res.status(400)
                    .setHeader("Content-Type", "application/json")
                    .end(JSON.stringify({ error: 'Invalid request body or missing "value" field' }));
        }

        const stringExists = await this.dbRepositoryService.checkIfStringExists(value);
        if (stringExists) {
            return res.status(409)
                .setHeader("Content-Type", "application/json")
                .end(JSON.stringify({ error: 'String already exists in the system' }));
        }

        const data = await this.stringAnalyzer.analyze(value);
        return res.status(201)
                .setHeader("Content-Type", "application/json")
                .end(JSON.stringify(data));
    }

    public async getStringByParams (req: Request, res: Response, _next: NextFunction) {
        const { value } = req.params;
        const data = await this.dbRepositoryService.getStringByString(value);
        if (!data) {
            return res.status(404)
                    .setHeader("Content-Type", "application/json")
                    .end(JSON.stringify({ error: 'String does not exist in the system' }));
        }
        return res.status(200)
            .setHeader("Content-Type", "application/json")
            .end(JSON.stringify(data));
    }

    public async getStringsFromQuery (req: Request, res: Response, _next: NextFunction) {
        try{
            const filters = stringQueryFiltersSchema.parse(req.query);
            const data = await this.dbRepositoryService.getStringByQuery(filters);
            return res
                .status(200)
                .setHeader('Content-Type', 'application/json')
                .end(JSON.stringify(data));   
        } catch (error) {
            return res
                .status(400)
                .setHeader('Content-Type', 'application/json')
                .end(JSON.stringify({ error: 'Invalid query parameter values or types' }));
        }
    };

    public async queryStringByNLP (req: Request, res: Response, _next: NextFunction) {
        const { query } = req.query;
        if (!query || typeof query !== 'string') {
            return res
                .status(400)
                .setHeader('Content-Type', 'application/json')
                .end(JSON.stringify({ error: 'Unable to parse natural language query' }));
        }
        const data = await this.nlpService.parseNaturalLanguageString(query);
        if(data.status !== 200){
            return res
                .status(data.status)
                .setHeader('Content-Type', 'application/json')
                .end(JSON.stringify({ error: data.response }));
        }
        return res
            .status(200)
            .setHeader('Content-Type', 'application/json')
            .end(JSON.stringify(data.response));
    }

    public async deleteStringByParams (req: Request, res: Response, _next: NextFunction) {
        const { value } = req.params;
        const deletionSuccess = await this.dbRepositoryService.deleteStringByString(value);
        if (!deletionSuccess) {
            return res
                .status(404)
                .setHeader('Content-Type', 'application/json')
                .end(JSON.stringify({ error: 'String does not exist in the system' }));
        }
        // For 204, explicitly set headers but no body
        return res
            .status(204)
            .setHeader('Cache-Control', 'no-cache')
            .end();
    }
}