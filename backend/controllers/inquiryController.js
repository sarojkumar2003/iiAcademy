const Inquiry = require('../models/Inquiry');
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.createInquiry = async (req, res) => {
  try {
    const { name='', email='', phone='', course='Backend Development', startDate='', education='', city='', message='', source='' } = req.body || {};

    if (!name.trim()) return res.status(400).json({ success: false, error: 'Name is required' });
    if (!email.trim()) return res.status(400).json({ success: false, error: 'Email is required' });
    if (!emailRe.test(email.trim())) return res.status(400).json({ success: false, error: 'Invalid email' });

    const inquiry = new Inquiry({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      course,
      startDate,
      education: education.trim(),
      city: city.trim(),
      message: message.trim(),
      source: source || req.ip
    });

    await inquiry.save();
    return res.status(201).json({ success: true, data: { id: inquiry._id } });
  } catch (err) {
    console.error('createInquiry error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};
