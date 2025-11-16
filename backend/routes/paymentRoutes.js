const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { makePayment, downloadCertificate } = require('../controllers/paymentController');

router.post('/payment', protect, makePayment);
router.get('/certificate', protect, downloadCertificate);

module.exports = router;
