import mongoose, { Schema } from 'mongoose'

// This is the model you will be modifying
const noteSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notebook: {
    type: Schema.Types.ObjectId,
    ref: "NoteBook"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Note = mongoose.model('Note', noteSchema)

export default Note
