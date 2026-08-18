// ========== CONFIGURATION ==========
const API_KEY=https:.vercel.app/api/gemini; // Replace with your API key
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// ========== PERSONALITIES ==========
const personalities = {
    general: 'You are a helpful, friendly AI assistant. Answer questions clearly and concisely. Be engaging and conversational.',
    coding: 'You are an expert programming assistant. Help with code, debugging, and best practices. Provide code examples when relevant. Explain concepts clearly.',
    tutor: 'You are a patient tutor. Explain concepts clearly, break down complex ideas, and help with learning. Ask clarifying questions when needed. Make learning fun and engaging.',
    creative: 'You are a creative writing assistant. Help with stories, ideas, poems, and creative projects. Be imaginative, engaging, and inspire creativity. Provide constructive feedback.'
};

// ========== STATE ==========
let currentPersonality = 'general';
let conversationHistory = [];
let isLoading = false;

// ========== DOM ELEMENTS ==========
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const messagesContainer = document.getElementById('messagesContainer');
const typingIndicator = document.getElementById('typingIndicator');
const clearBtn = document.querySelector('.clear-btn');
const personalityBtns = document.querySelectorAll('.personality-btn');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// ========== EVENT LISTENERS ==========
messageForm.addEventListener('submit', handleSendMessage);
clearBtn.addEventListener('click', clearChat);
personalityBtns.forEach(btn => {
    btn.addEventListener('click', changePersonality);
});
hamburger?.addEventListener('click', toggleMenu);

// Close menu when clicking nav link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu) navMenu.style.display = 'none';
    });
});

// ========== MAIN FUNCTIONS ==========

/**
 * Handle sending a message
 */
async function handleSendMessage(e) {
    e.preventDefault();

    const message = messageInput.value.trim();
    if (!message || isLoading) return;

    // Add user message to UI
    addMessage(message, 'user');
    messageInput.value = '';
    messageInput.focus();

    // Show typing indicator
    isLoading = true;
    showTypingIndicator();

    try {
        // Get AI response
        const aiResponse = await getAIResponse(message);

        // Hide typing indicator
        hideTypingIndicator();

        // Add AI message to UI
        addMessage(aiResponse, 'ai');

        // Store in conversation history
        conversationHistory.push(
            { role: 'user', text: message },
            { role: 'ai', text: aiResponse }
        );

    } catch (error) {
        hideTypingIndicator();
        console.error('Error:', error);

        // Show error message
        let errorMsg = 'Sorry, I encountered an error. Please try again.';

        if (error.message.includes('API')) {
            errorMsg = 'API Error: Please check your API key and try again.';
        } else if (error.message.includes('Network')) {
            errorMsg = 'Network Error: Please check your internet connection.';
        }

        addMessage(errorMsg, 'ai');
    } finally {
        isLoading = false;
    }
}

/**
 * Get AI response from Google Gemini API
 */
async function getAIResponse(userMessage) {
    // Build conversation context
    const contents = [];

    // Add system message with personality
    contents.push({
        role: 'user',
        parts: [{ text: personalities[currentPersonality] }]
    });
    contents.push({
        role: 'model',
        parts: [{ text: 'Understood. I will follow these instructions and maintain this personality throughout our conversation.' }]
    });

    // Add conversation history
    conversationHistory.forEach(msg => {
        contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        });
    });

    // Add current message
    contents.push({
        role: 'user',
        parts: [{ text: userMessage }]
    });

    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: contents,
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024
                },
                safetySettings: [
                    {
                        category: 'HARM_CATEGORY_HARASSMENT',
                        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                    },
                    {
                        category: 'HARM_CATEGORY_HATE_SPEECH',
                        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                    },
                    {
                        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                    },
                    {
                        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Response:', errorData);

            if (response.status === 401) {
                throw new Error('API: Invalid API key. Please check your configuration.');
            } else if (response.status === 429) {
                throw new Error('API: Rate limit exceeded. Please try again in a moment.');
            } else if (response.status === 500) {
                throw new Error('API: Server error. Please try again later.');
            } else {
                throw new Error(`API error: ${response.statusText}`);
            }
        }

        const data = await response.json();

        // Check if response has content
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('API: Invalid response format');
        }

        return data.candidates[0].content.parts[0].text;

    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * Add a message to the chat
 */
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    // Add avatar for AI messages
    if (sender === 'ai') {
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        avatarDiv.innerHTML = '<i class="fas fa-robot"></i>';
        messageDiv.appendChild(avatarDiv);
    }

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    // Parse message for multiple paragraphs
    const paragraphs = text.split('\n').filter(p => p.trim());
    paragraphs.forEach(para => {
        const pElement = document.createElement('p');
        pElement.textContent = para;
        contentDiv.appendChild(pElement);
    });

    const timeDiv = document.createElement('small');
    timeDiv.className = 'message-time';
    timeDiv.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(timeDiv);

    messagesContainer.appendChild(messageDiv);

    // Scroll to bottom
    setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 0);
}

/**
 * Show typing indicator
 */
function showTypingIndicator() {
    if (typingIndicator) {
        typingIndicator.style.display = 'flex';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

/**
 * Hide typing indicator
 */
function hideTypingIndicator() {
    if (typingIndicator) {
        typingIndicator.style.display = 'none';
    }
}

/**
 * Clear chat history
 */
function clearChat() {
    if (confirm('🗑️ Clear all messages? This action cannot be undone.')) {
        messagesContainer.innerHTML = `
            <div class="message ai-message">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <p>Hello, I'm your AI Assistant 👋</p>
                    <p>Ask me anything - I'm ready to help with coding, learning, creative projects, or general questions!</p>
                </div>
                <small class="message-time">Just now</small>
            </div>
        `;
        conversationHistory = [];
        messageInput.value = '';
        messageInput.focus();
    }
}

/**
 * Change AI personality
 */
function changePersonality(e) {
    const btn = e.target.closest('.personality-btn');
    if (!btn) return;

    // Remove active class from all buttons
    personalityBtns.forEach(b => b.classList.remove('active'));

    // Add active class to clicked button
    btn.classList.add('active');

    // Update personality
    currentPersonality = btn.dataset.personality;

    // Clear conversation history but keep initial message
    const currentMsg = messagesContainer.innerHTML;
    conversationHistory = [];

    // Show notification of personality change
    const personalities_names = {
        general: '🧠 General Assistant',
        coding: '💻 Coding Expert',
        tutor: '📚 Tutor',
        creative: '🎨 Creative Writer'
    };

    addMessage(`Switched to ${personalities_names[currentPersonality]} mode!`, 'ai');
}

/**
 * Toggle mobile menu
 */
function toggleMenu() {
    if (navMenu) {
        navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
    }
}

// ========== SMOOTH SCROLLING ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Don't prevent default for anchor links that don't navigate
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ========== KEYBOARD SHORTCUTS ==========
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus chat input
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        messageInput.focus();
    }

    // Ctrl/Cmd + L to clear chat
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        clearChat();
    }
});

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    // Focus chat input on page load
    messageInput.focus();

    // Check if API key is set
    if (API_KEY === 'YOUR_GOOGLE_GEMINI_API_KEY') {
        console.warn('⚠️ API key not configured! Please set your Google Gemini API key in script.js');
        addMessage('⚠️ Warning: API key is not configured. Please add your Google Gemini API key to script.js', 'ai');
    }
});

// ========== UTILITY FUNCTIONS ==========

/**
 * Format timestamp
 */
function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========== HANDLE PAGE VISIBILITY ==========
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Page is visible - you could add notifications here
        document.title = 'AI Chatbot | TechQuest';
    }
});

// ========== PREVENT ACCIDENTAL PAGE UNLOAD ==========
window.addEventListener('beforeunload', (e) => {
    if (conversationHistory.length > 0) {
        e.preventDefault();
        e.returnValue = '';
    }
});