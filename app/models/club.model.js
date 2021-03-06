/**
 * Club model (Verein)
 */
import mongoose from 'mongoose';

let clubSchema = new mongoose.Schema({
  name            : String,
  foundationYear  : Number,
  updated         : { type: Date, default: Date.now },
  logo            : Buffer,
  contact         : { type: mongoose.Schema.Types.ObjectId, ref: 'Person'},
  contactRole     : String,
  homepage        : String,
  emailAddress    : String,
  facebookUrl     : String,
  externalUid     : String
});

export default mongoose.model('Club', clubSchema);
