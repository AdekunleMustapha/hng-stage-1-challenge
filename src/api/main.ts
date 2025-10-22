import { Router } from "express";
import { StringAnalyzerController } from "../controller/string-analyzer-controller";

const mainRoute = Router();
const stringAnalyzerController = new StringAnalyzerController();

mainRoute.post('/strings', (req, res, next) => stringAnalyzerController.analyzeString(req, res, next));
mainRoute.get('/strings', (req, res, next) => stringAnalyzerController.getStringsFromQuery(req, res, next));
mainRoute.get('/strings/filter-by-natural-language', (req, res, next) => stringAnalyzerController.queryStringByNLP(req, res, next));
mainRoute.get('/strings/:value', (req, res, next) => stringAnalyzerController.getStringByParams(req, res, next));
mainRoute.delete('/strings/:value', (req, res, next) => stringAnalyzerController.deleteStringByParams(req, res, next));

export default mainRoute;