// Global state
let currentUser = null;
let draggedSword = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    setupAuthForms();
    setupGameForms();
});

// Auth Functions
function showTab(tab) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const tabs = document.querySelectorAll('.tab-btn');

    tabs.forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');

    if (tab === 'login') {
        loginForm.style.display = 'flex';
        registerForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'flex';
    }
}

function setupAuthForms() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                currentUser = data.user;
                showGameScreen();
            } else {
                showMessage('auth-message', data.error, 'error');
            }
        } catch (error) {
            showMessage('auth-message', 'Login failed', 'error');
        }
    });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const affiliateCode = document.getElementById('affiliate-code').value;

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                currentUser = data.user;
                
                // Apply affiliate code if provided
                if (affiliateCode) {
                    await applyAffiliateCodeOnSignup(affiliateCode);
                }

                showGameScreen();
            } else {
                showMessage('auth-message', data.error, 'error');
            }
        } catch (error) {
            showMessage('auth-message', 'Registration failed', 'error');
        }
    });
}

async function applyAffiliateCodeOnSignup(code) {
    try {
        await fetch('/api/affiliate/apply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        });
    } catch (error) {
        console.error('Failed to apply affiliate code:', error);
    }
}

function showGameScreen() {
    document.getElementById('auth-screen').classList.remove('active');
    document.getElementById('game-screen').classList.add('active');
    document.getElementById('username-display').textContent = currentUser.username;
    
    loadBalance();
    loadMiningStats();
    loadSwords();
    loadTasks();
    loadAffiliateInfo();
    loadWithdrawals();
}

async function logout() {
    try {
        await fetch('/api/logout', { method: 'POST' });
        location.reload();
    } catch (error) {
        console.error('Logout failed:', error);
    }
}

// Navigation
function switchTab(tabName) {
    // Update nav buttons
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Update tab content
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    document.getElementById(`${tabName}-tab`).classList.add('active');

    // Load fresh data for the tab
    switch(tabName) {
        case 'mining':
            loadMiningStats();
            break;
        case 'swords':
            loadSwords();
            break;
        case 'tasks':
            loadTasks();
            break;
        case 'affiliate':
            loadAffiliateInfo();
            break;
        case 'withdraw':
            loadWithdrawals();
            break;
    }
}

// Balance
async function loadBalance() {
    try {
        const response = await fetch('/api/balance');
        const balance = await response.json();
        
        document.getElementById('btc-balance').textContent = balance.btc.toFixed(6);
        document.getElementById('usd-balance').textContent = '$' + balance.usd.toFixed(2);
    } catch (error) {
        console.error('Failed to load balance:', error);
    }
}

// Mining Functions
async function loadMiningStats() {
    try {
        const response = await fetch('/api/mining-stats');
        const stats = await response.json();
        
        document.getElementById('total-clicks').textContent = stats.clicks || 0;
        document.getElementById('total-mined').textContent = (stats.total_mined || 0).toFixed(6) + ' BTC';
    } catch (error) {
        console.error('Failed to load mining stats:', error);
    }
}

async function mine() {
    const btn = document.getElementById('mine-btn');
    btn.disabled = true;

    try {
        const response = await fetch('/api/mine', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (response.ok) {
            // Animate the button
            btn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 100);

            // Show success message
            showMessage('mining-message', `+${data.mined.toFixed(6)} BTC mined!`, 'success');

            // Update stats
            loadMiningStats();
            loadBalance();
        } else {
            showMessage('mining-message', data.error, 'error');
        }
    } catch (error) {
        showMessage('mining-message', 'Mining failed', 'error');
    } finally {
        btn.disabled = false;
    }
}

// Swords Functions
async function loadSwords() {
    try {
        const response = await fetch('/api/swords');
        const swords = await response.json();
        
        const grid = document.getElementById('swords-grid');
        grid.innerHTML = '';

        if (swords.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666;">No swords yet. Buy your first sword!</p>';
            return;
        }

        swords.forEach(sword => {
            const card = createSwordCard(sword);
            grid.appendChild(card);
        });
    } catch (error) {
        console.error('Failed to load swords:', error);
    }
}

function createSwordCard(sword) {
    const card = document.createElement('div');
    card.className = 'sword-card';
    card.draggable = true;
    card.dataset.swordId = sword.id;
    card.dataset.level = sword.level;

    card.innerHTML = `
        <div class="sword-icon">⚔️</div>
        <div class="sword-name">${sword.name}</div>
        <div class="sword-rarity rarity-${sword.rarity}">${sword.rarity.toUpperCase()}</div>
        <div class="sword-stats">
            <div>Level: ${sword.level}</div>
            <div>Power: ${sword.power}</div>
        </div>
    `;

    // Drag and drop for merging
    card.addEventListener('dragstart', (e) => {
        draggedSword = sword;
        card.classList.add('dragging');
    });

    card.addEventListener('dragend', (e) => {
        card.classList.remove('dragging');
    });

    card.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    card.addEventListener('drop', async (e) => {
        e.preventDefault();
        if (draggedSword && draggedSword.id !== sword.id) {
            await mergeSwords(draggedSword.id, sword.id);
        }
    });

    return card;
}

async function buySword() {
    try {
        const response = await fetch('/api/swords/buy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('swords-message', data.message, 'success');
            loadSwords();
            loadBalance();
        } else {
            showMessage('swords-message', data.error, 'error');
        }
    } catch (error) {
        showMessage('swords-message', 'Purchase failed', 'error');
    }
}

async function mergeSwords(sword1Id, sword2Id) {
    try {
        const response = await fetch('/api/swords/merge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sword1Id, sword2Id })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('swords-message', `Created ${data.sword.name}! Power: ${data.sword.power}`, 'success');
            loadSwords();
        } else {
            showMessage('swords-message', data.error, 'error');
        }
    } catch (error) {
        showMessage('swords-message', 'Merge failed', 'error');
    }
}

// Tasks Functions
async function loadTasks() {
    try {
        const response = await fetch('/api/tasks');
        const tasks = await response.json();
        
        const list = document.getElementById('tasks-list');
        list.innerHTML = '';

        if (tasks.length === 0) {
            list.innerHTML = '<p style="text-align: center; color: #666;">All tasks completed! Check back later for more.</p>';
            return;
        }

        tasks.forEach(task => {
            const card = createTaskCard(task);
            list.appendChild(card);
        });
    } catch (error) {
        console.error('Failed to load tasks:', error);
    }
}

function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = 'task-card';

    card.innerHTML = `
        <div class="task-info">
            <div class="task-title">${task.title}</div>
            <div class="task-description">${task.description}</div>
        </div>
        <div class="task-reward">$${task.reward.toFixed(2)}</div>
        <button class="btn btn-primary" onclick="completeTask('${task.id}')">Complete</button>
    `;

    return card;
}

async function completeTask(taskId) {
    try {
        const response = await fetch(`/api/tasks/${taskId}/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('tasks-message', `Task completed! +$${data.earned.toFixed(2)}`, 'success');
            loadTasks();
            loadBalance();
        } else {
            showMessage('tasks-message', data.error, 'error');
        }
    } catch (error) {
        showMessage('tasks-message', 'Task completion failed', 'error');
    }
}

// Affiliate Functions
async function loadAffiliateInfo() {
    try {
        const [codeResponse, statsResponse] = await Promise.all([
            fetch('/api/affiliate/code'),
            fetch('/api/affiliate/stats')
        ]);

        const codeData = await codeResponse.json();
        const statsData = await statsResponse.json();

        document.getElementById('referral-code').value = codeData.code;
        document.getElementById('total-referrals').textContent = statsData.referrals || 0;
        document.getElementById('affiliate-earnings').textContent = '$' + (statsData.total_earned || 0).toFixed(2);
    } catch (error) {
        console.error('Failed to load affiliate info:', error);
    }
}

function copyReferralCode() {
    const input = document.getElementById('referral-code');
    input.select();
    document.execCommand('copy');
    showMessage('affiliate-message', 'Referral code copied to clipboard!', 'success');
}

// Withdrawal Functions
function setupGameForms() {
    const withdrawalForm = document.getElementById('withdrawal-form');
    
    if (withdrawalForm) {
        withdrawalForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const amount = parseFloat(document.getElementById('withdraw-amount').value);
            const method = document.getElementById('withdraw-method').value;

            try {
                const response = await fetch('/api/withdraw', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount, method })
                });

                const data = await response.json();

                if (response.ok) {
                    showMessage('withdraw-message', data.message, 'success');
                    loadWithdrawals();
                    loadBalance();
                    withdrawalForm.reset();
                } else {
                    showMessage('withdraw-message', data.error, 'error');
                }
            } catch (error) {
                showMessage('withdraw-message', 'Withdrawal request failed', 'error');
            }
        });
    }
}

async function loadWithdrawals() {
    try {
        const response = await fetch('/api/withdrawals');
        const withdrawals = await response.json();
        
        const list = document.getElementById('withdrawals-list');
        list.innerHTML = '';

        if (withdrawals.length === 0) {
            list.innerHTML = '<p style="text-align: center; color: #666;">No withdrawal history yet.</p>';
            return;
        }

        withdrawals.forEach(withdrawal => {
            const item = createWithdrawalItem(withdrawal);
            list.appendChild(item);
        });
    } catch (error) {
        console.error('Failed to load withdrawals:', error);
    }
}

function createWithdrawalItem(withdrawal) {
    const item = document.createElement('div');
    item.className = 'withdrawal-item';

    const date = new Date(withdrawal.created_at).toLocaleDateString();

    item.innerHTML = `
        <div>
            <div><strong>$${withdrawal.amount.toFixed(2)}</strong></div>
            <div style="font-size: 0.9em; color: #666;">${withdrawal.method} - ${date}</div>
        </div>
        <div class="withdrawal-status status-${withdrawal.status}">
            ${withdrawal.status.toUpperCase()}
        </div>
    `;

    return item;
}

// Utility Functions
function showMessage(elementId, message, type) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.className = `message ${type}`;
    element.style.display = 'block';

    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}
