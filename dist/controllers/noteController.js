"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shareNote = exports.deleteNote = exports.updateNote = exports.createNote = void 0;
// Create a new note
const createNote = async (req, res) => {
    const errors = validationResult(req);
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
        const newNote = new Note({
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
    const errors = validationResult(req);
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
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid note ID' });
            return;
        }
        let note = await Note.findById(id);
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
        note = await Note.findByIdAndUpdate(id, updateData, { new: true });
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
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid note ID' });
            return;
        }
        const note = await Note.findById(id);
        if (!note) {
            res.status(404).json({ message: 'Note not found' });
            return;
        }
        // Check if user is the owner
        if (note.owner.toString() !== req.user.id) {
            res.status(403).json({ message: 'Access denied' });
            return;
        }
        await Note.findByIdAndDelete(id);
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
    const errors = validationResult(req);
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
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid note ID' });
            return;
        }
        let note = await Note.findById(id);
        if (!note) {
            res.status(404).json({ message: 'Note not found' });
            return;
        }
        // Check if user is the owner
        if (note.owner.toString() !== req.user.id) {
            res.status(403).json({ message: 'Only the owner can share this note' });
            return;
        }
        note = await Note.findByIdAndUpdate(id, {
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
