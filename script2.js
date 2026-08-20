Full "script.js"

// ============================================================
// AI CHATBOT - FRONTEND SCRIPT
// Gemini API is NOT stored here.
// Gemini API key is kept securely in Vercel.
// ============================================================


// ============================================================
// CONFIGURATION
// ============================================================

// Your Vercel backend endpoint.
// IMPORTANT: No Gemini API key is needed in this file.
const API_URL = 'https://p1-zeta-silk.vercel.app/api/gemini';


// ============================================================
// PERSONALITIES
// ============================================================

const personalities = {

    general:
        'You are a helpful, friendly AI assistant. Answer questions clearly and concisely. Be engaging and conversational.',

    coding:
        'You are an expert programming assistant. Help with code, debugging, and best practices. Provide code examples when relevant. Explain concepts clearly.',

    tutor:
        'You are a patient tutor. Explain concepts clearly, break down complex ideas, and help with learning. Ask clarifying questions when needed. Make learning fun and engaging.',

    creative:
        'You are a creative writing assistant. Help with stories, ideas, poems, and creative projects. Be imaginative, engaging, and inspire creativity. Provide constructive feedback.'

};


// ============================================================
// STATE
// ============================================================

let currentPersonality = 'general';

let conversationHistory = [];

let isLoading = false;


// ============================================================
// DOM ELEMENTS
// ============================================================

const messageForm = document.getElementById('messageForm');

const messageInput = document.getElementById('messageInput');

const messagesContainer =
    document.getElementById('messagesContainer');

const typingIndicator =
    document.getElementById('typingIndicator');

const clearBtn =
    document.querySelector('.clear-btn');

const personalityBtns =
    document.querySelectorAll('.personality-btn');

const hamburger =
    document.querySelector('.hamburger');

const navMenu =
    document.querySelector('.nav-menu');


// ============================================================
// EVENT LISTENERS
// ============================================================

// Message form
if (messageForm) {
    messageForm.addEventListener(
        'submit',
        handleSendMessage
    );
}


// Clear chat button
if (clearBtn) {
    clearBtn.addEventListener(
        'click',
        clearChat
    );
}


// Personality buttons
personalityBtns.forEach(btn => {

    btn.addEventListener(
        'click',
        changePersonality
    );

});


// Mobile hamburger
if (hamburger) {

    hamburger.addEventListener(
        'click',
        toggleMenu
    );

}


// Close mobile menu when navigation link is clicked
document.querySelectorAll('.nav-link').forEach(link => {

    link.addEventListener('click', () => {

        if (navMenu) {
            navMenu.style.display = 'none';
        }

    });

});


// ============================================================
// SEND MESSAGE
// ============================================================

async function handleSendMessage(event) {

    event.preventDefault();

    if (!messageInput) {
        return;
    }

    const message =
        messageInput.value.trim();


    // Don't send empty messages
    if (!message) {
        return;
    }


    // Don't send multiple requests at the same time
    if (isLoading) {
        return;
    }


    // Add user's message to the interface
    addMessage(
        message,
        'user'
    );


    // Clear input
    messageInput.value = '';


    // Focus input again
    messageInput.focus();


    // Start loading state
    isLoading = true;


    // Show typing animation
    showTypingIndicator();


    try {

        // Get Gemini response from Vercel backend
        const aiResponse =
            await getAIResponse(message);


        // Hide typing animation
        hideTypingIndicator();


        // Add AI response to UI
        addMessage(
            aiResponse,
            'ai'
        );


        // Save conversation
        conversationHistory.push({

            role: 'user',

            text: message

        });


        conversationHistory.push({

            role: 'ai',

            text: aiResponse

        });


    } catch (error) {

        console.error(
            'Chat error:',
            error
        );


        hideTypingIndicator();


        let errorMessage =
            'Sorry, I could not get a response. Please try again.';


        const errorText =
            error && error.message
                ? error.message.toLowerCase()
                : '';


        if (
            errorText.includes('network') ||
            errorText.includes('failed to fetch')
        ) {

            errorMessage =
                'Network Error: Please check your internet connection.';

        }

        else if (
            errorText.includes('backend') ||
            errorText.includes('vercel')
        ) {

            errorMessage =
                'Backend Error: The AI server is currently unavailable.';

        }

        else if (
            errorText.includes('api')
        ) {

            errorMessage =
                'API Error: Please try again in a moment.';

        }


        addMessage(
            errorMessage,
            'ai'
        );

    } finally {

        isLoading = false;

    }

}


// ============================================================
// GET AI RESPONSE
// ============================================================

async function getAIResponse(userMessage) {

    // Make a safe copy of conversation history
    const history =
        conversationHistory.map(item => ({

            role: item.role,

            text: item.text

        }));


    // Send message to YOUR Vercel backend.
    //
    // The Gemini API key is NOT sent from the browser.
    //
    // Vercel backend reads:
    //
    // process.env.GEMINI_API_KEY
    //

    let response;


    try {

        response = await fetch(
            API_URL,
            {

                method: 'POST',

                headers: {

                    'Content-Type':
                        'application/json'

                },

                body: JSON.stringify({

                    message: userMessage,

                    personality:
                        personalities[currentPersonality],

                    history: history

                })

            }
        );

    } catch (networkError) {

        console.error(
            'Network error:',
            networkError
        );

        throw new Error(
            'Network Error'
        );

    }


    // Try to read JSON response
    let data;

    try {

        data = await response.json();

    } catch (jsonError) {

        console.error(
            'Invalid backend response:',
            jsonError
        );

        throw new Error(
            'Backend Error'
        );

    }


    // Handle HTTP errors
    if (!response.ok) {

        console.error(
            'Backend response:',
            data
        );


        if (response.status === 400) {

            throw new Error(
                'API: Invalid request'
            );

        }


        if (response.status === 401) {

            throw new Error(
                'API: Unauthorized'
            );

        }


        if (response.status === 429) {

            throw new Error(
                'API: Rate limit exceeded'
            );

        }


        if (response.status >= 500) {

            throw new Error(
                'Backend Error'
            );

        }


        throw new Error(
            data.error ||
            `API Error: ${response.status}`
        );

    }


    // Make sure backend returned a reply
    if (
        !data ||
        typeof data.reply !== 'string' ||
        !data.reply.trim()
    ) {

        console.error(
            'Invalid AI response:',
            data
        );

        throw new Error(
            'API: Invalid response'
        );

    }


    return data.reply.trim();

}


// ============================================================
// ADD MESSAGE TO CHAT
// ============================================================

function addMessage(text, sender) {

    if (!messagesContainer) {
        return;
    }


    const messageDiv =
        document.createElement('div');


    messageDiv.className =
        `message ${sender}-message`;


    // ========================================================
    // AI AVATAR
    // ========================================================

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


    // ========================================================
    // MESSAGE CONTENT
    // ========================================================

    const contentDiv =
        document.createElement('div');


    contentDiv.className =
        'message-content';


    // Make sure text is always treated as text,
    // not executable HTML.
    //
    // This prevents injected HTML/JavaScript.
    //

    const paragraphs =
        String(text)
            .split(/\r?\n/)
            .filter(
                paragraph =>
                    paragraph.trim()
            );


    if (paragraphs.length === 0) {

        const p =
            document.createElement('p');

        p.textContent = '';

        contentDiv.appendChild(p);

    }

    else {

        paragraphs.forEach(
            paragraph => {

                const p =
                    document.createElement('p');


                p.textContent =
                    paragraph;


                contentDiv.appendChild(p);

            }
        );

    }


    messageDiv.appendChild(
        contentDiv
    );


    // ========================================================
    // TIME
    // ========================================================

    const timeDiv =
        document.createElement('small');


    timeDiv.className =
        'message-time';


    timeDiv.textContent =
        formatTime(new Date());


    messageDiv.appendChild(
        timeDiv
    );


    // Add message to chat
    messagesContainer.appendChild(
        messageDiv
    );


    // Scroll to bottom
    scrollToBottom();

}


// ============================================================
// SCROLL CHAT TO BOTTOM
// ============================================================

function scrollToBottom() {

    if (!messagesContainer) {
        return;
    }


    setTimeout(() => {

        messagesContainer.scrollTop =
            messagesContainer.scrollHeight;

    }, 0);

}


// ============================================================
// TYPING INDICATOR
// ============================================================

function showTypingIndicator() {

    if (!typingIndicator) {
        return;
    }


    typingIndicator.style.display =
        'flex';


    scrollToBottom();

}


function hideTypingIndicator() {

    if (!typingIndicator) {
        return;
    }


    typingIndicator.style.display =
        'none';

}


// ============================================================
// CLEAR CHAT
// ============================================================

function clearChat() {

    const confirmed =
        confirm(
            '🗑️ Clear all messages? This action cannot be undone.'
        );


    if (!confirmed) {
        return;
    }


    if (messagesContainer) {

        messagesContainer.innerHTML = `

            <div class="message ai-message">

                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>

                <div class="message-content">

                    <p>
                        Hello, I'm your AI Assistant 👋
                    </p>

                    <p>
                        Ask me anything - I'm ready to help
                        with coding, learning, creative projects,
                        or general questions!
                    </p>

                </div>

                <small class="message-time">
                    Just now
                </small>

            </div>

        `;

    }


    // Reset conversation
    conversationHistory = [];


    // Reset input
    if (messageInput) {

        messageInput.value = '';

        messageInput.focus();

    }

}


// ============================================================
// CHANGE PERSONALITY
// ============================================================

function changePersonality(event) {

    const button =
        event.target.closest(
            '.personality-btn'
        );


    if (!button) {
        return;
    }


    // Remove active state
    personalityBtns.forEach(btn => {

        btn.classList.remove(
            'active'
        );

    });


    // Activate selected button
    button.classList.add(
        'active'
    );


    // Get personality
    const selectedPersonality =
        button.dataset.personality;


    if (
        selectedPersonality &&
        personalities[selectedPersonality]
    ) {

        currentPersonality =
            selectedPersonality;

    }


    // Start a fresh conversation
    conversationHistory = [];


    // Personality display names
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


    const selectedName =
        personalityNames[currentPersonality] ||
        'AI Assistant';


    // Tell user about personality change
    addMessage(
        `Switched to ${selectedName} mode!`,
        'ai'
    );

}


// ============================================================
// MOBILE MENU
// ============================================================

function toggleMenu() {

    if (!navMenu) {
        return;
    }


    const isVisible =
        navMenu.style.display === 'flex';


    navMenu.style.display =
        isVisible
            ? 'none'
            : 'flex';

}


// ============================================================
// SMOOTH SCROLLING
// ============================================================

document
    .querySelectorAll('a[href^="#"]')
    .forEach(anchor => {

        anchor.addEventListener(
            'click',
            function (event) {

                const href =
                    this.getAttribute('href');


                // Ignore empty anchor
                if (
                    !href ||
                    href === '#'
                ) {
                    return;
                }


                let target;


                try {

                    target =
                        document.querySelector(
                            href
                        );

                } catch (error) {

                    return;

                }


                if (!target) {
                    return;
                }


                event.preventDefault();


                target.scrollIntoView({

                    behavior: 'smooth',

                    block: 'start'

                });


                // Close mobile menu
                if (navMenu) {

                    navMenu.style.display =
                        'none';

                }

            }
        );

    });


// ============================================================
// KEYBOARD SHORTCUTS
// ============================================================

document.addEventListener(
    'keydown',
    event => {

        // Ctrl + K / Cmd + K
        // Focus chat input

        if (
            (event.ctrlKey ||
                event.metaKey) &&
            event.key.toLowerCase() === 'k'
        ) {

            event.preventDefault();


            if (messageInput) {

                messageInput.focus();

            }

        }


        // Ctrl + L / Cmd + L
        // Clear chat

        if (
            (event.ctrlKey ||
                event.metaKey) &&
            event.key.toLowerCase() === 'l'
        ) {

            event.preventDefault();


            clearChat();

        }

    }
);


// ============================================================
// INITIALIZATION
// ============================================================

function initializeChat() {

    // Focus input
    if (messageInput) {

        messageInput.focus();

    }


    // Make sure typing indicator starts hidden
    if (typingIndicator) {

        typingIndicator.style.display =
            'none';

    }


    // Make sure General personality is active
    personalityBtns.forEach(btn => {

        const personality =
            btn.dataset.personality;


        if (
            personality ===
            currentPersonality
        ) {

            btn.classList.add(
                'active'
            );

        }

    });

}


// Run initialization
if (
    document.readyState ===
    'loading'
) {

    document.addEventListener(
        'DOMContentLoaded',
        initializeChat
    );

} else {

    initializeChat();

}


// ============================================================
// PAGE VISIBILITY
// ============================================================

document.addEventListener(
    'visibilitychange',
    () => {

        if (!document.hidden) {

            document.title =
                'AI Chatbot | TechQuest';

        }

    }
);


// ============================================================
// PREVENT ACCIDENTAL PAGE UNLOAD
// ============================================================

window.addEventListener(
    'beforeunload',
    event => {

        if (
            conversationHistory.length > 0
        ) {

            event.preventDefault();

            event.returnValue = '';

        }

    }
);


// ============================================================
// UTILITY: FORMAT TIME
// ============================================================

function formatTime(date) {

    return date.toLocaleTimeString(
        [],
        {
            hour: '2-digit',
            minute: '2-digit'
        }
    );

}


// ============================================================
// UTILITY: ESCAPE HTML
// ============================================================

function escapeHtml(text) {

    const div =
        document.createElement('div');


    div.textContent =
        String(text);


    return div.innerHTML;

}


// ============================================================
// END OF SCRIPT
// ============================================================