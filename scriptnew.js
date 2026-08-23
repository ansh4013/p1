/* =======================================================
   NEXORA // DIGITAL MOTION ENGINE
   PART 01 — CORE / LOADER / NAV / CURSOR
   ========================================================= */

"use strict";

/* ================= CORE ================= */

const NX = {
  mouse:{
    x:innerWidth / 2,
    y:innerHeight / 2,
    tx:innerWidth / 2,
    ty:innerHeight / 2
  },

  scroll:0,
  time:0,

  lerp:(a,b,n)=>a+(b-a)*n,

  clamp:(v,min,max)=>
    Math.max(min,Math.min(max,v))
};

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

/* ================= LOADER ================= */

window.addEventListener("load",()=>{

  setTimeout(()=>{
    document.body.classList.add("loaded");

    const loader=$("#loader");

    if(loader){
      loader.classList.add("hide");
    }

    NX.start();
  },1800);

});

/* ================= NAVIGATION ================= */

const nav=$(".nav");
const menu=$(".menu");

if(menu){

  menu.addEventListener("click",()=>{

    nav.classList.toggle("open");
    document.body.classList.toggle(
      "menu-open"
    );

  });

}

$$(".nav nav a").forEach(link=>{

  link.addEventListener("click",()=>{

    nav?.classList.remove("open");
    document.body.classList.remove(
      "menu-open"
    );

  });

});

/* ================= CURSOR ================= */

const cursor=$(".cursor");
const ring=$(".cursor-ring");

if(matchMedia("(pointer:fine)").matches){

  window.addEventListener("pointermove",e=>{

    NX.mouse.tx=e.clientX;
    NX.mouse.ty=e.clientY;

  });

  const cursorLoop=()=>{

    NX.mouse.x=NX.lerp(
      NX.mouse.x,
      NX.mouse.tx,
      .18
    );

    NX.mouse.y=NX.lerp(
      NX.mouse.y,
      NX.mouse.ty,
      .18
    );

    if(cursor){
      cursor.style.transform=
        `translate(${NX.mouse.x}px,${NX.mouse.y}px)
         translate(-50%,-50%)`;
    }

    if(ring){
      ring.style.transform=
        `translate(${NX.mouse.x}px,${NX.mouse.y}px)
         translate(-50%,-50%)`;
    }

    requestAnimationFrame(cursorLoop);
  };

  cursorLoop();

}

/* ================= CURSOR INTERACTION ================= */

$$("a,.btn,.card,.menu,.tech-list span")
.forEach(el=>{

  el.addEventListener("mouseenter",()=>{
    ring?.classList.add("active");
  });

  el.addEventListener("mouseleave",()=>{
    ring?.classList.remove("active");
  });

});

/* ================= SCROLL STATE ================= */

window.addEventListener("scroll",()=>{

  NX.scroll=window.scrollY;

},{
  passive:true
});

/* ================= CORE LOOP ================= */

NX.start=()=>{

  NX.running=true;

  const loop=()=>{

    NX.time+=.016;

    document.documentElement
      .style.setProperty(
        "--scroll",
        NX.scroll
      );

    if(NX.running)
      requestAnimationFrame(loop);

  };

  loop();

};

/* ================= RESIZE ================= */

window.addEventListener("resize",()=>{

  NX.width=innerWidth;
  NX.height=innerHeight;

});

/* ================= INITIAL STATE ================= */

NX.width=innerWidth;
NX.height=innerHeight;

console.log(
  "%c NEXORA // SYSTEM ONLINE ",
  "color:#54f6ff;background:#050816;padding:8px;font-weight:bold"
);
/* =========================================================
   NEXORA // MOTION ENGINE
   PART 02 — THREE.JS PROCEDURAL WORLD
   ========================================================= */

const canvas = document.getElementById("heroCanvas");

let scene, camera, renderer;
let core, particles, stars;
let lightA, lightB;

if(canvas && window.THREE){

  /* ================= SCENE ================= */

  scene = new THREE.Scene();

  scene.fog = new THREE.FogExp2(
    0x050816,
    0.035
  );

  /* ================= CAMERA ================= */

  camera = new THREE.PerspectiveCamera(
    55,
    innerWidth / innerHeight,
    0.1,
    100
  );

  camera.position.set(
    0,
    0,
    8
  );

  /* ================= RENDERER ================= */

  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias:true,
    alpha:true,
    powerPreference:"high-performance"
  });

  renderer.setPixelRatio(
    Math.min(devicePixelRatio,2)
  );

  renderer.setSize(
    innerWidth,
    innerHeight
  );

  renderer.outputEncoding =
    THREE.sRGBEncoding;

  /* ================= CORE ================= */

  const coreGeo =
    new THREE.IcosahedronGeometry(
      1.7,
      4
    );

  const coreMat =
    new THREE.MeshStandardMaterial({
      color:0x54f6ff,
      emissive:0x164f62,
      emissiveIntensity:1.7,
      metalness:.8,
      roughness:.18,
      wireframe:true
    });

  core = new THREE.Mesh(
    coreGeo,
    coreMat
  );

  scene.add(core);

  /* ================= INNER CORE ================= */

  const innerGeo =
    new THREE.IcosahedronGeometry(
      1.25,
      3
    );

  const innerMat =
    new THREE.MeshBasicMaterial({
      color:0x9b5cff,
      transparent:true,
      opacity:.08,
      wireframe:true
    });

  const inner =
    new THREE.Mesh(
      innerGeo,
      innerMat
    );

  scene.add(inner);

  /* ================= PARTICLES ================= */

  const count =
    innerWidth < 700 ? 500: 1400;

  const positions =
    new Float32Array(count*3);

  const sizes =
    new Float32Array(count);

  for(let i=0;i<count;i++){

    const i3=i*3;

    const radius=
      3+
      Math.random()*9;

    const theta=
      Math.random()*Math.PI*2;

    const phi=
      Math.acos(
        2*Math.random()-1
      );

    positions[i3]=
      radius*
      Math.sin(phi)*
      Math.cos(theta);

    positions[i3+1]=
      radius*
      Math.sin(phi)*
      Math.sin(theta);

    positions[i3+2]=
      radius*
      Math.cos(phi);

    sizes[i]=
      Math.random()*2+.3;
  }

  const particleGeo=
    new THREE.BufferGeometry();

  particleGeo.setAttribute(
    "position",
    new THREE.BufferAttribute(
      positions,
      3
    )
  );

  particleGeo.setAttribute(
    "size",
    new THREE.BufferAttribute(
      sizes,
      1
    )
  );

  const particleMat=
    new THREE.PointsMaterial({
      color:0x54f6ff,
      size:.025,
      transparent:true,
      opacity:.65,
      blending:
        THREE.AdditiveBlending,
      depthWrite:false
    });

  particles=
    new THREE.Points(
      particleGeo,
      particleMat
    );

  scene.add(particles);

  /* ================= STARFIELD ================= */

  const starGeo=
    new THREE.BufferGeometry();

  const starPos=
    new Float32Array(1600*3);

  for(let i=0;i<1600*3;i++){
    starPos[i]=
      (Math.random()-.5)*60;
  }

  starGeo.setAttribute(
    "position",
    new THREE.BufferAttribute(
      starPos,
      3
    )
  );

  const starMat=
    new THREE.PointsMaterial({
      color:0xffffff,
      size:.015,
      transparent:true,
      opacity:.5
    });

  stars=
    new THREE.Points(
      starGeo,
      starMat
    );

  scene.add(stars);

  /* ================= LIGHTING ================= */

  lightA=
    new THREE.PointLight(
      0x54f6ff,
      6,
      18
    );

  lightA.position.set(
    3,
    2,
    5
  );

  scene.add(lightA);

  lightB=
    new THREE.PointLight(
      0x9b5cff,
      5,
      15
    );

  lightB.position.set(
    -4,
    -2,
    2
  );

  scene.add(lightB);

  /* ================= ANIMATION ================= */

  const clock=
    new THREE.Clock();

  function render(){

    const t=
      clock.getElapsedTime();

    core.rotation.x=
      t*.12;

    core.rotation.y=
      t*.18;

    inner.rotation.x=
      -t*.08;

    inner.rotation.y=
      -t*.14;

    particles.rotation.y=
      t*.025;

    particles.rotation.x=
      Math.sin(t*.2)*.04;

    stars.rotation.y=
      t*.004;

    /* mouse camera */

    const mx=
      (NX.mouse.x/innerWidth-.5);

    const my=
      (NX.mouse.y/innerHeight-.5);

    camera.position.x=
      NX.lerp(
        camera.position.x,
        mx*1.3,
        .025
      );

    camera.position.y=
      NX.lerp(
        camera.position.y,
        -my*1.0,
        .025
      );

    camera.lookAt(0,0,0);

    /* dynamic lights */

    lightA.position.x=
      Math.sin(t*.7)*4;

    lightA.position.y=
      Math.cos(t*.5)*3;

    lightB.position.x=
      Math.cos(t*.4)*-5;

    lightB.position.y=
      Math.sin(t*.6)*3;

    renderer.render(
      scene,
      camera
    );

    requestAnimationFrame(render);
  }

  render();

  /* ================= RESIZE ================= */

  window.addEventListener(
    "resize",
    ()=>{
      camera.aspect=
        innerWidth/innerHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(
        innerWidth,
        innerHeight
      );
    }
  );
}
/* =========================================================
   NEXORA // MOTION ENGINE
   PART 03 — GSAP + SCROLLTRIGGER
   ========================================================= */

if(window.gsap){

  gsap.registerPlugin(
    window.ScrollTrigger
  );

  /* ================= HERO INTRO ================= */

  const heroTL=gsap.timeline({
    defaults:{
      ease:"power4.out"
    }
  });

  heroTL
    .from(".eyebrow",{
      y:30,
      opacity:0,
      duration:1
    })
    .from(".hero h1",{
      y:100,
      opacity:0,
      scale:.94,
      duration:1.4
    },"-=.65")
    .from(".hero-text",{
      y:30,
      opacity:0,
      duration:.9
    },"-=.8")
    .from(".actions",{
      y:25,
      opacity:0,
      duration:.8
    },"-=.6")
    .from(".hero-info",{
      x:30,
      opacity:0,
      duration:.7
    },"-=.5");

  /* ================= HERO PARALLAX ================= */

  gsap.to(".hero-content",{
    yPercent:-20,
    opacity:.25,

    scrollTrigger:{
      trigger:".hero",
      start:"top top",
      end:"bottom top",
      scrub:1
    }
  });

  gsap.to(".grid",{
    yPercent:35,

    scrollTrigger:{
      trigger:".hero",
      start:"top top",
      end:"bottom top",
      scrub:1.5
    }
  });

  if(core){

    gsap.to(core.rotation,{
      z:Math.PI*2,

      scrollTrigger:{
        trigger:".hero",
        start:"top top",
        end:"bottom top",
        scrub:2
      }
    });

  }

  /* ================= SECTION REVEALS ================= */

  gsap.utils.toArray(
    ".section"
  ).forEach(section=>{

    const items=
      section.querySelectorAll(
        ".label,.number,h2,.description,.cards,.tech-list"
      );

    gsap.from(items,{
      y:70,
      opacity:0,
      stagger:.1,
      duration:1.1,
      ease:"power4.out",

      scrollTrigger:{
        trigger:section,
        start:"top 78%",
        toggleActions:
          "play none none reverse"
      }
    });

  });

  /* ================= ABOUT DEPTH ================= */

  gsap.to(".about h2",{

    x:30,

    scrollTrigger:{
      trigger:".about",
      start:"top bottom",
      end:"bottom top",
      scrub:1.5
    }

  });

  /* ================= WORLD SCALE ================= */

  gsap.fromTo(
    ".world h2",

    {
      scale:.82,
      opacity:.2
    },

    {
      scale:1,
      opacity:1,

      scrollTrigger:{
        trigger:".world",
        start:"top 80%",
        end:"center center",
        scrub:1.2
      }
    }
  );

  /* ================= PROJECT CARDS ================= */

  gsap.utils.toArray(
    ".card"
  ).forEach((card,i)=>{

    gsap.from(card,{

      y:100,
      rotateX:18,
      opacity:0,

      duration:1.2,
      delay:i*.12,

      ease:"power4.out",

      scrollTrigger:{
        trigger:".projects",
        start:"top 75%",
        toggleActions:
          "play none none reverse"
      }

    });

  });

  /* ================= TECHNOLOGY ================= */

  gsap.from(
    ".tech h2",
    {
      x:-100,
      opacity:0,

      scrollTrigger:{
        trigger:".tech",
        start:"top 70%",
        end:"center center",
        scrub:1
      }
    }
  );

  gsap.from(
    ".tech-list span",
    {
      y:50,
      opacity:0,
      scale:.8,
      stagger:.08,

      scrollTrigger:{
        trigger:".tech-list",
        start:"top 85%",
        toggleActions:
          "play none none reverse"
      }
    }
  );

  /* ================= FINAL CTA ================= */

  gsap.from(
    ".final h2",
    {
      scale:.65,
      opacity:0,

      scrollTrigger:{
        trigger:".final",
        start:"top 75%",
        end:"center center",
        scrub:1
      }
    }
  );

  /* ================= REFRESH ================= */

  window.addEventListener(
    "load",
    ()=>{
      ScrollTrigger.refresh();
    }
  );

}
/* =========================================================
   NEXORA // MOTION ENGINE
   PART 04 — MAGNETIC UI + 3D PHYSICS
   ========================================================= */

/* ================= MAGNETIC ELEMENTS ================= */

if(matchMedia("(pointer:fine)").matches){

  document
    .querySelectorAll(".magnetic")
    .forEach(el=>{

      let bounds;

      el.addEventListener(
        "mouseenter",
        ()=>{
          bounds=
            el.getBoundingClientRect();
        }
      );

      el.addEventListener(
        "mousemove",
        e=>{

          bounds=
            bounds ||
            el.getBoundingClientRect();

          const x=
            e.clientX-
            bounds.left-
            bounds.width/2;

          const y=
            e.clientY-
            bounds.top-
            bounds.height/2;

          const strength=
            el.classList.contains("card")
            ? .08
            : .22;

          gsap.to(el,{
            x:x*strength,
            y:y*strength,
            duration:.45,
            ease:"power3.out",
            overwrite:true
          });

        }
      );

      el.addEventListener(
        "mouseleave",
        ()=>{

          gsap.to(el,{
            x:0,
            y:0,
            duration:.8,
            ease:"elastic.out(1,.4)"
          });

        }
      );

    });

}

/* ================= 3D CARD TILT ================= */

if(matchMedia("(pointer:fine)").matches){

  document
    .querySelectorAll(".card")
    .forEach(card=>{

      card.addEventListener(
        "mousemove",
        e=>{

          const rect=
            card.getBoundingClientRect();

          const px=
            (e.clientX-rect.left)/
            rect.width;

          const py=
            (e.clientY-rect.top)/
            rect.height;

          const rotateY=
            (px-.5)*14;

          const rotateX=
            (py-.5)*-14;

          gsap.to(card,{
            rotateX,
            rotateY,
            transformPerspective:900,
            duration:.5,
            ease:"power2.out",
            overwrite:true
          });

          /* Dynamic mouse light */

          card.style.setProperty(
            "--mx",
            `${px*100}%`
          );

          card.style.setProperty(
            "--my",
            `${py*100}%`
          );

        }
      );

      card.addEventListener(
        "mouseleave",
        ()=>{

          gsap.to(card,{
            rotateX:0,
            rotateY:0,
            duration:1,
            ease:"elastic.out(1,.5)"
          });

        }
      );

    });

}

/* ================= GLOBAL MOUSE LIGHT ================= */

const sections=
  document.querySelectorAll(
    ".section,.final,.hero"
  );

if(matchMedia("(pointer:fine)").matches){

  window.addEventListener(
    "pointermove",
    e=>{

      const x=
        `${(e.clientX/innerWidth)*100}%`;

      const y=
        `${(e.clientY/innerHeight)*100}%`;

      sections.forEach(section=>{

        section.style.setProperty(
          "--light-x",
          x
        );

        section.style.setProperty(
          "--light-y",
          y
        );

      });

    },
    {passive:true}
  );

}

/* ================= HOVER LIGHT ================= */

document
  .querySelectorAll(".hover-light")
  .forEach(el=>{

    el.addEventListener(
      "pointermove",
      e=>{

        const r=
          el.getBoundingClientRect();

        el.style.setProperty(
          "--mx",
          `${e.clientX-r.left}px`
        );

        el.style.setProperty(
          "--my",
          `${e.clientY-r.top}px`
        );

      },
      {passive:true}
    );

  });

/* ================= BUTTON PRESS ================= */

document
  .querySelectorAll(".btn")
  .forEach(btn=>{

    btn.addEventListener(
      "pointerdown",
      ()=>{
        gsap.to(btn,{
          scale:.94,
          duration:.15,
          ease:"power2.out"
        });
      }
    );

    btn.addEventListener(
      "pointerup",
      ()=>{
        gsap.to(btn,{
          scale:1,
          duration:.5,
          ease:"elastic.out(1,.5)"
        });
      }
    );

  });
/* =========================================================
   NEXORA // MOTION ENGINE
   PART 05 — PARTICLE INTELLIGENCE
   ========================================================= */

let particleField;

if(window.THREE){

  const container=
    document.getElementById("particles");

  if(container){

    const cvs=
      document.createElement("canvas");

    container.appendChild(cvs);

    const ctx=
      cvs.getContext("2d");

    let w,h,dpr;

    const nodes=[];

    const mobile=
      innerWidth<700;

    const total=
      mobile ? 70 : 150;

    function resize(){

      dpr=
        Math.min(devicePixelRatio,2);

      w=
        container.clientWidth;

      h=
        container.clientHeight;

      cvs.width=w*dpr;
      cvs.height=h*dpr;

      cvs.style.width=w+"px";
      cvs.style.height=h+"px";

      ctx.setTransform(
        dpr,0,0,dpr,0,0
      );

    }

    resize();

    window.addEventListener(
      "resize",
      resize
    );

    /* ================= NODE GENERATION ================= */

    for(let i=0;i<total;i++){

      nodes.push({

        x:Math.random()*w,
        y:Math.random()*h,

        vx:(Math.random()-.5)*.35,
        vy:(Math.random()-.5)*.35,

        r:Math.random()*1.8+.5,

        phase:Math.random()*
          Math.PI*2

      });

    }

    /* ================= POINTER ================= */

    let px=w/2;
    let py=h/2;

    container.addEventListener(
      "pointermove",
      e=>{

        const rect=
          container.getBoundingClientRect();

        px=e.clientX-rect.left;
        py=e.clientY-rect.top;

      },
      {passive:true}
    );

    /* ================= DRAW ================= */

    function draw(t){

      ctx.clearRect(
        0,0,w,h
      );

      nodes.forEach((p,i)=>{

        p.x+=p.vx;
        p.y+=p.vy;

        if(p.x<0||p.x>w)
          p.vx*=-1;

        if(p.y<0||p.y>h)
          p.vy*=-1;

        /* pointer force */

        const dx=px-p.x;
        const dy=py-p.y;

        const dist=
          Math.sqrt(dx*dx+dy*dy);

        if(dist<170){

          const force=
            (170-dist)/170;

          p.x-=
            dx/dist*
            force*.7;

          p.y-=
            dy/dist*
            force*.7;

        }

        const pulse=
          Math.sin(
            t*.002+
            p.phase
          )*.5+.5;

        ctx.beginPath();

        ctx.arc(
          p.x,
          p.y,
          p.r+pulse*.5,
          0,
          Math.PI*2
        );

        ctx.fillStyle=
          `rgba(84,246,255,${
            .25+pulse*.5
          })`;

        ctx.fill();

        /* connections */

        for(let j=i+1;j<nodes.length;j++){

          const q=nodes[j];

          const dx2=p.x-q.x;
          const dy2=p.y-q.y;

          const dist2=
            Math.sqrt(
              dx2*dx2+
              dy2*dy2
            );

          if(dist2<110){

            ctx.beginPath();

            ctx.moveTo(
              p.x,p.y
            );

            ctx.lineTo(
              q.x,q.y
            );

            ctx.strokeStyle=
              `rgba(84,246,255,${
                (1-dist2/110)*.16
              })`;

            ctx.lineWidth=.5;

            ctx.stroke();

          }

        }

      });

      requestAnimationFrame(draw);

    }

    requestAnimationFrame(draw);

    particleField={
      nodes,
      resize
    };

  }

}
/* =========================================================
   NEXORA // MOTION ENGINE
   PART 06 — KINETIC TYPOGRAPHY
   ========================================================= */

if(window.gsap){

  /* ================= SPLIT HEADINGS ================= */

  const headings=
    document.querySelectorAll(
      ".section h2,.final h2"
    );

  headings.forEach(title=>{

    const text=
      title.innerHTML;

    /* preserve HTML while wrapping words */

    const parts=
      text.split(/(\s+)/);

    title.innerHTML=
      parts.map(part=>{

        if(/^\s+$/.test(part))
          return part;

        return `<span class="word-wrap">
          <span class="word">${part}</span>
        </span>`;

      }).join("");

    const words=
      title.querySelectorAll(
        ".word"
      );

    gsap.from(words,{

      yPercent:110,
      rotateX:-35,
      opacity:0,

      transformOrigin:
        "50% 100% -30px",

      stagger:.045,

      duration:1.1,

      ease:"power4.out",

      scrollTrigger:{
        trigger:title,
        start:"top 82%",
        toggleActions:
          "play none none reverse"
      }

    });

  });

  /* ================= WORD WRAPPER ================= */

  document
    .querySelectorAll(".word-wrap")
    .forEach(el=>{

      el.style.display=
        "inline-block";

      el.style.overflow=
        "hidden";

      el.style.verticalAlign=
        "bottom";

    });

  /* ================= EYEBROW REVEALS ================= */

  gsap.utils.toArray(
    ".eyebrow,.label"
  ).forEach(el=>{

    gsap.from(el,{

      opacity:0,
      x:-25,
      letterSpacing:".5em",

      duration:1,

      scrollTrigger:{
        trigger:el,
        start:"top 88%",
        toggleActions:
          "play none none reverse"
      }

    });

  });

  /* ================= DESCRIPTION ================= */

  gsap.utils.toArray(
    ".description,.hero-text"
  ).forEach(el=>{

    gsap.from(el,{

      opacity:0,
      y:35,

      duration:1,

      ease:"power3.out",

      scrollTrigger:{
        trigger:el,
        start:"top 85%",
        toggleActions:
          "play none none reverse"
      }

    });

  });

  /* ================= TECH COUNTER ================= */

  const counterTargets=[
    {
      el:".tech-list span:nth-child(1)",
      value:"01 / AI"
    },
    {
      el:".tech-list span:nth-child(2)",
      value:"02 / 3D"
    },
    {
      el:".tech-list span:nth-child(3)",
      value:"03 / REALTIME"
    }
  ];

  counterTargets.forEach(item=>{

    const el=
      document.querySelector(item.el);

    if(!el) return;

    const original=
      el.textContent;

    el.textContent=
      "00 / SYSTEM";

    const state={
      n:0
    };

    gsap.to(state,{

      n:1,

      duration:1.5,

      ease:"power2.out",

      scrollTrigger:{
        trigger:el,
        start:"top 90%",
        once:true
      },

      onUpdate:()=>{

        if(state.n<.35)
          el.textContent=
            "00 / SYSTEM";

        else if(state.n<.7)
          el.textContent=
            "01 / ONLINE";

        else
          el.textContent=
            item.value;

      },

      onComplete:()=>{

        if(original)
          el.textContent=
            item.value;

      }

    });

  });

  /* ================= FINAL WORD SCALE ================= */

  gsap.to(".final p",{

    letterSpacing:".55em",

    scrollTrigger:{
      trigger:".final",
      start:"top bottom",
      end:"center center",
      scrub:1
    }

  });

}
/* =========================================================
   NEXORA // MOTION ENGINE
   PART 07 — SCROLL DISTORTION + PARALLAX
   ========================================================= */

if(window.gsap){

  /* ================= SECTION PARALLAX ================= */

  gsap.utils.toArray(
    ".section"
  ).forEach(section=>{

    const heading=
      section.querySelector("h2");

    const number=
      section.querySelector(".number");

    if(heading){

      gsap.to(heading,{

        yPercent:-8,

        ease:"none",

        scrollTrigger:{
          trigger:section,
          start:"top bottom",
          end:"bottom top",
          scrub:1.5
        }

      });

    }

    if(number){

      gsap.to(number,{

        yPercent:100,
        opacity:.25,

        ease:"none",

        scrollTrigger:{
          trigger:section,
          start:"top bottom",
          end:"bottom top",
          scrub:2
        }

      });

    }

  });

  /* ================= CARD PARALLAX ================= */

  gsap.utils.toArray(
    ".card"
  ).forEach((card,i)=>{

    gsap.to(card,{

      y:i%2===0 ? -25 : 25,

      ease:"none",

      scrollTrigger:{
        trigger:".projects",
        start:"top bottom",
        end:"bottom top",
        scrub:1.4
      }

    });

  });

  /* ================= WORLD ORBIT ================= */

  if(particleField){

    gsap.to(
      particleField.nodes,
      {
        duration:10,
        repeat:-1,
        ease:"none",
        stagger:{
          each:.01,
          repeat:-1,
          yoyo:true
        }
      }
    );

  }

  /* ================= HERO DEPTH ================= */

  gsap.to(".hero::before",{
    opacity:.5
  });

  /* ================= SCROLL VELOCITY ================= */

  let lastScroll=
    window.scrollY;

  let velocity=0;

  window.addEventListener(
    "scroll",
    ()=>{

      const current=
        window.scrollY;

      velocity=
        current-lastScroll;

      lastScroll=current;

      velocity=
        NX.clamp(
          velocity,
          -30,
          30
        );

    },
    {passive:true}
  );

  function velocityLoop(){

    const amount=
      Math.abs(velocity);

    document.documentElement
      .style.setProperty(
        "--scroll-speed",
        amount
      );

    velocity*=.9;

    requestAnimationFrame(
      velocityLoop
    );

  }

  velocityLoop();

  /* ================= VELOCITY CARDS ================= */

  gsap.utils.toArray(
    ".card"
  ).forEach(card=>{

    gsap.to(card,{

      rotationZ:
        velocity*.015,

      duration:.4,

      overwrite:false

    });

  });

  /* ================= FINAL ZOOM ================= */

  gsap.fromTo(
    ".final",

    {
      backgroundPosition:
        "50% 40%"
    },

    {
      backgroundPosition:
        "50% 60%",

      ease:"none",

      scrollTrigger:{
        trigger:".final",
        start:"top bottom",
        end:"bottom top",
        scrub:2
      }

    }
  );

}
/* =========================================================
   NEXORA // MOTION ENGINE
   PART 08 — ENERGY ORBITS + 3D FX
   ========================================================= */

if(window.THREE && scene){

  const orbitGroup = new THREE.Group();
  scene.add(orbitGroup);

  /* ================= ENERGY RINGS ================= */

  const ringData = [
    {r:2.1, rot:.8, color:0x54f6ff},
    {r:2.6, rot:1.4, color:0x9b5cff},
    {r:3.1, rot:2.2, color:0xff4fd8}
  ];

  ringData.forEach((data,i)=>{

    const geometry =
      new THREE.TorusGeometry(
        data.r,
        .008,
        8,
        160
      );

    const material =
      new THREE.MeshBasicMaterial({
        color:data.color,
        transparent:true,
        opacity:.55,
        blending:
          THREE.AdditiveBlending
      });

    const ring =
      new THREE.Mesh(
        geometry,
        material
      );

    ring.rotation.x=data.rot;
    ring.rotation.y=i*.7;

    orbitGroup.add(ring);

  });

  /* ================= ORBIT NODES ================= */

  const nodeGroup =
    new THREE.Group();

  orbitGroup.add(nodeGroup);

  for(let i=0;i<18;i++){

    const geometry =
      new THREE.SphereGeometry(
        .025+
        Math.random()*.035,
        8,
        8
      );

    const material =
      new THREE.MeshBasicMaterial({
        color:
          i%2
          ? 0x54f6ff
          : 0x9b5cff
      });

    const node =
      new THREE.Mesh(
        geometry,
        material
      );

    const angle =
      (i/18)*Math.PI*2;

    const radius =
      2.2+
      (i%3)*.45;

    node.userData={
      angle,
      radius,
      speed:
        .25+
        Math.random()*.4
    };

    nodeGroup.add(node);

  }

  /* ================= ENERGY ANIMATION ================= */

  const fxClock =
    new THREE.Clock();

  function energyLoop(){

    const t =
      fxClock.getElapsedTime();

    orbitGroup.rotation.y =
      t*.08;

    orbitGroup.rotation.z =
      Math.sin(t*.2)*.08;

    nodeGroup.children.forEach(
      node=>{

        const d=
          node.userData;

        const angle=
          d.angle+
          t*d.speed;

        node.position.set(
          Math.cos(angle)*d.radius,
          Math.sin(angle)*d.radius,
          Math.sin(
            angle*2
          )*.35
        );

        const pulse=
          Math.sin(
            t*3+
            d.angle
          )*.5+.5;

        node.scale.setScalar(
          .7+
          pulse*.8
        );

      }
    );

    requestAnimationFrame(
      energyLoop
    );

  }

  energyLoop();

  /* ================= CINEMATIC LIGHT ================= */

  if(lightA && lightB){

    const baseA =
      lightA.intensity;

    const baseB =
      lightB.intensity;

    gsap.to(lightA,{
      intensity:baseA*1.5,
      duration:2.5,
      repeat:-1,
      yoyo:true,
      ease:"sine.inOut"
    });

    gsap.to(lightB,{
      intensity:baseB*1.4,
      duration:3.2,
      repeat:-1,
      yoyo:true,
      ease:"sine.inOut"
    });

  }

  /* ================= CAMERA BREATH ================= */

  if(camera){

    gsap.to(camera.position,{
      z:8.5,
      duration:4,
      repeat:-1,
      yoyo:true,
      ease:"sine.inOut"
    });

  }

}
/* =========================================================
   NEXORA // MOTION ENGINE
   PART 09 — INTERACTION + NAVIGATION SYSTEM
   ========================================================= */

/* ================= SMOOTH ANCHOR NAVIGATION ================= */

document.querySelectorAll('a[href^="#"]').forEach(link=>{

  link.addEventListener("click",e=>{

    const id =
      link.getAttribute("href");

    const target =
      document.querySelector(id);

    if(!target) return;

    e.preventDefault();

    const offset =
      window.innerWidth < 700
      ? 60
      : 80;

    const position =
      target.getBoundingClientRect().top +
      window.scrollY -
      offset;

    if(window.gsap){

      gsap.to(window,{
        duration:1.4,
        scrollTo:{
          y:position,
          autoKill:true
        },
        ease:"power4.inOut"
      });

    }else{

      window.scrollTo({
        top:position,
        behavior:"smooth"
      });

    }

  });

});

/* ================= ACTIVE NAV STATE ================= */

const navLinks =
  document.querySelectorAll(
    ".nav nav a"
  );

const sectionsForNav =
  document.querySelectorAll(
    "section[id]"
  );

const navObserver =
  new IntersectionObserver(
    entries=>{

      entries.forEach(entry=>{

        if(!entry.isIntersecting)
          return;

        navLinks.forEach(link=>{
          link.classList.remove(
            "active"
          );
        });

        const active =
          document.querySelector(
            `.nav nav a[href="#${entry.target.id}"]`
          );

        active?.classList.add(
          "active"
        );

      });

    },
    {
      threshold:.25
    }
  );

sectionsForNav.forEach(
  section=>
    navObserver.observe(section)
);

/* ================= KEYBOARD ACCESSIBILITY ================= */

document.addEventListener(
  "keydown",
  e=>{

    if(e.key==="Escape"){

      nav?.classList.remove(
        "open"
      );

      document.body.classList.remove(
        "menu-open"
      );

    }

  }
);

/* ================= SYSTEM STATUS ================= */

const status =
  document.querySelector(
    ".system-status"
  );

if(status){

  const states=[
    "SYSTEM ONLINE",
    "NEURAL GRID ACTIVE",
    "3D ENGINE READY",
    "NEXORA CORE ONLINE"
  ];

  let stateIndex=0;

  setInterval(()=>{

    stateIndex=
      (stateIndex+1)%
      states.length;

    status.textContent=
      states[stateIndex];

  },3200);

}

/* ================= PERFORMANCE MODE ================= */

const lowPower =
  navigator.hardwareConcurrency &&
  navigator.hardwareConcurrency<=4;

if(lowPower){

  document.body.classList.add(
    "low-power"
  );

}

/* ================= VISIBILITY CONTROL ================= */

document.addEventListener(
  "visibilitychange",
  ()=>{

    if(document.hidden){

      NX.running=false;

    }else{

      NX.running=true;

    }

  }
);

/* ================= WEBGL DIAGNOSTICS ================= */

if(renderer){

  const gl =
    renderer.getContext();

  const debug =
    gl.getExtension(
      "WEBGL_debug_renderer_info"
    );

  if(debug){

    const gpu =
      gl.getParameter(
        debug.UNMASKED_RENDERER_WEBGL
      );

    console.log(
      "%c NEXORA GPU: ",
      "color:#9b5cff;font-weight:bold",
      gpu
    );

  }

}

/* ================= FINAL BOOT ================= */

window.addEventListener(
  "load",
  ()=>{

    document.documentElement
      .classList.add(
        "nexora-ready"
      );

    console.log(
      "%c NEXORA // ALL SYSTEMS READY ",
      "color:#54f6ff;background:#03050d;padding:10px;font-weight:bold"
    );

  }
);
/* =========================================================
   NEXORA // MOTION ENGINE
   PART 10 — ADAPTIVE CORE + FINAL BOOT
   ========================================================= */

/* ================= DEVICE PROFILE ================= */

const DEVICE = {

  mobile:
    window.matchMedia(
      "(max-width:768px)"
    ).matches,

  touch:
    window.matchMedia(
      "(pointer:coarse)"
    ).matches,

  reducedMotion:
    window.matchMedia(
      "(prefers-reduced-motion:reduce)"
    ).matches,

  cores:
    navigator.hardwareConcurrency || 4

};

if(DEVICE.mobile){

  document.body.classList.add(
    "mobile-device"
  );

}

/* ================= REDUCED MOTION ================= */

if(DEVICE.reducedMotion){

  document.body.classList.add(
    "reduced-motion"
  );

  if(window.gsap){

    gsap.globalTimeline.timeScale(
      1
    );

  }

}

/* ================= CSS MOTION VARIABLES ================= */

function updateMotion(){

  const t =
    performance.now()*.001;

  document.documentElement
    .style.setProperty(
      "--time",
      t
    );

  requestAnimationFrame(
    updateMotion
  );

}

updateMotion();

/* ================= DYNAMIC SYSTEM PULSE ================= */

const systemCore =
  document.querySelector(
    ".system-core"
  );

if(systemCore){

  setInterval(()=>{

    systemCore.classList.add(
      "pulse"
    );

    setTimeout(()=>{

      systemCore.classList.remove(
        "pulse"
      );

    },500);

  },3000);

}

/* ================= WEBGL PERFORMANCE ================= */

if(renderer){

  const pixelRatio =
    DEVICE.mobile
    ? 1
    : Math.min(
        window.devicePixelRatio,
        2
      );

  renderer.setPixelRatio(
    pixelRatio
  );

}

/* ================= PAUSE WEBGL WHEN HIDDEN ================= */

document.addEventListener(
  "visibilitychange",
  ()=>{

    if(!renderer) return;

    if(document.hidden){

      renderer.setAnimationLoop(
        null
      );

    }

  }
);

/* ================= CONNECTION EFFECT ================= */

document
  .querySelectorAll(
    ".card,.tech-list span"
  )
  .forEach(el=>{

    el.addEventListener(
      "mouseenter",
      ()=>{

        el.style.setProperty(
          "--energy",
          "1"
        );

      }
    );

    el.addEventListener(
      "mouseleave",
      ()=>{

        el.style.setProperty(
          "--energy",
          "0"
        );

      }
    );

  });

/* ================= ORIENTATION ================= */

window.addEventListener(
  "orientationchange",
  ()=>{

    setTimeout(()=>{

      window.dispatchEvent(
        new Event("resize")
      );

      if(window.ScrollTrigger){

        ScrollTrigger.refresh();

      }

    },400);

  }
);

/* ================= FINAL BOOT ================= */

function nexoraBoot(){

  document.documentElement
    .classList.add(
      "nexora-engine-ready"
    );

  document.body
    .classList.add(
      "nexora-active"
    );

  console.log(
    "%c NEXORA ",
    "color:#54f6ff;font-size:22px;font-weight:900"
  );

  console.log(
    "%c DIGITAL EXPERIENCE ENGINE ONLINE ",
    "color:#9b5cff;font-weight:bold"
  );

  console.log(
    "%c WebGL • GSAP • Motion • Interaction • Adaptive UI ",
    "color:#8b95ad"
  );

}

if(document.readyState==="complete"){

  nexoraBoot();

}else{

  window.addEventListener(
    "load",
    nexoraBoot,
    {once:true}
  );

}

/* ================= ERROR GUARD ================= */

window.addEventListener(
  "error",
  event=>{

    console.warn(
      "NEXORA runtime:",
      event.message
    );

  }
);