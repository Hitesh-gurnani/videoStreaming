"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const v1Router = express_1.default.Router();
v1Router.get("/ping", (_, res) => {
    res.json({ message: "pong!" });
});
exports.default = v1Router;
