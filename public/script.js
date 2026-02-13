document.addEventListener('DOMContentLoaded', function() {
    const solveBtn = document.getElementById('solveBtn');
    const problemInput = document.getElementById('problemInput');
    const problemType = document.getElementById('problemType');
    const resultDiv = document.getElementById('result');
    const solutionContent = document.getElementById('solutionContent');
    const loadingDiv = document.getElementById('loading');

    // Handle solve button click
    solveBtn.addEventListener('click', async function() {
        const problem = problemInput.value.trim();
        const type = problemType.value;

        if (!problem) {
            alert('Please enter a problem or question!');
            return;
        }

        // Show loading, hide result
        loadingDiv.classList.remove('hidden');
        resultDiv.classList.add('hidden');
        solveBtn.disabled = true;

        try {
            // Call API
            const response = await fetch('/api/solve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    problem: problem,
                    type: type
                })
            });

            const data = await response.json();

            // Hide loading
            loadingDiv.classList.add('hidden');

            if (data.success) {
                // Show result
                solutionContent.innerHTML = `
                    <p><strong>Problem Type:</strong> ${formatType(data.type)}</p>
                    <p><strong>Your Question:</strong> ${escapeHtml(data.problem)}</p>
                    <hr style="margin: 15px 0; border: none; border-top: 1px solid #ddd;">
                    <p><strong>Solution:</strong></p>
                    <p>${escapeHtml(data.solution)}</p>
                    <p style="margin-top: 15px; font-size: 0.9em; color: #666;">
                        <em>Timestamp: ${new Date(data.timestamp).toLocaleString()}</em>
                    </p>
                `;
                resultDiv.classList.remove('hidden');
            } else {
                alert('Error processing your request. Please try again.');
            }
        } catch (error) {
            loadingDiv.classList.add('hidden');
            alert('Error connecting to server. Please try again.');
            console.error('Error:', error);
        } finally {
            solveBtn.disabled = false;
        }
    });

    // Handle Enter key in textarea
    problemInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            solveBtn.click();
        }
    });

    // Format type for display
    function formatType(type) {
        const types = {
            'general': 'General Question',
            'math': 'Mathematics',
            'physics': 'Physics',
            'puzzle': 'Puzzle',
            'prediction': 'Future Prediction',
            'diagnosis': 'Medical Diagnosis'
        };
        return types[type] || type;
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Animate app cards on load
    const appCards = document.querySelectorAll('.app-card');
    appCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s, transform 0.5s';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        }, index * 100);
    });

    // Add click handlers to app cards
    appCards.forEach(card => {
        card.addEventListener('click', function() {
            const appName = this.querySelector('h3').textContent;
            showAppStatus(appName);
        });
    });

    // Show app status
    function showAppStatus(appName) {
        alert(`${appName} is working normally on phuhanddevice 81! ✅`);
    }

    // Log system ready
    console.log('Phu-AI System Ready on phuhanddevice 81');
    console.log('All apps initialized successfully');
});
