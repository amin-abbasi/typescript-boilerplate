"use strict";
// -------------------------------------- Initialize redis + config --------------------------------------
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = __importDefault(require("redis"));
const config_1 = __importDefault(require("../configs/config"));
const { REDIS_HOST, REDIS_PORT } = config_1.default.env;
const redisURL = `redis://${REDIS_HOST}:${REDIS_PORT}`;
const client = redis_1.default.createClient(redisURL);
// import { promisify }  from 'util'
// const getAsync  = promisify(client.get).bind(client)
client.on('connect', () => { console.log(`<<<< Connected to Redis >>>>`); });
client.on('error', err => { console.log(`Redis Error: ${err}`); });
// Redis functions
// function create(id: any, value: any, type: any) {
//   return Promise.resolve( client.set(`${type}:${id}`, JSON.stringify(value)) )
// }
// async function fetch(keyPattern: string) {
//   try {
//     const result = await getAsync(keyPattern)
//     console.log('>>>>>>>> getAsync result: ', result)
//     if(!result) return false
//     return JSON.parse(result)
//   }
//   catch (err) {
//     console.log('Redis Error - Fetch Data: ', err)
//     throw err
//   }
// }
// const exportResult = { create, fetch }
exports.default = client;
