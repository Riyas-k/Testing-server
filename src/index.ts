import express from 'express';
import cors from 'cors';
import http from 'http';
import connectDB from './db';
import config from './config';
import authRoutes from './routes/authRoutes';
import noteRoutes from './routes/noteRoutes';
import { notFound, errorHandler } from './middleware/errorHandler';
import setupSocketIO from './socket';

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

app.get('/', (req, res) => {
  res.send('API is running...');
});


// Setup Socket.IO
const io = setupSocketIO(server);

// Middleware
app.use(cors({
  origin: config.clientURL,
  credentials: true
}));
app.use(express.json());

// Make io available to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
// Mount auth routes at both /api/auth and /auth to support both formats
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes); // Add this line to support /auth routes directly

// // Mount note routes at both /api/notes and /notes
// app.use('/api/notes', noteRoutes);
// app.use('/notes', noteRoutes); // Add this line to support /notes routes directly

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});



// Error handling middleware
// app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = config.port;
server.listen(PORT, () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
});
