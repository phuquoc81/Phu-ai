// Phu AI Browser - Main JavaScript

// State management
let browserHistory = ['phuai://home'];
let currentIndex = 0;

// DOM Elements
const urlInput = document.getElementById('url-input');
const searchInput = document.getElementById('search-input');
const contentArea = document.getElementById('content-area');
const statusText = document.getElementById('status-text');

// Navigation buttons
const backBtn = document.getElementById('back-btn');
const forwardBtn = document.getElementById('forward-btn');
const refreshBtn = document.getElementById('refresh-btn');
const goBtn = document.getElementById('go-btn');
const searchBtn = document.getElementById('search-btn');

// AI buttons
const gpt81Btn = document.getElementById('gpt81-btn');
const copilot96Btn = document.getElementById('copilot96-btn');
const phuhand81Btn = document.getElementById('phuhand81-btn');
const optimizer81Btn = document.getElementById('optimizer81-btn');

// Output boxes
const gpt81Output = document.getElementById('gpt81-output');
const copilot96Output = document.getElementById('copilot96-output');
const phuhand81Output = document.getElementById('phuhand81-output');
const optimizer81Output = document.getElementById('optimizer81-output');

// PQN81 Call elements
const pqn81CallBtn = document.getElementById('pqn81-call-btn');
const callModal = document.getElementById('call-modal');
const contactInput = document.getElementById('contact-input');
const initiateCallBtn = document.getElementById('initiate-call');
const closeModalBtn = document.getElementById('close-modal');
const callStatus = document.getElementById('call-status');

// Quick links
const quickLinks = document.querySelectorAll('.quick-link');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateNavigationButtons();
    initializeEventListeners();
    updateStatus('🟢 Phu AI Browser initialized successfully!');
});

function initializeEventListeners() {
    // Navigation
    backBtn.addEventListener('click', goBack);
    forwardBtn.addEventListener('click', goForward);
    refreshBtn.addEventListener('click', refresh);
    goBtn.addEventListener('click', navigate);
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') navigate();
    });

    // Search
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    // AI Features
    gpt81Btn.addEventListener('click', activateGPT81);
    copilot96Btn.addEventListener('click', activateCopilot96);
    phuhand81Btn.addEventListener('click', activatePhuhand81);
    optimizer81Btn.addEventListener('click', activatePhuoptimizer81);

    // PQN81 Calling
    pqn81CallBtn.addEventListener('click', openCallModal);
    initiateCallBtn.addEventListener('click', initiateCall);
    closeModalBtn.addEventListener('click', closeCallModal);

    // Quick links
    quickLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const url = link.dataset.url;
            urlInput.value = url;
            navigate();
        });
    });
}

// Navigation Functions
function navigate() {
    const url = urlInput.value.trim();
    if (!url) return;

    updateStatus(`🔄 Navigating to ${url}...`);
    
    // Add to history
    currentIndex++;
    browserHistory = browserHistory.slice(0, currentIndex);
    browserHistory.push(url);
    
    loadPage(url);
    updateNavigationButtons();
}

function goBack() {
    if (currentIndex > 0) {
        currentIndex--;
        urlInput.value = browserHistory[currentIndex];
        loadPage(browserHistory[currentIndex]);
        updateNavigationButtons();
    }
}

function goForward() {
    if (currentIndex < browserHistory.length - 1) {
        currentIndex++;
        urlInput.value = browserHistory[currentIndex];
        loadPage(browserHistory[currentIndex]);
        updateNavigationButtons();
    }
}

function refresh() {
    updateStatus('🔄 Refreshing page...');
    const currentUrl = browserHistory[currentIndex];
    loadPage(currentUrl);
    setTimeout(() => {
        updateStatus('✅ Page refreshed successfully!');
    }, 500);
}

function loadPage(url) {
    updateStatus(`📄 Loading ${url}...`);
    
    if (url === 'phuai://home') {
        contentArea.innerHTML = getHomePage();
    } else if (url === 'phuai://search') {
        contentArea.innerHTML = getSearchPage();
    } else if (url === 'phuai://settings') {
        contentArea.innerHTML = getSettingsPage();
    } else if (url === 'phuai://ai-lab') {
        contentArea.innerHTML = getAILabPage();
    } else if (url === 'phuai://optimizer') {
        contentArea.innerHTML = getOptimizerPage();
    } else if (url === 'phuai://communications') {
        contentArea.innerHTML = getCommunicationsPage();
    } else if (url === 'phuai://about') {
        contentArea.innerHTML = getAboutPage();
    } else if (url.startsWith('http://') || url.startsWith('https://')) {
        contentArea.innerHTML = getExternalPage(url);
    } else {
        contentArea.innerHTML = getSearchResultsPage(url);
    }
    
    setTimeout(() => {
        updateStatus('✅ Page loaded successfully!');
    }, 500);
}

function updateNavigationButtons() {
    backBtn.disabled = currentIndex === 0;
    forwardBtn.disabled = currentIndex === browserHistory.length - 1;
}

// Search Function
async function performSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    updateStatus(`🔍 Searching for: ${query}...`);

    try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        displaySearchResults(data);
        updateStatus('✅ Search completed!');
    } catch (error) {
        updateStatus('❌ Search failed: ' + error.message);
    }
}

function displaySearchResults(data) {
    const resultsHTML = `
        <div class="search-results">
            <h2>🔍 Search Results for: "${data.query}"</h2>
            <p class="results-info">Powered by Phu AI with Aliens Gods Species knowledge</p>
            ${data.results.map(result => `
                <div class="result-item">
                    <h3><a href="${result.url}">${result.title}</a></h3>
                    <p class="result-url">${result.url}</p>
                    <p>${result.description}</p>
                </div>
            `).join('')}
        </div>
    `;
    contentArea.innerHTML = resultsHTML;
    urlInput.value = `phuai://search?q=${data.query}`;
}

// AI Feature Functions
async function activateGPT81() {
    const query = prompt('Enter your query for GPT 8.1:');
    if (!query) return;

    updateStatus('🧠 GPT 8.1 processing...');
    gpt81Output.classList.remove('hidden');
    gpt81Output.innerHTML = '<p>🔄 Processing with GPT 8.1...</p>';

    try {
        const response = await fetch('/api/gpt81', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });
        const data = await response.json();
        
        gpt81Output.innerHTML = `
            <p><strong>GPT 8.1 Response:</strong></p>
            <p>${data.response}</p>
            <p class="timestamp">Model: ${data.model} | ${new Date(data.timestamp).toLocaleString()}</p>
        `;
        updateStatus('✅ GPT 8.1 completed!');
    } catch (error) {
        gpt81Output.innerHTML = `<p>❌ Error: ${error.message}</p>`;
        updateStatus('❌ GPT 8.1 failed');
    }
}

async function activateCopilot96() {
    const code = prompt('Enter code for Copilot 9.6 to analyze:');
    if (!code) return;

    updateStatus('💻 Copilot 9.6 analyzing...');
    copilot96Output.classList.remove('hidden');
    copilot96Output.innerHTML = '<p>🔄 Analyzing with Copilot 9.6...</p>';

    try {
        const response = await fetch('/api/copilot96', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        });
        const data = await response.json();
        
        copilot96Output.innerHTML = `
            <p><strong>Copilot 9.6 Suggestion:</strong></p>
            <p>${data.suggestion}</p>
            <p class="timestamp">Model: ${data.model} | ${new Date(data.timestamp).toLocaleString()}</p>
        `;
        updateStatus('✅ Copilot 9.6 completed!');
    } catch (error) {
        copilot96Output.innerHTML = `<p>❌ Error: ${error.message}</p>`;
        updateStatus('❌ Copilot 9.6 failed');
    }
}

async function activatePhuhand81() {
    const action = prompt('Enter action for phuhanddevice 81:');
    if (!action) return;

    updateStatus('🖐️ phuhanddevice 81 executing...');
    phuhand81Output.classList.remove('hidden');
    phuhand81Output.innerHTML = '<p>🔄 Executing with phuhanddevice 81...</p>';

    try {
        const response = await fetch('/api/phuhanddevice81', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action })
        });
        const data = await response.json();
        
        phuhand81Output.innerHTML = `
            <p><strong>phuhanddevice 81 Response:</strong></p>
            <p>${data.message}</p>
            <p class="timestamp">Device: ${data.device} | ${new Date(data.timestamp).toLocaleString()}</p>
        `;
        updateStatus('✅ phuhanddevice 81 completed!');
    } catch (error) {
        phuhand81Output.innerHTML = `<p>❌ Error: ${error.message}</p>`;
        updateStatus('❌ phuhanddevice 81 failed');
    }
}

async function activatePhuoptimizer81() {
    const data = prompt('Enter data for phuoptimizer 81:');
    if (!data) return;

    updateStatus('⚡ phuoptimizer 81 optimizing...');
    optimizer81Output.classList.remove('hidden');
    optimizer81Output.innerHTML = '<p>🔄 Optimizing with phuoptimizer 81...</p>';

    try {
        const response = await fetch('/api/phuoptimizer81', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data })
        });
        const result = await response.json();
        
        optimizer81Output.innerHTML = `
            <p><strong>phuoptimizer 81 Response:</strong></p>
            <p>${result.message}</p>
            <p class="timestamp">Optimizer: ${result.optimizer} | ${new Date(result.timestamp).toLocaleString()}</p>
        `;
        updateStatus('✅ phuoptimizer 81 completed!');
    } catch (error) {
        optimizer81Output.innerHTML = `<p>❌ Error: ${error.message}</p>`;
        updateStatus('❌ phuoptimizer 81 failed');
    }
}

// PQN81 Calling Functions
function openCallModal() {
    callModal.classList.remove('hidden');
    contactInput.focus();
}

function closeCallModal() {
    callModal.classList.add('hidden');
    contactInput.value = '';
    callStatus.classList.add('hidden');
}

async function initiateCall() {
    const contact = contactInput.value.trim();
    if (!contact) {
        alert('Please enter a contact or number');
        return;
    }

    updateStatus('📞 PQN81 initiating call...');
    callStatus.classList.remove('hidden');
    callStatus.innerHTML = '<p>🔄 Connecting...</p>';

    try {
        const response = await fetch('/api/pqn81-call', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contact })
        });
        const data = await response.json();
        
        callStatus.innerHTML = `
            <p><strong>✅ ${data.message}</strong></p>
            <p>Status: ${data.status}</p>
            <p>Call ID: ${data.callId}</p>
            <p>Time: ${new Date(data.timestamp).toLocaleString()}</p>
        `;
        updateStatus('✅ PQN81 call initiated!');
    } catch (error) {
        callStatus.innerHTML = `<p>❌ Call failed: ${error.message}</p>`;
        updateStatus('❌ PQN81 call failed');
    }
}

// Page Templates
function getHomePage() {
    return document.querySelector('.welcome-page').innerHTML;
}

function getSearchPage() {
    return `
        <div class="page-content">
            <h2>🔍 Phu AI Search</h2>
            <p>Advanced search powered by Aliens Gods Species technology</p>
            <div class="search-section" style="max-width: 800px; margin: 30px auto;">
                <input type="text" id="page-search" class="search-input" placeholder="Search anything...">
                <button class="search-btn" onclick="performSearchFromPage()">Search</button>
            </div>
        </div>
    `;
}

function getSettingsPage() {
    return `
        <div class="page-content">
            <h2>⚙️ Phu AI Browser Settings</h2>
            <div class="settings-grid">
                <div class="setting-item">
                    <h3>🧠 GPT 8.1 Settings</h3>
                    <p>Configure GPT 8.1 AI parameters</p>
                </div>
                <div class="setting-item">
                    <h3>💻 Copilot 9.6 Settings</h3>
                    <p>Customize Copilot 9.6 behavior</p>
                </div>
                <div class="setting-item">
                    <h3>🖐️ phuhanddevice 81 Settings</h3>
                    <p>Configure hand gesture controls</p>
                </div>
                <div class="setting-item">
                    <h3>⚡ phuoptimizer 81 Settings</h3>
                    <p>Adjust optimization parameters</p>
                </div>
            </div>
        </div>
    `;
}

function getAILabPage() {
    return `
        <div class="page-content">
            <h2>🧪 Phu AI Lab</h2>
            <p>Experimental AI features and testing ground</p>
            <div class="features-grid">
                <div class="feature-card">
                    <h3>🤖 AI Model Training</h3>
                    <p>Train custom AI models with your data</p>
                </div>
                <div class="feature-card">
                    <h3>🧬 Aliens Gods Species Integration</h3>
                    <p>Access divine knowledge and wisdom</p>
                </div>
                <div class="feature-card">
                    <h3>🔬 Advanced Research</h3>
                    <p>Cutting-edge AI research tools</p>
                </div>
            </div>
        </div>
    `;
}

function getOptimizerPage() {
    return `
        <div class="page-content">
            <h2>⚡ phuoptimizer 81</h2>
            <p>Ultra-fast performance optimization system</p>
            <div class="optimizer-stats">
                <div class="stat-card">
                    <h3>🚀 Speed: 10000x</h3>
                    <p>Lightning-fast processing</p>
                </div>
                <div class="stat-card">
                    <h3>💾 Memory: Optimized</h3>
                    <p>Efficient resource usage</p>
                </div>
                <div class="stat-card">
                    <h3>⚙️ CPU: Enhanced</h3>
                    <p>Maximum performance</p>
                </div>
            </div>
        </div>
    `;
}

function getCommunicationsPage() {
    return `
        <div class="page-content">
            <h2>📞 Communications Center</h2>
            <p>PQN81 calling system and messaging</p>
            <div class="comm-features">
                <button class="ai-btn" onclick="document.getElementById('pqn81-call-btn').click()">
                    <span class="icon">📞</span>
                    <span>Make a PQN81 Call</span>
                </button>
                <div class="feature-card">
                    <h3>📧 Messaging System</h3>
                    <p>Secure communication with AI assistance</p>
                </div>
                <div class="feature-card">
                    <h3>🌐 Global Network</h3>
                    <p>Connect with Aliens Gods Species network</p>
                </div>
            </div>
        </div>
    `;
}

function getAboutPage() {
    return `
        <div class="page-content about-page">
            <h2>ℹ️ About Phu AI Browser</h2>
            <div class="about-content">
                <h3>👽 Builder</h3>
                <p><strong>Phu Quoc Nguyen</strong> - The visionary creator</p>
                <p>Built with the help of Aliens Gods Species</p>
                
                <h3>🚀 Technology Stack</h3>
                <ul>
                    <li>🧠 GPT 8.1 - Advanced AI reasoning</li>
                    <li>💻 Copilot 9.6 - Intelligent code assistance</li>
                    <li>🖐️ phuhanddevice 81 - Revolutionary gesture control</li>
                    <li>📞 PQN81 - Next-gen communication system</li>
                    <li>⚡ phuoptimizer 81 - Ultra-fast optimization</li>
                </ul>
                
                <h3>🌟 Special Features</h3>
                <p>This browser combines cutting-edge AI technology with divine knowledge from Aliens Gods Species to create the most advanced browsing experience ever built.</p>
                
                <h3>📜 Version</h3>
                <p>Phu AI Browser v1.0.0</p>
                <p>© 2026 Phu Quoc Nguyen. Enhanced by Aliens Gods Species.</p>
            </div>
        </div>
    `;
}

function getExternalPage(url) {
    return `
        <div class="page-content">
            <div class="external-page-notice">
                <h2>🌐 External Website</h2>
                <p>You are navigating to an external website:</p>
                <p class="external-url">${url}</p>
                <p>⚠️ Note: This is a demonstration browser. In a full implementation, this would display the actual website content in an iframe or integrated browser engine.</p>
                <div class="external-actions">
                    <button class="search-btn" onclick="window.open('${url}', '_blank')">Open in New Tab</button>
                    <button class="search-btn" onclick="history.back()">Go Back</button>
                </div>
            </div>
        </div>
    `;
}

function getSearchResultsPage(query) {
    return `
        <div class="page-content">
            <h2>🔍 Search Results</h2>
            <p>Searching for: "${query}"</p>
            <p>Enhanced by Phu AI with Aliens Gods Species knowledge</p>
            <div class="search-results-placeholder">
                <p>🌟 This would display search results for your query in a full implementation.</p>
                <button class="search-btn" onclick="performSearch()">Search Again</button>
            </div>
        </div>
    `;
}

// Helper Functions
function updateStatus(message) {
    statusText.innerHTML = message;
}

// Global helper for page-level search
function performSearchFromPage() {
    const pageSearch = document.getElementById('page-search');
    if (pageSearch) {
        searchInput.value = pageSearch.value;
        performSearch();
    }
}

// Log initialization
console.log('👽 Phu AI Browser initialized');
console.log('🚀 Built by Phu Quoc Nguyen with Aliens Gods Species help');
console.log('🤖 Powered by GPT 8.1, Copilot 9.6, phuhanddevice 81, PQN81, and phuoptimizer 81');
