const express = require('express');
const router = express.Router();
const PayOS = require('@payos/node');
const dotenv = require('dotenv');

dotenv.config();

const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);

router.post('/create-payment', async (req, res) => {
  const YOUR_DOMAIN = 'http://localhost:5000';
  
  const body = {
    orderCode: Number(String(Date.now()).slice(-6)),
    amount: 50000,
    description: 'Test don hang',
    items: [
      {
        name: 'San pham mau',
        quantity: 1,
        price: 50000,
      },
    ],
    returnUrl: `${YOUR_DOMAIN}/payment-success`,
    cancelUrl: `${YOUR_DOMAIN}/payment-cancel`,
  };

  try {
    const paymentLinkResponse = await payOS.createPaymentLink(body);
    
    // Log response for debugging
    console.log('PayOS Response:', JSON.stringify(paymentLinkResponse, null, 2));

    // Kiểm tra xem paymentLinkResponse có phải là response trực tiếp không
    const paymentData = paymentLinkResponse.hasOwnProperty('data') 
      ? paymentLinkResponse.data 
      : paymentLinkResponse;

    if (paymentData && paymentData.checkoutUrl) {
      return res.status(200).json({
        success: true,
        data: {
          paymentLink: paymentData.checkoutUrl,
          qrCode: paymentData.qrCode,
          status: paymentData.status,
          orderCode: paymentData.orderCode,
          amount: paymentData.amount,
          accountName: paymentData.accountName,
          accountNumber: paymentData.accountNumber,
          description: paymentData.description
        }
      });
    }

    return res.status(400).json({
      success: false,
      message: 'Invalid PayOS response format',
      error: paymentData
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    
    const errorMessage = error.response?.data?.message || error.message || 'Payment creation failed';
    const errorDetails = error.response?.data || error;

    res.status(500).json({
      success: false,
      message: errorMessage,
      error: errorDetails
    });
  }
});

module.exports = router;