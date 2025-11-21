const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, trim: true, default: '' },
  course: { type: String, trim: true, default: 'Backend Development' },
  startDate: { type: String, trim: true, default: '' },
  education: { type: String, trim: true, default: '' },
  city: { type: String, trim: true, default: '' },
  message: { type: String, trim: true, default: '' },
  source: { type: String, trim: true, default: '' },
  createdAt: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = mongoose.model('Inquiry', InquirySchema);
