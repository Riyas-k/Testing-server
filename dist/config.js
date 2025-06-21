"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    port: process.env.PORT || 5000,
    mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/notes-app',
    jwtSecret: process.env.JWT_SECRET || 'secret',
    jwtExpire: process.env.JWT_EXPIRE || '30d',
    nodeEnv: process.env.NODE_ENV || 'development',
    clientURL: process.env.CLIENT_URL || 'http://localhost:3000'
};
exports.default = config;
