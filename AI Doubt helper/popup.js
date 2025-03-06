document.addEventListener("DOMContentLoaded", function () {
    const apiKeyInput = document.getElementById("apiKey");
    const saveButton = document.getElementById("saveButton");
    const statusMessage = document.getElementById("statusMessage");

    chrome.storage.local.get("geminiApiKey", function (data) {
        if (data.geminiApiKey) {
            apiKeyInput.value = data.geminiApiKey;
        }
    });

    saveButton.addEventListener("click", function () {
        const apiKey = apiKeyInput.value.trim();
        
        // Validate API key format (assuming alphanumeric with 39-40 characters)
        const apiKeyRegex = /^[A-Za-z0-9_-]{39,40}$/;
        if (!apiKeyRegex.test(apiKey)) {
            statusMessage.textContent = "Invalid API Key format!";
            statusMessage.style.color = "red";
            return;
        }

        chrome.storage.local.set({ geminiApiKey: apiKey }, function () {
            statusMessage.textContent = "API Key saved successfully!";
            statusMessage.style.color = "green";
            setTimeout(() => {
                statusMessage.textContent = "";
            }, 2000);
        });
    });
});
