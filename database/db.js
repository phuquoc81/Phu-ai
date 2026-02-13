const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

class Database {
    constructor() {
        this.db = new sqlite3.Database(path.join(__dirname, 'app.db'), (err) => {
            if (err) {
                console.error('Database connection error:', err);
            } else {
                console.log('✅ Connected to SQLite database');
                this.initialize();
            }
        });
    }

    initialize() {
        this.db.serialize(() => {
            // Users table
            this.db.run(`
                CREATE TABLE IF NOT EXISTS users (
                    id TEXT PRIMARY KEY,
                    username TEXT UNIQUE NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    btc_balance REAL DEFAULT 0,
                    usd_balance REAL DEFAULT 0,
                    affiliate_code TEXT UNIQUE NOT NULL,
                    referred_by TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Mining stats table
            this.db.run(`
                CREATE TABLE IF NOT EXISTS mining_stats (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id TEXT NOT NULL,
                    clicks INTEGER DEFAULT 0,
                    total_mined REAL DEFAULT 0,
                    last_click DATETIME,
                    FOREIGN KEY (user_id) REFERENCES users(id)
                )
            `);

            // Swords table
            this.db.run(`
                CREATE TABLE IF NOT EXISTS swords (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    name TEXT NOT NULL,
                    level INTEGER DEFAULT 1,
                    power INTEGER DEFAULT 10,
                    rarity TEXT DEFAULT 'common',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id)
                )
            `);

            // Tasks table
            this.db.run(`
                CREATE TABLE IF NOT EXISTS tasks (
                    id TEXT PRIMARY KEY,
                    title TEXT NOT NULL,
                    description TEXT,
                    reward REAL NOT NULL,
                    type TEXT DEFAULT 'microtask'
                )
            `);

            // Completed tasks table
            this.db.run(`
                CREATE TABLE IF NOT EXISTS completed_tasks (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id TEXT NOT NULL,
                    task_id TEXT NOT NULL,
                    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id),
                    FOREIGN KEY (task_id) REFERENCES tasks(id)
                )
            `);

            // Affiliate earnings table
            this.db.run(`
                CREATE TABLE IF NOT EXISTS affiliate_earnings (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    affiliate_id TEXT NOT NULL,
                    referred_user_id TEXT NOT NULL,
                    amount REAL NOT NULL,
                    earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (affiliate_id) REFERENCES users(id),
                    FOREIGN KEY (referred_user_id) REFERENCES users(id)
                )
            `);

            // Withdrawals table
            this.db.run(`
                CREATE TABLE IF NOT EXISTS withdrawals (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    amount REAL NOT NULL,
                    method TEXT NOT NULL,
                    status TEXT DEFAULT 'pending',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    processed_at DATETIME,
                    FOREIGN KEY (user_id) REFERENCES users(id)
                )
            `);

            // Initialize default tasks
            this.initializeDefaultTasks();
        });
    }

    initializeDefaultTasks() {
        const defaultTasks = [
            { id: uuidv4(), title: 'Watch a 30-second ad', description: 'Watch a short advertisement', reward: 0.05, type: 'video' },
            { id: uuidv4(), title: 'Complete survey', description: 'Answer 5 quick questions', reward: 0.15, type: 'survey' },
            { id: uuidv4(), title: 'Social media share', description: 'Share our app on social media', reward: 0.10, type: 'social' },
            { id: uuidv4(), title: 'Daily check-in', description: 'Log in daily to earn rewards', reward: 0.25, type: 'daily' },
            { id: uuidv4(), title: 'Invite a friend', description: 'Invite a friend to join', reward: 1.00, type: 'referral' }
        ];

        defaultTasks.forEach(task => {
            this.db.run(
                'INSERT OR IGNORE INTO tasks (id, title, description, reward, type) VALUES (?, ?, ?, ?, ?)',
                [task.id, task.title, task.description, task.reward, task.type]
            );
        });
    }

    // User management
    async createUser(username, email, password) {
        return new Promise((resolve, reject) => {
            const id = uuidv4();
            const affiliateCode = uuidv4().substring(0, 8).toUpperCase();
            const passwordHash = bcrypt.hashSync(password, 10);

            this.db.run(
                'INSERT INTO users (id, username, email, password_hash, affiliate_code) VALUES (?, ?, ?, ?, ?)',
                [id, username, email, passwordHash, affiliateCode],
                function(err) {
                    if (err) {
                        reject(new Error('Username or email already exists'));
                    } else {
                        // Initialize mining stats
                        this.db.run(
                            'INSERT INTO mining_stats (user_id) VALUES (?)',
                            [id]
                        );
                        
                        // Give starter sword
                        const swordId = uuidv4();
                        this.db.run(
                            'INSERT INTO swords (id, user_id, name, level, power, rarity) VALUES (?, ?, ?, ?, ?, ?)',
                            [swordId, id, 'Rusty Blade', 1, 10, 'common']
                        );

                        resolve({ id, username, email, affiliateCode });
                    }
                }.bind(this)
            );
        });
    }

    async authenticateUser(username, password) {
        return new Promise((resolve, reject) => {
            this.db.get(
                'SELECT * FROM users WHERE username = ?',
                [username],
                (err, user) => {
                    if (err || !user) {
                        reject(new Error('Invalid username or password'));
                    } else if (!bcrypt.compareSync(password, user.password_hash)) {
                        reject(new Error('Invalid username or password'));
                    } else {
                        resolve({
                            id: user.id,
                            username: user.username,
                            email: user.email
                        });
                    }
                }
            );
        });
    }

    async getUser(userId) {
        return new Promise((resolve, reject) => {
            this.db.get(
                'SELECT id, username, email, btc_balance, usd_balance, affiliate_code, created_at FROM users WHERE id = ?',
                [userId],
                (err, user) => {
                    if (err || !user) {
                        reject(new Error('User not found'));
                    } else {
                        resolve(user);
                    }
                }
            );
        });
    }

    async getUserBalance(userId) {
        return new Promise((resolve, reject) => {
            this.db.get(
                'SELECT btc_balance, usd_balance FROM users WHERE id = ?',
                [userId],
                (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            btc: row?.btc_balance || 0,
                            usd: row?.usd_balance || 0,
                            total: (row?.btc_balance || 0) + (row?.usd_balance || 0)
                        });
                    }
                }
            );
        });
    }

    // Mining methods
    async recordMiningClick(userId) {
        return new Promise((resolve, reject) => {
            // Each click mines 0.00001 BTC (simulated)
            const minedAmount = 0.00001;
            
            this.db.run(
                'UPDATE mining_stats SET clicks = clicks + 1, total_mined = total_mined + ?, last_click = CURRENT_TIMESTAMP WHERE user_id = ?',
                [minedAmount, userId],
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        this.db.run(
                            'UPDATE users SET btc_balance = btc_balance + ? WHERE id = ?',
                            [minedAmount, userId],
                            (err) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve({ mined: minedAmount, message: 'Mining successful!' });
                                }
                            }
                        );
                    }
                }
            );
        });
    }

    async getMiningStats(userId) {
        return new Promise((resolve, reject) => {
            this.db.get(
                'SELECT * FROM mining_stats WHERE user_id = ?',
                [userId],
                (err, stats) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(stats || { clicks: 0, total_mined: 0 });
                    }
                }
            );
        });
    }

    // Sword methods
    async getUserSwords(userId) {
        return new Promise((resolve, reject) => {
            this.db.all(
                'SELECT * FROM swords WHERE user_id = ? ORDER BY power DESC',
                [userId],
                (err, swords) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(swords || []);
                    }
                }
            );
        });
    }

    async mergeSwords(userId, sword1Id, sword2Id) {
        return new Promise((resolve, reject) => {
            // Get both swords
            this.db.all(
                'SELECT * FROM swords WHERE id IN (?, ?) AND user_id = ?',
                [sword1Id, sword2Id, userId],
                (err, swords) => {
                    if (err || swords.length !== 2) {
                        reject(new Error('Invalid swords for merging'));
                        return;
                    }

                    const [sword1, sword2] = swords;
                    
                    // Check if same level
                    if (sword1.level !== sword2.level) {
                        reject(new Error('Swords must be same level to merge'));
                        return;
                    }

                    // Create new merged sword
                    const newLevel = sword1.level + 1;
                    const newPower = Math.floor((sword1.power + sword2.power) * 1.5);
                    const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
                    const newRarity = rarities[Math.min(newLevel - 1, rarities.length - 1)];
                    const newName = this.generateSwordName(newLevel, newRarity);
                    const newId = uuidv4();

                    // Delete old swords and create new one
                    this.db.serialize(() => {
                        this.db.run('DELETE FROM swords WHERE id IN (?, ?)', [sword1Id, sword2Id]);
                        this.db.run(
                            'INSERT INTO swords (id, user_id, name, level, power, rarity) VALUES (?, ?, ?, ?, ?, ?)',
                            [newId, userId, newName, newLevel, newPower, newRarity],
                            (err) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve({
                                        success: true,
                                        sword: { id: newId, name: newName, level: newLevel, power: newPower, rarity: newRarity }
                                    });
                                }
                            }
                        );
                    });
                }
            );
        });
    }

    generateSwordName(level, rarity) {
        const prefixes = {
            common: ['Rusty', 'Old', 'Worn', 'Simple'],
            uncommon: ['Sharp', 'Refined', 'Polished', 'Steel'],
            rare: ['Enchanted', 'Mystic', 'Ancient', 'Noble'],
            epic: ['Dragon', 'Phoenix', 'Thunder', 'Celestial'],
            legendary: ['Godslayer', 'Excalibur', 'Legendary', 'Divine']
        };
        const suffixes = ['Blade', 'Sword', 'Edge', 'Saber', 'Katana'];
        
        const prefix = prefixes[rarity][Math.floor(Math.random() * prefixes[rarity].length)];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        
        return `${prefix} ${suffix} +${level}`;
    }

    async buySword(userId) {
        return new Promise((resolve, reject) => {
            const cost = 0.001; // 0.001 BTC
            
            this.db.get(
                'SELECT btc_balance FROM users WHERE id = ?',
                [userId],
                (err, user) => {
                    if (err || !user || user.btc_balance < cost) {
                        reject(new Error('Insufficient balance'));
                        return;
                    }

                    const swordId = uuidv4();
                    this.db.serialize(() => {
                        this.db.run(
                            'UPDATE users SET btc_balance = btc_balance - ? WHERE id = ?',
                            [cost, userId]
                        );
                        this.db.run(
                            'INSERT INTO swords (id, user_id, name, level, power, rarity) VALUES (?, ?, ?, ?, ?, ?)',
                            [swordId, userId, 'Rusty Blade', 1, 10, 'common'],
                            (err) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve({ success: true, message: 'Sword purchased!' });
                                }
                            }
                        );
                    });
                }
            );
        });
    }

    // Task methods
    async getAvailableTasks(userId) {
        return new Promise((resolve, reject) => {
            this.db.all(
                `SELECT t.* FROM tasks t 
                 WHERE NOT EXISTS (
                     SELECT 1 FROM completed_tasks ct 
                     WHERE ct.task_id = t.id AND ct.user_id = ?
                 )`,
                [userId],
                (err, tasks) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(tasks || []);
                    }
                }
            );
        });
    }

    async completeTask(userId, taskId) {
        return new Promise((resolve, reject) => {
            // Check if already completed
            this.db.get(
                'SELECT * FROM completed_tasks WHERE user_id = ? AND task_id = ?',
                [userId, taskId],
                (err, completed) => {
                    if (completed) {
                        reject(new Error('Task already completed'));
                        return;
                    }

                    // Get task reward
                    this.db.get(
                        'SELECT * FROM tasks WHERE id = ?',
                        [taskId],
                        (err, task) => {
                            if (err || !task) {
                                reject(new Error('Task not found'));
                                return;
                            }

                            this.db.serialize(() => {
                                this.db.run(
                                    'INSERT INTO completed_tasks (user_id, task_id) VALUES (?, ?)',
                                    [userId, taskId]
                                );
                                this.db.run(
                                    'UPDATE users SET usd_balance = usd_balance + ? WHERE id = ?',
                                    [task.reward, userId],
                                    (err) => {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            resolve({ success: true, earned: task.reward, message: 'Task completed!' });
                                        }
                                    }
                                );
                            });
                        }
                    );
                }
            );
        });
    }

    // Affiliate methods
    async getAffiliateCode(userId) {
        return new Promise((resolve, reject) => {
            this.db.get(
                'SELECT affiliate_code FROM users WHERE id = ?',
                [userId],
                (err, user) => {
                    if (err || !user) {
                        reject(new Error('User not found'));
                    } else {
                        resolve(user.affiliate_code);
                    }
                }
            );
        });
    }

    async applyAffiliateCode(code, userId) {
        return new Promise((resolve, reject) => {
            // Find affiliate owner
            this.db.get(
                'SELECT id FROM users WHERE affiliate_code = ?',
                [code],
                (err, affiliate) => {
                    if (err || !affiliate) {
                        reject(new Error('Invalid affiliate code'));
                        return;
                    }

                    if (affiliate.id === userId) {
                        reject(new Error('Cannot use your own affiliate code'));
                        return;
                    }

                    // Update referred_by
                    this.db.run(
                        'UPDATE users SET referred_by = ? WHERE id = ? AND referred_by IS NULL',
                        [affiliate.id, userId],
                        function(err) {
                            if (err) {
                                reject(err);
                            } else if (this.changes === 0) {
                                reject(new Error('Affiliate code already applied'));
                            } else {
                                // Give bonus to both users
                                const signupBonus = 0.50;
                                const affiliateBonus = 1.00;
                                
                                this.db.run(
                                    'UPDATE users SET usd_balance = usd_balance + ? WHERE id = ?',
                                    [signupBonus, userId]
                                );
                                this.db.run(
                                    'UPDATE users SET usd_balance = usd_balance + ? WHERE id = ?',
                                    [affiliateBonus, affiliate.id]
                                );
                                this.db.run(
                                    'INSERT INTO affiliate_earnings (affiliate_id, referred_user_id, amount) VALUES (?, ?, ?)',
                                    [affiliate.id, userId, affiliateBonus]
                                );

                                resolve({ 
                                    success: true, 
                                    message: `You received $${signupBonus} signup bonus!` 
                                });
                            }
                        }.bind(this)
                    );
                }
            );
        });
    }

    async getAffiliateStats(userId) {
        return new Promise((resolve, reject) => {
            this.db.all(
                `SELECT 
                    COUNT(DISTINCT u.id) as referrals,
                    COALESCE(SUM(ae.amount), 0) as total_earned
                 FROM users u
                 LEFT JOIN affiliate_earnings ae ON ae.affiliate_id = ?
                 WHERE u.referred_by = ?`,
                [userId, userId],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows[0] || { referrals: 0, total_earned: 0 });
                    }
                }
            );
        });
    }

    // Withdrawal methods
    async createWithdrawalRequest(userId, amount, method) {
        return new Promise((resolve, reject) => {
            const id = uuidv4();
            
            this.db.serialize(() => {
                // Deduct from balance
                this.db.run(
                    'UPDATE users SET usd_balance = usd_balance - ? WHERE id = ?',
                    [amount, userId]
                );
                
                // Create withdrawal request
                this.db.run(
                    'INSERT INTO withdrawals (id, user_id, amount, method) VALUES (?, ?, ?, ?)',
                    [id, userId, amount, method],
                    (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve({ id, amount, method, status: 'pending' });
                        }
                    }
                );
            });
        });
    }

    async getUserWithdrawals(userId) {
        return new Promise((resolve, reject) => {
            this.db.all(
                'SELECT * FROM withdrawals WHERE user_id = ? ORDER BY created_at DESC',
                [userId],
                (err, withdrawals) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(withdrawals || []);
                    }
                }
            );
        });
    }
}

module.exports = Database;
