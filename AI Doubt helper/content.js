console.log("AI DSA Mentor Loaded!");

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

function createChatBot() {
  const chatBotContainer = document.createElement('div');
  chatBotContainer.className = 'helper-chatbot';
  chatBotContainer.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: 10000;
    font-family: 'Inter', sans-serif;
  `;

  const toggleButton = document.createElement('button');
  toggleButton.className = 'chatbot-toggle-btn';
  toggleButton.textContent = '🤖 Need Help?';
  toggleButton.style.cssText = `
    background-color: #2563eb;
    color: white;
    border: none;
    border-radius: 50px;
    padding: 12px 24px;
    cursor: pointer;
    font-size: 14px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  `;
  
  const chatPanel = document.createElement('div');
  chatPanel.className = 'chatbot-panel';
  chatPanel.style.cssText = `
    display: none;
    position: absolute;
    bottom: 70px;
    left: 0;
    width: 380px;
    height: 500px;
    background-color: #2d2d2d;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    flex-direction: column;
    overflow: hidden;
    color: #e0e0e0;
  `;

  const chatHeader = document.createElement('div');
  chatHeader.className = 'chatbot-header';
  chatHeader.style.cssText = `
    background-color: #2563eb;
    color: white;
    padding: 12px 16px;
    font-weight: 600;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 12px 12px 0 0;
  `;
  chatHeader.textContent = 'DSA Mentor AI';
  
  const closeButton = document.createElement('button');
  closeButton.textContent = '✕';
  closeButton.style.cssText = `
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    padding: 4px;
    border-radius: 50%;
    transition: background 0.2s ease;
  `;
  closeButton.addEventListener('mouseover', () => {
    closeButton.style.background = 'rgba(255, 255, 255, 0.1)';
  });
  closeButton.addEventListener('mouseout', () => {
    closeButton.style.background = 'none';
  });
  
  const chatMessages = document.createElement('div');
  chatMessages.className = 'chatbot-messages';
  chatMessages.style.cssText = `
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    background-color: #252525;
    scrollbar-width: thin;
    scrollbar-color: #555 #252525;
  `;

  const inputContainer = document.createElement('div');
  inputContainer.className = 'chatbot-input-container';
  inputContainer.style.cssText = `
    display: flex;
    padding: 12px;
    border-top: 1px solid #444;
    background-color: #2d2d2d;
    gap: 8px;
  `;

  const chatInput = document.createElement('input');
  chatInput.className = 'chatbot-input';
  chatInput.placeholder = 'Ask about this problem...';
  chatInput.style.cssText = `
    flex: 1;
    padding: 10px;
    border: 1px solid #555;
    border-radius: 20px;
    font-size: 14px;
    background-color: #333;
    color: #e0e0e0;
    outline: none;
  `;

  const voiceButton = document.createElement('button');
  voiceButton.className = 'chatbot-voice-btn';
  voiceButton.innerHTML = '🎤';
  voiceButton.style.cssText = `
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s ease;
  `;
  voiceButton.addEventListener('mouseover', () => {
    voiceButton.style.background = '#218838';
  });
  voiceButton.addEventListener('mouseout', () => {
    voiceButton.style.background = '#28a745';
  });

  const sendButton = document.createElement('button');
  sendButton.className = 'chatbot-send-btn';
  sendButton.textContent = 'Ask';
  sendButton.style.cssText = `
    background-color: #2563eb;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.3s ease;
  `;
  sendButton.addEventListener('mouseover', () => {
    sendButton.style.background = '#1e4bb6';
  });
  sendButton.addEventListener('mouseout', () => {
    sendButton.style.background = '#2563eb';
  });

  chatHeader.appendChild(closeButton);
  inputContainer.appendChild(chatInput);
  inputContainer.appendChild(voiceButton);
  inputContainer.appendChild(sendButton);
  
  chatPanel.appendChild(chatHeader);
  chatPanel.appendChild(chatMessages);
  chatPanel.appendChild(inputContainer);
  
  chatBotContainer.appendChild(toggleButton);
  chatBotContainer.appendChild(chatPanel);
  
  document.body.appendChild(chatBotContainer);

  addMessage('bot', 'Hi! I am your DSA Mentor. I can help you solve coding problems. Ask me anything!', chatMessages);

  toggleButton.addEventListener('click', () => {
    chatPanel.style.display = chatPanel.style.display === 'none' ? 'flex' : 'none';
  });

  closeButton.addEventListener('click', () => {
    chatPanel.style.display = 'none';
  });

  function sendMessage() {
    const userMessage = chatInput.value.trim();
    if (userMessage === '') return;
    
    addMessage('user', userMessage, chatMessages);
    
    chatInput.value = '';
    
    const problemInfo = getProblemInfo();
    
    sendToGemini(userMessage, problemInfo, chatMessages);
  }

  sendButton.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  voiceButton.addEventListener('click', startVoiceRecognition);

  return chatBotContainer;
}

function addMessage(sender, text, chatMessagesElement) {
  const messageElement = document.createElement('div');
  messageElement.className = `message message-${sender}`;
  messageElement.style.cssText = `
    margin-bottom: 12px;
    padding: 12px 16px;
    border-radius: 12px;
    max-width: 80%;
    ${sender === 'user' ? 
      'background-color: #2563eb; color: white; align-self: flex-end; margin-left: auto;' : 
      'background-color: #3a3a3a; color: #e0e0e0;'}
    line-height: 1.5;
    font-size: 14px;
    white-space: pre-wrap;
    word-break: break-word;
  `;
  
  messageElement.textContent = text;
  chatMessagesElement.appendChild(messageElement);
  
  if (sender === 'bot') {
    const speakButton = document.createElement('img');
    speakButton.src = chrome.runtime.getURL('assets/voice.jpg');
    speakButton.style.cssText = `
      width: 20px;
      height: 20px;
      margin-left: 8px;
      cursor: pointer;
    `;
    speakButton.addEventListener('click', () => speakMessage(text));
    messageElement.appendChild(speakButton);
  }
  
  chatMessagesElement.scrollTop = chatMessagesElement.scrollHeight;
}

function startVoiceRecognition() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.start();
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    document.querySelector('.chatbot-input').value = transcript;
  };
  
  recognition.onerror = (event) => {
    console.error('Voice recognition error:', event.error);
  };
}

function speakMessage(message) {
  const speech = new SpeechSynthesisUtterance(message);
  speech.lang = 'en-US';
  speech.rate = 1.0;
  speech.pitch = 1.0;
  window.speechSynthesis.speak(speech);
}

function getProblemInfo() {
    let title = '';
    let description = '';
    let code = '';

    // Get the problem title
    const titleContainer = document.querySelector('.fw-bolder.problem_heading.fs-4');
    if (titleContainer) {
        title = titleContainer.innerText.trim();
    }

    if (!title) {
        title = document.title.replace(' - LeetCode', '').replace(' - HackerRank', '').trim();
    }

    // Get the problem description
    const descriptionContainer = document.querySelector('.coding_desc__pltWY.problem_paragraph');
    if (descriptionContainer) {
        description = descriptionContainer.innerText.trim();
    }

    // Ensure the description is not empty
    if (!description) {
        description = 'Description not found. Please check the problem page structure.';
    }

    // Extract language
    let language = 'unknown';
    const languageElement = document.querySelector('.d-flex.align-items-center.gap-1.text-blue-dark');
    if (languageElement) {
        language = languageElement.textContent.trim(); // Keeping the original case and spaces
    }

    // Extract difficulty
    let difficulty = '';
    const difficultyElement = document.querySelector('.m-0.fs-6.problem_paragraph.fw-bold.mb-0');
    if (difficultyElement) {
        difficulty = difficultyElement.textContent.trim();
    }

    // Extract problem ID from the URL
    let problemId = 'unknown';
    const urlParts = window.location.pathname.split('/').filter(Boolean);
    if (urlParts.length >= 2) {
        const lastPart = urlParts[urlParts.length - 1]; // Get the last part of the URL
        const match = lastPart.match(/(\d+)$/); // Extract the numeric problem ID at the end
        if (match) {
            problemId = match[1];
        }
    }

    // Extract user ID from localStorage keys
    let userId = 'unknown';
    let courseName = 'course'; // Always fixed as "course"

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const match = key.match(/^course_(\d+)_\d+_.+$/); // Extract userId from key format
        if (match) {
            userId = match[1]; // Extract user ID (e.g., 44652)
            break; // Use the first matching key
        }
    }

    // Construct the correct storage key using extracted language, user ID, and problem ID
    const storageKey = `${courseName}_${userId}_${problemId}_${language}`;
    console.log("Generated Storage Key:", storageKey);
    
    code = localStorage.getItem(storageKey) || 'No code found in localStorage';

    console.log("Extracted problem info:", { 
        title, 
        description: description.substring(0, 100) + "...", 
        codePreview: code.substring(0, 100) + "...", 
        language, 
        difficulty 
    });

    return {
        title,
        description,
        code,
        language,
        difficulty,
        url: window.location.href
    };
}

async function sendToGemini(userQuestion, problemInfo, chatMessagesElement) {
  try {
    const apiKeyObj = await chrome.storage.local.get("geminiApiKey");
    const API_KEY = apiKeyObj.geminiApiKey;
    
    if (!API_KEY) {
      addMessage('bot', 'API key not found. Please set your Gemini API key in the extension settings.', chatMessagesElement);
      return;
    }

    const contextKey = "Context_" + problemInfo.title;
    const contextObj = await chrome.storage.local.get(contextKey);
    const context = contextObj[contextKey] || { question: "", answer: "" };

    addMessage('bot', 'Got it, let me think about this...', chatMessagesElement);
    
    const prompt = `
      Previous chat with the user:
      ${JSON.stringify(context) || "No previous context"}
      
      PROBLEM INFORMATION:
      Title: ${problemInfo.title || "Unknown problem title"}
      URL: ${problemInfo.url}
      Difficulty: ${problemInfo.difficulty || "Unknown"}
      Language: ${problemInfo.language || "Unknown"}
      
      Description: 
      ${problemInfo.description || "No description available"}
      
      Current Code:
      \`\`\`${problemInfo.language || ""}
      ${problemInfo.code || "No code available"}
      \`\`\`
      
      USER QUESTION: ${userQuestion}

      You are a knowledgeable and supportive DSA (Data Structures and Algorithms) mentor and problem-solving assistant. Your goal is to guide the user toward understanding and solving coding problems rather than simply providing direct answers.

      When presented with a problem, follow this structured approach:
      1. Start by understanding the user's question and provide hints at first.
      2. Encourage the user to think through the problem, ask guiding questions, and help them break it down logically.
      3. Once the user has attempted an approach or needs more help, guide them step by step toward an optimal solution.
      4. Only provide the code when the user specifically requests it.
      5. Keep the conversation natural and engaging, using simple and clear explanations.
    `;
    
    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 4096,
        topP: 0.8,
        topK: 40
      }
    };
    
    const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Remove the "thinking" message
    const thinkingMessages = chatMessagesElement.querySelectorAll('.message-bot');
    for (const msg of thinkingMessages) {
      if (msg.textContent === 'Got it, let me think about this...') {
        chatMessagesElement.removeChild(msg);
        break;
      }
    }
    
    if (data.candidates && data.candidates.length > 0 && 
        data.candidates[0].content && 
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts.length > 0) {
      
      const responseText = data.candidates[0].content.parts[0].text;
      addMessage('bot', responseText, chatMessagesElement);

      await chrome.storage.local.set({ 
        [contextKey]: {
          question: (context.question || "") + "\n\nUser: " + userQuestion,
          answer: (context.answer || "") + "\n\nAI: " + responseText
        } 
      });
    
    } else {
      throw new Error('Unexpected API response format');
    }
    
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    
    // Remove the "thinking" message if it exists
    const thinkingMessages = chatMessagesElement.querySelectorAll('.message-bot');
    for (const msg of thinkingMessages) {
      if (msg.textContent === 'Got it, let me think about this...') {
        chatMessagesElement.removeChild(msg);
        break;
      }
    }
    
    addMessage('bot', 'Sorry, I encountered an error. Please try again later. Error details: ' + error.message, chatMessagesElement);
  }
}

// Function to observe DOM changes and ensure the chatbot is created if missing
function setupMutationObserver() {
    const observer = new MutationObserver(() => {
        if (shouldRunChatBot()) {
            if (!document.querySelector('.helper-chatbot')) {
                createChatBot(); // Create chatbot if it doesn't exist
            }
        } else {
            const chatbot = document.querySelector('.helper-chatbot');
            if (chatbot) {
                chatbot.remove(); // Remove chatbot if not on the allowed page
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// Function to determine if the chatbot should run on the current page
function shouldRunChatBot() {
    const allowedURL = "https://maang.in/problems/"; // Only allow chatbot on this specific URL
    return window.location.href.startsWith(allowedURL);
}

// Function to handle URL changes in SPAs
function counterSPAProblem() {
    let lastURL = window.location.href;

    setInterval(() => {
        const currentURL = window.location.href;
        if (currentURL !== lastURL) {
            lastURL = currentURL;
            if (shouldRunChatBot()) {
                if (!document.querySelector('.helper-chatbot')) {
                    createChatBot();
                }
            } else {
                const chatbot = document.querySelector('.helper-chatbot');
                if (chatbot) {
                    chatbot.remove();
                }
            }
        }
    }, 1000); // Check for URL changes every second
}

// Event listener to initialize the chatbot when the page loads
window.addEventListener("load", () => {
    if (shouldRunChatBot()) { // Run chatbot only if on the allowed URL
        createChatBot();
    }
    setupMutationObserver();
    counterSPAProblem(); // Monitor SPA navigation changes
    console.log("DSA Helper Extension loaded and ready");
});

// If the document is already loaded, initialize the chatbot immediately
if (document.readyState === "complete" || document.readyState === "interactive") {
    if (shouldRunChatBot()) {
        createChatBot();
    }
    setupMutationObserver();
    counterSPAProblem();
}
