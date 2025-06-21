import mongoose, { Schema, Document } from 'mongoose';

export interface INote extends Document {
  title?: string;
  content?: string;
  owner: mongoose.Types.ObjectId;
  collaborators: string[];
  isShared: boolean;
  lastEdited: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema: Schema = new Schema(
  {
    title: {
      type: String,
      // required: true,
      trim: true
    },
    content: {
      type: String,
      default: ''
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    collaborators: {
      type: [String], // Array of email addresses
      default: []
    },
    isShared: {
      type: Boolean,
      default: false
    },
    lastEdited: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.model<INote>('Note', NoteSchema);
