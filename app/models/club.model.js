/**
 * Club model (Verein)
 */
import mongoose from 'mongoose';

let clubSchema = new mongoose.Schema({
  _id             : Number,
  name            : String,
  foundationYear  : Number,
  updated         : { type: Date, default: Date.now },
  logo            : Buffer,
  contact         : { type: mongoose.Schema.Types.ObjectId, ref: 'Person'}
});

export default mongoose.model('Club', clubSchema);
