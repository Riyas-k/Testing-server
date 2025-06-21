"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const db_1 = __importDefault(require("./db"));
const config_1 = __importDefault(require("./config"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const noteRoutes_1 = __importDefault(require("./routes/noteRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
const socket_1 = __importDefault(require("./socket"));
// Connect to MongoDB
(0, db_1.default)();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// Setup Socket.IO
const io = (0, socket_1.default)(server);
// Middleware
app.use((0, cors_1.default)({
    origin: config_1.default.clientURL,
    credentials: true
}));
app.use(express_1.default.json());
// Make io available to routes
app.use((req, res, next) => {
    req.io = io;
    next();
});
// Routes
// Mount auth routes at both /api/auth and /auth to support both formats
app.use('/api/auth', authRoutes_1.default);
app.use('/auth', authRoutes_1.default); // Add this line to support /auth routes directly
// Mount note routes at both /api/notes and /notes
app.use('/api/notes', noteRoutes_1.default);
app.use('/notes', noteRoutes_1.default); // Add this line to support /notes routes directly
// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
// Error handling middleware
app.use(errorHandler_1.notFound);
app.use(errorHandler_1.errorHandler);
// Start server
const PORT = config_1.default.port;
server.listen(PORT, () => {
    console.log(`Server running in ${config_1.default.nodeEnv} mode on port ${PORT}`);
});
