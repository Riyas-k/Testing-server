"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = setupSocketIO;
const socket_io_1 = require("socket.io");
const jwt_1 = require("../utils/jwt");
const config_1 = __importDefault(require("../config"));
function setupSocketIO(server) {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: config_1.default.clientURL,
            methods: ['GET', 'POST'],
            credentials: true
        }
    });
    // Authentication middleware
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error'));
        }
        const decoded = (0, jwt_1.verifyToken)(token);
        if (!decoded) {
            return next(new Error('Invalid token'));
        }
        socket.userId = decoded.id;
        socket.userEmail = decoded.email;
        next();
    });
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.userId}`);
        // Join a note room for real-time collaboration
        socket.on('join:note', ({ noteId }) => {
            const room = `note:${noteId}`;
            socket.join(room);
            console.log(`${socket.userId} joined room ${room}`);
            // Notify others in the room about the new user
            const roomUsers = Array.from(io.sockets.adapter.rooms.get(room) || [])
                .map((id) => {
                const s = io.sockets.sockets.get(id);
                return s.userId;
            })
                .filter(Boolean);
            io.to(room).emit('note:users', roomUsers);
        });
        // Leave a note room
        socket.on('leave:note', ({ noteId }) => {
            const room = `note:${noteId}`;
            socket.leave(room);
            console.log(`${socket.userId} left room ${room}`);
            // Update the list of users in the room
            const roomUsers = Array.from(io.sockets.adapter.rooms.get(room) || [])
                .map((id) => {
                const s = io.sockets.sockets.get(id);
                return s.userId;
            })
                .filter(Boolean);
            io.to(room).emit('note:users', roomUsers);
        });
        // Handle real-time editing
        socket.on('note:editing', (data) => {
            const room = `note:${data.noteId}`;
            // Broadcast to everyone in the room except the sender
            socket.to(room).emit('note:editing', {
                user: socket.userId,
                content: data.content
            });
        });
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.userId}`);
        });
    });
    return io;
}
