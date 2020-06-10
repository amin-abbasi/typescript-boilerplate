"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ------ Import npm modules
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const body_parser_1 = require("body-parser");
const app = express_1.default();
// ------ Initialize & Use Middle-Wares
app.set('trust proxy', 1);
app.use(body_parser_1.urlencoded({ extended: true }));
app.use(body_parser_1.json());
app.use(helmet_1.default());
app.use(cors_1.default());
// ------ Add config to access everywhere
const config_1 = __importDefault(require("./configs/config"));
app.set('config', config_1.default);
// TODO: Add other caching systems (like 'RabbitMQ') in the future
// ------ Socket.io Integration
// import http   from 'http'
// import socket from 'socket.io'
// const server: http.Server = new http.Server(app)
// const io: socket.Server   = socket(server)
// app.set('io', io)
// ------ Allows cross-origin domains to access this API
// import initCors from './services/cors'
// app.use(initCors)
// ------ Add Redis to system globally [Caching System]
// import redis from './services/redis'
// app.set('redis', redis)
// ------ Require global methods
const methods = __importStar(require("./services/methods"));
app.set('methods', methods);
// ------ Add logger to system
const logger_1 = __importDefault(require("./services/logger"));
app.use(logger_1.default);
// ------ Require Database (mongodb)
require("./services/db");
// ------ Require all routes
const routes_1 = __importDefault(require("./routes"));
app.use('/api', routes_1.default);
// ------ Add Response Decorator (& error handler) to system
const response_decorator_1 = __importDefault(require("./services/response_decorator"));
app.use(response_decorator_1.default);
exports.default = app;
