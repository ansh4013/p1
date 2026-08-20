/* =========================================================
   NEXORA
   SCRIPT.JS
========================================================= */


/* =========================================================
   LOADER
========================================================= */

window.addEventListener("load", () => {

    const loader =
        document.getElementById("loader");

    setTimeout(() => {

        loader.classList.add("hidden");

    }, 700);

});


/* =========================================================
   CURSOR GLOW
========================================================= */

const cursorGlow =
    document.getElementById("cursorGlow");


if (cursorGlow) {

    let mouseX = 0;
    let mouseY = 0;

    let currentX = 0;
    let currentY = 0;


    document.addEventListener(
        "mousemove",
        event => {

            mouseX = event.clientX;
            mouseY = event.clientY;

        }
    );


    function animateCursor() {

        currentX +=
            (mouseX - currentX) * .08;

        currentY +=
            (mouseY - currentY) * .08;


        cursorGlow.style.left =
            `${currentX}px`;

        cursorGlow.style.top =
            `${currentY}px`;


        requestAnimationFrame(
            animateCursor
        );
    }


    animateCursor();

}


/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements =
    document.querySelectorAll(".reveal");


const revealObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (
                    entry.isIntersecting
                ) {

                    entry.target
                        .classList
                        .add("active");

                    revealObserver
                        .unobserve(
                            entry.target
                        );

                }

            });

        },
        {
            threshold: .12
        }
    );


revealElements.forEach(
    element => {

        revealObserver.observe(
            element
        );

    }
);


/* =========================================================
   MAGNETIC BUTTONS
========================================================= */

const magneticElements =
    document.querySelectorAll(
        ".magnetic"
    );


magneticElements.forEach(
    element => {

        element.addEventListener(
            "mousemove",
            event => {

                const rect =
                    element.getBoundingClientRect();

                const x =
                    event.clientX -
                    rect.left -
                    rect.width / 2;

                const y =
                    event.clientY -
                    rect.top -
                    rect.height / 2;


                element.style.transform =
                    `translate(${x * .12}px, ${y * .12}px)`;
            }
        );


        element.addEventListener(
            "mouseleave",
            () => {

                element.style.transform =
                    "";

            }
        );

    }
);


/* =========================================================
   NEXORA CORE PARALLAX
========================================================= */

const heroVisual =
    document.querySelector(
        ".hero-visual"
    );


if (heroVisual) {

    document.addEventListener(
        "mousemove",
        event => {

            const x =
                (event.clientX /
                    window.innerWidth -
                    .5);

            const y =
                (event.clientY /
                    window.innerHeight -
                    .5);


            heroVisual.style.transform =
                `translateY(-50%)
                 translate(${x * 12}px, ${y * 12}px)`;
        }
    );

}


/* =========================================================
   FEATURE CARD TILT
========================================================= */

const cards =
    document.querySelectorAll(
        ".feature-card"
    );


cards.forEach(card => {

    card.addEventListener(
        "mousemove",
        event => {

            if (
                window.innerWidth < 850
            ) return;


            const rect =
                card.getBoundingClientRect();


            const x =
                event.clientX -
                rect.left;

            const y =
                event.clientY -
                rect.top;


            const rotateX =
                ((y / rect.height) -
                    .5) * -4;

            const rotateY =
                ((x / rect.width) -
                    .5) * 4;


            card.style.transform =
                `perspective(900px)
                 translateY(-8px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)`;
        }
    );


    card.addEventListener(
        "mouseleave",
        () => {

            card.style.transform =
                "";

        }
    );

});


/* =========================================================
   PARTICLES
========================================================= */

function createParticles() {

    const hero =
        document.querySelector(
            ".hero"
        );


    if (!hero) return;


    const amount =
        window.innerWidth < 600
            ? 12
            : 25;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const particle =
            document.createElement(
                "span"
            );


        particle.className =
            "particle";


        particle.style.left =
            `${Math.random() * 100}%`;


        particle.style.top =
            `${Math.random() * 100}%`;


        particle.style.setProperty(
            "--x",
            `${(Math.random() - .5) * 180}px`
        );


        particle.style.setProperty(
            "--y",
            `${(Math.random() - .5) * 180}px`
        );


        particle.style.setProperty(
            "--duration",
            `${5 + Math.random() * 8}s`
        );


        particle.style.animationDelay =
            `${Math.random() * 5}s`;


        hero.appendChild(
            particle
        );

    }

}


createParticles();


/* =========================================================
   AI INTERFACE
========================================================= */

const aiForm =
    document.getElementById(
        "aiForm"
    );

const aiInput =
    document.getElementById(
        "aiInput"
    );


if (aiForm && aiInput) {

    aiForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const question =
                aiInput.value.trim();


            if (!question) return;


            /*
             * FRONTEND DEMO
             *
             * This does NOT call an AI API.
             *
             * Later you can connect this
             * form to your Gemini/OpenAI
             * backend endpoint.
             */


            const original =
                aiInput.placeholder;


            aiInput.value = "";


            aiInput.placeholder =
                "NEXORA CORE RECEIVED INPUT...";


            aiInput.disabled =
                true;


            setTimeout(() => {

                aiInput.placeholder =
                    "AI CONNECTION READY — CONNECT YOUR BACKEND";

                aiInput.disabled =
                    false;

                aiInput.focus();

            }, 1400);

        }
    );

}


/* =========================================================
   SMOOTH ANCHOR NAVIGATION
========================================================= */

document.querySelectorAll(
    'a[href^="#"]'
).forEach(link => {

    link.addEventListener(
        "click",
        event => {

            const targetId =
                link.getAttribute(
                    "href"
                );


            if (
                targetId === "#"
            ) return;


            const target =
                document.querySelector(
                    targetId
                );


            if (!target) return;


            event.preventDefault();


            target.scrollIntoView({
                behavior:
                    "smooth",
                block:
                    "start"
            });

        }
    );

});


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

const sections =
    document.querySelectorAll(
        "section[id]"
    );

const navLinks =
    document.querySelectorAll(
        ".nav-links a"
    );


const sectionObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(
                entry => {

                    if (
                        !entry.isIntersecting
                    ) return;


                    const id =
                        entry.target.id;


                    navLinks.forEach(
                        link => {

                            link.classList
                                .remove(
                                    "active"
                                );


                            if (
                                link.getAttribute(
                                    "href"
                                ) === `#${id}`
                            ) {

                                link.classList
                                    .add(
                                        "active"
                                    );

                            }

                        }
                    );

                }
            );

        },
        {
            threshold: .35
        }
    );


sections.forEach(
    section => {

        sectionObserver.observe(
            section
        );

    }
);


/* =========================================================
   TERMINAL BLINK
========================================================= */

const terminalStatus =
    document.querySelector(
        ".terminal-status"
    );


if (terminalStatus) {

    setInterval(
        () => {

            terminalStatus.style.opacity =
                terminalStatus.style.opacity === "0.35"
                    ? "1"
                    : ".35";

        },
        900
    );

}


/* =========================================================
   RANDOM CORE DATA
========================================================= */

const coreLabels =
    document.querySelectorAll(
        ".visual-label strong"
    );


const coreValues = [

    "99.98%",

    "∞ DATA",

    "CONNECTED"

];


coreLabels.forEach(
    (label, index) => {

        label.textContent =
            coreValues[index];

    }
);


/* =========================================================
   CONSOLE BRANDING
========================================================= */

console.log(
    "%c NEXORA ",
    `
    color:#06152f;
    background:#67f7ff;
    padding:8px 16px;
    font-size:16px;
    font-weight:bold;
    border-radius:5px;
    `
);

console.log(
    "%c Digital Intelligence System Online ",
    `
    color:#67f7ff;
    background:#061731;
    padding:5px 10px;
    `
);


/* =========================================================
   RESIZE CLEANUP
========================================================= */

window.addEventListener(
    "resize",
    () => {

        if (
            window.innerWidth < 850 &&
            heroVisual
        ) {

            heroVisual.style.transform =
                "none";

        }

    }
);