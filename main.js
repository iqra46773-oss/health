const crypto = require('crypto');
const fs = require('fs');

module.exports = async (req, res) => {
  try {
    const { phone } = JSON.parse(req.body);

    if (!phone) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const token = crypto.randomUUID();

    // JSON file read (store OTPs)
    let data = { tokens: [] };
    if (fs.existsSync('data.json')) {
      data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    }

    data.tokens.push({ token, otp, phone, createdAt: new Date() });
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));

    console.log(`OTP ${otp} sent to ${phone}`);

    return res.status(200).json({ token, otp });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
