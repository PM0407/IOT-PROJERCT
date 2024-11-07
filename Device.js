const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },  // E.g., LED, Sensor
  status: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;