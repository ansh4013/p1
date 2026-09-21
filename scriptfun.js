// ========== CONFIGURATION ==========
const API_URL = "https://p1-zeta-silk.vercel.app/api/gemini";

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

clearBtn?.addEventListener('click', clearChat);

personalityBtns.forEach(btn => {
    btn.addEventListener('click', changePersonality);
});

hamburger?.addEventListener('click', toggleMenu);

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu) {
            navMenu.style.display = 'none';
        }
    });
});

// ========== MAIN FUNCTIONS ==========

async function handleSendMessage(e) {

    e.preventDefault();

    const message = messageInput.value.trim();

    if (!message || isLoading) {
        return;
    }

    console.log("Sending:", message);

    addMessage(message, 'user');

    messageInput.value = '';
    messageInput.focus();

    isLoading = true;

    showTypingIndicator();

    try {

        const aiResponse =
            await getAIResponse(message);

        hideTypingIndicator();

        addMessage(aiResponse, 'ai');

        conversationHistory.push(
            {
                role: 'user',
                text: message
            },
            {
                role: 'ai',
                text: aiResponse
            }
        );

    } catch (error) {

        hideTypingIndicator();

        console.error(error);

        let errorMsg =
            'Sorry, I encountered an error. Please try again.';

        if (
            error.message.includes('Network')
        ) {
            errorMsg =
                'Network Error: Please check your internet connection.';
        }

        addMessage(errorMsg, 'ai');

    } finally {

        isLoading = false;

    }
}

// ========== AI FUNCTION ==========

async function getAIResponse(userMessage) {

    try {

        let historyText = '';

        conversationHistory.forEach(msg => {

            historyText +=
                `${msg.role}: ${msg.text}\n`;

        });

        const prompt = `
${personalities[currentPersonality]}

Conversation History:
${historyText}

User:
${userMessage}
`;

        const response =
            await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body: JSON.stringify({
                    message: prompt
                })
            });

        const data =
            await response.json();

        console.log(
            "Gemini Response:",
            data
        );

        if (!response.ok) {

            throw new Error(
                data.error ||
                "Server Error"
            );

        }

        return (
            data.reply ||
            "No response received."
        );

    } catch (error) {

        console.error(
            "Gemini Error:",
            error
        );

        if (
            error.message.includes(
                "Failed to fetch"
            )
        ) {
            throw new Error(
                "Network Error"
            );
        }

        throw error;
    }
}
// ========== CHAT UI FUNCTIONS ==========

function addMessage(text, sender) {

    const messageDiv =
        document.createElement('div');

    messageDiv.className =
        `message ${sender}-message`;

    if (sender === 'ai') {

        const avatarDiv =
            document.createElement('div');

        avatarDiv.className =
            'message-avatar';

        avatarDiv.innerHTML =
            '<i class="fas fa-robot"></i>';

        messageDiv.appendChild(
            avatarDiv
        );
    }

    const contentDiv =
        document.createElement('div');

    contentDiv.className =
        'message-content';

    const paragraphs =
        text.split('\n')
            .filter(
                p => p.trim()
            );

    paragraphs.forEach(para => {

        const p =
            document.createElement('p');

        p.textContent = para;

        contentDiv.appendChild(p);

    });

    const timeDiv =
        document.createElement('small');

    timeDiv.className =
        'message-time';

    timeDiv.textContent =
        formatTime(new Date());

    messageDiv.appendChild(
        contentDiv
    );

    messageDiv.appendChild(
        timeDiv
    );

    messagesContainer.appendChild(
        messageDiv
    );

    setTimeout(() => {

        messagesContainer.scrollTop =
            messagesContainer.scrollHeight;

    }, 50);
}

// ========== TYPING INDICATOR ==========

function showTypingIndicator() {

    if (!typingIndicator) return;

    typingIndicator.style.display =
        'flex';

    setTimeout(() => {

        messagesContainer.scrollTop =
            messagesContainer.scrollHeight;

    }, 50);
}

function hideTypingIndicator() {

    if (!typingIndicator) return;

    typingIndicator.style.display =
        'none';
}

// ========== CLEAR CHAT ==========

function clearChat() {

    const confirmed =
        confirm(
            '🗑️ Clear all messages?'
        );

    if (!confirmed) return;

    messagesContainer.innerHTML = `
        <div class="message ai-message">
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>

            <div class="message-content">
                <p>Hello, I'm your AI Assistant 👋</p>
                <p>Ask me anything — coding, studies, creativity, ideas, projects, and more.</p>
            </div>

            <small class="message-time">
                Just now
            </small>
        </div>
    `;

    conversationHistory = [];

    messageInput.value = '';

    messageInput.focus();
}

// ========== PERSONALITY SWITCHING ==========

function changePersonality(e) {

    const btn =
        e.target.closest(
            '.personality-btn'
        );

    if (!btn) return;

    personalityBtns.forEach(b => {
        b.classList.remove(
            'active'
        );
    });

    btn.classList.add(
        'active'
    );

    currentPersonality =
        btn.dataset.personality;

    conversationHistory = [];

    const personalityNames = {

        general:
            '🧠 General Assistant',

        coding:
            '💻 Coding Expert',

        tutor:
            '📚 Tutor',

        creative:
            '🎨 Creative Writer'

    };

    addMessage(
        `Switched to ${personalityNames[currentPersonality]} mode!`,
        'ai'
    );
}

// ========== MOBILE MENU ==========

function toggleMenu() {

    if (!navMenu) return;

    if (
        navMenu.style.display ===
        'flex'
    ) {

        navMenu.style.display =
            'none';

    } else {

        navMenu.style.display =
            'flex';

    }
}

// ========== SMOOTH SCROLLING ==========

document
.querySelectorAll(
    'a[href^="#"]'
)
.forEach(anchor => {

    anchor.addEventListener(
        'click',
        function (e) {

            const href =
                this.getAttribute(
                    'href'
                );

            if (
                href === '#'
            ) return;

            e.preventDefault();

            const target =
                document.querySelector(
                    href
                );

            if (target) {

                target.scrollIntoView({
                    behavior:
                        'smooth'
                });

            }
        }
    );
});

// ========== KEYBOARD SHORTCUTS ==========

document.addEventListener(
    'keydown',
    e => {

        if (
            (e.ctrlKey ||
                e.metaKey) &&
            e.key === 'k'
        ) {

            e.preventDefault();

            messageInput.focus();
        }

        if (
            (e.ctrlKey ||
                e.metaKey) &&
            e.key === 'l'
        ) {

            e.preventDefault();

            clearChat();
        }
    }
);

// ========== INITIALIZATION ==========

document.addEventListener(
    'DOMContentLoaded',
    () => {

        console.log(
            '🚀 NEXORA AI Ready'
        );

        messageInput?.focus();
    }
);

// ========== UTILITIES ==========

function formatTime(date) {

    return date.toLocaleTimeString(
        [],
        {
            hour: '2-digit',
            minute: '2-digit'
        }
    );
}

function escapeHtml(text) {

    const div =
        document.createElement(
            'div'
        );

    div.textContent =
        text;

    return div.innerHTML;
}

// ========== PAGE VISIBILITY ==========

document.addEventListener(
    'visibilitychange',
    () => {

        if (
            !document.hidden
        ) {

            document.title =
                'NEXORA AI CHAT';
        }
    }
);

// ========== BEFORE UNLOAD ==========

window.addEventListener(
    'beforeunload',
    e => {

        if (
            conversationHistory.length > 0
        ) {

            e.preventDefault();

            e.returnValue = '';
        }
    }
);