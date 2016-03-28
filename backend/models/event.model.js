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
  picture: String,
  attachment: String,
  start: Date,
  end: Date,
  allDay: Boolean,
  link: String,
  exports: [{
    source: { type: mongoose.Schema.Types.ObjectId, ref: 'EventSource'},
    uid: String
  }],
  updated: { type: Date, default: Date.now },
  _creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

export default mongoose.model('Event', eventSchema);
