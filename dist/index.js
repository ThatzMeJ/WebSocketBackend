"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const user_1 = __importDefault(require("./routes/user"));
const auth_1 = __importDefault(require("./routes/auth"));
const db_1 = __importDefault(require("./db"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
db_1.default.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    client === null || client === void 0 ? void 0 : client.query('SELECT NOW()', (err, result) => {
        release();
        if (err) {
            return console.error('Error executing query', err.stack);
        }
        console.log("Connected to Database !");
    });
});
const PORT = process.env.PORT || 3001;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/v1/auth', auth_1.default);
app.use('/v1/users', user_1.default);
app.get('/', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
