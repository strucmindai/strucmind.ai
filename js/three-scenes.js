/* ── THREE.JS SCENES ─────────────────────────────────────────
   initLogo, initHeroScene, initOrbitalScene, initFinalCTA
──────────────────────────────────────────────────────────── */

/* ── LOGO SCENE ─────────────────────────────────────────── */
function initLogo(containerId, options) {
  options = options || {};
  var container = document.getElementById(containerId);
  if (!container || typeof THREE === 'undefined') return null;

  var W = options.width  || container.clientWidth  || 300;
  var H = options.height || container.clientHeight || 300;
  var opacity   = options.opacity   !== undefined ? options.opacity   : 1;
  var speed     = options.speed     !== undefined ? options.speed     : 0.003;
  var useImage  = options.useImage  !== undefined ? options.useImage  : true;
  var mouseTilt = options.mouseTilt !== undefined ? options.mouseTilt : false;

  var renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  var scene  = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(40, W/H, 0.1, 2000);
  camera.position.set(0, 0, 420);

  var root = new THREE.Group();
  scene.add(root);

  if (useImage) {
    var loader = new THREE.TextureLoader();
    loader.load('assets/logo.png', function(texture) {
      var geo = new THREE.PlaneGeometry(220, 220);
      var mat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: opacity,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      root.add(new THREE.Mesh(geo, mat));

      var glowGeo = new THREE.PlaneGeometry(260, 260);
      var glowMat = new THREE.MeshBasicMaterial({
        color: 0x0066FF,
        transparent: true,
        opacity: 0.04 * opacity,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      var glowPlane = new THREE.Mesh(glowGeo, glowMat);
      glowPlane.position.z = -10;
      root.add(glowPlane);
    }, undefined, function() {
      buildFallback();
    });
  } else {
    buildFallback();
  }

  function buildFallback() {
    var BLUE = 0x0066FF;
    root.add(new THREE.Mesh(
      new THREE.TorusGeometry(118, 0.8, 8, 120),
      new THREE.MeshBasicMaterial({ color:BLUE, transparent:true, opacity:0.15*opacity })
    ));
    var ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(90, 0.6, 8, 100),
      new THREE.MeshBasicMaterial({ color:BLUE, transparent:true, opacity:0.12*opacity })
    );
    ring2.rotation.x = Math.PI/3;
    root.add(ring2);
    root.add(new THREE.Mesh(
      new THREE.OctahedronGeometry(38, 0),
      new THREE.MeshBasicMaterial({ color:BLUE, wireframe:true, transparent:true, opacity:0.9*opacity })
    ));
  }

  /* Particles */
  var pCount = 60;
  var pPos = new Float32Array(pCount * 3);
  for (var i = 0; i < pCount; i++) {
    var r = 160 + Math.random() * 100;
    var theta = Math.random() * Math.PI * 2;
    var phi   = Math.random() * Math.PI;
    pPos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
    pPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
    pPos[i*3+2] = r * Math.cos(phi);
  }
  var pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  var particles = new THREE.Points(pGeo,
    new THREE.PointsMaterial({ color:0x0066FF, size:1.5, transparent:true, opacity:0.35*opacity })
  );
  scene.add(particles);

  var t = 0, intro = 0;
  var targetRotX = 0, targetRotY = 0;

  if (mouseTilt) {
    document.addEventListener('mousemove', function(e) {
      targetRotX = -(e.clientY / window.innerHeight - 0.5) * 0.15;
      targetRotY =  (e.clientX / window.innerWidth  - 0.5) * 0.15;
    });
  }

  function tick() {
    requestAnimationFrame(tick);
    t += 0.005;

    if (intro < 1) {
      intro = Math.min(intro + 0.006, 1);
      var ease = 1 - Math.pow(1 - intro, 3);
      root.scale.setScalar(ease);
    }

    root.rotation.y += speed;
    if (mouseTilt) {
      root.rotation.y += (targetRotY - root.rotation.y) * 0.05;
      root.rotation.x += (targetRotX - root.rotation.x) * 0.05;
    }
    root.position.y = Math.sin(t * 0.5) * 8;

    particles.rotation.y = t * 0.03;
    renderer.render(scene, camera);
  }
  tick();

  window.addEventListener('resize', function() {
    var nW = options.width  || container.clientWidth;
    var nH = options.height || container.clientHeight;
    camera.aspect = nW / nH;
    camera.updateProjectionMatrix();
    renderer.setSize(nW, nH);
  });

  return { root:root, renderer:renderer, scene:scene, camera:camera };
}

/* ── HERO SCENE ─────────────────────────────────────────── */
function initHeroScene() {
  var canvas = document.getElementById('hero-three-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  var isMobile = window.innerWidth < 768;
  var W = window.innerWidth, H = window.innerHeight;
  var pCount = isMobile ? 150 : 300;

  var renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  canvas.appendChild(renderer.domElement);

  var scene  = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(60, W/H, 0.1, 2000);
  camera.position.z = 600;

  var positions  = new Float32Array(pCount * 3);
  var velocities = [];
  for (var i = 0; i < pCount; i++) {
    positions[i*3]   = (Math.random()-0.5) * W * 1.5;
    positions[i*3+1] = (Math.random()-0.5) * H * 1.5;
    positions[i*3+2] = (Math.random()-0.5) * 400;
    velocities.push({
      x: (Math.random()-0.5)*0.3,
      y: (Math.random()-0.5)*0.3,
    });
  }
  var pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  var pMat = new THREE.PointsMaterial({ color:0x0066FF, size:2, transparent:true, opacity:0.5 });
  var particleSystem = new THREE.Points(pGeo, pMat);
  scene.add(particleSystem);

  scene.add(new THREE.Mesh(
    new THREE.PlaneGeometry(W*0.8, H*0.8),
    new THREE.MeshBasicMaterial({ color:0x0066FF, transparent:true, opacity:0.025, side:THREE.DoubleSide })
  ));

  var mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', function(e) {
    mouseX = (e.clientX/W - 0.5);
    mouseY = (e.clientY/H - 0.5);
  });

  var t = 0;
  function heroTick() {
    requestAnimationFrame(heroTick);
    t += 0.003;

    var pos = pGeo.attributes.position.array;
    for (var i = 0; i < pCount; i++) {
      pos[i*3]   += velocities[i].x + mouseX * 0.5;
      pos[i*3+1] += velocities[i].y - mouseY * 0.5;
      if (pos[i*3]   >  W*0.75) pos[i*3]   = -W*0.75;
      if (pos[i*3]   < -W*0.75) pos[i*3]   =  W*0.75;
      if (pos[i*3+1] >  H*0.75) pos[i*3+1] = -H*0.75;
      if (pos[i*3+1] < -H*0.75) pos[i*3+1] =  H*0.75;
    }
    pGeo.attributes.position.needsUpdate = true;
    pMat.opacity = 0.4 + Math.sin(t)*0.1;

    camera.position.x += (mouseX * 30 - camera.position.x) * 0.03;
    camera.position.y += (-mouseY * 30 - camera.position.y) * 0.03;

    renderer.render(scene, camera);
  }
  heroTick();

  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
}

/* ── ORBITAL SCENE ──────────────────────────────────────── */
function initOrbitalScene() {
  var canvas = document.getElementById('orbit-canvas');
  if (!canvas || typeof THREE === 'undefined') return;
  if (window.innerWidth < 768) return;

  var W = canvas.parentElement.clientWidth || window.innerWidth;
  var H = canvas.parentElement.clientHeight || window.innerHeight;

  var renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  canvas.appendChild(renderer.domElement);

  var scene  = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(50, W/H, 0.1, 2000);
  camera.position.set(0, 0, 500);

  /* Center sphere */
  var centerGeo = new THREE.SphereGeometry(28, 32, 32);
  var centerMat = new THREE.MeshBasicMaterial({ color:0x0066FF, transparent:true, opacity:0.9 });
  var centerSphere = new THREE.Mesh(centerGeo, centerMat);
  scene.add(centerSphere);

  /* Center glow */
  var glowGeo = new THREE.SphereGeometry(42, 16, 16);
  var glowMat = new THREE.MeshBasicMaterial({ color:0x0044CC, transparent:true, opacity:0.12, side:THREE.BackSide });
  scene.add(new THREE.Mesh(glowGeo, glowMat));

  var labels = [
    'Lead Capture','Appointment Booking','Client Communication',
    'Internal Workflows','CRM Integration','AI Receptionist',
    'Reporting','Document Automation','Decision Systems','Custom AI'
  ];

  var satellites = [];
  var orbitRadii  = [110,140,165,130,150,120,145,160,135,155];
  var orbitSpeeds = [0.008,0.005,0.007,0.009,0.006,0.011,0.004,0.007,0.010,0.006];
  var orbitTilts  = [0,0.4,-0.3,0.6,-0.5,0.2,-0.4,0.7,-0.2,0.5];

  for (var i = 0; i < labels.length; i++) {
    var satGeo = new THREE.SphereGeometry(7, 12, 12);
    var satMat = new THREE.MeshBasicMaterial({ color:0x0066FF, transparent:true, opacity:0.75 });
    var sat = new THREE.Mesh(satGeo, satMat);

    var pivot = new THREE.Group();
    pivot.rotation.x = orbitTilts[i];
    pivot.rotation.z = (i / labels.length) * Math.PI * 0.5;
    scene.add(pivot);

    sat.position.x = orbitRadii[i];
    pivot.add(sat);

    /* Orbit ring */
    var ringGeo = new THREE.TorusGeometry(orbitRadii[i], 0.4, 6, 80);
    var ringMat = new THREE.MeshBasicMaterial({ color:0x0066FF, transparent:true, opacity:0.07 });
    var ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI/2;
    pivot.add(ring);

    /* Line from center to satellite */
    var lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0,0,0), new THREE.Vector3(orbitRadii[i],0,0)
    ]);
    var lineMat = new THREE.LineBasicMaterial({ color:0x0066FF, transparent:true, opacity:0.1 });
    pivot.add(new THREE.Line(lineGeo, lineMat));

    satellites.push({ mesh:sat, pivot:pivot, speed:orbitSpeeds[i], angle:(i/labels.length)*Math.PI*2 });
  }

  var targetRotX = 0, targetRotY = 0, curRotX = 0, curRotY = 0;
  document.addEventListener('mousemove', function(e) {
    targetRotX = -(e.clientY/window.innerHeight - 0.5) * 0.3;
    targetRotY =  (e.clientX/window.innerWidth  - 0.5) * 0.3;
  });

  var t = 0;
  function orbitTick() {
    requestAnimationFrame(orbitTick);
    t += 0.005;

    for (var i = 0; i < satellites.length; i++) {
      satellites[i].angle += satellites[i].speed;
      satellites[i].pivot.rotation.y = satellites[i].angle;
    }

    curRotX += (targetRotX - curRotX) * 0.04;
    curRotY += (targetRotY - curRotY) * 0.04;
    scene.rotation.x = curRotX;
    scene.rotation.y = curRotY;

    centerMat.opacity = 0.8 + Math.sin(t) * 0.1;
    renderer.render(scene, camera);
  }
  orbitTick();

  window.addEventListener('resize', function() {
    var nW = canvas.parentElement.clientWidth || window.innerWidth;
    var nH = canvas.parentElement.clientHeight;
    renderer.setSize(nW, nH || H);
    camera.aspect = nW / (nH || H);
    camera.updateProjectionMatrix();
  });
}

/* ── FINAL CTA SCENE ────────────────────────────────────── */
function initFinalCTAScene() {
  var canvas = document.getElementById('final-cta-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  var W = canvas.parentElement.clientWidth || window.innerWidth;
  var H = canvas.parentElement.clientHeight || window.innerHeight;

  var renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  canvas.appendChild(renderer.domElement);

  var scene  = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(40, W/H, 0.1, 2000);
  camera.position.set(0, 0, 420);

  var root = new THREE.Group();
  scene.add(root);

  var BLUE = 0x0066FF;
  root.add(new THREE.Mesh(
    new THREE.TorusGeometry(180, 0.7, 8, 140),
    new THREE.MeshBasicMaterial({ color:BLUE, transparent:true, opacity:0.06 })
  ));
  var ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(140, 0.5, 8, 100),
    new THREE.MeshBasicMaterial({ color:BLUE, transparent:true, opacity:0.05 })
  );
  ring2.rotation.x = Math.PI/3; root.add(ring2);

  var core = new THREE.Mesh(
    new THREE.OctahedronGeometry(50, 0),
    new THREE.MeshBasicMaterial({ color:BLUE, wireframe:true, transparent:true, opacity:0.12 })
  );
  root.add(core);

  var loader = new THREE.TextureLoader();
  loader.load('assets/logo.png', function(tex) {
    root.clear();
    var geo = new THREE.PlaneGeometry(340, 340);
    var mat = new THREE.MeshBasicMaterial({ map:tex, transparent:true, opacity:0.18, side:THREE.DoubleSide, depthWrite:false });
    root.add(new THREE.Mesh(geo, mat));
  });

  /* Particles */
  var pCount = 80;
  var pPos = new Float32Array(pCount * 3);
  for (var i = 0; i < pCount; i++) {
    var r = 200 + Math.random() * 150;
    var theta = Math.random() * Math.PI * 2;
    var phi   = Math.random() * Math.PI;
    pPos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
    pPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
    pPos[i*3+2] = r * Math.cos(phi);
  }
  var pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  var particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color:BLUE, size:1.2, transparent:true, opacity:0.25 }));
  scene.add(particles);

  var t = 0;
  function ctaTick() {
    requestAnimationFrame(ctaTick);
    t += 0.004;
    root.rotation.y += 0.002;
    root.position.y = Math.sin(t * 0.4) * 10;
    particles.rotation.y = t * 0.02;
    renderer.render(scene, camera);
  }
  ctaTick();

  window.addEventListener('resize', function() {
    var nW = canvas.parentElement.clientWidth || window.innerWidth;
    var nH = canvas.parentElement.clientHeight;
    camera.aspect = nW / (nH || H);
    camera.updateProjectionMatrix();
    renderer.setSize(nW, nH || H);
  });
}
