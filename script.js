/**
 * Mora Winter - Interactive Controller (Spring Flow Games)
 * Features:
 * 1. 3D Cartoonish Snowfall in the Dark (Falling in background behind title in Section 1)
 * 2. Authentic Criss-Cross Campfire with Hexagonal Glowing Cadmium Orange Crystal (Section 1)
 * 3. Active Section Navigation Syncing via IntersectionObserver (3-Section Setup)
 * 4. Interactive Video Player Placeholder (Section 3)
 */

document.addEventListener('DOMContentLoaded', () => {
  init3DSnowfall();
  initAuthenticCampfire3D();
  initVideoPlayer();
});

/**
 * =========================================================================
 * 1. 3D CARTOONISH SNOWFALL (Section 1 - Behind Title)
 * - Bright, radiant, crisp white snowflakes falling behind the title text
 * =========================================================================
 */
function init3DSnowfall() {
  const container = document.getElementById('snow-container');
  if (!container) return;

  if (typeof THREE !== 'undefined') {
    initThreeJSSnow(container);
  } else {
    initCanvasSnowFallback(container);
  }
}

function initThreeJSSnow(container) {
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.z = 100;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Crisp, bright white lighting to make snow pop against the dark background
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
  scene.add(ambientLight);

  const moonLight = new THREE.DirectionalLight(0xffffff, 1.8);
  moonLight.position.set(40, 100, 40);
  scene.add(moonLight);

  const frontFillLight = new THREE.DirectionalLight(0xf0f8ff, 1.2);
  frontFillLight.position.set(-30, -50, 60);
  scene.add(frontFillLight);

  // Cartoonish 3D Snowflakes - Pure Radiant White across 200dvh
  const flakeCount = 190;
  const flakes = [];

  const geometries = [
    new THREE.DodecahedronGeometry(1.45, 0),
    new THREE.IcosahedronGeometry(1.25, 0),
    new THREE.OctahedronGeometry(1.55, 0)
  ];

  // Bright, luminous white snowflake materials
  const flakeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 0.35,
    roughness: 0.15,
    metalness: 0.05,
    flatShading: true
  });

  const flakeGlowMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xf8fafc,
    emissiveIntensity: 0.55,
    roughness: 0.1,
    metalness: 0.05,
    flatShading: true
  });

  for (let i = 0; i < flakeCount; i++) {
    const geom = geometries[Math.floor(Math.random() * geometries.length)];
    const mat = Math.random() > 0.4 ? flakeMaterial : flakeGlowMaterial;
    const mesh = new THREE.Mesh(geom, mat);

    mesh.position.x = (Math.random() - 0.5) * 230;
    mesh.position.y = (Math.random() - 0.5) * 190;
    mesh.position.z = (Math.random() - 0.5) * 120;

    const baseScale = 0.75 + Math.random() * 1.5;
    mesh.scale.set(baseScale, baseScale, baseScale);

    flakes.push({
      mesh: mesh,
      baseScale: baseScale,
      speedY: 0.32 + Math.random() * 0.18,
      wobbleSpeed: 0.8 + Math.random() * 1.5,
      wobbleRadius: 0.2 + Math.random() * 0.5,
      rotSpeedX: (Math.random() - 0.5) * 0.02,
      rotSpeedY: (Math.random() - 0.5) * 0.02,
      rotSpeedZ: (Math.random() - 0.5) * 0.02,
      baseX: mesh.position.x
    });

    scene.add(mesh);
  }

  // Background particle dust - Bright White
  const bgParticleCount = 240;
  const bgGeometry = new THREE.BufferGeometry();
  const bgPositions = new Float32Array(bgParticleCount * 3);
  const bgSpeeds = new Float32Array(bgParticleCount);

  for (let i = 0; i < bgParticleCount; i++) {
    bgPositions[i * 3] = (Math.random() - 0.5) * 300;
    bgPositions[i * 3 + 1] = (Math.random() - 0.5) * 210;
    bgPositions[i * 3 + 2] = -40 + (Math.random() - 0.5) * 80;
    bgSpeeds[i] = 0.30 + Math.random() * 0.16;
  }

  bgGeometry.setAttribute('position', new THREE.BufferAttribute(bgPositions, 3));
  const bgMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 2.0,
    transparent: true,
    opacity: 0.9
  });

  const bgParticleSystem = new THREE.Points(bgGeometry, bgMaterial);
  scene.add(bgParticleSystem);

  const handleResize = () => {
    const newW = container.clientWidth || window.innerWidth;
    const newH = container.clientHeight || window.innerHeight;
    camera.aspect = newW / newH;
    camera.updateProjectionMatrix();
    renderer.setSize(newW, newH);
  };
  window.addEventListener('resize', handleResize, { passive: true });

  let isSection1Visible = true;
  const sec1 = document.getElementById('section-1');
  if (sec1) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { isSection1Visible = entry.isIntersecting; });
    }, { threshold: 0.05 });
    observer.observe(sec1);
  }

  const clock = new THREE.Clock();
  const topY = 95;
  const bottomY = -95;
  const totalSpan = topY - bottomY; // 190
  const decayConstant = 2.6; // Exponential decay rate
  const expDenom = 1 - Math.exp(-decayConstant);

  function animate() {
    requestAnimationFrame(animate);
    if (!isSection1Visible) return;

    const elapsedTime = clock.getElapsedTime();

    for (let i = 0; i < flakes.length; i++) {
      const flake = flakes[i];
      const mesh = flake.mesh;

      // Downward descent
      mesh.position.y -= flake.speedY;
      mesh.position.x = flake.baseX + Math.sin(elapsedTime * flake.wobbleSpeed + i) * flake.wobbleRadius;

      mesh.rotation.x += flake.rotSpeedX;
      mesh.rotation.y += flake.rotSpeedY;
      mesh.rotation.z += flake.rotSpeedZ;

      // Calculate normalized vertical fall progress t in [0, 1]
      const t = Math.min(1, Math.max(0, (topY - mesh.position.y) / totalSpan));

      // Exponential decay scale formula (starts at 1.0 at top, drops exponentially to 0.0 at bottom)
      const expFactor = Math.max(0, (Math.exp(-decayConstant * t) - Math.exp(-decayConstant)) / expDenom);
      const currentScale = flake.baseScale * expFactor;
      mesh.scale.set(currentScale, currentScale, currentScale);

      // Disappear completely at the bottom and respawn at top with full size
      if (mesh.position.y <= bottomY) {
        mesh.position.y = topY;
        mesh.position.x = (Math.random() - 0.5) * 230;
        flake.baseX = mesh.position.x;
        mesh.scale.set(flake.baseScale, flake.baseScale, flake.baseScale);
      }
    }

    // Animate background particles at similar descent rate
    const positions = bgGeometry.attributes.position.array;
    for (let i = 0; i < bgParticleCount; i++) {
      const yIdx = i * 3 + 1;
      positions[yIdx] -= bgSpeeds[i];
      if (positions[yIdx] < bottomY) {
        positions[yIdx] = topY;
        positions[i * 3] = (Math.random() - 0.5) * 300;
      }
    }
    bgGeometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }

  animate();
}

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

  const flakes = Array.from({ length: 90 }, () => {
    const baseRadius = Math.random() * 3.5 + 2;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      baseRadius: baseRadius,
      radius: baseRadius,
      speed: Math.random() * 1.2 + 0.6,
      angle: Math.random() * Math.PI * 2
    };
  });

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';

    flakes.forEach(flake => {
      flake.y += flake.speed;
      flake.x += Math.sin(flake.angle) * 0.4;
      flake.angle += 0.015;

      // Exponential radius decay
      const t = Math.min(1, Math.max(0, flake.y / height));
      const expFactor = Math.max(0, (Math.exp(-2.6 * t) - Math.exp(-2.6)) / (1 - Math.exp(-2.6)));
      flake.radius = flake.baseRadius * expFactor;

      // Disappear at bottom and respawn at top
      if (flake.y >= height) {
        flake.y = 0;
        flake.x = Math.random() * width;
        flake.radius = flake.baseRadius;
      }

      ctx.beginPath();
      ctx.arc(flake.x, flake.y, Math.max(0.1, flake.radius), 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
}

/**
 * =========================================================================
 * 2. AUTHENTIC CRISS-CROSS CAMPFIRE WITH GLOWING CADMIUM ORANGE CRYSTAL (Section 1)
 * - Lowered position: about half of the campfire is off-screen at the bottom
 * - Deep, earthy Cadmium Orange glowing crystal (reduced saturation, rich warmth)
 * - Natural leaning & criss-crossed charred wood logs, stone ring hearth
 * - Dynamic light projecting upward to illuminate the Mora Winter title
 * =========================================================================
 */
function initAuthenticCampfire3D() {
  const container = document.getElementById('campfire-container');
  const moraTitle = document.getElementById('moraTitle');
  if (!container || typeof THREE === 'undefined') return;

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  const scene = new THREE.Scene();
  
  // Camera positioned to view the scene with campfire lowered at the bottom
  const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
  camera.position.set(0, 5, 36);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // Soft Ambient Night Light
  const ambientLight = new THREE.AmbientLight(0x0c1527, 1.3);
  scene.add(ambientLight);

  // Master Campfire Group (Positioned so ~50% is off-screen at the bottom of the section)
  const campfireGroup = new THREE.Group();
  campfireGroup.position.set(0, -11.5, 0);
  scene.add(campfireGroup);

  // Main Radiant Crystal Core Light (Rich Cadmium Orange #d9531e)
  const crystalCoreLight = new THREE.PointLight(0xd9531e, 6.0, 85);
  crystalCoreLight.position.set(0, 4.0, 0);
  campfireGroup.add(crystalCoreLight);

  // Upward Projecting Light to illuminate the title text above (Warm Cadmium Amber #e5723b)
  const upwardTitleLight = new THREE.PointLight(0xe5723b, 4.5, 75);
  upwardTitleLight.position.set(0, 10.5, 4);
  campfireGroup.add(upwardTitleLight);

  // Deep Hearth Light at base of logs (Earthy Deep Cadmium #b83e14)
  const baseHearthLight = new THREE.PointLight(0xb83e14, 3.2, 50);
  baseHearthLight.position.set(0, 1.5, 0);
  campfireGroup.add(baseHearthLight);

  // 1. Dark Snowy Ground Terrain catching the firelight
  const groundGeo = new THREE.PlaneGeometry(160, 100, 32, 24);
  const pos = groundGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const vx = pos.getX(i);
    const vy = pos.getY(i);
    pos.setZ(i, Math.sin(vx * 0.08) * Math.cos(vy * 0.08) * 1.2);
  }
  groundGeo.computeVertexNormals();

  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x0a1222,
    roughness: 0.8,
    metalness: 0.05,
    flatShading: true
  });
  const groundMesh = new THREE.Mesh(groundGeo, groundMat);
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.y = 0;
  campfireGroup.add(groundMesh);

  // 2. Hearth Stone Ring (Surrounding the campfire)
  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0x273449,
    roughness: 0.9,
    metalness: 0.1,
    flatShading: true
  });

  const stoneCount = 14;
  const ringRadiusX = 14;
  const ringRadiusZ = 9.5;
  for (let i = 0; i < stoneCount; i++) {
    const angle = (i / stoneCount) * Math.PI * 2;
    const stoneSize = 1.2 + Math.random() * 0.6;
    const stoneGeom = new THREE.DodecahedronGeometry(stoneSize, 0);
    const stoneMesh = new THREE.Mesh(stoneGeom, stoneMat);
    stoneMesh.position.set(
      Math.cos(angle) * ringRadiusX + (Math.random() - 0.5) * 0.8,
      stoneSize * 0.4,
      Math.sin(angle) * ringRadiusZ + (Math.random() - 0.5) * 0.8
    );
    stoneMesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
    campfireGroup.add(stoneMesh);
  }

  // 3. Glowing Ember Bed at the center of the hearth (Cadmium Orange Ember)
  const emberBedMat = new THREE.MeshStandardMaterial({
    color: 0xd9531e,
    emissive: 0xb83e14,
    emissiveIntensity: 2.2,
    roughness: 0.3,
    flatShading: true
  });
  const emberBed = new THREE.Mesh(new THREE.CylinderGeometry(7, 8, 0.6, 12), emberBedMat);
  emberBed.position.set(0, 0.3, 0);
  campfireGroup.add(emberBed);

  // 4. Authentic Leaning & Criss-Crossed Campfire Logs
  const logMat = new THREE.MeshStandardMaterial({
    color: 0x1f1612,
    roughness: 0.85,
    metalness: 0.05,
    flatShading: true
  });

  const logSpecs = [
    // Front leaning logs
    { p1: [-9, 0.5, 5], p2: [-0.5, 6.5, 0], r: 1.1 },
    { p1: [8.5, 0.5, 5.5], p2: [0.5, 7.0, -0.5], r: 1.15 },
    { p1: [-5.5, 0.5, 6.5], p2: [1.2, 6.0, 0.5], r: 1.0 },
    { p1: [5.0, 0.5, 6.0], p2: [-1.0, 6.2, 0.2], r: 1.05 },
    
    // Side crossing logs
    { p1: [-11, 0.5, 0.5], p2: [-0.2, 7.2, -0.8], r: 1.2 },
    { p1: [11.5, 0.5, 0], p2: [0.3, 7.4, -0.5], r: 1.2 },
    
    // Back support logs
    { p1: [-8.5, 0.5, -4.5], p2: [0, 6.8, -0.2], r: 1.1 },
    { p1: [8.0, 0.5, -5.0], p2: [-0.5, 6.5, -0.4], r: 1.1 },
    { p1: [0, 0.5, -7.5], p2: [0, 7.0, -0.5], r: 1.05 },
    
    // Horizontal base embers/logs
    { p1: [-7.0, 0.4, 2.5], p2: [6.5, 0.4, -2.0], r: 0.95 },
    { p1: [-6.0, 0.4, -2.5], p2: [7.0, 0.4, 2.0], r: 0.95 }
  ];

  logSpecs.forEach(spec => {
    const v1 = new THREE.Vector3(...spec.p1);
    const v2 = new THREE.Vector3(...spec.p2);
    const dist = v1.distanceTo(v2);
    const dir = new THREE.Vector3().subVectors(v2, v1).normalize();
    
    const logGeo = new THREE.CylinderGeometry(spec.r * 0.75, spec.r, dist, 7);
    const logMesh = new THREE.Mesh(logGeo, logMat);

    const mid = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
    logMesh.position.copy(mid);

    const axis = new THREE.Vector3(0, 1, 0);
    logMesh.quaternion.setFromUnitVectors(axis, dir);

    campfireGroup.add(logMesh);
  });

  // 5. Elongated Hexagonal Glowing Cadmium Orange Crystal
  const crystalGroup = new THREE.Group();
  crystalGroup.position.set(0, 2.5, 0);
  campfireGroup.add(crystalGroup);

  const crystalRadius = 3.2;
  const bodyHeight = 6.8;
  const capHeight = 4.6;

  // Hexagonal Prism Body
  const bodyGeom = new THREE.CylinderGeometry(crystalRadius, crystalRadius * 1.05, bodyHeight, 6);
  
  // Hexagonal Pointed Pyramid Cap
  const capGeom = new THREE.ConeGeometry(crystalRadius, capHeight, 6);
  capGeom.translate(0, capHeight / 2, 0);

  // Radiant Glowing Cadmium Orange Materials (Reduced saturation, earthy warmth)
  const crystalCoreMat = new THREE.MeshStandardMaterial({
    color: 0xfde8df,
    emissive: 0xd9531e,
    emissiveIntensity: 2.7,
    roughness: 0.1,
    metalness: 0.2,
    flatShading: true
  });

  const crystalCapMat = new THREE.MeshStandardMaterial({
    color: 0xfbd2c3,
    emissive: 0xb83e14,
    emissiveIntensity: 2.5,
    roughness: 0.15,
    metalness: 0.2,
    flatShading: true
  });

  const crystalBodyMesh = new THREE.Mesh(bodyGeom, crystalCoreMat);
  crystalBodyMesh.position.y = bodyHeight / 2;
  crystalGroup.add(crystalBodyMesh);

  const crystalCapMesh = new THREE.Mesh(capGeom, crystalCapMat);
  crystalCapMesh.position.y = bodyHeight;
  crystalGroup.add(crystalCapMesh);

  // Glowing base contact ring
  const baseRingGeom = new THREE.TorusGeometry(crystalRadius * 1.1, 0.45, 8, 16);
  const baseRingMat = new THREE.MeshStandardMaterial({
    color: 0xfde8df,
    emissive: 0xd9531e,
    emissiveIntensity: 3.0,
    roughness: 0.1,
    flatShading: true
  });
  const baseRing = new THREE.Mesh(baseRingGeom, baseRingMat);
  baseRing.rotation.x = Math.PI / 2;
  baseRing.position.y = 0.2;
  crystalGroup.add(baseRing);

  // 6. Rising Floating Cadmium Orange Fire Embers & Sparks
  const emberCount = 45;
  const embers = [];
  const emberGeom = new THREE.DodecahedronGeometry(0.22, 0);
  const emberMat = new THREE.MeshStandardMaterial({
    color: 0xfde8df,
    emissive: 0xd9531e,
    emissiveIntensity: 2.8,
    roughness: 0.1,
    flatShading: true
  });

  for (let i = 0; i < emberCount; i++) {
    const emberMesh = new THREE.Mesh(emberGeom, emberMat);
    const scale = 0.5 + Math.random() * 0.9;
    emberMesh.scale.set(scale, scale, scale);
    campfireGroup.add(emberMesh);

    embers.push({
      mesh: emberMesh,
      x: (Math.random() - 0.5) * 5,
      y: 3 + Math.random() * 20,
      z: (Math.random() - 0.5) * 5,
      speedY: 0.06 + Math.random() * 0.08,
      wobbleSpeed: 1.5 + Math.random() * 2.5,
      wobbleRadius: 0.25 + Math.random() * 0.35,
      age: Math.random() * 100
    });
  }

  // Handle Resize
  const handleCampfireResize = () => {
    const newW = container.clientWidth || window.innerWidth;
    const newH = container.clientHeight || window.innerHeight;
    camera.aspect = newW / newH;
    camera.updateProjectionMatrix();
    renderer.setSize(newW, newH);
  };
  window.addEventListener('resize', handleCampfireResize, { passive: true });

  // IntersectionObserver to pause rendering when Section 1 is off-screen
  let isSection1CampfireVisible = true;
  const sec1 = document.getElementById('section-1');
  if (sec1) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { isSection1CampfireVisible = entry.isIntersecting; });
    }, { threshold: 0.05 });
    observer.observe(sec1);
  }

  // Animation Loop with Light Flicker & Cadmium Orange Title Illumination
  const clock = new THREE.Clock();

  function animateAuthenticCampfire() {
    requestAnimationFrame(animateAuthenticCampfire);
    if (!isSection1CampfireVisible) return;

    const time = clock.getElapsedTime();

    // 1. Gentle Crystal Breathing & Slow Rotation
    crystalGroup.rotation.y = time * 0.15;
    crystalGroup.position.y = 2.4 + Math.sin(time * 1.6) * 0.2;

    // 2. Realistic Campfire Light Flicker in Cadmium Orange
    const flicker = Math.sin(time * 7.5) * 0.4 + (Math.random() - 0.5) * 0.25;
    crystalCoreLight.intensity = 5.8 + flicker;
    upwardTitleLight.intensity = 4.4 + flicker * 0.6;
    baseHearthLight.intensity = 3.0 + flicker * 0.4;
    crystalCoreMat.emissiveIntensity = 2.7 + flicker * 0.35;
    crystalCapMat.emissiveIntensity = 2.5 + flicker * 0.35;

    // Dynamically illuminate the Mora Winter title text with cadmium orange glow
    if (moraTitle) {
      const glowAmt = (32 + flicker * 14).toFixed(1);
      moraTitle.style.filter = `
        drop-shadow(0 0 20px rgba(56, 189, 248, 0.2))
        drop-shadow(0 15px ${glowAmt}px rgba(217, 83, 30, 0.55))
        drop-shadow(0 25px 60px rgba(0, 0, 0, 0.95))
        drop-shadow(0 0 2px rgba(255, 255, 255, 0.5))
      `;
    }

    // 3. Rising Embers Animation
    embers.forEach((ember) => {
      ember.y += ember.speedY;
      ember.age += 1;

      ember.mesh.position.y = ember.y;
      ember.mesh.position.x = ember.x + Math.sin(time * ember.wobbleSpeed + ember.age) * ember.wobbleRadius;
      ember.mesh.position.z = ember.z + Math.cos(time * ember.wobbleSpeed + ember.age) * ember.wobbleRadius;

      const progress = (ember.y - 3.0) / 20.0;
      const scale = Math.max(0.1, 1 - progress);
      ember.mesh.scale.set(scale, scale, scale);

      if (ember.y > 22.0) {
        ember.y = 3.0;
        ember.x = (Math.random() - 0.5) * 4.5;
        ember.z = (Math.random() - 0.5) * 4.5;
        ember.age = 0;
      }
    });

    renderer.render(scene, camera);
  }

  animateAuthenticCampfire();
}

/**
 * =========================================================================
 * 3. INTERACTIVE VIDEO PLAYER PLACEHOLDER (Section 3)
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
      playBtn.innerHTML = '<span style="font-size:1.3rem;">❚❚</span>';
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
