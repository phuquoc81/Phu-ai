module.exports = (req, res) => {
  res.status(200).json({
    name: 'Phutokenvercel API',
    version: '1.0.0',
    message: 'Welcome to Phu AI API endpoint',
    capabilities: [
      'Complex puzzle solving',
      'Math and physics problems',
      'Future prediction',
      'Species diagnosis'
    ],
    timestamp: new Date().toISOString()
  });
};
