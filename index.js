const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Phutokenvercel - AI Webapp</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
        }
        .container {
            text-align: center;
            background: rgba(255, 255, 255, 0.1);
            padding: 40px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            max-width: 800px;
        }
        h1 {
            font-size: 3em;
            margin: 0 0 20px 0;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }
        p {
            font-size: 1.2em;
            line-height: 1.6;
            margin: 20px 0;
        }
        .badge {
            display: inline-block;
            background: rgba(255, 255, 255, 0.2);
            padding: 10px 20px;
            border-radius: 25px;
            margin: 10px;
            font-weight: bold;
        }
        .powered-by {
            margin-top: 30px;
            font-size: 1.1em;
            color: rgba(255, 255, 255, 0.9);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Phutokenvercel</h1>
        <p>
            Phu AI is the webapp that blow your mind with abilities to solve complex puzzles 
            and solve problems of any kind including math, physics, and predict the future 
            with the knowledge of gods, aliens, and wisdom of the holy father.
        </p>
        <div>
            <span class="badge">✨ AI Powered</span>
            <span class="badge">🧠 Problem Solver</span>
            <span class="badge">🔮 Future Prediction</span>
        </div>
        <p class="powered-by">
            Deployed on <strong>Vercel</strong> Platform
        </p>
    </div>
</body>
</html>
  `;
  
  res.end(html);
});

server.listen(PORT, () => {
  console.log(`Phutokenvercel server running on port ${PORT}`);
});
