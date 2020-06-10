"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../configs/config"));
// Database URL
const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS } = config_1.default.env;
let dbURL = '';
if (DB_USER && DB_PASS)
    dbURL = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
else
    dbURL = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
// Import the mongoose module
const options = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
};
mongoose_1.default.connect(dbURL, options);
mongoose_1.default.Promise = global.Promise; // Get Mongoose to use the global promise library
const db = mongoose_1.default.connection; // Get the default connection
// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error: '));
exports.default = db;
