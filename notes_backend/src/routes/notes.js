const express = require('express');
const controller = require('../controllers/notes');
const { requireAuth } = require('../middleware');

/**
 * @swagger
 * tags:
 *   - name: notes
 *     description: Notes management
 *
 * /notes:
 *   get:
 *     summary: List notes for user
 *     tags: [notes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: tag
 *         schema: { type: string }
 *         description: Tag name to filter
 *       - in: query
 *         name: title
 *         schema: { type: string }
 *         description: Filter by title (partial match)
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Text search
 *     responses:
 *       200:
 *         description: List of notes (with tags)
 *
 *   post:
 *     summary: Create a note
 *     tags: [notes]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title: { type: string }
 *               content: { type: string }
 *               tags:
 *                 type: array
 *                 items: { type: string }
 *     responses:
 *       201:
 *         description: Created note object
 *
 * /notes/{id}:
 *   get:
 *     summary: Get a note by id
 *     tags: [notes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: A note
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update a note
 *     tags: [notes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title: { type: string }
 *               content: { type: string }
 *               tags:
 *                 type: array
 *                 items: { type: string }
 *     responses:
 *       200:
 *         description: Updated note
 *   delete:
 *     summary: Delete a note
 *     tags: [notes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Deleted
 *       404:
 *         description: Not found
 */

const router = express.Router();

router.use(requireAuth);
router.get('/', controller.listNotes);
router.post('/', controller.createNote);
router.get('/:id', controller.getNote);
router.put('/:id', controller.updateNote);
router.delete('/:id', controller.deleteNote);

module.exports = router;
