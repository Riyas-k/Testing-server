Collaborative Notes App
A real-time collaborative notes application built with Next.js (frontend) and Node.js/Express (backend), allowing users to create, edit, and share notes with real-time updates.

Live Demo
Frontend: https://testing-mavens-client.vercel.app/
Backend: https://testing-server-z2ib.onrender.com
Repositories
Client: https://github.com/Riyas-k/Testing-Mavens-client.git
Server: https://github.com/Riyas-k/Testing-server.git
Features
User Authentication: Secure register and login functionality
Personal Notes Management: Create, edit, and delete notes
Real-time Collaboration: See changes instantly across multiple devices/tabs
Collaborative Editing: Work together on shared notes
Markdown Support: Rich text editing with live preview
Responsive Design: Works on desktop and mobile devices
Tech Stack
Frontend
Next.js with App Router for routing and server components
TypeScript for type safety
Tailwind CSS for styling
Zustand for state management
Socket.IO Client for real-time communication
Zod for form validation
Markdown-it for rendering markdown content
Backend
Node.js with Express framework
MongoDB with Mongoose ODM
JWT for authentication
Socket.IO for WebSocket communication
Express Validator for input validation
Docker for containerization
Getting Started
Prerequisites
Node.js (v18 or later)
MongoDB
Git
Setup and Installation
Frontend Setup
Clone the client repository

bash

Hide
git clone https://github.com/Riyas-k/Testing-Mavens-client.git
cd Testing-Mavens-client
Install dependencies

bash

Hide
npm install
Create a .env.local file in the root directory with the following content

plaintext

Hide
NEXT_PUBLIC_API_URL=http://localhost:5000
Start the development server

bash

Hide
npm run dev
The client will be available at http://localhost:3000

Backend Setup
Clone the server repository

bash

Hide
git clone https://github.com/Riyas-k/Testing-server.git
cd Testing-server
Install dependencies

bash

Hide
npm install
Create a .env file in the root directory with the following content

plaintext

Hide
PORT=5000
MONGODB_URI=mongodb://localhost:27017/notes-app
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000
Start the development server

bash

Hide
npm run dev
The server will be available at http://localhost:5000

API Endpoints
Authentication
POST /api/auth/register - Register a new user
POST /api/auth/login - Login a user
GET /api/auth/me - Get current user details
Notes
GET /api/notes - Get all notes for the authenticated user
GET /api/notes/:id - Get a specific note
POST /api/notes - Create a new note
PUT /api/notes/:id - Update a note
DELETE /api/notes/:id - Delete a note
POST /api/notes/:id/share - Share a note with collaborators
WebSocket Events
Client to Server
join:note - Join a note's room for real-time collaboration
leave:note - Leave a note's room
note:editing - Send note content while editing
Server to Client
note:created - A new note was created
note:updated - A note was updated
note:deleted - A note was deleted
note:editing - Someone is editing the note
note:users - List of users currently viewing/editing a note
Project Structure
Client
plaintext

Hide
client/
├── app/                  # Next.js app router
│   ├── (auth)/           # Authentication pages
│   ├── dashboard/        # Dashboard page
│   ├── notes/            # Notes pages
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── auth/             # Authentication components
│   ├── layout/           # Layout components
│   ├── notes/            # Note-related components
│   └── ui/               # UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── store/                # Zustand state management
├── types/                # TypeScript type definitions
└── styles/               # Global styles
Server
plaintext

Hide
server/
├── src/
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Express middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # Express routes
│   ├── socket/           # Socket.IO setup
│   ├── utils/            # Utility functions
│   ├── config.ts         # Configuration
│   ├── db.ts             # Database connection
│   └── index.ts          # Entry point
└── tests/                # Test files
Deployment
Frontend (Vercel)
Connect your GitHub repository to Vercel
Set the environment variables in Vercel dashboard:
NEXT_PUBLIC_API_URL=https://testing-server-z2ib.onrender.com
Deploy the application
Backend (Render)
Connect your GitHub repository to Render
Set the environment variables in Render dashboard:
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
CLIENT_URL=https://testing-mavens-client.vercel.app
Deploy the application
Future Enhancements
Add search functionality for notes
Implement note categories/tags
Add rich text editor with formatting options
Implement version history for notes
Add offline support with sync
Contributing
Fork the repositories
Create your feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request
License
This project is licensed under the MIT License