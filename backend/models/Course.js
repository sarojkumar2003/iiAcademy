// models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  // optional slug if you want friendly URLs in future:
  // slug: { type: String, unique: true, sparse: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },  // Duration in days
  instructor: { type: String, required: true },
}, {
  timestamps: true, // adds createdAt and updatedAt
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
