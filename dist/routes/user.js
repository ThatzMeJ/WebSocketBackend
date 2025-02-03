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
const db_1 = require("../db");
const router = express_1.default.Router();
router.all('/secret', (req, res, next) => {
    console.log('To see if this middleware method is executed before other routes');
    next();
});
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, db_1.query)('SELECT * FROM users');
        res.json(user);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Internal Server error');
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        res.json({ username, email, password });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Internal Server error!' });
    }
}));
router.get('/:id');
exports.default = router;
