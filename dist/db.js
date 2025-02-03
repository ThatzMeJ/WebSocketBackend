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
exports.query = exports.pool = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load environment variables from a .env file
// Create a PostgreSQL pool
exports.pool = new pg_1.Pool({
    user: process.env.DB_USER, // PostgreSQL username
    host: process.env.DB_HOST, // Database host (e.g., localhost)
    database: process.env.DB_NAME, // Database name
    password: process.env.DB_PASS, // PostgreSQL password
    port: Number(process.env.DB_PORT), // PostgreSQL port (default is 5432)
});
// Optionally, create a query helper to simplify database access
const query = (text, params) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield exports.pool.connect();
    try {
        const result = yield client.query(text, params);
        return result;
    }
    finally {
        client.release();
    }
});
exports.query = query;
exports.default = exports.pool;
