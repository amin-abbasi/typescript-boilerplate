"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sample_1 = __importDefault(require("../models/sample"));
const exportResult = {
    // Create Sample
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            try {
                const result = yield sample_1.default.create(data);
                res.result = result;
                next(res);
            }
            catch (err) {
                console.log(' --------------- Create Error: ', err);
                next(err);
            }
        });
    },
    // List all Sample
    list(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = req.query;
            try {
                const result = yield sample_1.default.list(query);
                res.result = result;
                next(res);
            }
            catch (err) {
                console.log(' --------------- List Error: ', err);
                next(err);
            }
        });
    },
    // Show Sample Details
    details(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield sample_1.default.details(req.params.sampleId);
                res.result = result;
                next(res);
            }
            catch (err) {
                console.log(' --------------- Details Error: ', err);
                next(err);
            }
        });
    },
    // Update Sample
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const sampleId = req.params.sampleId;
            try {
                const result = yield sample_1.default.updateById(sampleId, req.body);
                res.result = result;
                next(res);
            }
            catch (err) {
                console.log(' --------------- Update Error: ', err);
                next(err);
            }
        });
    },
    // Delete Sample
    delete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const sampleId = req.params.sampleId;
            try {
                const result = yield sample_1.default.delete(sampleId);
                res.result = result;
                next(res);
            }
            catch (err) {
                console.log(' --------------- Delete Error: ', err);
                next(err);
            }
        });
    }
};
exports.default = exportResult;
