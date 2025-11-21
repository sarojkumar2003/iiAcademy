const express = require('express');
const router = express.Router();
const controller = require('../controllers/inquiryController');

router.post('/', controller.createInquiry);
router.get('/', (req, res) => res.json({ success: true, message: 'Use admin route with header x-admin-key' }));

module.exports = router;
