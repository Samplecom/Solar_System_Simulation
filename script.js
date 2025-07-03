// Toggle visibility of the planet control sidebar
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.style.display = sidebar.style.display === 'block' ? 'none' : 'block';
}

if (typeof THREE === 'undefined') {
  alert('Three.js failed to load.');
} else {
  // Scene setup
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000011);

  // Camera setup
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 40;

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("canvas-container").appendChild(renderer.domElement);

  // Add stars to background
  const starsGeometry = new THREE.BufferGeometry();
  const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff });
  const starVertices = [];
  for (let i = 0; i < 10000; i++) {
    starVertices.push((Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 2000);
  }
  starsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starVertices, 3));
  const starField = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(starField);

  // Sun (light source)
  const light = new THREE.PointLight(0xffffff, 2);
  light.position.set(0, 0, 0);
  scene.add(light);

  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(2, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xffcc00 })
  );
  scene.add(sun);

  // Planet data and initialization
  const planetData = [
    { name: "Mercury", color: 0xaaaaaa, size: 0.3, distance: 4, description: "Closest to Sun" },
    { name: "Venus", color: 0xff8800, size: 0.5, distance: 6, description: "Hottest planet" },
    { name: "Earth", color: 0x2e86de, size: 0.5, distance: 8, description: "Our home planet" },
    { name: "Mars", color: 0xff0000, size: 0.4, distance: 10, description: "The Red Planet" },
    { name: "Jupiter", color: 0xffcc99, size: 1.2, distance: 13, description: "Largest planet" },
    { name: "Saturn", color: 0xffff66, size: 1.1, distance: 16, description: "With rings" },
    { name: "Uranus", color: 0x66ccff, size: 0.9, distance: 19, description: "Ice giant" },
    { name: "Neptune", color: 0x3333ff, size: 0.9, distance: 22, description: "Farthest planet" }
  ];

  const planets = [];
  const angles = {};
  const speeds = {};
  const controlsDiv = document.getElementById("planet-controls");

  // Create each planet and corresponding control
  planetData.forEach((planet, index) => {
    const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: planet.color });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    planets.push(mesh);
    angles[planet.name] = Math.random() * Math.PI * 2;
    speeds[planet.name] = 0.01 + index * 0.001;

    const card = document.createElement("div");
    card.className = "planet-card";
    card.innerHTML = `
      <h3>${planet.name}</h3>
      <p>${planet.description}</p>
      <label>Speed: <span id="${planet.name}-value">${(speeds[planet.name] * 100).toFixed(2)}x</span></label>
      <input type="range" min="0.001" max="0.05" step="0.001" value="${speeds[planet.name]}" id="${planet.name}-slider">
    `;
    controlsDiv.appendChild(card);

    document.getElementById(`${planet.name}-slider`).addEventListener("input", (e) => {
      speeds[planet.name] = parseFloat(e.target.value);
      document.getElementById(`${planet.name}-value`).textContent = (speeds[planet.name] * 100).toFixed(2) + "x";
    });
  });

  // Pause/resume button toggle
  let paused = false;
  const pauseBtn = document.getElementById("pauseBtn");
  pauseBtn.onclick = () => {
    paused = !paused;
    pauseBtn.textContent = paused ? "Resume" : "Pause";
  };

  // Reset all speeds
  document.getElementById("resetBtn").onclick = () => {
    planetData.forEach((planet, index) => {
      speeds[planet.name] = 0.01 + index * 0.001;
      document.getElementById(`${planet.name}-slider`).value = speeds[planet.name];
      document.getElementById(`${planet.name}-value`).textContent = (speeds[planet.name] * 100).toFixed(2) + "x";
    });
  };

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    if (!paused) {
      planetData.forEach((planet, i) => {
        angles[planet.name] += speeds[planet.name];
        const angle = angles[planet.name];
        planets[i].position.set(
          planet.distance * Math.cos(angle),
          0,
          planet.distance * Math.sin(angle)
        );
        planets[i].rotation.y += 0.01;
      });
    }
    renderer.render(scene, camera);
  }
  animate();

  // Handle window resizing
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}