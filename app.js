// Data Storage
let appData = {
    balance: 0,
    tasksCompleted: 0,
    gamesPlayed: 0,
    affiliateEarnings: 0,
    tasks: [],
    affiliateClicks: 0,
    affiliateConversions: 0,
    learningProgress: {}
};

// Load data from localStorage
function loadData() {
    const saved = localStorage.getItem('phuBusinessData');
    if (saved) {
        appData = JSON.parse(saved);
        updateDashboard();
        renderTasks();
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('phuBusinessData', JSON.stringify(appData));
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupNavigation();
    updateDashboard();
});

// Navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            navigateTo(section);
        });
    });
}

function navigateTo(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === sectionId) {
            link.classList.add('active');
        }
    });
}

// Dashboard Updates
function updateDashboard() {
    document.getElementById('userBalance').textContent = appData.balance.toFixed(2);
    document.getElementById('tasksCompleted').textContent = appData.tasksCompleted;
    document.getElementById('gamesPlayed').textContent = appData.gamesPlayed;
    document.getElementById('affiliateEarnings').textContent = appData.affiliateEarnings.toFixed(2);
    document.getElementById('totalEarnings').textContent = appData.balance.toFixed(2);
    document.getElementById('affiliateClicks').textContent = appData.affiliateClicks;
    document.getElementById('affiliateConversions').textContent = appData.affiliateConversions;
    document.getElementById('affiliateTotal').textContent = appData.affiliateEarnings.toFixed(2);
}

// Task Management
function addTask() {
    const input = document.getElementById('taskInput');
    const taskText = input.value.trim();
    
    if (!taskText) {
        showNotification('Please enter a task!', 'error');
        return;
    }
    
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false,
        reward: 0.50
    };
    
    appData.tasks.push(task);
    input.value = '';
    renderTasks();
    saveData();
    showNotification('Task added successfully!');
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    
    if (appData.tasks.length === 0) {
        taskList.innerHTML = '<p style="text-align: center; color: #999;">No tasks yet. Add your first task!</p>';
        return;
    }
    
    taskList.innerHTML = appData.tasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}">
            <span class="task-text">${task.text}</span>
            <span class="task-reward">+$${task.reward.toFixed(2)}</span>
            <div class="task-actions">
                ${!task.completed ? `<button class="btn btn-success" onclick="completeTask(${task.id})">Complete</button>` : ''}
                <button class="btn btn-danger" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function completeTask(taskId) {
    const task = appData.tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
        task.completed = true;
        appData.balance += task.reward;
        appData.tasksCompleted++;
        updateDashboard();
        renderTasks();
        saveData();
        showNotification(`Task completed! Earned $${task.reward.toFixed(2)}`);
    }
}

function deleteTask(taskId) {
    appData.tasks = appData.tasks.filter(t => t.id !== taskId);
    renderTasks();
    saveData();
    showNotification('Task deleted!');
}

// Game 1: Click Challenge
let clickGameActive = false;
let clickCount = 0;
let clickTimer;

function startClickGame() {
    if (clickGameActive) return;
    
    clickGameActive = true;
    clickCount = 0;
    let timeLeft = 10;
    
    const gameArea = document.getElementById('clickGameArea');
    const clickButton = document.getElementById('clickButton');
    const countDisplay = document.getElementById('clickCount');
    const timerDisplay = document.getElementById('clickTimer');
    
    gameArea.style.display = 'block';
    countDisplay.textContent = '0';
    timerDisplay.textContent = '10';
    
    clickButton.onclick = () => {
        if (clickGameActive) {
            clickCount++;
            countDisplay.textContent = clickCount;
        }
    };
    
    clickTimer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(clickTimer);
            endClickGame();
        }
    }, 1000);
}

function endClickGame() {
    clickGameActive = false;
    const reward = Math.floor(clickCount / 50) * 0.10;
    
    if (reward > 0) {
        appData.balance += reward;
        appData.gamesPlayed++;
        updateDashboard();
        saveData();
        showNotification(`Game over! ${clickCount} clicks. Earned $${reward.toFixed(2)}`);
    } else {
        showNotification(`Game over! ${clickCount} clicks. Need 50+ clicks to earn rewards.`);
    }
    
    setTimeout(() => {
        document.getElementById('clickGameArea').style.display = 'none';
    }, 2000);
}

// Game 2: Memory Match
const memorySymbols = ['🎮', '🎯', '💎', '🌟', '🚀', '💰', '🎁', '⭐'];
let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;

function startMemoryGame() {
    matchedPairs = 0;
    flippedCards = [];
    
    // Create pairs
    memoryCards = [...memorySymbols, ...memorySymbols]
        .sort(() => Math.random() - 0.5)
        .map((symbol, index) => ({ id: index, symbol, matched: false, flipped: false }));
    
    const gameArea = document.getElementById('memoryGameArea');
    const grid = document.getElementById('memoryGrid');
    
    gameArea.style.display = 'block';
    grid.innerHTML = memoryCards.map(card => `
        <div class="memory-card" data-id="${card.id}" onclick="flipCard(${card.id})">❓</div>
    `).join('');
    
    document.getElementById('matchCount').textContent = '0/8';
}

function flipCard(cardId) {
    if (flippedCards.length >= 2) return;
    
    const card = memoryCards[cardId];
    if (card.matched || card.flipped) return;
    
    card.flipped = true;
    flippedCards.push(card);
    
    const cardElement = document.querySelector(`[data-id="${cardId}"]`);
    cardElement.textContent = card.symbol;
    cardElement.classList.add('flipped');
    
    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 500);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.symbol === card2.symbol) {
        card1.matched = true;
        card2.matched = true;
        
        document.querySelector(`[data-id="${card1.id}"]`).classList.add('matched');
        document.querySelector(`[data-id="${card2.id}"]`).classList.add('matched');
        
        matchedPairs++;
        document.getElementById('matchCount').textContent = `${matchedPairs}/8`;
        
        if (matchedPairs === 8) {
            appData.balance += 0.25;
            appData.gamesPlayed++;
            updateDashboard();
            saveData();
            showNotification('Memory game completed! Earned $0.25');
            setTimeout(() => {
                document.getElementById('memoryGameArea').style.display = 'none';
            }, 2000);
        }
    } else {
        card1.flipped = false;
        card2.flipped = false;
        
        const el1 = document.querySelector(`[data-id="${card1.id}"]`);
        const el2 = document.querySelector(`[data-id="${card2.id}"]`);
        
        el1.textContent = '❓';
        el2.textContent = '❓';
        el1.classList.remove('flipped');
        el2.classList.remove('flipped');
    }
    
    flippedCards = [];
}

// Game 3: Lucky Number
let luckyNumber = 0;

function startNumberGame() {
    luckyNumber = Math.floor(Math.random() * 10) + 1;
    const gameArea = document.getElementById('numberGameArea');
    gameArea.style.display = 'block';
    document.getElementById('guessInput').value = '';
    document.getElementById('numberResult').textContent = '';
}

function makeGuess() {
    const guess = parseInt(document.getElementById('guessInput').value);
    const result = document.getElementById('numberResult');
    
    if (!guess || guess < 1 || guess > 10) {
        result.textContent = 'Please enter a number between 1 and 10!';
        result.style.color = '#f56565';
        return;
    }
    
    if (guess === luckyNumber) {
        appData.balance += 0.50;
        appData.gamesPlayed++;
        updateDashboard();
        saveData();
        result.textContent = `🎉 Correct! You won $0.50! The number was ${luckyNumber}`;
        result.style.color = '#48bb78';
        showNotification('Lucky number guessed! Earned $0.50');
        
        setTimeout(() => {
            document.getElementById('numberGameArea').style.display = 'none';
        }, 3000);
    } else {
        const hint = guess < luckyNumber ? 'higher' : 'lower';
        result.textContent = `Wrong! Try ${hint}.`;
        result.style.color = '#f56565';
    }
}

// Affiliate Marketing
function copyReferralLink() {
    const linkInput = document.getElementById('referralLink');
    const linkText = linkInput.value;
    
    // Use modern Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(linkText).then(() => {
            showNotification('Referral link copied to clipboard!');
        }).catch(() => {
            // Fallback for older browsers
            linkInput.select();
            document.execCommand('copy');
            showNotification('Referral link copied to clipboard!');
        });
    } else {
        // Fallback for browsers without Clipboard API
        linkInput.select();
        document.execCommand('copy');
        showNotification('Referral link copied to clipboard!');
    }
    
    // Simulate a click
    appData.affiliateClicks++;
    updateDashboard();
    saveData();
}

function joinProgram(programType) {
    const programs = {
        business: { name: 'Business Tools', commission: 20 },
        courses: { name: 'Online Courses', commission: 30 },
        ecommerce: { name: 'E-commerce', commission: 15 }
    };
    
    const program = programs[programType];
    showNotification(`Joined ${program.name} affiliate program! ${program.commission}% commission`);
    
    // Simulate conversion
    appData.affiliateConversions++;
    const earnings = Math.random() * 10 + 5;
    appData.affiliateEarnings += earnings;
    appData.balance += earnings;
    updateDashboard();
    saveData();
}

// Learning Section
function startCourse(courseType) {
    const courses = {
        optimization: 'Task Optimization',
        income: 'Passive Income Mastery',
        gaming: 'Gaming Strategies',
        growth: 'Business Growth'
    };
    
    const courseName = courses[courseType];
    
    if (!appData.learningProgress[courseType]) {
        appData.learningProgress[courseType] = {
            name: courseName,
            progress: 0
        };
    }
    
    appData.learningProgress[courseType].progress += 25;
    if (appData.learningProgress[courseType].progress > 100) {
        appData.learningProgress[courseType].progress = 100;
    }
    
    renderLearningProgress();
    saveData();
    
    const progress = appData.learningProgress[courseType].progress;
    if (progress === 100) {
        appData.balance += 1.00;
        updateDashboard();
        showNotification(`🎓 Course completed! Earned $1.00`);
    } else {
        showNotification(`Course progress: ${progress}%`);
    }
}

function renderLearningProgress() {
    const progressList = document.getElementById('learningProgress');
    const courses = Object.values(appData.learningProgress);
    
    if (courses.length === 0) {
        progressList.innerHTML = '<p>Start a course to track your progress!</p>';
        return;
    }
    
    progressList.innerHTML = courses.map(course => `
        <div class="progress-item">
            <span>${course.name}</span>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${course.progress}%"></div>
            </div>
            <span>${course.progress}%</span>
        </div>
    `).join('');
}

// Notifications
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    if (type === 'error') {
        notification.style.background = '#f56565';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize learning progress on load
if (Object.keys(appData.learningProgress).length > 0) {
    renderLearningProgress();
}
