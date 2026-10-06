// ============================================================
// NEXORA AI CHAT — scriptfun.js
// ============================================================


// ============================================================
// CONFIGURATION
// ============================================================

const API_URL =
    "https://p1-two-orcin.vercel.app/api/gemini";


// ============================================================
// PERSONALITIES
// ============================================================

const personalities = {

    general:
        "You are a helpful, friendly AI assistant. " +
        "Answer questions clearly and concisely. " +
        "Be engaging, accurate, and conversational.",

    coding:
        "You are an expert programming assistant. " +
        "Help with code, debugging, programming concepts, " +
        "and best practices. Provide code examples when useful. " +
        "Explain concepts clearly.",

    tutor:
        "You are a patient tutor. " +
        "Explain concepts step by step. " +
        "Break complex topics into simple parts. " +
        "Help the student learn rather than simply giving answers. " +
        "Ask clarifying questions when necessary.",

    creative:
        "You are a creative writing assistant. " +
        "Help with stories, poems, scripts, ideas, captions, " +
        "and creative projects. Be imaginative and engaging."
};


// ============================================================
// STATE
// ============================================================

let currentPersonality = "general";

let conversationHistory = [];

let isLoading = false;


// ============================================================
// DOM ELEMENTS
// ============================================================

const messageForm =
    document.getElementById("messageForm");

const messageInput =
    document.getElementById("messageInput");

const messagesContainer =
    document.getElementById("messagesContainer");

const typingIndicator =
    document.getElementById("typingIndicator");

const clearBtn =
    document.querySelector(".clear-btn");

const personalityBtns =
    document.querySelectorAll(".personality-btn");

const hamburger =
    document.querySelector(".hamburger");

const navMenu =
    document.querySelector(".nav-menu");


// ============================================================
// EVENT LISTENERS
// ============================================================

if (messageForm) {
    messageForm.addEventListener(
        "submit",
        handleSendMessage
    );
}

if (clearBtn) {
    clearBtn.addEventListener(
        "click",
        clearChat
    );
}

personalityBtns.forEach(btn => {

    btn.addEventListener(
        "click",
        changePersonality
    );

});


if (hamburger) {

    hamburger.addEventListener(
        "click",
        toggleMenu
    );

}


// Navigation links

document
    .querySelectorAll(".nav-link")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                if (navMenu) {
                    navMenu.style.display = "none";
                }

            }
        );

    });


// ============================================================
// MAIN SEND FUNCTION
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


    // Prevent multiple requests

    if (isLoading) {
        return;
    }


    console.log(
        "NEXORA: Sending message:",
        message
    );


    // Display user's message

    addMessage(
        message,
        "user"
    );


    // Clear input

    messageInput.value = "";

    messageInput.focus();


    // Loading state

    isLoading = true;

    showTypingIndicator();


    try {

        const aiResponse =
            await getAIResponse(message);


        hideTypingIndicator();


        // Display AI response

        addMessage(
            aiResponse,
            "ai"
        );


        // Save conversation

        conversationHistory.push({

            role: "user",

            text: message

        });


        conversationHistory.push({

            role: "ai",

            text: aiResponse

        });


    }

    catch (error) {

        hideTypingIndicator();


        console.error(
            "NEXORA Chat Error:",
            error
        );


        let errorMessage =
            "Sorry, I couldn't process your request.";


        if (error && error.message) {

            errorMessage =
                error.message;

        }


        addMessage(
            errorMessage,
            "ai"
        );

    }

    finally {

        isLoading = false;

        messageInput.focus();

    }

}


// ============================================================
// AI API FUNCTION
// ============================================================

async function getAIResponse(userMessage) {

    try {

        // Build conversation history

        let historyText = "";


        conversationHistory.forEach(
            message => {

                historyText +=
                    `${message.role}: ${message.text}\n`;

            }
        );


        // Build prompt

        const prompt = `

${personalities[currentPersonality]}

Conversation History:
${historyText}

User:
${userMessage}

Please answer the user's message naturally and helpfully.
`;


        console.log(
            "NEXORA: API URL:",
            API_URL
        );


        console.log(
            "NEXORA: Sending API request..."
        );


        // Send request

        const response =
            await fetch(
                API_URL,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json"

                    },

                    body: JSON.stringify({

                        message: prompt

                    })

                }
            );


        console.log(
            "NEXORA: HTTP status:",
            response.status
        );


        // Get response content type

        const contentType =
            response.headers.get(
                "content-type"
            ) || "";


        let data;


        // JSON response

        if (
            contentType
                .toLowerCase()
                .includes("application/json")
        ) {

            data =
                await response.json();

        }

        // Non-JSON response

        else {

            const text =
                await response.text();


            console.error(
                "NEXORA: Server returned non-JSON response:",
                text
            );


            if (response.status === 404) {

                throw new Error(
                    "API endpoint not found (404). Check your Vercel /api/gemini deployment."
                );

            }


            if (response.status === 405) {

                throw new Error(
                    "API does not allow POST requests (405)."
                );

            }


            if (response.status >= 500) {

                throw new Error(
                    "Vercel server error (" +
                    response.status +
                    "). Check your backend and Gemini API configuration."
                );

            }


            throw new Error(
                "Server returned an invalid response (" +
                response.status +
                ")."
            );

        }


        console.log(
            "NEXORA: API response:",
            data
        );


        // HTTP error

        if (!response.ok) {

            const serverError =
                data &&
                (
                    data.error ||
                    data.message
                );


            throw new Error(

                serverError ||

                `Server returned HTTP ${response.status}.`

            );

        }


        // Check reply

        if (
            !data ||
            typeof data.reply !== "string" ||
            !data.reply.trim()
        ) {

            console.error(
                "NEXORA: Invalid API response:",
                data
            );


            throw new Error(
                "The AI server did not return a valid reply."
            );

        }


        return data.reply.trim();

    }

    catch (error) {

        console.error(
            "NEXORA: Gemini request failed:",
            error
        );


        // Actual browser/network failure

        if (
            error instanceof TypeError
        ) {

            throw new Error(
                "Unable to connect to the NEXORA AI server. Check the Vercel API deployment or CORS configuration."
            );

        }


        // Preserve useful error

        throw error;

    }

}


// ============================================================
// ADD MESSAGE
// ============================================================

function addMessage(
    text,
    sender
) {

    if (!messagesContainer) {
        return;
    }


    const messageDiv =
        document.createElement("div");


    messageDiv.className =
        `message ${sender}-message`;


    // AI avatar

    if (sender === "ai") {

        const avatarDiv =
            document.createElement("div");


        avatarDiv.className =
            "message-avatar";


        avatarDiv.innerHTML =
            '<i class="fas fa-robot"></i>';


        messageDiv.appendChild(
            avatarDiv
        );

    }


    // Message content

    const contentDiv =
        document.createElement("div");


    contentDiv.className =
        "message-content";


    // Convert text to string

    const safeText =
        String(text || "");


    // Split lines

    const paragraphs =
        safeText
            .split("\n")
            .filter(
                paragraph =>
                    paragraph.trim()
            );


    paragraphs.forEach(
        paragraph => {

            const p =
                document.createElement("p");


            p.textContent =
                paragraph;


            contentDiv.appendChild(
                p
            );

        }
    );


    // Time

    const timeDiv =
        document.createElement("small");


    timeDiv.className =
        "message-time";


    timeDiv.textContent =
        formatTime(
            new Date()
        );


    // Add elements

    messageDiv.appendChild(
        contentDiv
    );


    messageDiv.appendChild(
        timeDiv
    );


    messagesContainer.appendChild(
        messageDiv
    );


    // Scroll

    scrollMessages();

}


// ============================================================
// SCROLL CHAT
// ============================================================

function scrollMessages() {

    if (!messagesContainer) {
        return;
    }


    setTimeout(
        () => {

            messagesContainer.scrollTop =
                messagesContainer.scrollHeight;

        },
        50
    );

}


// ============================================================
// TYPING INDICATOR
// ============================================================

function showTypingIndicator() {

    if (!typingIndicator) {
        return;
    }


    typingIndicator.style.display =
        "flex";


    scrollMessages();

}


function hideTypingIndicator() {

    if (!typingIndicator) {
        return;
    }


    typingIndicator.style.display =
        "none";

}


// ============================================================
// CLEAR CHAT
// ============================================================

function clearChat() {

    const confirmed =
        confirm(
            "🗑️ Clear all messages?"
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
                        Ask me anything — coding, studies,
                        creativity, ideas, projects, and more.
                    </p>

                </div>

                <small class="message-time">
                    Just now
                </small>

            </div>

        `;

    }


    conversationHistory = [];


    if (messageInput) {

        messageInput.value = "";

        messageInput.focus();

    }

}


// ============================================================
// PERSONALITY SWITCHING
// ============================================================

function changePersonality(event) {

    const btn =
        event.target.closest(
            ".personality-btn"
        );


    if (!btn) {
        return;
    }


    // Remove active

    personalityBtns.forEach(
        button => {

            button.classList.remove(
                "active"
            );

        }
    );


    // Activate selected button

    btn.classList.add(
        "active"
    );


    // Get personality

    currentPersonality =
        btn.dataset.personality ||
        "general";


    // Reset history

    conversationHistory = [];


    const personalityNames = {

        general:
            "🧠 General Assistant",

        coding:
            "💻 Coding Expert",

        tutor:
            "📚 Tutor",

        creative:
            "🎨 Creative Writer"

    };


    const selectedName =
        personalityNames[
            currentPersonality
        ] ||
        "🧠 General Assistant";


    addMessage(
        `Switched to ${selectedName} mode!`,
        "ai"
    );


    if (messageInput) {
        messageInput.focus();
    }

}


// ============================================================
// MOBILE MENU
// ============================================================

function toggleMenu() {

    if (!navMenu) {
        return;
    }


    const isOpen =
        navMenu.style.display === "flex";


    if (isOpen) {

        navMenu.style.display =
            "none";

    }

    else {

        navMenu.style.display =
            "flex";

    }

}


// ============================================================
// SMOOTH SCROLLING
// ============================================================

document
    .querySelectorAll(
        'a[href^="#"]'
    )
    .forEach(
        anchor => {

            anchor.addEventListener(
                "click",
                function(event) {

                    const href =
                        this.getAttribute(
                            "href"
                        );


                    if (
                        !href ||
                        href === "#"
                    ) {
                        return;
                    }


                    event.preventDefault();


                    const target =
                        document.querySelector(
                            href
                        );


                    if (target) {

                        target.scrollIntoView({

                            behavior:
                                "smooth",

                            block:
                                "start"

                        });

                    }

                }
            );

        }
    );


// ============================================================
// KEYBOARD SHORTCUTS
// ============================================================

document.addEventListener(
    "keydown",
    event => {


        // CTRL + K / CMD + K
        // Focus chat input

        if (
            (
                event.ctrlKey ||
                event.metaKey
            ) &&
            event.key.toLowerCase() === "k"
        ) {

            event.preventDefault();


            if (messageInput) {
                messageInput.focus();
            }

        }


        // CTRL + L / CMD + L
        // Clear chat

        if (
            (
                event.ctrlKey ||
                event.metaKey
            ) &&
            event.key.toLowerCase() === "l"
        ) {

            event.preventDefault();

            clearChat();

        }

    }
);


// ============================================================
// ENTER KEY
// ============================================================

if (messageInput) {

    messageInput.addEventListener(
        "keydown",
        event => {

            // Enter sends message

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();


                if (messageForm) {

                    messageForm.requestSubmit();

                }

            }

        }
    );

}


// ============================================================
// INITIALIZATION
// ============================================================

function initializeNexora() {

    console.log(
        "🚀 NEXORA AI Ready"
    );


    console.log(
        "🔗 API:",
        API_URL
    );


    console.log(
        "🧠 Personality:",
        currentPersonality
    );


    if (messageInput) {

        setTimeout(
            () => {
                messageInput.focus();
            },
            300
        );

    }

}


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeNexora
    );

}

else {

    initializeNexora();

}


// ============================================================
// FORMAT TIME
// ============================================================

function formatTime(date) {

    return date.toLocaleTimeString(
        [],
        {

            hour:
                "2-digit",

            minute:
                "2-digit"

        }
    );

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHtml(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(text || "");


    return div.innerHTML;

}


// ============================================================
// PAGE VISIBILITY
// ============================================================

document.addEventListener(
    "visibilitychange",
    () => {

        if (!document.hidden) {

            document.title =
                "NEXORA AI CHAT";

        }

    }
);


// ============================================================
// BEFORE UNLOAD
// ============================================================

window.addEventListener(
    "beforeunload",
    event => {

        if (
            conversationHistory.length > 0 &&
            !isLoading
        ) {

            event.preventDefault();

            event.returnValue = "";

        }

    }
);