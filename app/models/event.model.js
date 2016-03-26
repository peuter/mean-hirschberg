/**
 * event.model.js
 *
 * @author tobiasb
 * @since 2016
 */
import mongoose from 'mongoose';

let eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'Club'},
  location: String,
  picture: Buffer,
  attachment: Buffer,
  start: Date,
  end: Date,
  allDay: Boolean,
  link: String,
  exports: [{
    target: String,
    url: String
  }],  
  _creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

export default mongoose.model('Event', eventSchema);
