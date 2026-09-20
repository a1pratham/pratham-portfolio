import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  EdgesGeometry,
  Float32BufferAttribute,
  Group,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  OctahedronGeometry,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  WebGLRenderer,
} from 'three';

/** Reads a colour from the CSS design tokens so the scene follows the site palette. */
const tokenColor = (name, fallback) => new Color(
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback,
);

function createParticleField(count, color) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const radius = 2.9 + Math.random() * 2.3;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.cos(phi) * 0.55;
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  const material = new PointsMaterial({
    color,
    size: 0.035,
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  return new Points(geometry, material);
}

function createWireframe(sourceGeometry, color, opacity) {
  const geometry = new EdgesGeometry(sourceGeometry);
  sourceGeometry.dispose();
  return new LineSegments(geometry, new LineBasicMaterial({ color, transparent: true, opacity }));
}

/**
 * Decorative hero scene: a wireframe polyhedron with a counter-rotating core
 * and a particle halo. Throws if WebGL is unavailable.
 */
export default function createHeroScene(canvas, { lowPower = false } = {}) {
  const renderer = new WebGLRenderer({
    canvas, antialias: !lowPower, alpha: true, powerPreference: 'low-power',
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPower ? 1.25 : 2));

  const scene = new Scene();
  const camera = new PerspectiveCamera(45, 1, 0.1, 50);
  camera.position.z = 9;

  const accent = tokenColor('--accent', '#ff6f61');
  const accent2 = tokenColor('--accent-2', '#ffb86b');
  const shell = createWireframe(new IcosahedronGeometry(2.1, 1), accent, 0.55);
  const core = createWireframe(new OctahedronGeometry(1.05, 0), accent2, 0.9);
  const particles = createParticleField(lowPower ? 600 : 1500, accent);
  const group = new Group();
  group.add(shell, core, particles);
  scene.add(group);

  const pointer = { x: 0, y: 0 };
  const pointerTarget = { x: 0, y: 0 };
  const layout = { x: 0, y: 0, scale: 1 };
  let scroll = 0;
  let elapsed = 0;
  let last = 0;
  let frame = 0;

  function render(now) {
    const delta = Math.min((now - last) / 1000, 0.05);
    last = now;
    elapsed += delta;
    const ease = Math.min(1, delta * 3);
    pointer.x += (pointerTarget.x - pointer.x) * ease;
    pointer.y += (pointerTarget.y - pointer.y) * ease;

    shell.rotation.y += delta * 0.18;
    shell.rotation.x = Math.sin(elapsed * 0.2) * 0.25;
    core.rotation.y -= delta * 0.4;
    core.rotation.x += delta * 0.22;
    particles.rotation.y += delta * 0.03;

    group.rotation.y = pointer.x * 0.35;
    group.rotation.x = pointer.y * 0.25 + scroll * 0.6;
    group.position.set(layout.x, layout.y + scroll * 1.5, -scroll * 2);
    group.scale.setScalar(layout.scale);
    renderer.render(scene, camera);
  }

  function loop(now) {
    render(now);
    frame = requestAnimationFrame(loop);
  }

  return {
    resize(width, height) {
      if (!width || !height) return;
      const aspect = width / height;
      renderer.setSize(width, height, false);
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      const wide = aspect >= 1.1;
      layout.x = wide ? MathUtils.clamp((aspect - 1.1) * 5.5, 0, 3.6) : 0;
      layout.y = wide ? 0 : 2.3;
      layout.scale = wide ? 1 : MathUtils.clamp(aspect * 1.35, 0.5, 1);
      render(performance.now());
    },
    setPointer(x, y) {
      pointerTarget.x = x;
      pointerTarget.y = y;
    },
    setScroll(progress) {
      scroll = progress;
    },
    setActive(active) {
      if (active && !frame) {
        last = performance.now();
        frame = requestAnimationFrame(loop);
      } else if (!active && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    },
    dispose() {
      cancelAnimationFrame(frame);
      frame = 0;
      [shell, core, particles].forEach((object) => {
        object.geometry.dispose();
        object.material.dispose();
      });
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
