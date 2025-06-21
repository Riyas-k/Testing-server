"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shareNote = exports.deleteNote = exports.updateNote = exports.createNote = exports.getNoteById = exports.getNotes = void 0;
const express_validator_1 = require("express-validator");
const mongoose_1 = __importDefault(require("mongoose"));
const Note_1 = __importDefault(require("../models/Note"));
// Get all notes for a user
const getNotes = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        const notes = await Note_1.default.find({
            $or: [
                { owner: req.user.id },
                { collaborators: req.user.email }
            ]
        }).sort({ updatedAt: -1 });
        res.json(notes);
    }
    catch (error) {
        console.error('Error in getNotes:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getNotes = getNotes;
// Get a specific note
const getNoteById = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        const { id } = req.params;
        // Validate ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid note ID' });
            return;
        }
        const note = await Note_1.default.findById(id);
        if (!note) {
            res.status(404).json({ message: 'Note not found' });
            return;
        }
        // Check if user has access to this note
        const isOwner = note.owner.toString() === req.user.id;
        const isCollaborator = note.collaborators.includes(req.user.email);
        if (!isOwner && !isCollaborator) {
            res.status(403).json({ message: 'Access denied' });
            return;
        }
        res.json(note);
    }
    catch (error) {
        console.error('Error in getNoteById:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getNoteById = getNoteById;
// Create a new note
const createNote = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        const { title, content, collaborators = [] } = req.body;
        const newNote = new Note_1.default({
            title,
            content,
            owner: req.user.id,
            collaborators,
            isShared: collaborators.length > 0,
            lastEdited: new Date()
        });
        const savedNote = await newNote.save();
        // Emit socket event for real-time updates
        if (req.io) {
            req.io.emit('note:created', savedNote);
        }
        res.status(201).json(savedNote);
    }
    catch (error) {
        console.error('Error in createNote:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createNote = createNote;
// Update a note
const updateNote = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        const { id } = req.params;
        const { title, content } = req.body;
        console.log(req.body, 'body');
        // Validate ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid note ID' });
            return;
        }
        let note = await Note_1.default.findById(id);
        if (!note) {
            res.status(404).json({ message: 'Note not found' });
            return;
        }
        // Check if user has permission to update
        const isOwner = note.owner.toString() === req.user.id;
        const isCollaborator = note.collaborators.includes(req.user.email);
        if (!isOwner && !isCollaborator) {
            res.status(403).json({ message: 'Access denied' });
            return;
        }
        // Update fields
        const updateData = {
            lastEdited: new Date()
        };
        if (title !== undefined)
            updateData.title = title;
        if (content !== undefined)
            updateData.content = content;
        note = await Note_1.default.findByIdAndUpdate(id, updateData, { new: true });
        // Emit socket event for real-time updates
        if (req.io) {
            req.io.emit('note:updated', note);
            req.io.to(`note:${id}`).emit('note:updated', note);
        }
        res.json(note);
    }
    catch (error) {
        console.error('Error in updateNote:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateNote = updateNote;
// Delete a note
const deleteNote = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        const { id } = req.params;
        // Validate ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid note ID' });
            return;
        }
        const note = await Note_1.default.findById(id);
        if (!note) {
            res.status(404).json({ message: 'Note not found' });
            return;
        }
        // Check if user is the owner
        if (note.owner.toString() !== req.user.id) {
            res.status(403).json({ message: 'Access denied' });
            return;
        }
        await Note_1.default.findByIdAndDelete(id);
        // Emit socket event for real-time updates
        if (req.io) {
            req.io.emit('note:deleted', id);
            req.io.to(`note:${id}`).emit('note:deleted', id);
        }
        res.json({ message: 'Note deleted' });
    }
    catch (error) {
        console.error('Error in deleteNote:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteNote = deleteNote;
// Share a note with collaborators
const shareNote = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        const { id } = req.params;
        const { collaborators } = req.body;
        // Validate ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid note ID' });
            return;
        }
        let note = await Note_1.default.findById(id);
        if (!note) {
            res.status(404).json({ message: 'Note not found' });
            return;
        }
        // Check if user is the owner
        if (note.owner.toString() !== req.user.id) {
            res.status(403).json({ message: 'Only the owner can share this note' });
            return;
        }
        note = await Note_1.default.findByIdAndUpdate(id, {
            collaborators,
            isShared: collaborators.length > 0,
            lastEdited: new Date()
        }, { new: true });
        // Emit socket event for real-time updates
        if (req.io) {
            req.io.emit('note:updated', note);
            req.io.to(`note:${id}`).emit('note:updated', note);
        }
        res.json(note);
    }
    catch (error) {
        console.error('Error in shareNote:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.shareNote = shareNote;
