import express from 'express'
import Note from '../models/Notes.js'
import { authMiddleware } from '../utils/auth.js'

const router = express.Router()

// Apply authMiddleware to all routes in this file
router.use(authMiddleware)

// GET /api/notes - Get all notes for the logged-in user
// THIS IS THE ROUTE THAT CURRENTLY HAS THE FLAW
router.get('/', async (req, res) => {
  // This currently finds all notes in the database.
  // It should only find notes owned by the logged in user.
  try {
    const notes = await Note.find({ user: req.user._id })
    res.json(notes)
  } catch (err) {
    res.status(500).json(err)
  }
})

// GET route /api/note/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const note = await Note.findById(id)

    if (!note) {
      return res.status(404).json({ message: 'Not not found' })
    }

    if (!note.user.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: 'User is not authorized to veiw note' })
    }

    res.json(note)
  } catch (error) {
    res.status(500).json(error)
  }
})

// POST /api/notes - Create a new note
router.post('/', async (req, res) => {
  try {
    const note = await Note.create({
      ...req.body, // Spreading the request thru-out the body
      user: req.user._id // The user ID needs to be added here
    })
    res.status(201).json(note)
  } catch (err) {
    res.status(400).json(err)
  }
})

// PUT /api/notes/:id - Update a note
router.put('/:id', async (req, res) => {
  try {
    // This needs an authorization check
    const note = await Note.findById(req.params.id)

    if (!note) {
      return res.status(404).json({ message: 'No note found with this id!' })
    }

    if (!note.user.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: 'Updates for this content by User are not permitted' })
    }

    const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })

    res.json(updatedNote)
  } catch (err) {
    res.status(500).json(err)
  }
})

// DELETE /api/notes/:id - Delete a note
router.delete('/:id', async (req, res) => {
  try {
    // This needs an authorization check
    const note = await Note.findByIdAndDelete(req.params.id)
    if (!note) {
      return res.status(404).json({ message: 'No note found with this id!' })
    }

    if (!note.user.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: 'User is not authorized to delete this content' })
    }
    await note.deleteOne()
    res.json({ message: 'Note deleted!' })
  } catch (err) {
    res.status(500).json(err)
  }
})

export default router
