"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// All Configs that needed to be centralized
const config = {
    // JWT Configuration
    jwt: {
        key: 'your_jwt_secret_key',
        expiration: 3600,
        algorithm: 'HS384',
        cache_prefix: 'token:',
        allow_renew: true,
        renew_threshold: 60
    },
    env: JSON.parse(JSON.stringify(process.env))
    // MS Configs
    // MS: {
    //   some_microservice: {
    //     host: 'localhost',
    //     port: 3000,
    //     paths: {
    //       create: '/v1/sample',
    //     }
    //   }
    // }
};
exports.default = config;
