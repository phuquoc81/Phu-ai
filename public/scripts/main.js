document.addEventListener('DOMContentLoaded', () => {
    const problemInput = document.getElementById('problemInput');
    const solveButton = document.getElementById('solveButton');
    const resultSection = document.getElementById('result');
    const resultContent = document.getElementById('resultContent');

    solveButton.addEventListener('click', async () => {
        const problem = problemInput.value.trim();

        if (!problem) {
            alert('Please enter a problem to solve!');
            return;
        }

        // Disable button while processing
        solveButton.disabled = true;
        solveButton.textContent = 'Processing...';

        try {
            // TODO: Replace with actual AI backend integration
            // Simulate AI processing delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Display result
            resultContent.innerHTML = `
                <p><strong>Problem:</strong> ${escapeHtml(problem)}</p>
                <p><strong>Analysis:</strong> This is a demonstration of the Phu AI interface. 
                In a production environment, this would connect to advanced AI models to provide 
                intelligent solutions to your problems.</p>
                <p><strong>Status:</strong> Ready for integration with AI backend services.</p>
            `;

            resultSection.style.display = 'block';
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } catch (error) {
            alert('An error occurred while processing your request.');
            console.error(error);
        } finally {
            // Re-enable button
            solveButton.disabled = false;
            solveButton.textContent = 'Solve Problem';
        }
    });

    // Helper function to escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Check API health on load
    checkApiHealth();
});

async function checkApiHealth() {
    try {
        const response = await fetch('/api/health');
        const data = await response.json();
        console.log('API Health:', data);
    } catch (error) {
        console.error('API health check failed:', error);
    }
}
