import { Request, Response, NextFunction } from "express";
import { StringAnalyzer } from "../service/string-analyzer";
import { DBRepositoryService } from "../service/db-repository-service";

export class StringAnalyzerController {
    private stringAnalyzer: StringAnalyzer;
    private dbRepositoryService: DBRepositoryService;

    constructor(){
        this.stringAnalyzer = new StringAnalyzer();
        this.dbRepositoryService = new DBRepositoryService();
    }

    public async analyzeString(req: Request, res: Response, _next: NextFunction) {
        const { value } = req.body;
        if (typeof value !== 'string') {
            return res.status(422).json({ error: 'Invalid data type for "value" (must be string)' });
        }

        if (value.length === 0) {
            return res.status(400).json({ error: 'Invalid request body or missing "value" field' });
        }

        const stringExists = await this.dbRepositoryService.checkIfStringExists(value);
        if (stringExists) {
            return res.status(409).json({ error: 'String already exists in the system' });
        }

        const data = await this.stringAnalyzer.analyze(value);
        return res.status(201).json(data);
    }

    public async getStringByParams (req: Request, res: Response, _next: NextFunction) {
        const { value } = req.params;
        const data = await this.dbRepositoryService.getStringByString(value);
        if (!data) {
            return res.status(404).json({ error: 'String does not exist in the system' });
        }
        return res.status(200).json(data);
    }
}