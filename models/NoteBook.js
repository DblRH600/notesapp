import mongoose, { Schema } from 'mongoose'

const noteBookSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Note'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const NoteBook = mongoose.model('NoteBook', noteBookSchema)

export default NoteBook
