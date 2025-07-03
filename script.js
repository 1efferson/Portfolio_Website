import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// --- 1. 3D SCENE & MODEL SETUP ---
function initThreeJS() {
  // Basic scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg-canvas"),
    alpha: true, // Allows for a transparent background
    antialias: true,
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.z = 2.5;

  // --- Background Particles ---
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 1500;
  const posArray = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10;
  }

  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(posArray, 3)
  );
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.03,
    color: 0xffffff,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
  });
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  // --- Lighting ---
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0x007cf0, 10, 10);
  pointLight.position.set(-2, -1, 2);
  scene.add(pointLight);

  // --- Load 3D Model ---
  const loader = new GLTFLoader();
  let model;
  loader.load(
    "https://poly.pizza/download/baked/5723321525534720",
    (gltf) => {
      model = gltf.scene;
      model.scale.set(0.5, 0.5, 0.5);
      model.position.y = -0.3;
      scene.add(model);
    },
    undefined,
    (error) => {
      console.error("An error occurred while loading the 3D model:", error);
    }
  );

  // --- Animation Loop ---
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Animate particles
    particlesMesh.rotation.x = elapsedTime * 0.05;
    particlesMesh.rotation.y = elapsedTime * 0.03;

    // Animate the model if loaded
    if (model) {
      model.rotation.y = elapsedTime * 0.2;
      model.rotation.x = Math.sin(elapsedTime * 0.5) * 0.1;
    }

    renderer.render(scene, camera);
  }
  animate();

  // Handle Window Resizing
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// --- 2. TYPED.JS SETUP ---
function initTypedJS() {
  new Typed("#typed-text", {
    strings: [
      "Building Digital Realities.",
      "Code Meets Creativity.",
      "Interactive Web Experiences.",
    ],
    typeSpeed: 40,
    backSpeed: 20,
    backDelay: 2000,
    loop: true,
  });
}

// --- 3. GSAP ANIMATIONS ---
function initGSAP() {
  // Tech Orbit Animation (unchanged)
  const icons = gsap.utils.toArray(".tech-icon");
  const orbitRadius = window.innerWidth < 768 ? 80 : 110;
  const duration = 20;

  gsap.set(icons, {
    x: (i) => orbitRadius * Math.cos(i * ((Math.PI * 2) / icons.length)),
    y: (i) => orbitRadius * Math.sin(i * ((Math.PI * 2) / icons.length)),
    scale: 0,
  });

  // Main Page Load Animation Timeline
  gsap.set(".hero-text .line", { y: "100%" });
  gsap.set(["header", ".follow-bar", ".hero-text .tagline", ".profile-image"], {
    opacity: 0,
  });

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.to(".hero-text .line", {
    y: "0%",
    duration: 1.2,
    stagger: 0.15,
    delay: 0.5,
  })
    .to("header", { opacity: 1, duration: 1 }, "-=0.8")
    .to(".follow-bar", { opacity: 1, duration: 1 }, "-=1")
    .to(".hero-text .tagline", { opacity: 1, duration: 1 }, "-=0.5")
    .to(".profile-image", { opacity: 1, duration: 1 }, "-=0.5")
    .to(
      ".tech-icon",
      {
        scale: 1,
        stagger: 0.1,
        duration: 0.8,
        onComplete: () => {
          // Start orbit animation only after icons appear
          gsap.to(icons, {
            rotation: 360,
            transformOrigin: `-${orbitRadius}px 0px`,
            duration: duration,
            repeat: -1,
            ease: "none",
            stagger: {
              each: duration / icons.length,
              repeat: -1,
            },
          });
          
          // Initialize timeline animations AFTER orbit is set up
          initTimelineAnimations();
        },
      },
      "-=0.8"
    );
}

// --- 4. TIMELINE ANIMATIONS ---
function initTimelineAnimations() {
  // Experience items animation
  gsap.utils.toArray(".experience-item").forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: "top 80%",
        toggleActions: "play none none none",
        markers: false, // Set to true for debugging if needed
      },
      opacity: 0,
      y: 50,
      duration: 0.8,
      delay: i * 0.2,
    });
  });

  // Timeline bar animation
  ScrollTrigger.create({
    trigger: ".timeline-container",
    start: "top center",
    end: "bottom center",
    onUpdate: (self) => {
      const timelineBar = document.querySelector(".timeline-bar");
      if (timelineBar) {
        timelineBar.style.height = `${self.progress * 100}%`;
      }
    },
    markers: false, // Set to true for debugging if needed
  });
  
}

// --- INITIALIZE EVERYTHING ---
document.addEventListener("DOMContentLoaded", () => {
  initThreeJS();
  initTypedJS();
  initGSAP();
  
  // Refresh ScrollTrigger after all animations are set up
  ScrollTrigger.addEventListener("refresh", () => {
    document.querySelectorAll(".experience-item").forEach(item => {
      item.style.opacity = "1"; // Ensure items are visible before animation
    });
  });
  ScrollTrigger.refresh();
});