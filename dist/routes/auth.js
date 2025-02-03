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
const express_1 = __importDefault(require("express"));
const bcryptUtil_1 = require("../utility/bcryptUtil");
const db_1 = require("../db");
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.json({ message: 'OMG Im in auth routes' });
});
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: "Email and password are required." });
        }
        const emailCheck = yield (0, db_1.query)('SELECT user_email FROM users WHERE user_email = $1', [email]);
        if (emailCheck.rows.length < 0) {
            res.status(404).json({ error: "There was a problem with you login credentials. Please try again" });
            return;
        }
        const userPassword = yield (0, db_1.query)('SELECT user_password FROM users WHERE user_email = $1', [emailCheck.rows[0].user_email]);
        const comparePasswords = yield (0, bcryptUtil_1.comparePassword)(password, userPassword.rows[0].user_password);
        res.json(comparePasswords);
        yield (0, db_1.query)('SELECT 1 FROM users WHERE user_email = $1 ');
    }
    catch (error) {
        console.error(error);
    }
}));
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        if (!email || !username || !password) {
            res.status(400).json({ error: 'Please fill in credentials.' });
        }
        // Check if email already exists in the database
        const emailCheck = yield (0, db_1.query)('SELECT 1 FROM users WHERE user_email = $1 LIMIT 1', [email]);
        if (emailCheck.rows.length > 0) {
            res.status(400).json({ error: 'Email already exists.' });
            return;
        }
        // Check if username already exists in the database
        const usernameCheck = yield (0, db_1.query)('SELECT 1 FROM users WHERE user_username = $1 LIMIT 1', [username]);
        if (usernameCheck.rows.length > 0) {
            res.status(400).json({ error: 'Username already exists.' });
            return;
        }
        const securePass = yield (0, bcryptUtil_1.hashPassword)(password);
        yield (0, db_1.query)(`INSERT INTO users (user_username, user_email,user_password) VALUES ($1, $2, $3)`, [username, email, securePass]);
        res.status(201).json({
            message: 'User successfully created.',
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Internal Server error!' });
    }
}));
router.post('/logout');
exports.default = router;
