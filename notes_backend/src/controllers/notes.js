//
// Notes API controller (CRUD, search, tagging, etc.)
//
const notesModel = require('../models/note');

// PUBLIC_INTERFACE
async function createNote(req, res) {
  /**
   * Create a new note for this user.
   * ---
   * req.body: {title, content, tags?}
   */
  const { title, content, tags } = req.body;
  if (!title || !content) {
    return res.status(400).json({ msg: 'Title and content required.' });
  }
  try {
    const note = await notesModel.createNote({
      title,
      content,
      user_id: req.user.id,
      tags: Array.isArray(tags) ? tags : [],
    });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to create note', error: err.message });
  }
}

// PUBLIC_INTERFACE
async function updateNote(req, res) {
  /**
   * Update an existing note (must be owned).
   * ---
   * req.params.id, req.body: {title, content, tags?}
   */
  const { id } = req.params;
  const { title, content, tags } = req.body;
  if (!title || !content) {
    return res.status(400).json({ msg: 'Title and content required.' });
  }
  try {
    const note = await notesModel.updateNote({
      id,
      title,
      content,
      tags: Array.isArray(tags) ? tags : [],
      user_id: req.user.id,
    });
    res.status(200).json(note);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update note', error: err.message });
  }
}

// PUBLIC_INTERFACE
async function deleteNote(req, res) {
  /**
   * Delete a note owned by this user
   */
  const { id } = req.params;
  try {
    const affected = await notesModel.deleteNote(id, req.user.id);
    if (!affected) {
      return res.status(404).json({ msg: 'Note not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete note', error: err.message });
  }
}

// PUBLIC_INTERFACE
async function getNote(req, res) {
  /**
   * Get a note by id for this user, with tags
   */
  const { id } = req.params;
  try {
    const note = await notesModel.getNoteById(id, req.user.id);
    if (!note) return res.status(404).json({ msg: 'Note not found' });
    res.status(200).json(note);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to get note', error: err.message });
  }
}

// PUBLIC_INTERFACE
async function listNotes(req, res) {
  /**
   * List all notes for this user with optional filtering. Query: tag, title, search.
   */
  const filters = {
    user_id: req.user.id,
    tag: req.query.tag,
    title: req.query.title,
    search: req.query.search,
  };
  try {
    const notes = await notesModel.listNotes(filters);
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch notes', error: err.message });
  }
}

module.exports = {
  createNote,
  updateNote,
  deleteNote,
  getNote,
  listNotes,
};
