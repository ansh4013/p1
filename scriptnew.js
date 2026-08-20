/* =========================================================
   NEXORA AI — JAVASCRIPT ENGINE
========================================================= */


/* =========================================================
   PARTICLE SYSTEM
========================================================= */

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let particles = [];
let animationFrame;


/* Canvas size */

function resizeCanvas() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);


/* Create particles */

function createParticles() {

    particles = [];

    const amount =
        window.innerWidth < 700 ? 45 : 90;

    for (let i = 0; i < amount; i++) {

        particles.push({

            x: Math.random() * canvas.width,

            y: Math.random() * canvas.height,

            size: Math.random() * 1.5 + 0.3,

            speed: Math.random() * 0.35 + 0.05,

            opacity: Math.random() * 0.7 + 0.1,

            drift: (Math.random() - 0.5) * 0.15

        });

    }

}

createParticles();


/* Animate particles */

function animateParticles() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    particles.forEach(p => {

        p.y -= p.speed;
        p.x += p.drift;


        /* Screen wrapping */

        if (p.y < -5) {

            p.y = canvas.height + 5;

            p.x = Math.random() * canvas.width;

        }


        if (p.x < -5) {

            p.x = canvas.width + 5;

        }


        if (p.x > canvas.width + 5) {

            p.x = -5;

        }


        /* Draw particle */

        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            p.size,
            0,
            Math.PI * 2
        );


        ctx.fillStyle =
            `rgba(0,234,255,${p.opacity})`;

        ctx.fill();

    });


    animationFrame =
        requestAnimationFrame(
            animateParticles
        );

}

animateParticles();



/* =========================================================
   SMOOTH NAVIGATION
========================================================= */

function scrollToAI() {

    const section =
        document.getElementById("ai");

    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }

}


function scrollToTechnology() {

    const section =
        document.getElementById("technology");

    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }

}



/* =========================================================
   AI CHAT SYSTEM
========================================================= */

const input =
    document.getElementById("userInput");

const chat =
    document.getElementById("chat");


/* Enter key */

if (input) {

    input.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                event.preventDefault();

                sendMessage();

            }

        }
    );

}



/* Add message */

function addMessage(
    text,
    type
) {

    const message =
        document.createElement("div");


    message.className =
        `message ${type}`;


    if (type === "bot") {

        message.innerHTML =
            `<strong>NEXORA</strong><br>${text}`;

    } else {

        message.textContent = text;

    }


    chat.appendChild(message);


    chat.scrollTop =
        chat.scrollHeight;


    return message;

}



/* Typing indicator */

function showTyping() {

    const typing =
        document.createElement("div");


    typing.className =
        "message bot";

    typing.id =
        "typing";


    typing.innerHTML = `
        <strong>NEXORA</strong><br>
        <span class="typing-dots">
            ● ● ●
        </span>
    `;


    chat.appendChild(typing);


    chat.scrollTop =
        chat.scrollHeight;

}



/* Remove typing indicator */

function hideTyping() {

    const typing =
        document.getElementById("typing");


    if (typing) {

        typing.remove();

    }

}



/* Generate local demo response */

function generateResponse(text) {

    const message =
        text.toLowerCase().trim();


    if (
        message === "hello" ||
        message === "hi" ||
        message.includes("hello") ||
        message.includes("hey")
    ) {

        return `
            Welcome to NEXORA. 👋
            <br><br>
            Intelligence core is online and ready.
        `;

    }


    if (
        message.includes("who are you") ||
        message.includes("what are you")
    ) {

        return `
            I am NEXORA — a futuristic AI command
            interface designed for intelligent digital
            experiences.
        `;

    }


    if (
        message.includes("ai") &&
        message.includes("what")
    ) {

        return `
            Artificial Intelligence enables software
            systems to perform tasks that normally require
            human intelligence, such as reasoning,
            language understanding and pattern recognition.
        `;

    }


    if (
        message.includes("website") ||
        message.includes("web")
    ) {

        return `
            I can help you design modern websites,
            dashboards, AI interfaces and futuristic
            digital products.
        `;

    }


    if (
        message.includes("code") ||
        message.includes("coding") ||
        message.includes("program")
    ) {

        return `
            Coding converts ideas into executable
            instructions. HTML structures a website,
            CSS designs it and JavaScript makes it
            interactive.
        `;

    }


    if (
        message.includes("future") ||
        message.includes("technology")
    ) {

        return `
            The future of technology will increasingly
            combine AI, automation, robotics, spatial
            interfaces and intelligent software systems.
            🚀
        `;

    }


    if (
        message.includes("nexora")
    ) {

        return `
            NEXORA is your futuristic intelligence
            command center.
            <br><br>
            SYSTEM STATUS: ONLINE
        `;

    }


    if (
        message.includes("help")
    ) {

        return `
            Available demo commands:
            <br><br>

            • Ask about AI
            <br>
            • Ask about websites
            <br>
            • Ask about coding
            <br>
            • Ask about technology
            <br>
            • Ask about NEXORA
        `;

    }


    return `
        Command received.
        <br><br>

        <span style="color:#00eaff">
        "${escapeHTML(text)}"
        </span>

        <br><br>

        This is currently the local NEXORA
        intelligence demo.
        <br><br>

        Connect your Node.js / Gemini backend
        to activate real AI responses.
    `;

}



/* Send message */

function sendMessage() {

    if (!input || !chat) {

        console.error(
            "NEXORA: Chat elements not found."
        );

        return;

    }


    const text =
        input.value.trim();


    if (!text) {

        return;

    }


    /* User message */

    addMessage(
        text,
        "user"
    );


    /* Clear input */

    input.value = "";


    /* Disable button temporarily */

    const button =
        document.querySelector(
            ".chat-input button"
        );


    if (button) {

        button.disabled = true;

        button.style.opacity = "0.5";

    }


    /* Show AI thinking */

    showTyping();


    /* Simulate processing */

    setTimeout(() => {

        hideTyping();


        const response =
            generateResponse(text);


        addMessage(
            response,
            "bot"
        );


        if (button) {

            button.disabled = false;

            button.style.opacity = "1";

        }


        input.focus();

    }, 800);

}



/* =========================================================
   SECURITY HELPER
========================================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;

}



/* =========================================================
   MOUSE PARALLAX
========================================================= */

const hud =
    document.querySelector(".hud");


let mouseX = 0;
let mouseY = 0;

let currentX = 0;
let currentY = 0;


document.addEventListener(
    "mousemove",
    function(event) {

        mouseX =
            (event.clientX /
                window.innerWidth - 0.5);

        mouseY =
            (event.clientY /
                window.innerHeight - 0.5);

    }
);


function animateHUD() {

    if (hud) {

        currentX +=
            (mouseX * 18 - currentX) * 0.05;

        currentY +=
            (mouseY * 18 - currentY) * 0.05;


        hud.style.transform =
            `translate(
                ${currentX}px,
                ${currentY}px
            )`;

    }


    requestAnimationFrame(
        animateHUD
    );

}

animateHUD();



/* =========================================================
   FEATURE CARD EFFECT
========================================================= */

const features =
    document.querySelectorAll(
        ".feature"
    );


features.forEach(feature => {

    feature.addEventListener(
        "mousemove",
        function(event) {

            const rect =
                feature.getBoundingClientRect();


            const x =
                event.clientX - rect.left;

            const y =
                event.clientY - rect.top;


            const rotateX =
                ((y / rect.height) - 0.5) * -5;

            const rotateY =
                ((x / rect.width) - 0.5) * 5;


            feature.style.transform =
                `perspective(800px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)
                 translateY(-5px)`;

        }
    );


    feature.addEventListener(
        "mouseleave",
        function() {

            feature.style.transform =
                "";

        }
    );

});



/* =========================================================
   SYSTEM TELEMETRY ANIMATION
========================================================= */

const bars =
    document.querySelectorAll(
        ".bar span"
    );


bars.forEach(bar => {

    const finalWidth =
        bar.style.width;


    bar.style.width =
        "0";


    setTimeout(() => {

        bar.style.width =
            finalWidth;

        bar.style.transition =
            "width 1.8s cubic-bezier(.2,.8,.2,1)";

    }, 500);

});



/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements =
    document.querySelectorAll(
        ".feature, .panel, .ai-terminal"
    );


const revealObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (
                    entry.isIntersecting
                ) {

                    entry.target.classList.add(
                        "revealed"
                    );

                }

            });

        },
        {
            threshold:0.12
        }
    );


revealElements.forEach(element => {

    revealObserver.observe(
        element
    );

});



/* =========================================================
   SYSTEM CLOCK
========================================================= */

function updateSystemTime() {

    const now =
        new Date();


    const time =
        now.toLocaleTimeString(
            [],
            {
                hour:"2-digit",
                minute:"2-digit",
                second:"2-digit"
            }
        );


    const existing =
        document.querySelector(
            ".system-time"
        );


    if (existing) {

        existing.textContent =
            time;

    }

}


setInterval(
    updateSystemTime,
    1000
);



/* =========================================================
   CONSOLE BOOT SEQUENCE
========================================================= */

const consoleLines =
    document.querySelectorAll(
        ".console-line"
    );


consoleLines.forEach(
    (line,index) => {

        line.style.opacity = "0";

        setTimeout(() => {

            line.style.transition =
                "opacity .4s ease";

            line.style.opacity = "1";

        }, 250 + index * 180);

    }
);



/* =========================================================
   PAGE LOAD
========================================================= */

window.addEventListener(
    "load",
    function() {

        console.log(
            "%c NEXORA AI ",
            "color:#00eaff;font-size:20px;font-weight:bold;"
        );

        console.log(
            "%c Intelligence system initialized.",
            "color:#00ff9d;"
        );

        console.log(
            "%c Status: ONLINE",
            "color:#8b5cf6;"
        );

    }
);