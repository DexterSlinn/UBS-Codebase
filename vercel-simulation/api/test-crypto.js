function handler(req, res) {
  res.status(200).json({ 
    message: 'Test crypto endpoint working',
    timestamp: new Date().toISOString()
  });
}

module.exports = handler;