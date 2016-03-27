/**
 * Person model
 */
import mongoose from 'mongoose';

let personSchema = new mongoose.Schema({
  name: {
    first: {type: String},
    last: {type: String}
  },
  address: {
    street: { type: String },
    hno: { type: String },
    zip: { type: Number },
    city: { type: String}
  },
  email: { type: String},
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  updated: { type: Date, default: Date.now },
});
personSchema.virtual('name.full').get(function () {
  return this.name.first + ' ' + this.name.last;
});
personSchema.methods.hasClubRole = function(club, type) {
  if (!this.user) {
    return false;
  } else {
    return this.user.clubRoles.findIndex(clubRole => clubRole.type === type && clubRole.club === club) >= 0;
  }
}

export default mongoose.model('Person', personSchema);
