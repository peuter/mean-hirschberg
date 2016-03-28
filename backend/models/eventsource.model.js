/**
 * event.model.js
 *
 * @author tobiasb
 * @since 2016
 */
import mongoose from 'mongoose';

let eventSourceSchema = new mongoose.Schema({
  name: String,
  url: String,
  type: {type: String, enum: ['ical'], default: 'ical'},
  read: { type: Boolean, default: true },
  write: { type: Boolean, default: false },
  active: { type: Boolean, default: true }
});

export default mongoose.model('EventSource', eventSourceSchema);
