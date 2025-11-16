// controllers/paymentController.js
const Payment = require('../models/Payment');
const User = require('../models/User');

// Payment Processing (Simulated for the sake of this example)
const makePayment = async (req, res) => {
  try {
    // If admin triggers payment they can pass userId in body (fallback to req.user.userId)
    const targetUserId = req.body.userId || req.user?.userId;
    if (!targetUserId) return res.status(400).json({ message: 'UserId required' });

    const user = await User.findById(targetUserId);
    if (!user) return res.status(400).json({ message: 'User not found' });

    const payment = new Payment({
      userId: user._id,
      amount: req.body.amount || 200,
      paymentStatus: 'completed',
      transactionId: req.body.transactionId || `tx_${Date.now()}`,
    });

    await payment.save();

    // Mark user as having paid
    user.hasPaid = true;
    user.paymentStatus = payment._id;
    await user.save();

    res.json({ message: 'Payment successful, certificate unlocked!', payment });
  } catch (error) {
    console.error('[PAYMENT] makePayment error:', error);
    res.status(500).json({ message: 'Error processing payment', error: error.message });
  }
};

// Download Certificate (Only if the user has paid)
const downloadCertificate = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(400).json({ message: 'User not found in request' });

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: 'User not found' });

    if (!user.hasPaid) {
      return res.status(400).json({ message: 'Please complete payment to download the certificate' });
    }

    // Simulate certificate download
    const certPath = path.join(__dirname, '..', 'certificates', 'sample-certificate.pdf');
    if (!fs.existsSync(certPath)) {
      return res.status(404).json({ message: 'Certificate file not found on server' });
    }
    res.download(certPath);
  } catch (error) {
    console.error('[PAYMENT] downloadCertificate error:', error);
    res.status(500).json({ message: 'Error downloading certificate', error: error.message });
  }
};

module.exports = { makePayment, downloadCertificate };
