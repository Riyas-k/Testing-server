import express from 'express';
import { body } from 'express-validator';
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  shareNote
} from '../controllers/noteController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// @route   GET /api/notes
// @desc    Get all notes for the authenticated user
// @access  Private
router.get('/', getNotes);

// @route   GET /api/notes/:id
// @desc    Get a specific note by ID
// @access  Private
router.get('/:id', getNoteById);

// @route   POST /api/notes
// @desc    Create a new note
// @access  Private
router.post(
  '/',
  [
    body('title').optional(),
    body('content').optional(),
    body('collaborators').optional().isArray()
  ],
  createNote
);

// @route   PUT /api/notes/:id
// @desc    Update a note
// @access  Private
router.put(
  '/:id',
  [
    body('title').optional(),
    body('content').optional()
  ],
  updateNote
);

// @route   DELETE /api/notes/:id
// @desc    Delete a note
// @access  Private
router.delete('/:id', deleteNote);

// @route   POST /api/notes/:id/share
// @desc    Share a note with collaborators
// @access  Private
router.post(
  '/:id/share',
  [
    body('collaborators').isArray().withMessage('Collaborators must be an array')
  ],
  shareNote
);

export default router;
