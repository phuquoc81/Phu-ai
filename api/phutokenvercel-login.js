// Phutokenvercel API Login Endpoint with phuoptimizer 81
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const phuoptimizer = process.env.PHUOPTIMIZER || '81';
    
    if (req.method === 'POST') {
      const { username, password, token } = req.body || {};
      
      // Phutokenvercel login logic with phuoptimizer 81
      if (token && token.includes('phutokenvercel')) {
        res.status(200).json({
          success: true,
          message: 'Phutokenvercel login successful',
          phuoptimizer: phuoptimizer,
          data: {
            username: username,
            optimizer: 'phuoptimizer 81',
            authenticated: true,
            timestamp: new Date().toISOString()
          }
        });
      } else {
        res.status(401).json({
          success: false,
          message: 'Invalid Phutokenvercel token',
          phuoptimizer: phuoptimizer
        });
      }
    } else if (req.method === 'GET') {
      // GET request returns API information
      res.status(200).json({
        api: 'Phutokenvercel Login API',
        version: '1.0.0',
        phuoptimizer: phuoptimizer,
        optimizer: 'phuoptimizer 81',
        endpoints: {
          login: '/api/phutokenvercel-login',
          method: 'POST',
          requiredFields: ['username', 'password', 'token']
        }
      });
    } else {
      res.status(405).json({
        success: false,
        message: 'Method not allowed'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
