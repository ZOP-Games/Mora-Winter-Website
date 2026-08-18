/**
 * Mora Winter - Interactive Controller
 * Features:
 * 1. 3D Cartoonish Snowfall (Three.js WebGL with graceful 2D Canvas fallback)
 * 2. Active Section Syncing via IntersectionObserver
 * 3. Interactive Video Player Placeholder
 */

document.addEventListener('DOMContentLoaded', () => {
  init3DSnowfall();
  initSectionNavigation();
  initVideoPlayer();
});

/**
 * =========================================================================
 * 1. 3D CARTOONISH SNOWFALL IN THE DARK (Section 1)
 * =========================================================================
 */
function init3DSnowfall() {
  const container = document.getElementById('snow-container');
  if (!container) return;

  // If Three.js loaded from CDN, use full 3D WebGL cartoon snow
  if (typeof THREE !== 'undefined') {
    initThreeJSSnow(container);
  } else {
    // Graceful 2D Canvas Cartoon Snow Fallback
    initCanvasSnowFallback(container);
  }
}

function initThreeJSSnow(container) {
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  // Scene & Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.z = 100;

  // WebGL Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Lighting - Dark Midnight with Soft Cool Moon Rim & Cozy Warm Ambient
  const ambientLight = new THREE.AmbientLight(0xd0e8ff, 0.85);
  scene.add(ambientLight);

  const moonLight = new THREE.DirectionalLight(0x7dd3fc, 1.2);
  moonLight.position.set(50, 100, 50);
  scene.add(moonLight);

  const warmHearthLight = new THREE.PointLight(0xfbbf24, 0.6, 250);
  warmHearthLight.position.set(0, -60, 40);
  scene.add(warmHearthLight);

  // Create Cartoonish 3D Snowflakes
  const flakeCount = 140;
  const flakes = [];

  // Geometries for cartoonish stylized snowflakes
  const geometries = [
    new THREE.DodecahedronGeometry(1.4, 0), // Fluffy low-poly cartoon snowflake
    new THREE.IcosahedronGeometry(1.2, 0),  // Faceted ice crystal
    new THREE.OctahedronGeometry(1.5, 0)   // Classic diamond snowflake
  ];

  // Soft cartoonish materials with frosty ice-white and subtle cyan glow
  const flakeMaterial = new THREE.MeshStandardMaterial({
    color: 0xf0f9ff,
    roughness: 0.35,
    metalness: 0.1,
    flatShading: true
  });

  const flakeGlowMaterial = new THREE.MeshStandardMaterial({
    color: 0xbae6fd,
    roughness: 0.2,
    metalness: 0.2,
    flatShading: true
  });

  for (let i = 0; i < flakeCount; i++) {
    const geom = geometries[Math.floor(Math.random() * geometries.length)];
    const mat = Math.random() > 0.3 ? flakeMaterial : flakeGlowMaterial;
    const mesh = new THREE.Mesh(geom, mat);

    // Initial 3D Positions spread across viewport frustum
    mesh.position.x = (Math.random() - 0.5) * 220;
    mesh.position.y = (Math.random() - 0.5) * 160;
    mesh.position.z = (Math.random() - 0.5) * 120;

    // Individual scale and tumbling dynamics
    const scale = 0.6 + Math.random() * 1.5;
    mesh.scale.set(scale, scale, scale);

    flakes.push({
      mesh: mesh,
      speedY: 0.35 + Math.random() * 0.55,
      speedX: (Math.random() - 0.5) * 0.2,
      wobbleSpeed: 1 + Math.random() * 2,
      wobbleRadius: 0.2 + Math.random() * 0.4,
      rotSpeedX: (Math.random() - 0.5) * 0.03,
      rotSpeedY: (Math.random() - 0.5) * 0.03,
      rotSpeedZ: (Math.random() - 0.5) * 0.03,
      baseX: mesh.position.x
    });

    scene.add(mesh);
  }

  // Secondary soft background particle cloud (tiny distant snow specks)
  const bgParticleCount = 200;
  const bgGeometry = new THREE.BufferGeometry();
  const bgPositions = new Float32Array(bgParticleCount * 3);

  for (let i = 0; i < bgParticleCount * 3; i += 3) {
    bgPositions[i] = (Math.random() - 0.5) * 300;
    bgPositions[i + 1] = (Math.random() - 0.5) * 200;
    bgPositions[i + 2] = -50 + (Math.random() - 0.5) * 100;
  }

  bgGeometry.setAttribute('position', new THREE.BufferAttribute(bgPositions, 3));
  const bgMaterial = new THREE.PointsMaterial({
    color: 0x93c5fd,
    size: 1.8,
    transparent: true,
    opacity: 0.65
  });

  const bgParticleSystem = new THREE.Points(bgGeometry, bgMaterial);
  scene.add(bgParticleSystem);

  // Mouse Interactivity (Gentle Wind Drift)
  let mouseX = 0;
  let targetMouseX = 0;

  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  }, { passive: true });

  // Handle Resize
  const handleResize = () => {
    const newW = container.clientWidth || window.innerWidth;
    const newH = container.clientHeight || window.innerHeight;
    camera.aspect = newW / newH;
    camera.updateProjectionMatrix();
    renderer.setSize(newW, newH);
  };

  window.addEventListener('resize', handleResize, { passive: true });

  // IntersectionObserver to pause WebGL rendering when section 1 is scrolled off-screen
  let isSection1Visible = true;
  const sec1 = document.getElementById('section-1');
  if (sec1) {
    const visibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isSection1Visible = entry.isIntersecting;
      });
    }, { threshold: 0.05 });
    visibilityObserver.observe(sec1);
  }

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    if (!isSection1Visible) return; // Save GPU/CPU when offscreen

    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // Smooth mouse wind easing
    mouseX += (targetMouseX - mouseX) * 0.05;

    // Animate 3D Cartoon Flakes
    for (let i = 0; i < flakes.length; i++) {
      const flake = flakes[i];
      const mesh = flake.mesh;

      // Downward fall
      mesh.position.y -= flake.speedY;

      // Horizontal wobble and wind push
      mesh.position.x = flake.baseX + Math.sin(elapsedTime * flake.wobbleSpeed + i) * flake.wobbleRadius + (mouseX * 15);

      // 3D tumbling rotation
      mesh.rotation.x += flake.rotSpeedX;
      mesh.rotation.y += flake.rotSpeedY;
      mesh.rotation.z += flake.rotSpeedZ;

      // Wrap around when falling below viewport
      if (mesh.position.y < -90) {
        mesh.position.y = 90;
        mesh.position.x = (Math.random() - 0.5) * 220;
        flake.baseX = mesh.position.x;
      }
    }

    // Animate background particles
    const positions = bgGeometry.attributes.position.array;
    for (let i = 1; i < bgParticleCount * 3; i += 3) {
      positions[i] -= 0.18;
      if (positions[i] < -100) {
        positions[i] = 100;
      }
    }
    bgGeometry.attributes.position.needsUpdate = true;

    // Subtle gentle camera sway
    camera.position.x = mouseX * 6;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  animate();
}

/**
 * Graceful 2D Canvas Cartoon Snow Fallback (in case Three.js CDN is unreachable)
 */
function initCanvasSnowFallback(container) {
  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = container.clientWidth || window.innerWidth);
  let height = (canvas.height = container.clientHeight || window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = container.clientWidth || window.innerWidth;
    height = canvas.height = container.clientHeight || window.innerHeight;
  });

  const flakes = Array.from({ length: 90 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 4 + 2,
    speed: Math.random() * 1.5 + 0.8,
    angle: Math.random() * Math.PI * 2
  }));

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(240, 248, 255, 0.85)';

    flakes.forEach(flake => {
      flake.y += flake.speed;
      flake.x += Math.sin(flake.angle) * 0.5;
      flake.angle += 0.02;

      if (flake.y > height) {
        flake.y = -10;
        flake.x = Math.random() * width;
      }

      ctx.beginPath();
      ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
}

/**
 * =========================================================================
 * 2. SECTION NAVIGATION & ACTIVE STATE SYNCING
 * =========================================================================
 */
function initSectionNavigation() {
  const sections = document.querySelectorAll('.screen-section');
  const sideDots = document.querySelectorAll('.side-nav-dot');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -30% 0px',
    threshold: [0.1, 0.4, 0.7]
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        
        sideDots.forEach(dot => {
          if (dot.getAttribute('data-section') === currentId) {
            dot.classList.add('active');
            dot.setAttribute('aria-current', 'true');
          } else {
            dot.classList.remove('active');
            dot.removeAttribute('aria-current');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));

  // Smooth click scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          history.pushState(null, '', targetId);
        }
      }
    });
  });
}

/**
 * =========================================================================
 * 3. INTERACTIVE VIDEO PLAYER PLACEHOLDER (Section 4)
 * =========================================================================
 */
function initVideoPlayer() {
  const playBtn = document.getElementById('playBtn');
  const videoPlaceholder = document.getElementById('videoPlaceholder');
  const scrubberFill = document.querySelector('.video-scrubber-fill');
  const timeDisplay = document.querySelector('.ctrl-time');

  if (!playBtn || !videoPlaceholder) return;

  let isPlaying = false;
  let playInterval = null;
  let currentSeconds = 0;
  const totalSeconds = 134; // 2:14

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  playBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    
    if (isPlaying) {
      playBtn.innerHTML = '<span style="font-size:1.4rem;">❚❚</span>';
      playBtn.setAttribute('aria-label', 'Pause Mora Winter Trailer');
      
      playInterval = setInterval(() => {
        currentSeconds++;
        if (currentSeconds > totalSeconds) currentSeconds = 0;
        
        const percent = (currentSeconds / totalSeconds) * 100;
        if (scrubberFill) scrubberFill.style.width = `${percent}%`;
        if (timeDisplay) timeDisplay.textContent = `${formatTime(currentSeconds)} / 2:14`;
      }, 1000);
    } else {
      playBtn.innerHTML = '<span class="play-icon-triangle" aria-hidden="true">▶</span>';
      playBtn.setAttribute('aria-label', 'Play Mora Winter Trailer');
      if (playInterval) clearInterval(playInterval);
    }
  });
}
