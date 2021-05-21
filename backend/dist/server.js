"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var dotenv_1 = __importDefault(require("dotenv"));
var cors_1 = __importDefault(require("cors"));
var routes_1 = __importDefault(require("./routes"));
var body_parser_1 = __importDefault(require("body-parser"));
dotenv_1.default.config();
var app = express_1.default();
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json({ limit: '100mb' }));
var corsOption = {
    origin: true,
    methods: 'GET',
    credentials: true,
};
app.use(cors_1.default(corsOption));
app.use('/api/v1', routes_1.default);
/*
------------------
    Create Server
------------------
*/
var server = http_1.default.createServer(app);
var port = process.env.PORT || 8000;
server.listen(port, function () {
    console.log("App Listening on port " + port + "!!!");
});
