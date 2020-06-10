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
exports.request = exports.jwt = exports.tryJSON = exports.findProp = void 0;
const boom_1 = require("@hapi/boom");
const util_1 = require("util");
const node_fetch_1 = __importDefault(require("node-fetch"));
const config_1 = __importDefault(require("../configs/config"));
const redis_1 = __importDefault(require("./redis"));
/**
 * Find Property
 * @param   properties  array of property objects
 * @param   label       `string` label to be found in properties
 * @return  returns object of property or returns `null` if not found any
 */
function findProp(properties, label) {
    for (let index = 0; index < properties.length; index++) {
        const property = properties[index];
        if (property.label === label)
            return property;
    }
    return null;
}
exports.findProp = findProp;
/**
 * Check if an object is JSON
 * @param   object  an object to be parsed to JSON
 * @return  return valid object if it is JSON, and return `null` if it isn't
 */
function tryJSON(object) {
    try {
        return JSON.parse(object);
    }
    catch (e) {
        return null;
    }
}
exports.tryJSON = tryJSON;
// JWT Token Functions
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.jwt = {
    // Creates JWT Token
    create(data, expire = config_1.default.jwt.expiration) {
        const secretKey = config_1.default.jwt.key;
        const options = {
            expiresIn: expire,
            algorithm: config_1.default.jwt.algorithm
        };
        return jsonwebtoken_1.default.sign(data, secretKey, options);
    },
    // Creates Non Expire JWT Token (Caching is temporarily disabled)
    createNonExpire(data) {
        const token = jsonwebtoken_1.default.sign(data, config_1.default.jwt.key, { algorithm: config_1.default.jwt.algorithm });
        const key = `${config_1.default.jwt.cache_prefix}${token}`;
        redis_1.default.set(key, 'valid');
        return token;
    },
    // Blocks JWT Token from cache
    block(token) {
        const decoded = jsonwebtoken_1.default.decode(token);
        const key = `${config_1.default.jwt.cache_prefix}${token}`;
        if (!!(decoded === null || decoded === void 0 ? void 0 : decoded.exp)) {
            const expiration = decoded.exp - Date.now();
            redis_1.default.multi().set(key, "blocked").expire(key, expiration).exec();
        }
        else {
            redis_1.default.del(key);
        }
    },
    // Renew JWT Token when is going to be expired
    renew(token, routePlugins, expire) {
        if (!token)
            throw new Error('Token is undefined');
        if ((!config_1.default.jwt.allow_renew && routePlugins.jwtRenew == undefined) || (routePlugins.jwtRenew == false))
            throw new Error('Renewing tokens is not allowed');
        const decoded = jsonwebtoken_1.default.decode(token);
        if (!decoded.exp)
            return token;
        if ((decoded.exp - Date.now()) > config_1.default.jwt.renew_threshold)
            return token;
        // this.block(token, decoded)
        delete decoded.iat;
        delete decoded.exp;
        return this.create(decoded, expire || config_1.default.jwt.expiration);
    },
    // Checks the validity of JWT Token
    isValid(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const key = `${config_1.default.jwt.cache_prefix}${token}`;
                const asyncRedisGet = util_1.promisify(redis_1.default.get);
                const value = yield asyncRedisGet((key));
                const decoded = jsonwebtoken_1.default.decode(token);
                if (decoded.exp) {
                    if (value === null)
                        return true;
                    return false;
                }
                else {
                    if (value === null)
                        return false;
                    return true;
                }
            }
            catch (err) {
                throw Error('Can not validate because cache app is not responsive');
            }
        });
    }
};
/**
 * Request Function
 * @param   url       an endpoint URL to call to
 * @param   opt       an object for request options, containing `method`, `body`, `headers`, ...
 * @param   output    output format for response: `json` or `text`
 * @return  returns request response
 */
function request(url, opt, output) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const defaultOutput = output ? output : 'json';
            const res = yield node_fetch_1.default(url, opt);
            if (!res.ok)
                throw new boom_1.Boom(`Error response: `, { statusCode: res.status, data: opt.body });
            if (defaultOutput === "json")
                return res.json();
            else
                return res.text();
        }
        catch (error) {
            console.log(` >>>> Node-Fetch Error: ${error}`);
            return error;
        }
    });
}
exports.request = request;
