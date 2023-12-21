"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const RandomUsers_1 = __importStar(require("./RandomUsers"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)({
    origin: ["https://task5-react-front.vercel.app", "http://localhost:5173"],
}));
app.use(express_1.default.json());
app.get("/api/users", (req, res) => {
    const local = req.query.local;
    const seed = req.query.seed ? +req.query.seed : 0;
    const errors = req.query.errors ? +req.query.errors : 0;
    const page = req.query.page ? +req.query.page : 0;
    const randomUserApi = (0, RandomUsers_1.default)({
        local,
        seed,
        page,
    });
    let users = randomUserApi.getMany();
    if (errors)
        users = users.map((user) => (0, RandomUsers_1.addErrorsToUser)(user, local, errors));
    res.send(users);
});
app.listen(port, () => console.log(`This app is listening on port ${port}`));
