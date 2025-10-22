import { Router } from "express";
import { StringAnalyzerController } from "../controller/string-analyzer-controller";

const mainRoute = Router();
const stringAnalyzerController = new StringAnalyzerController();

mainRoute.post('/strings', (req, res, next) => stringAnalyzerController.analyzeString(req, res, next));
mainRoute.get('/strings/:value', (req, res, next) => stringAnalyzerController.getStringByParams(req, res, next));

export default mainRoute;