export default function handler(req, res) {
  const { token } = req.body;

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  // In a real application, you would validate the token against a database or API
  // For this implementation, we'll accept any non-empty token
  res.status(200).json({ 
    success: true, 
    message: 'Token validated successfully',
    token: token 
  });
}
