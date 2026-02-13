const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');
const Database = require('./database/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
const db = new Database();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: process.env.SESSION_SECRET || 'legendary-swords-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true in production with HTTPS
}));

// Authentication middleware
const requireAuth = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).json({ error: 'Authentication required' });
    }
};

// Routes

// Home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// User registration
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await db.createUser(username, email, password);
        req.session.userId = user.id;
        res.json({ success: true, user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// User login
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await db.authenticateUser(username, password);
        req.session.userId = user.id;
        res.json({ success: true, user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

// User logout
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// Get user profile
app.get('/api/profile', requireAuth, async (req, res) => {
    try {
        const user = await db.getUser(req.session.userId);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user balance
app.get('/api/balance', requireAuth, async (req, res) => {
    try {
        const balance = await db.getUserBalance(req.session.userId);
        res.json(balance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// BTC Mining endpoints
app.post('/api/mine', requireAuth, async (req, res) => {
    try {
        const result = await db.recordMiningClick(req.session.userId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/mining-stats', requireAuth, async (req, res) => {
    try {
        const stats = await db.getMiningStats(req.session.userId);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Sword Game endpoints
app.get('/api/swords', requireAuth, async (req, res) => {
    try {
        const swords = await db.getUserSwords(req.session.userId);
        res.json(swords);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/swords/merge', requireAuth, async (req, res) => {
    try {
        const { sword1Id, sword2Id } = req.body;
        const result = await db.mergeSwords(req.session.userId, sword1Id, sword2Id);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/swords/buy', requireAuth, async (req, res) => {
    try {
        const result = await db.buySword(req.session.userId);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Microtask endpoints
app.get('/api/tasks', requireAuth, async (req, res) => {
    try {
        const tasks = await db.getAvailableTasks(req.session.userId);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/tasks/:taskId/complete', requireAuth, async (req, res) => {
    try {
        const result = await db.completeTask(req.session.userId, req.params.taskId);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Affiliate endpoints
app.get('/api/affiliate/code', requireAuth, async (req, res) => {
    try {
        const code = await db.getAffiliateCode(req.session.userId);
        res.json({ code });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/affiliate/apply', async (req, res) => {
    try {
        const { code, userId } = req.body;
        const result = await db.applyAffiliateCode(code, userId || req.session.userId);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/affiliate/stats', requireAuth, async (req, res) => {
    try {
        const stats = await db.getAffiliateStats(req.session.userId);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Payment endpoints
app.post('/api/withdraw', requireAuth, async (req, res) => {
    try {
        const { amount, method } = req.body;
        
        if (amount < 10) {
            return res.status(400).json({ error: 'Minimum withdrawal is $10' });
        }

        const balance = await db.getUserBalance(req.session.userId);
        if (balance.total < amount) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        // Create withdrawal request
        const withdrawal = await db.createWithdrawalRequest(req.session.userId, amount, method);
        
        res.json({
            success: true,
            message: 'Withdrawal request created. Processing within 24-48 hours.',
            withdrawal
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/stripe/create-checkout', requireAuth, async (req, res) => {
    try {
        const { amount } = req.body;
        
        // This is a placeholder - in production, you'd create a real Stripe checkout session
        res.json({
            success: true,
            message: 'Stripe integration ready (requires valid API key)',
            checkoutUrl: '/payment-success'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/withdrawals', requireAuth, async (req, res) => {
    try {
        const withdrawals = await db.getUserWithdrawals(req.session.userId);
        res.json(withdrawals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Legendary Swords & BTC Mining App running on port ${PORT}`);
    console.log(`📍 Access the app at http://localhost:${PORT}`);
});
