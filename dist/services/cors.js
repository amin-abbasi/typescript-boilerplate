"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Function to set needed header cors
function initCors(_req, res, next) {
    res.append('Access-Control-Allow-Origin', '');
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append("Access-Control-Allow-Headers", "Origin, Accept,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.append('Access-Control-Allow-Credentials', 'true');
    next();
}
exports.default = initCors;
