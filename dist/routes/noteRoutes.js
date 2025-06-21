"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const noteController_1 = require("../controllers/noteController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Apply authentication middleware to all routes
router.use(auth_1.authenticate);
// @route   GET /api/notes
// @desc    Get all notes for the authenticated user
// @access  Private
router.get('/', noteController_1.getNotes);
// @route   GET /api/notes/:id
// @desc    Get a specific note by ID
// @access  Private
router.get('/:id', noteController_1.getNoteById);
// @route   POST /api/notes
// @desc    Create a new note
// @access  Private
router.post('/', [
    (0, express_validator_1.body)('title').optional(),
    (0, express_validator_1.body)('content').optional(),
    (0, express_validator_1.body)('collaborators').optional().isArray()
], noteController_1.createNote);
// @route   PUT /api/notes/:id
// @desc    Update a note
// @access  Private
router.put('/:id', [
    (0, express_validator_1.body)('title').optional(),
    (0, express_validator_1.body)('content').optional()
], noteController_1.updateNote);
// @route   DELETE /api/notes/:id
// @desc    Delete a note
// @access  Private
router.delete('/:id', noteController_1.deleteNote);
// @route   POST /api/notes/:id/share
// @desc    Share a note with collaborators
// @access  Private
router.post('/:id/share', [
    (0, express_validator_1.body)('collaborators').isArray().withMessage('Collaborators must be an array')
], noteController_1.shareNote);
exports.default = router;
