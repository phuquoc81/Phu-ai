const statusElement = document.getElementById("api-status");
const timestampElement = document.getElementById("api-timestamp");
const refreshButton = document.getElementById("refresh-status");

const setStatus = (message, timestamp = "--") => {
  statusElement.textContent = message;
  timestampElement.textContent = `Last updated: ${timestamp}`;
};

const fetchStatus = async () => {
  setStatus("Checking API status...");

  try {
    const response = await fetch("/api/phutokenvercel");

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const statusMessage = `${data.message} (${data.status})`;

    setStatus(statusMessage, new Date(data.timestamp).toLocaleString());
  } catch (error) {
    setStatus("Unable to reach the API right now.");
    console.error("Failed to load Phutokenvercel API status:", error);
  }
};

refreshButton.addEventListener("click", fetchStatus);
fetchStatus();
