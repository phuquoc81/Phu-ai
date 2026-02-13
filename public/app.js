// Generate a unique user ID or retrieve from localStorage
let userId = localStorage.getItem('userId');
if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', userId);
}

// DOM Elements
const balanceEl = document.getElementById('balance');
const miningPowerEl = document.getElementById('miningPower');
const totalMinedEl = document.getElementById('totalMined');
const mineButton = document.getElementById('mineButton');
const upgradeButton = document.getElementById('upgradeButton');
const upgradeCostEl = document.getElementById('upgradeCost');
const miningMessage = document.getElementById('miningMessage');
const upgradeMessage = document.getElementById('upgradeMessage');
const miningAnimation = document.getElementById('miningAnimation');

// Format currency
function formatCurrency(value) {
    return '$' + (value || 0).toFixed(6);
}

// Format currency for upgrade costs (less decimal places)
function formatUpgradeCost(value) {
    if (value >= 1) {
        return '$' + (value || 0).toFixed(2);
    }
    return formatCurrency(value);
}

// Update UI with user data
function updateUI(data) {
    balanceEl.textContent = formatCurrency(data.balance);
    miningPowerEl.textContent = data.miningPower + 'x';
    totalMinedEl.textContent = formatCurrency(data.totalMined);
    upgradeCostEl.textContent = formatUpgradeCost(data.upgradeCost);
    
    // Update mine button reward text
    const rewardText = document.querySelector('.reward-text');
    if (rewardText) {
        rewardText.textContent = '+' + formatCurrency(0.000001 * data.miningPower);
    }
}

// Fetch user data on load
async function fetchUserData() {
    try {
        const response = await fetch(`/api/user/${userId}`);
        const data = await response.json();
        updateUI(data);
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

// Mine action
mineButton.addEventListener('click', async () => {
    try {
        // Disable button temporarily
        mineButton.disabled = true;
        
        // Add animation
        miningAnimation.classList.add('active');
        
        const response = await fetch('/api/mine', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId })
        });
        
        const data = await response.json();
        
        if (data.success) {
            updateUI(data);
            
            // Show success message
            miningMessage.textContent = `⛏️ Mined ${formatCurrency(data.reward)}!`;
            setTimeout(() => {
                miningMessage.textContent = '';
            }, 2000);
        }
        
        // Remove animation
        setTimeout(() => {
            miningAnimation.classList.remove('active');
        }, 500);
        
        // Re-enable button
        setTimeout(() => {
            mineButton.disabled = false;
        }, 500);
        
    } catch (error) {
        console.error('Error mining:', error);
        mineButton.disabled = false;
        miningAnimation.classList.remove('active');
    }
});

// Upgrade action
upgradeButton.addEventListener('click', async () => {
    try {
        upgradeButton.disabled = true;
        
        const response = await fetch('/api/upgrade', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId })
        });
        
        const data = await response.json();
        
        if (data.success) {
            updateUI(data);
            upgradeMessage.textContent = '✨ Upgrade successful! Mining power increased!';
            upgradeMessage.className = 'upgrade-message success';
        } else {
            upgradeMessage.textContent = '❌ ' + data.message + '. Keep mining!';
            upgradeMessage.className = 'upgrade-message error';
        }
        
        setTimeout(() => {
            upgradeMessage.textContent = '';
            upgradeMessage.className = 'upgrade-message';
        }, 3000);
        
        upgradeButton.disabled = false;
        
    } catch (error) {
        console.error('Error upgrading:', error);
        upgradeButton.disabled = false;
    }
});

// Auto-mine feature (optional - can be enabled with keyboard shortcut)
let autoMining = false;
let autoMineInterval;

document.addEventListener('keydown', (e) => {
    // Press 'A' to toggle auto-mining (for testing/demo purposes)
    if (e.key === 'a' || e.key === 'A') {
        autoMining = !autoMining;
        
        if (autoMining) {
            console.log('Auto-mining enabled');
            autoMineInterval = setInterval(() => {
                if (!mineButton.disabled) {
                    mineButton.click();
                }
            }, 1000);
        } else {
            console.log('Auto-mining disabled');
            clearInterval(autoMineInterval);
        }
    }
});

// Initialize
fetchUserData();

// Periodic data refresh (every 30 seconds)
setInterval(fetchUserData, 30000);
