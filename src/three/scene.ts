import * as THREE from "three";
import { gsap } from "gsap";
import { compositionFor } from "./composition";

export type CinemaPhase = "loading" | "side" | "orbit" | "follow" | "impact" | "complete" | "fallback";

export type Cinema = {
  replay: () => void;
  skip: () => void;
  dispose: () => void;
};
export function createCinema(
  canvas: HTMLCanvasElement,
  reduced: boolean,
  onPhase: (phase: CinemaPhase) => void,
  onFinish: () => void,
): Cinema {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setClearColor(0x090909, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x090909, 0.016);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  scene.add(new THREE.HemisphereLight(0xf5eee5, 0x151519, 0.7));
  const key = new THREE.DirectionalLight(0xfaf2e7, 2.1);
  key.position.set(-4, 7, 9);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xb6c6dd, 1.3);
  rim.position.set(5, 1, 4);
  scene.add(rim);
  const red = new THREE.PointLight(0xf13c29, 16, 14);
  red.position.set(-4, -1, 3);
  scene.add(red);
  const board = new THREE.Group();
  scene.add(board);

  // Procedural sporting equipment: standard scoring geometry, original texture.
  const textureCanvas = document.createElement("canvas");
  textureCanvas.width = 1024;
  textureCanvas.height = 1024;
  const ctx = textureCanvas.getContext("2d")!;
  const c = 512,
    scale = 435;
  ctx.fillStyle = "#111214";
  ctx.fillRect(0, 0, 1024, 1024);
  const nums = [
    20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5,
  ];
  for (let i = 0; i < 20; i++) {
    const a = -Math.PI / 2 - Math.PI / 20 + (i * Math.PI) / 10,
      b = a + Math.PI / 10;
    const bands = [
      [0.09, 0.53],
      [0.53, 0.58],
      [0.58, 0.88],
      [0.88, 0.94],
    ];
    bands.forEach(([inner, outer], j) => {
      ctx.beginPath();
      ctx.arc(c, c, outer * scale, a, b);
      ctx.arc(c, c, inner * scale, b, a, true);
      ctx.closePath();
      ctx.fillStyle =
        j % 2 === 0
          ? i % 2
            ? "#c6c0ae"
            : "#252624"
          : i % 2
            ? "#465d51"
            : "#a92f26";
      ctx.fill();
      ctx.strokeStyle = "#77766f";
      ctx.lineWidth = 1.6;
      ctx.stroke();
    });
    const mid = a + Math.PI / 20;
    ctx.save();
    ctx.translate(c + Math.cos(mid) * 472, c + Math.sin(mid) * 472);
    ctx.rotate(mid + Math.PI / 2);
    ctx.fillStyle = "#d1cfc4";
    ctx.font = "500 35px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(nums[i]), 0, 0);
    ctx.restore();
  }
  ctx.beginPath();
  ctx.arc(c, c, 39, 0, Math.PI * 2);
  ctx.fillStyle = "#435c4a";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(c, c, 16, 0, Math.PI * 2);
  ctx.fillStyle = "#c13529";
  ctx.fill();
  // Apply deterministic sisal grain in one upload, avoiding 36,000 canvas draws.
  const grain = ctx.getImageData(0, 0, 1024, 1024);
  let seed = 731;
  for (let i = 0; i < 36000; i++) {
    seed = (seed * 16807) % 2147483647;
    const x = seed % 1024;
    seed = (seed * 16807) % 2147483647;
    const y = seed % 1024;
    const alpha = i % 2 ? 0.12 : 0.07;
    const color = i % 2 ? 0 : 255;
    for (let row = y; row < Math.min(y + 2, 1024); row++) {
      const offset = (row * 1024 + x) * 4;
      for (let channel = 0; channel < 3; channel++) {
        grain.data[offset + channel] = Math.round(
          grain.data[offset + channel] * (1 - alpha) + color * alpha,
        );
      }
    }
  }
  ctx.putImageData(grain, 0, 0);
  const map = new THREE.CanvasTexture(textureCanvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  const sideMat = new THREE.MeshStandardMaterial({
    color: 0x171717,
    roughness: 0.85,
    metalness: 0.2,
  });
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(2.8, 2.8, 0.21, 96),
    sideMat,
  );
  body.rotation.x = Math.PI / 2;
  body.position.z = -0.12;
  board.add(body);
  const face = new THREE.Mesh(
    new THREE.CircleGeometry(2.79, 96),
    new THREE.MeshStandardMaterial({ map, roughness: 0.94, metalness: 0.05 }),
  );
  board.add(face);
  const wireMat = new THREE.MeshStandardMaterial({
    color: 0xa4a5a1,
    metalness: 0.85,
    roughness: 0.4,
  });
  [2.79, 2.24, 2.11, 1.39, 1.27, 0.213, 0.087].forEach((radius) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.007, 4, 96),
      wireMat,
    );
    ring.position.z = 0.012;
    board.add(ring);
  });

  const dart = new THREE.Group();
  scene.add(dart);
  const steel = new THREE.MeshStandardMaterial({
    color: 0xb5b9be,
    metalness: 0.88,
    roughness: 0.28,
  });
  const darkSteel = new THREE.MeshStandardMaterial({
    color: 0x555b61,
    metalness: 0.8,
    roughness: 0.35,
  });
  // Baked CubeUV lighting: no expensive PMREM passes on visitors' GPUs.
  const environment = new THREE.TextureLoader().load(
    import.meta.env.BASE_URL + "studio-reflections.webp",
    (texture) => {
      if (disposed) {
        texture.dispose();
        return;
      }
      steel.envMap = texture;
      darkSteel.envMap = texture;
      steel.needsUpdate = true;
      darkSteel.needsUpdate = true;
      void prepare();
    },
    undefined,
    () => {
      void prepare();
    },
  );
  environment.mapping = THREE.CubeUVReflectionMapping;
  environment.colorSpace = THREE.LinearSRGBColorSpace;
  environment.flipY = false;
  environment.generateMipmaps = false;
  environment.minFilter = THREE.LinearFilter;
  environment.magFilter = THREE.LinearFilter;
  steel.envMapIntensity = 0.9;
  darkSteel.envMapIntensity = 0.75;
  const cylinder = (
    r1: number,
    r2: number,
    length: number,
    z: number,
    mat: THREE.Material,
  ) => {
    const m = new THREE.Mesh(
      new THREE.CylinderGeometry(r1, r2, length, 20),
      mat,
    );
    m.rotation.x = Math.PI / 2;
    m.position.z = z;
    dart.add(m);
    return m;
  };
  cylinder(0.047, 0, 0.5, 0.25, steel);
  cylinder(0.095, 0.047, 0.16, 0.58, steel);
  cylinder(0.095, 0.095, 0.62, 0.97, steel);
  for (let i = 0; i < 13; i++)
    cylinder(0.101, 0.101, 0.018, 0.7 + i * 0.043, darkSteel);
  cylinder(0.045, 0.07, 0.15, 1.35, steel);
  cylinder(0.033, 0.033, 0.65, 1.74, darkSteel);
  const flightShape = new THREE.Shape();
  flightShape.moveTo(0, 1.7);
  flightShape.lineTo(0.39, 1.99);
  flightShape.lineTo(0.34, 2.5);
  flightShape.lineTo(0.03, 2.28);
  flightShape.closePath();
  const geom = new THREE.ShapeGeometry(flightShape);
  // Shape xy becomes xz, creating two intersecting folded flights.
  geom.rotateX(Math.PI / 2);
  const flightMat = new THREE.MeshStandardMaterial({
    color: 0xec3427,
    metalness: 0.3,
    roughness: 0.4,
    side: THREE.DoubleSide,
  });
  for (let i = 0; i < 4; i++) {
    const fin = new THREE.Mesh(geom, flightMat);
    fin.rotation.z = (i * Math.PI) / 2;
    dart.add(fin);
  }
  // The shape above maps local y into +z; four fins share one geometry.
  dart.rotation.z = 0.4;
  let composition = compositionFor(1440, 900);
  let visible = true,
    disposed = false,
    failed = false,
    settled = false,
    ready = false,
    pendingSkip = false;
  let timeline: gsap.core.Timeline | undefined;
  let throwCount = 0;
  let sector = Math.floor(Math.random() * 20);
  const landing = new THREE.Vector2();
  const flightDirection = new THREE.Vector3();
  const dartAxis = new THREE.Vector3(0, 0, -1);
  const dartRoll = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 0, 1), 0.4,
  );
  const state = {
    z: 20,
    angle: -Math.PI / 2,
    radius: 8,
    targetZ: 15,
    blend: 0,
  };
  const target = new THREE.Vector3(),
    flightCamera = new THREE.Vector3(),
    finalCamera = new THREE.Vector3(),
    finalTarget = new THREE.Vector3();
  async function prepare() {
    try {
      await renderer.compileAsync(scene, camera);
      if (disposed || failed) return;
      ready = true;
      if (pendingSkip || reduced) end();
      else replay();
    } catch {
      if (disposed || failed) return;
      failed = true;
      onPhase("fallback");
      onFinish();
    }
  }
  function resize() {
    const { width, height } = canvas.getBoundingClientRect();
    if (width === 0 || height === 0) return;
    composition = compositionFor(width, height);
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, composition.dpr),
    );
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.fov = composition.fov;
    camera.updateProjectionMatrix();
    render();
  }
  function render() {
    if (!ready || disposed || failed || !visible || document.hidden) return;
    // Every throw is a straight trajectory ending with the tip on the face.
    const travel = 1 - state.z / 23;
    dart.position.set(landing.x * travel, landing.y * travel, state.z);
    flightDirection.set(landing.x, landing.y, -23).normalize();
    dart.quaternion.setFromUnitVectors(dartAxis, flightDirection).multiply(dartRoll);
    const nearZ = state.targetZ;
    flightCamera.set(
      Math.sin(state.angle) * state.radius,
      0.45,
      nearZ + Math.cos(state.angle) * state.radius,
    );
    target.set(
      0,
      0,
      Math.max(
        0,
        state.targetZ - (3 * (state.angle + Math.PI / 2)) / (Math.PI / 2),
      ),
    );
    // Follow the selected trajectory; keep the contact point framed on phones.
    flightCamera.x += landing.x * (1 - nearZ / 23);
    flightCamera.y += landing.y * (1 - nearZ / 23);
    const lookTravel = 1 - target.z / 23;
    target.x = landing.x * lookTravel;
    target.y = landing.y * lookTravel;
    finalCamera.fromArray(composition.camera);
    finalTarget.fromArray(composition.target);
    camera.position.copy(flightCamera).lerp(finalCamera, state.blend);
    target.lerp(finalTarget, state.blend);
    camera.lookAt(target);
    renderer.render(scene, camera);
  }
  function end() {
    settled = true;
    state.z = 0;
    state.blend = 1;
    state.angle = 0;
    onPhase("complete");
    onFinish();
    render();
  }
  function replay() {
    if (!ready || failed || disposed) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      end();
      return;
    }
    settled = false;
    timeline?.kill();
    if (throwCount++ === 0) {
      landing.set(0, 0);
    } else {
      // Move at least five wedges each time, away from wires and outer edge.
      sector = (sector + 5 + Math.floor(Math.random() * 11)) % 20;
      const angle = Math.PI / 2 - sector * Math.PI / 10;
      const radius = throwCount % 2 === 0 ? 1.33 : 1.78;
      landing.set(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
    Object.assign(state, {
      z: composition.entryZ,
      angle: -Math.PI / 2,
      radius: composition.sideRadius,
      targetZ: composition.sideTargetZ,
      blend: 0,
    });
    onPhase("side");
    timeline = gsap.timeline({ onUpdate: render, onComplete: end });
    const rate = composition.rate;
    timeline
      .to(state, { z: 15, duration: composition.sideDuration, ease: "power2.out" })
      .call(() => onPhase("orbit"))
      .to(state, {
        angle: 0,
        radius: composition.followRadius,
        z: 11,
        targetZ: 11,
        duration: 1.05 * rate,
        ease: "power2.inOut",
      })
      .call(() => onPhase("follow"))
      .to(state, { z: 0, targetZ: 0, duration: 0.72 * rate, ease: "power2.in" })
      .call(() => onPhase("impact"))
      .to(state, { blend: 1, duration: 1.15, ease: "power3.inOut" }, "+=.08");
    render();
    if (!visible || document.hidden) timeline.pause();
  }
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) {
      if (!document.hidden && !settled) timeline?.resume();
      render();
    } else timeline?.pause();
  });
  observer.observe(canvas);
  const visibility = () => {
    if (document.hidden) timeline?.pause();
    else if (visible) {
      if (!settled) timeline?.resume();
      render();
    }
  };
  const lost = (event: Event) => {
    event.preventDefault();
    failed = true;
    timeline?.kill();
    onPhase("fallback");
    onFinish();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  document.addEventListener("visibilitychange", visibility);
  canvas.addEventListener("webglcontextlost", lost);
  resize();

  return {
    replay,
    skip() {
      timeline?.kill();
      if (!ready) {
        pendingSkip = true;
        onPhase("fallback");
        onFinish();
      } else end();
    },
    dispose() {
      disposed = true;
      timeline?.kill();
      observer.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      canvas.removeEventListener("webglcontextlost", lost);
      const geometries = new Set<THREE.BufferGeometry>(),
        materials = new Set<THREE.Material>();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          geometries.add(obj.geometry);
          (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach(
            (m) => materials.add(m),
          );
        }
      });
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      map.dispose();
      environment.dispose();
      renderer.dispose();
    },
  };
}
