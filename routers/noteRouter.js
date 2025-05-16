const { Router } = require("express");
const noteControllers = require("../controllers/noteControllers");
const noteSchema = require("../validation/noteSchema");
const router = Router();

router.get('/notes/all', noteControllers.authenticate, noteControllers.getAllnotes);
router.post('/notes', noteControllers.authenticate, noteSchema.createNoteSchema, noteControllers.createNote);
router.put('/notes/:id', noteControllers.authenticate, noteSchema.updateNoteSchema, noteControllers.updateNote);
router.delete('/notes/:id', noteControllers.authenticate, noteSchema.deleteNoteSchema, noteControllers.deleteNote);
router.get('/notes/:id', noteControllers.authenticate, noteSchema.getNoteSchema, noteControllers.getNote);
module.exports = router;
