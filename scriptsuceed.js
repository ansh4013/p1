
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
        "Be engaging, accurate, and conversational. " +
        "Organise detailed answers using headings, lists, " +
        "bold text and tables whenever appropriate.",

    coding:
        "You are an expert programming assistant. " +
        "Help with code, debugging, programming concepts, " +
        "and best practices. Provide code examples when useful. " +
        "Explain concepts clearly. " +
        "Use properly formatted Markdown code blocks with " +
        "programming language identifiers.",

    tutor:
        "You are a patient tutor. " +
        "Explain concepts step by step. " +
        "Break complex topics into simple parts. " +
        "Help the student learn rather than simply giving answers. " +
        "Ask clarifying questions when necessary. " +
        "Use headings, numbered steps, examples and tables " +
        "to organise educational explanations.",

    creative:
        "You are a creative writing assistant. " +
        "Help with stories, poems, scripts, ideas, captions, " +
        "and creative projects. Be imaginative and engaging. " +
        "Use clear formatting whenever appropriate."
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
// MARKDOWN FORMATTING — NEW
// ============================================================

function formatAIResponse(text) {

    const safeText = String(text || "");

    // Fallback if Markdown libraries are unavailable

    if (
        !window.marked ||
        !window.DOMPurify
    ) {

        return escapeHtml(safeText).replace(
            /\n/g,
            "<br>"
        );

    }

    // Convert Markdown into HTML

    const html = window.marked.parse(
        safeText,
        {
            gfm: true,
            breaks: true
        }
    );

    // Sanitize HTML before displaying it

    return window.DOMPurify.sanitize(html);

}
// ==========================================
// NEXORA — MATHEMATICAL FORMULA RENDERER
// ==========================================

async function renderNexoraMath(element) {

    if (!element || !window.MathJax) return;

    try {

        await window.MathJax.startup.promise;

        window.MathJax.typesetClear([element]);

        await window.MathJax.typesetPromise([element]);

    } catch (error) {

        console.error(
            "NEXORA Math Rendering Error:",
            error
        );

    }
}


// ============================================================
// MAIN SEND FUNCTION — STREAMING
// ============================================================

async function handleSendMessage(event) {

    event.preventDefault();

    if (!messageInput || !messagesContainer) {
        return;
    }

    const message =
        messageInput.value.trim();

    if (!message || isLoading) {
        return;
    }

    console.log(
        "NEXORA: Sending message:",
        message
    );

    // Display user message

    addMessage(message, "user");

    messageInput.value = "";

    messageInput.focus();

    // Loading state

    isLoading = true;

    showTypingIndicator();

    // Create empty AI message

    addMessage("", "ai");

    const aiMessages =
        messagesContainer.querySelectorAll(
            ".ai-message"
        );

    const aiMessage =
        aiMessages[aiMessages.length - 1];

    const aiContent =
        aiMessage.querySelector(
            ".message-content"
        );

    try {

        const aiResponse =
            await getAIResponse(
                message,
                (partialResponse) => {

                    hideTypingIndicator();

                    // Display formatted incoming tokens

                    aiContent.innerHTML =
                        formatAIResponse(partialResponse);

                    scrollMessages();

                }
            );

        // Save conversation

        conversationHistory.push(
            {
                role: "user",
                text: message
            },
            {
                role: "ai",
                text: aiResponse
            }
        );

        // Final formatted response

        aiContent.innerHTML =
            formatAIResponse(aiResponse);
      // Render mathematical formulas
renderNexoraMath(aiContent);
        scrollMessages();

    }

    catch (error) {

        hideTypingIndicator();

        console.error(
            "NEXORA Chat Error:",
            error
        );

        aiContent.textContent =
            error.message ||
            "Sorry, I couldn't process your request.";

    }

    finally {

        hideTypingIndicator();

        isLoading = false;

        messageInput.focus();

    }

}


// ============================================================
// OPENROUTER STREAMING AI FUNCTION
// ============================================================

async function getAIResponse(userMessage, onToken) {

    let historyText = "";

    conversationHistory.forEach(message => {

        historyText +=
            `${message.role}: ${message.text}\n`;

    });

    const prompt = `
${personalities[currentPersonality]}

Conversation History:
${historyText}

User:
${userMessage}

Please answer naturally, accurately and helpfully.

IMPORTANT FORMATTING INSTRUCTIONS:
- Use Markdown for organised responses.
- Use clear headings and subheadings when appropriate.
- Use numbered lists for steps and procedures.
- Use bullet points for key information.
- Use bold text for important terms.
- Use Markdown tables for comparisons when useful.
- Use fenced code blocks with language identifiers for code.
- Keep paragraphs clear and readable.
- Avoid unnecessary formatting for simple questions.
`;

    const response = await fetch(API_URL, {

        method: "POST",

        headers: {
            "Content-Type": "application/json",
            "Accept": "text/event-stream"
        },

        body: JSON.stringify({
            message: prompt
        })

    });

    if (!response.ok) {

        let errorData = {};

        try {
            errorData = await response.json();
        }

        catch (parseError) {
            // Use HTTP status as fallback.
        }

        throw new Error(
            errorData.error ||
            `NEXORA server error: ${response.status}`
        );

    }

    if (!response.body) {

        throw new Error(
            "NEXORA: Streaming is unavailable."
        );

    }

    const reader =
        response.body.getReader();

    const decoder =
        new TextDecoder();

    let buffer = "";

    let fullReply = "";

    let streamFinished = false;

    try {

        while (!streamFinished) {

            const {
                done,
                value
            } = await reader.read();

            if (done) break;

            buffer += decoder.decode(
                value,
                {
                    stream: true
                }
            );

            // SSE events are separated by blank lines

            const events =
                buffer.split(/\r?\n\r?\n/);

            buffer =
                events.pop() || "";

            for (const event of events) {

                const lines =
                    event.split(/\r?\n/);

                for (const line of lines) {

                    if (!line.startsWith("data:")) {
                        continue;
                    }

                    const data =
                        line.slice(5).trim();

                    if (data === "[DONE]") {

                        streamFinished = true;

                        break;

                    }

                    let chunk;

                    try {

                        chunk = JSON.parse(data);

                    }

                    catch (parseError) {

                        continue;

                    }

                    if (chunk.error) {

                        throw new Error(
                            chunk.error.message ||
                            "NEXORA: AI streaming failed."
                        );

                    }

                    const token =
                        chunk.choices?.[0]?.delta?.content;

                    if (
                        typeof token === "string" &&
                        token.length > 0
                    ) {

                        fullReply += token;

                        if (typeof onToken === "function") {

                            onToken(fullReply);

                        }

                    }

                }

                if (streamFinished) break;

            }

        }

        // Flush remaining decoder data

        buffer += decoder.decode();

    }

    finally {

        reader.releaseLock();

    }

    if (!fullReply.trim()) {

        throw new Error(
            "NEXORA: Empty AI response."
        );

    }

    return fullReply.trim();

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

    const safeText =
        String(text || "");

    const paragraphs =
        safeText
            .split("\n")
            .filter(
                paragraph =>
                    paragraph.trim()
            );

    paragraphs.forEach(paragraph => {

        const p =
            document.createElement("p");

        p.textContent =
            paragraph;

        contentDiv.appendChild(p);

    });

    // Time

    const timeDiv =
        document.createElement("small");

    timeDiv.className =
        "message-time";

    timeDiv.textContent =
        formatTime(new Date());

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

    personalityBtns.forEach(button => {

        button.classList.remove(
            "active"
        );

    });

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
        personalityNames[currentPersonality] ||
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
    .forEach(anchor => {

        anchor.addEventListener(
            "click",
            function(event) {

                const href =
                    this.getAttribute("href");

                if (
                    !href ||
                    href === "#"
                ) {
                    return;
                }

                event.preventDefault();

                const target =
                    document.querySelector(href);

                if (target) {

                    target.scrollIntoView({

                        behavior: "smooth",

                        block: "start"

                    });

                }

            }
        );

    });


// ============================================================
// KEYBOARD SHORTCUTS
// ============================================================

document.addEventListener(
    "keydown",
    event => {

        // CTRL + K / CMD + K

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

            hour: "2-digit",

            minute: "2-digit"

        }
    );

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHtml(text) {

    const div =
        document.createElement("div");

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
