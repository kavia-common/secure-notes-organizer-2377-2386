//
// Note model and DB access helpers
//
const pool = require('../db/mysql');

// PUBLIC_INTERFACE
async function createNote({ title, content, user_id, tags }) {
  /**
   * Create a note and attach tags (as array of string).
   * Returns the created note including assigned id.
   */
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [noteResult] = await conn.query(
      'INSERT INTO notes (title, content, user_id, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
      [title, content, user_id]
    );
    const noteId = noteResult.insertId;
    if (tags && tags.length) {
      await createOrAttachTags(conn, noteId, tags);
    }
    const [rows] = await conn.query(
      'SELECT * FROM notes WHERE id = ? LIMIT 1', [noteId]
    );
    await conn.commit();
    return rows[0];
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

// Helper: Upsert tags and connect to note
async function createOrAttachTags(conn, noteId, tags) {
  for (const tagName of tags) {
    const [[tagRow]] = await conn.query(
      'SELECT id FROM tags WHERE name = ?',
      [tagName]
    );
    let tagId = tagRow && tagRow.id;
    if (!tagId) {
      const [result] = await conn.query(
        'INSERT INTO tags (name) VALUES (?)', [tagName]
      );
      tagId = result.insertId;
    }
    await conn.query(
      'INSERT IGNORE INTO note_tags (note_id, tag_id) VALUES (?, ?)',
      [noteId, tagId]
    );
  }
}

// PUBLIC_INTERFACE
async function updateNote({ id, title, content, tags, user_id }) {
  /**
   * Update note fields and tags for this note id/user id.
   * Returns updated note row.
   */
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query(
      'UPDATE notes SET title=?, content=?, updated_at=NOW() WHERE id=? AND user_id=?',
      [title, content, id, user_id]
    );
    // Update tags: remove old, set new
    await conn.query('DELETE FROM note_tags WHERE note_id = ?', [id]);
    if (tags && tags.length) {
      await createOrAttachTags(conn, id, tags);
    }
    const [rows] = await conn.query('SELECT * FROM notes WHERE id = ? LIMIT 1', [id]);
    await conn.commit();
    return rows[0];
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

// PUBLIC_INTERFACE
async function deleteNote(noteId, user_id) {
  /**
   * Delete note for this user (id/user_id match). Also cleans up note_tags.
   * Returns affected rows count.
   */
  const [result] = await pool.query(
    'DELETE FROM notes WHERE id=? AND user_id=?',
    [noteId, user_id]
  );
  return result.affectedRows;
}

// PUBLIC_INTERFACE
async function getNoteById(id, user_id) {
  /**
   * Get a single note owned by user, including tags array.
   */
  const [[note]] = await pool.query(
    'SELECT * FROM notes WHERE id=? AND user_id=?',
    [id, user_id]
  );
  if (!note) return null;
  const [tags] = await pool.query(
    'SELECT t.name FROM tags t INNER JOIN note_tags nt ON t.id = nt.tag_id WHERE nt.note_id = ?',
    [id]
  );
  return { ...note, tags: tags.map(row => row.name) };
}

// PUBLIC_INTERFACE
async function listNotes({ user_id, tag, title, search }) {
  /**
   * List notes owned by user with optional filtering by tag, title, or search
   */
  let query = `
    SELECT DISTINCT n.* FROM notes n
    LEFT JOIN note_tags nt ON n.id = nt.note_id
    LEFT JOIN tags t ON nt.tag_id = t.id
    WHERE n.user_id = ?
  `;
  const args = [user_id];
  if (tag) {
    query += ' AND t.name = ?';
    args.push(tag);
  }
  if (title) {
    query += ' AND n.title LIKE ?';
    args.push('%' + title + '%');
  }
  if (search) {
    query += ' AND (n.title LIKE ? OR n.content LIKE ?)';
    args.push('%' + search + '%', '%' + search + '%');
  }
  query += ' ORDER BY n.updated_at DESC';
  const [rows] = await pool.query(query, args);

  // Attach tags array for each note
  const noteIds = rows.map(r => r.id);
  let tagMap = {};
  if (noteIds.length) {
    const [tags] = await pool.query(
      `SELECT nt.note_id, t.name FROM note_tags nt 
       INNER JOIN tags t ON nt.tag_id = t.id
       WHERE nt.note_id IN (${noteIds.map(() => '?').join(',')})`, noteIds
    );
    tagMap = tags.reduce((acc, row) => {
      if (!acc[row.note_id]) acc[row.note_id] = [];
      acc[row.note_id].push(row.name);
      return acc;
    }, {});
  }
  return rows.map(note => ({
    ...note,
    tags: tagMap[note.id] || [],
  }));
}

module.exports = {
  createNote,
  updateNote,
  deleteNote,
  getNoteById,
  listNotes,
};
