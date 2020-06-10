"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// initialize our logger (our use-case: Winston)
const winston_1 = __importDefault(require("winston"));
const express_winston_1 = __importDefault(require("express-winston"));
const logFormat = winston_1.default.format.printf((info) => {
    return `[${info.timestamp}] ${JSON.stringify(info.meta)} ${info.level}: ${info.message}`;
});
express_winston_1.default.requestWhitelist.push('body');
express_winston_1.default.responseWhitelist.push('body');
const logger = express_winston_1.default.logger({
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.File({ filename: `${__dirname}/logs/app.log` })
    ],
    format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.json(), logFormat),
    meta: true,
    expressFormat: true,
    colorize: true,
});
exports.default = logger;
