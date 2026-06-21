import * as THREE from "three";
import "./styles.css";

const manuscripts = [
  {
    title: "3つの山",
    body: "ここ最近、週末に3つの山に登りました。高尾山、宝登山（ほどさん）、そして大山です。高尾山は観光地としても有名な山で、名前を聞いたことがある人も多いと思います。宝登山は、長瀞（ながとろ）にある山で、登山初心者でも登りやすい山として知られています。長瀞といえば岩畳も有名ですね。そして大山は、神奈川県にある標高1,252mの山で、多くの登山客で賑わっていました。",
  },
  {
    title: "登りやすい山",
    body: "高尾山と宝登山は、道がよく整備されていて、初心者の自分でも、森の空気を楽しみながら気持ちよく登れました。",
  },
  {
    title: "大山の試練",
    body: "高尾山の次は大山、という情報がネットにあって、それを信じて登ったのですが、これが大変でした。\nゴツゴツした岩山で、急な登りが延々と続きます。翌日には、見事にふくらはぎが筋肉痛になりました。下りのダメージが特に大きかったですね。",
  },
  {
    title: "登山中の本音",
    body: "登っている最中の頭の中は、こんな感じです。\n「疲れた…」「足が痛い…」「もう帰りたい…」「ぜんぜん楽しくない…」\nなぜわざわざ休みの日に辛い思いをしなければいけないのか、人間の営みとは大層不思議なものであります。",
  },
  {
    title: "山頂の達成感",
    body: "それでもなんとか登り切るその瞬間、山頂で、苦しさが一気に吹き飛ぶような達成感が待っているのです。これは、日常では決して味わえない感覚でした。\n不確実性の高い社会では今自分がやっていることが正しいのかどうか、なかなか判断がつかないのですが、登山では目の前の山を登るというシンプルな行為が、目に見える形で結果として返ってくるというのも、登山の魅力のひとつでしょう。",
  },
  {
    title: "学び",
    body: "最近は、AIのおかげで何でも効率よくこなせるようになりました。\nでも、効率ばかりを追い求めていると、どこかで疲れてしまう気がします。\nだからこそ、たまには自然とふれ合って、あえて不便さを味わうという、その「遠回り」の経験が、心の健康にとって大切なのではないかと思います。\n\nみなさんもよかったら週末、近所の山に登ってみてください。\n以上です。ありがとうございました。",
  },
];

const slideImages = {
  landscape: new URL("../images/web/wide-landscape-view.jpg", import.meta.url)
    .href,
  forest: new URL("../images/web/broad-forest-road.jpg", import.meta.url).href,
  hikers: new URL(
    "../images/web/group-of-hikers-ascending-a-steep.jpg",
    import.meta.url,
  ).href,
};

const slides = [
  {
    kicker: "MORNING TALK",
    title: "最近、登山にハマっています。",
    body: "おはようございます。azukiazusa です。\n今日は、最近登山にハマっているという話をしたいと思います。",
    image: slideImages.landscape,
  },
  {
    kicker: "THREE PEAKS",
    ...manuscripts[0],
    image: slideImages.landscape,
  },
  {
    kicker: "TAKAO & HODOSAN",
    ...manuscripts[1],
    image: slideImages.forest,
  },
  {
    kicker: "THE CHALLENGE",
    ...manuscripts[2],
    image: slideImages.hikers,
  },
  { kicker: "HONEST THOUGHTS", ...manuscripts[3] },
  {
    kicker: "AT THE SUMMIT",
    ...manuscripts[4],
    image: slideImages.landscape,
  },
  {
    kicker: "THE TAKEAWAY",
    ...manuscripts[5],
    image: slideImages.forest,
  },
];

const ui = Object.fromEntries(
  [
    "hud",
    "phase-icon",
    "phase-label",
    "star-count",
    "timer",
    "life-count",
    "sound-toggle",
    "crosshair",
    "interaction",
    "interaction-label",
    "toast",
    "start-screen",
    "start-button",
    "manuscript-modal",
    "manuscript-number",
    "manuscript-title",
    "manuscript-body",
    "close-manuscript",
    "end-screen",
    "end-eyebrow",
    "end-title",
    "end-message",
    "end-stats",
    "retry-button",
    "slides",
    "slide-stage",
    "prev-slide",
    "next-slide",
    "slide-counter",
    "replay-button",
  ].map((id) => [id, document.getElementById(id)]),
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#game"),
  antialias: true,
  powerPreference: "high-performance",
});
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.35));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa9d9db);
scene.fog = new THREE.Fog(0xa9d9db, 50, 120);
const camera = new THREE.PerspectiveCamera(
  55,
  innerWidth / innerHeight,
  0.1,
  250,
);
const clock = new THREE.Clock();
const world = new THREE.Group();
scene.add(world);

const skyLight = new THREE.HemisphereLight(0xdff5f1, 0x465e34, 2.5);
scene.add(skyLight);
const sun = new THREE.DirectionalLight(0xfff0c7, 3.3);
sun.position.set(-30, 50, 20);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
sun.shadow.camera.left = -55;
sun.shadow.camera.right = 55;
sun.shadow.camera.top = 55;
sun.shadow.camera.bottom = -55;
scene.add(sun);

const mat = (color, roughness = 0.9) =>
  new THREE.MeshStandardMaterial({ color, roughness, flatShading: true });
const terrainMat = mat(0x4d8151);
const trailMat = mat(0xbfa777);
trailMat.side = THREE.DoubleSide;
const trunkMat = mat(0x6e4d31);
const rockMat = mat(0x67706a);

function terrainHeight(x, z) {
  const ridge = Math.max(0, 1 - Math.hypot(x - 7, z + 10) / 62) * 10;
  return ridge + Math.sin(x * 0.15) * 0.55 + Math.cos(z * 0.13) * 0.42 - 5.5;
}

function createTerrain() {
  const geo = new THREE.PlaneGeometry(125, 125, 70, 70);
  geo.rotateX(-Math.PI / 2);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++)
    p.setY(i, terrainHeight(p.getX(i), p.getZ(i)));
  geo.computeVertexNormals();
  const ground = new THREE.Mesh(geo, terrainMat);
  ground.receiveShadow = true;
  world.add(ground);
  const water = new THREE.Mesh(
    new THREE.CircleGeometry(110, 64),
    new THREE.MeshStandardMaterial({
      color: 0x75b9bc,
      roughness: 0.25,
      metalness: 0.05,
      transparent: true,
      opacity: 0.88,
    }),
  );
  water.rotation.x = -Math.PI / 2;
  water.position.y = -5.9;
  world.add(water);

  const pathPoints = [
    new THREE.Vector3(-20, 0, 20),
    new THREE.Vector3(-5, 0, 14),
    new THREE.Vector3(14, 0, 19),
    new THREE.Vector3(26, 0, 7),
    new THREE.Vector3(18, 0, -7),
    new THREE.Vector3(0, 0, -12),
    new THREE.Vector3(-18, 0, -5),
    new THREE.Vector3(-27, 0, -19),
    new THREE.Vector3(-7, 0, -29),
    new THREE.Vector3(13, 0, -23),
  ];
  pathPoints.forEach((v) => (v.y = terrainHeight(v.x, v.z) + 0.08));
  const curve = new THREE.CatmullRomCurve3(pathPoints);
  const trailPositions = [],
    trailIndices = [],
    segments = 180,
    halfWidth = 1.45;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments,
      p = curve.getPoint(t),
      tangent = curve.getTangent(t).setY(0).normalize(),
      side = new THREE.Vector3(-tangent.z, 0, tangent.x);
    for (const direction of [-1, 1]) {
      const edge = p.clone().addScaledVector(side, halfWidth * direction);
      edge.y = terrainHeight(edge.x, edge.z) + 0.09;
      trailPositions.push(edge.x, edge.y, edge.z);
    }
    if (i < segments) {
      const a = i * 2;
      trailIndices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  }
  const trailGeo = new THREE.BufferGeometry();
  trailGeo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(trailPositions, 3),
  );
  trailGeo.setIndex(trailIndices);
  trailGeo.computeVertexNormals();
  const trail = new THREE.Mesh(trailGeo, trailMat);
  trail.receiveShadow = true;
  world.add(trail);
}

function createTree(x, z, s = 1) {
  const y = terrainHeight(x, z);
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.scale.setScalar(s);
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.3, 2, 6),
    trunkMat,
  );
  trunk.position.y = 1;
  trunk.castShadow = true;
  g.add(trunk);
  const crown1 = new THREE.Mesh(
    new THREE.ConeGeometry(1.25, 2.7, 7),
    mat(0x24583b),
  );
  crown1.position.y = 2.6;
  g.add(crown1);
  const crown2 = new THREE.Mesh(
    new THREE.ConeGeometry(0.9, 2.1, 7),
    mat(0x32704a),
  );
  crown2.position.y = 3.75;
  g.add(crown2);
  world.add(g);
}

function createScenery() {
  const rng = (n) => {
    const x = Math.sin(n * 999) * 43758.5453;
    return x - Math.floor(x);
  };
  for (let i = 0; i < 58; i++) {
    const a = rng(i) * Math.PI * 2,
      r = 14 + rng(i + 1) * 44,
      x = Math.cos(a) * r,
      z = Math.sin(a) * r;
    createTree(x, z, 0.65 + rng(i + 2) * 0.85);
  }
  for (let i = 0; i < 22; i++) {
    const a = rng(i + 200) * Math.PI * 2,
      r = 12 + rng(i + 201) * 42,
      x = Math.cos(a) * r,
      z = Math.sin(a) * r,
      y = terrainHeight(x, z);
    const rock = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.35 + rng(i + 202) * 0.7, 0),
      rockMat,
    );
    rock.position.set(x, y + 0.2, z);
    rock.rotation.set(rng(i), rng(i + 1), rng(i + 2));
    world.add(rock);
  }
  const peakMat = mat(0x6b8a70);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const peak = new THREE.Mesh(
      new THREE.ConeGeometry(18 + (i % 3) * 4, 28 + (i % 2) * 6, 6),
      peakMat,
    );
    peak.position.set(Math.cos(a) * 85, -1, Math.sin(a) * 85);
    peak.rotation.y = a;
    world.add(peak);
  }
}

function createHiker() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.47, 0.9, 4, 8),
    mat(0xe96932),
  );
  body.position.y = 1.15;
  body.castShadow = true;
  g.add(body);
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.34, 12, 8),
    mat(0xe8b789),
  );
  head.position.y = 2.05;
  head.castShadow = true;
  g.add(head);
  const hat = new THREE.Mesh(
    new THREE.CylinderGeometry(0.42, 0.58, 0.16, 12),
    mat(0xf3c84b),
  );
  hat.position.y = 2.35;
  hat.castShadow = true;
  g.add(hat);
  const pack = new THREE.Mesh(
    new THREE.BoxGeometry(0.76, 0.9, 0.38),
    mat(0x173f30),
  );
  pack.position.set(0, 1.25, 0.47);
  pack.castShadow = true;
  g.add(pack);
  for (const x of [-0.24, 0.24]) {
    const leg = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.14, 0.55, 3, 6),
      mat(0x273a35),
    );
    leg.position.set(x, 0.35, 0);
    leg.castShadow = true;
    leg.userData.leg = true;
    g.add(leg);
  }
  g.position.set(-20, terrainHeight(-20, 20) + 0.1, 20);
  world.add(g);
  return g;
}

createTerrain();
createScenery();

const BOUNDARY = 50;
let boundaryWarned = false;
(function createBoundary() {
  // プレイ範囲を囲む半透明の霧の壁。地面から立ち上がって見えるよう
  // 底を十分下げ、内側から見えるよう BackSide にする
  const wall = new THREE.Mesh(
    new THREE.CylinderGeometry(BOUNDARY, BOUNDARY, 22, 96, 1, true),
    new THREE.MeshBasicMaterial({
      color: 0xdfe8ea,
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide,
      depthWrite: false,
    }),
  );
  wall.position.y = 4;
  world.add(wall);
})();

const player = createHiker();
const safePosition = player.position.clone();

const fireflyPositions = [];
for (let i = 0; i < 42; i++) {
  const angle = i * 2.399,
    radius = 7 + (i % 9) * 4.2,
    x = Math.cos(angle) * radius,
    z = Math.sin(angle) * radius;
  fireflyPositions.push(x, terrainHeight(x, z) + 1.2 + (i % 5) * 0.55, z);
}
const fireflyGeometry = new THREE.BufferGeometry();
fireflyGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(fireflyPositions, 3),
);
const fireflyMaterial = new THREE.PointsMaterial({
  color: 0xffed8a,
  size: 0.18,
  transparent: true,
  opacity: 0,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});
const fireflies = new THREE.Points(fireflyGeometry, fireflyMaterial);
world.add(fireflies);
const pickupPositions = [
  [-7, 15],
  [15, 18],
  [26, 5],
  [14, -8],
  [-16, -6],
  [-6, -29],
];
const pickupObjects = [];
function createPickups() {
  pickupPositions.forEach(([x, z], i) => {
    const g = new THREE.Group();
    g.position.set(x, terrainHeight(x, z) + 1.35, z);
    g.userData = { index: i, collected: false, baseY: g.position.y };
    const star = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.5, 0),
      new THREE.MeshStandardMaterial({
        color: 0xffcf3e,
        emissive: 0x9c5b00,
        emissiveIntensity: 1.2,
        roughness: 0.35,
      }),
    );
    star.rotation.z = Math.PI / 4;
    star.castShadow = true;
    g.add(star);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.78, 0.045, 6, 32),
      mat(0xffe790),
    );
    ring.rotation.x = Math.PI / 2;
    g.add(ring);
    world.add(g);
    pickupObjects.push(g);
  });
}
createPickups();

const hazards = [];
[
  [4, 7, 1],
  [23, -4, -1],
  [-20, -17, 1],
].forEach(([x, z, dir], i) => {
  const mesh = new THREE.Mesh(
    new THREE.DodecahedronGeometry(1.05 + i * 0.14, 1),
    mat(0x515c58),
  );
  world.add(mesh);
  hazards.push({
    mesh,
    origin: new THREE.Vector3(x, 0, z),
    axis: i % 2 ? "z" : "x",
    dir,
    phase: i * 2.1,
    speed: 5 + i * 0.6,
  });
});

const fogZones = [];
[
  [2, 4, 11],
  [-12, -20, 9],
].forEach(([x, z, radius]) => {
  const group = new THREE.Group();
  const cy = terrainHeight(x, z);
  group.position.set(x, cy, z);
  const puffs = [];
  const count = 26;
  for (let i = 0; i < count; i++) {
    // 中心ほど密・縁ほど疎。外周は半径の1.1倍まではみ出させて輪郭をぼかす
    const frac = Math.pow((i + 0.5) / count, 0.78);
    const r = frac * radius * 1.1;
    const a = i * 2.399;
    const edge = 1 - frac; // 1=中心, 0=縁
    const s = 2 + edge * 3.2 + ((i * 3) % 4) * 0.5;
    const puff = new THREE.Mesh(
      new THREE.IcosahedronGeometry(s, 1),
      new THREE.MeshStandardMaterial({
        color: 0xeef4f6,
        transparent: true,
        opacity: 0.1 + edge * 0.22, // 縁ほど薄く
        depthWrite: false,
        roughness: 1,
      }),
    );
    puff.position.set(Math.cos(a) * r, 1.4 + (i % 3) * 0.7, Math.sin(a) * r);
    puff.userData = {
      spin: 0.08 + (i % 4) * 0.04,
      baseY: puff.position.y,
      phase: i,
    };
    group.add(puff);
    puffs.push(puff);
  }
  world.add(group);
  fogZones.push({
    center: new THREE.Vector3(x, cy, z),
    radius,
    puffs,
    inside: false,
  });
});
let fogVeil = 0;
const fogVeilColor = new THREE.Color(0xc6d2d6);

let state = "start",
  lives = 3,
  timeLeft = 180,
  collected = new Set(),
  nearby = null,
  yaw = 0,
  pitch = 0.17,
  invulnerable = 0,
  elapsed = 0,
  slideIndex = 0,
  audioMuted = false,
  audioCtx = null,
  phaseIndex = 0;
const keys = {};

const skyColors = [
  new THREE.Color(0xa9d9db),
  new THREE.Color(0xb9e2dc),
  new THREE.Color(0xf0ad79),
  new THREE.Color(0x52647e),
];
const fogColors = [
  new THREE.Color(0xa9d9db),
  new THREE.Color(0xb9e2dc),
  new THREE.Color(0xd18c70),
  new THREE.Color(0x4b596d),
];
const sunColors = [
  new THREE.Color(0xffe7bd),
  new THREE.Color(0xfff4d4),
  new THREE.Color(0xff9c52),
  new THREE.Color(0xe87550),
];
const phases = [
  { label: "朝", icon: "☀", message: "" },
  { label: "昼", icon: "◉", message: "昼になった。山の影が短くなる" },
  { label: "夕暮れ", icon: "◒", message: "夕暮れが近い。残り1分" },
  { label: "日没前", icon: "◐", message: "日没まであと30秒！" },
];

function segmentedColor(colors, progress, target) {
  const scaled = progress * (colors.length - 1),
    index = Math.min(colors.length - 2, Math.floor(scaled));
  return target.lerpColors(colors[index], colors[index + 1], scaled - index);
}

function updateAtmosphere() {
  const progress = THREE.MathUtils.clamp((180 - timeLeft) / 180, 0, 1);
  segmentedColor(skyColors, progress, scene.background);
  segmentedColor(fogColors, progress, scene.fog.color);
  scene.fog.near = THREE.MathUtils.lerp(50, 32, progress);
  scene.fog.far = THREE.MathUtils.lerp(120, 72, progress);
  segmentedColor(sunColors, progress, sun.color);
  sun.position.set(
    THREE.MathUtils.lerp(-30, 22, progress),
    THREE.MathUtils.lerp(50, 7, progress),
    THREE.MathUtils.lerp(20, -34, progress),
  );
  sun.intensity = THREE.MathUtils.lerp(3.3, 1.35, progress);
  skyLight.intensity = THREE.MathUtils.lerp(2.5, 0.85, progress);
  renderer.toneMappingExposure = THREE.MathUtils.lerp(1.08, 0.76, progress);
  fireflyMaterial.opacity =
    THREE.MathUtils.smoothstep(progress, 0.64, 0.9) * 0.9;
  fireflies.rotation.y = elapsed * 0.018;
  const nextPhase =
    timeLeft > 120 ? 0 : timeLeft > 60 ? 1 : timeLeft > 30 ? 2 : 3;
  if (nextPhase !== phaseIndex) {
    phaseIndex = nextPhase;
    if (state === "playing") showToast(phases[nextPhase].message);
  }
  ui["phase-label"].textContent = phases[nextPhase].label;
  ui["phase-icon"].textContent = phases[nextPhase].icon;
  ui["phase-label"].parentElement.classList.toggle("evening", nextPhase >= 2);
}

function updateHUD() {
  ui["star-count"].textContent = `${collected.size}/6`;
  ui["life-count"].textContent = lives;
  const totalSeconds = Math.ceil(timeLeft),
    m = Math.floor(totalSeconds / 60),
    s = totalSeconds % 60;
  ui.timer.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  ui.timer.parentElement.classList.toggle("danger", timeLeft <= 30);
}
function setState(next) {
  state = next;
  const playing = next === "playing";
  ui.hud.classList.toggle("hidden", !playing);
  ui.crosshair.classList.toggle("hidden", !playing);
  if (!playing) ui.interaction.classList.add("hidden");
}
function showToast(text) {
  ui.toast.textContent = text;
  ui.toast.classList.add("show");
  clearTimeout(showToast.t);
  showToast.t = setTimeout(() => ui.toast.classList.remove("show"), 1800);
}
function tone(freq = 440, dur = 0.12, type = "sine", gain = 0.05) {
  if (audioMuted) return;
  audioCtx ??= new AudioContext();
  const o = audioCtx.createOscillator(),
    g = audioCtx.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(gain, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
  o.connect(g).connect(audioCtx.destination);
  o.start();
  o.stop(audioCtx.currentTime + dur);
}

function resetGame() {
  lives = 3;
  timeLeft = 180;
  collected.clear();
  invulnerable = 0;
  elapsed = 0;
  yaw = 0;
  pitch = 0.17;
  phaseIndex = 0;
  fogVeil = 0;
  boundaryWarned = false;
  fogZones.forEach((z) => (z.inside = false));
  player.position.set(-20, terrainHeight(-20, 20) + 0.1, 20);
  player.rotation.y = 0;
  safePosition.copy(player.position);
  pickupObjects.forEach((g) => {
    g.visible = true;
    g.userData.collected = false;
  });
  updateHUD();
  ui["end-screen"].classList.remove("visible");
  ui.slides.classList.remove("visible");
  ui["start-screen"].classList.remove("visible");
  setState("playing");
  updateAtmosphere();
  renderer.domElement.requestPointerLock?.();
  tone(523, 0.12);
  setTimeout(() => tone(659, 0.16), 90);
  showToast("6つの原稿を探そう");
}

function collectPickup(g) {
  if (!g || g.userData.collected) return;
  const i = g.userData.index;
  g.userData.collected = true;
  g.visible = false;
  collected.add(i);
  tone(880, 0.14, "triangle", 0.06);
  setTimeout(() => tone(1175, 0.22, "triangle", 0.05), 100);
  updateHUD();
  ui["manuscript-number"].textContent =
    `SCRIPT ${String(i + 1).padStart(2, "0")} / 06`;
  ui["manuscript-title"].textContent = manuscripts[i].title;
  ui["manuscript-body"].textContent = manuscripts[i].body;
  ui["manuscript-modal"].classList.add("visible");
  setState("modal");
  document.exitPointerLock?.();
}

function damage() {
  if (invulnerable > 0 || state !== "playing") return;
  lives--;
  invulnerable = 2;
  tone(120, 0.3, "sawtooth", 0.08);
  updateHUD();
  player.position.copy(safePosition);
  player.position.y = terrainHeight(player.position.x, player.position.z) + 0.1;
  showToast(lives > 0 ? "岩にぶつかった！ −1 ライフ" : "ライフがなくなった");
  if (lives <= 0) setTimeout(() => endGame("life"), 450);
}

function endGame(reason) {
  if (state === "ended") return;
  setState("ended");
  document.exitPointerLock?.();
  ui["end-eyebrow"].textContent =
    reason === "time" ? "TIME IS UP" : "TRAIL ENDED";
  ui["end-title"].textContent =
    reason === "time" ? "時間切れ" : "ゲームオーバー";
  ui["end-message"].textContent =
    reason === "time"
      ? "山にはまだ原稿が残っています。ルートを変えて、もう一度挑戦しましょう。"
      : "岩に気をつけて、安全なルートから山頂を目指しましょう。";
  ui["end-stats"].innerHTML =
    `<span>★ ${collected.size}/6</span><span>◷ ${formatTime(180 - timeLeft)}</span>`;
  ui["end-screen"].classList.add("visible");
  tone(165, 0.5, "sawtooth", 0.06);
}
function formatTime(seconds) {
  const m = Math.floor(seconds / 60),
    s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function showSlides() {
  setState("slides");
  ui["manuscript-modal"].classList.remove("visible");
  ui.slides.classList.add("visible");
  slideIndex = 0;
  renderSlide();
  tone(523, 0.2, "triangle", 0.05);
  setTimeout(() => tone(784, 0.5, "triangle", 0.05), 160);
}
function buildSlides() {
  ui["slide-stage"].innerHTML = slides
    .map(
      (s, i) =>
        `<article class="slide ${s.image ? "has-photo" : ""}" data-number="${String(i + 1).padStart(2, "0")}">${s.image ? `<div class="slide-bg" style="background-image:url('${s.image}')"></div>` : ""}<div class="slide-content"><div class="slide-kicker">${s.kicker} · ${String(i + 1).padStart(2, "0")}</div><h2>${s.title}</h2><p>${s.body}</p></div></article>`,
    )
    .join("");
}
function renderSlide() {
  [...ui["slide-stage"].children].forEach((el, i) =>
    el.classList.toggle("active", i === slideIndex),
  );
  ui["slide-counter"].textContent =
    `${String(slideIndex + 1).padStart(2, "0")} / 07`;
  ui["prev-slide"].disabled = slideIndex === 0;
  ui["next-slide"].textContent = slideIndex === 6 ? "↻" : "→";
}
buildSlides();

function updatePlayer(dt) {
  const input = new THREE.Vector2(
    (keys.KeyD || keys.ArrowRight ? 1 : 0) -
      (keys.KeyA || keys.ArrowLeft ? 1 : 0),
    (keys.KeyW || keys.ArrowUp ? 1 : 0) - (keys.KeyS || keys.ArrowDown ? 1 : 0),
  );
  if (input.lengthSq() > 0) {
    input.normalize();
    const speed = keys.ShiftLeft || keys.ShiftRight ? 8.5 : 5.2;
    const forward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw)),
      right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
    const movement = forward
      .multiplyScalar(input.y)
      .add(right.multiplyScalar(input.x))
      .normalize();
    player.position.addScaledVector(movement, speed * dt);
    player.rotation.y = Math.atan2(movement.x, movement.z);
    player.children
      .filter((c) => c.userData.leg)
      .forEach(
        (leg, i) =>
          (leg.rotation.x = Math.sin(elapsed * 11 + i * Math.PI) * 0.55),
      );
  }
  const radius = Math.hypot(player.position.x, player.position.z);
  if (radius > BOUNDARY) {
    // 範囲外には出られない。岩のダメージとは別物なので押し戻すだけ
    const k = BOUNDARY / radius;
    player.position.x *= k;
    player.position.z *= k;
    if (!boundaryWarned) {
      boundaryWarned = true;
      showToast("この先は霧が深い。引き返そう");
      tone(160, 0.2, "sine", 0.04);
    }
  } else if (radius < BOUNDARY - 3) {
    boundaryWarned = false;
  }
  player.position.y = terrainHeight(player.position.x, player.position.z) + 0.1;
  if (input.lengthSq() > 0 && Math.floor(elapsed) % 2 === 0)
    safePosition.lerp(player.position, 0.025);
}

function updateHazards(dt) {
  hazards.forEach((h, i) => {
    const travel = Math.sin(elapsed * h.speed * 0.18 + h.phase) * 8;
    h.mesh.position.copy(h.origin);
    h.mesh.position[h.axis] += travel;
    h.mesh.position.y = terrainHeight(h.mesh.position.x, h.mesh.position.z) + 1;
    h.mesh.rotation.x += dt * h.speed;
    h.mesh.rotation.z += dt * h.speed * 0.7;
    if (h.mesh.position.distanceTo(player.position) < 1.45) damage();
  });
}
function updateFogZones(dt) {
  let target = 0;
  fogZones.forEach((zone) => {
    const dist = Math.hypot(
      player.position.x - zone.center.x,
      player.position.z - zone.center.z,
    );
    // 縁から中心へ滑らかに濃くなる（直線的な境界をなくす）
    const veil =
      1 - THREE.MathUtils.smoothstep(dist, zone.radius * 0.35, zone.radius);
    target = Math.max(target, veil);
    const within = dist < zone.radius * 0.8;
    if (within && !zone.inside) {
      zone.inside = true;
      showToast("濃い霧に入った。視界が悪い…");
      tone(200, 0.4, "sine", 0.04);
    } else if (!within && zone.inside) {
      zone.inside = false;
    }
    zone.puffs.forEach((p) => {
      p.rotation.y += dt * p.userData.spin;
      p.position.y =
        p.userData.baseY + Math.sin(elapsed * 0.6 + p.userData.phase) * 0.4;
    });
  });
  fogVeil += (target - fogVeil) * Math.min(1, dt * 3);
  if (fogVeil > 0.001) {
    scene.fog.near = THREE.MathUtils.lerp(scene.fog.near, 3, fogVeil);
    scene.fog.far = THREE.MathUtils.lerp(scene.fog.far, 16, fogVeil);
    scene.fog.color.lerp(fogVeilColor, fogVeil * 0.5);
  }
}
function updatePickups() {
  nearby = null;
  let best = 3.15;
  pickupObjects.forEach((g, i) => {
    if (g.userData.collected) return;
    g.position.y = g.userData.baseY + Math.sin(elapsed * 2 + i) * 0.2;
    g.rotation.y += 0.012;
    const d = g.position.distanceTo(player.position);
    if (d < best) {
      best = d;
      nearby = g;
    }
  });
  ui.interaction.classList.toggle("hidden", !nearby);
  if (nearby)
    ui["interaction-label"].textContent =
      `原稿 ${nearby.userData.index + 1} を読む`;
}
function updateCamera(dt) {
  const distance = 8.2;
  const target = player.position.clone().add(new THREE.Vector3(0, 1.45, 0));
  const offset = new THREE.Vector3(
    Math.sin(yaw) * Math.cos(pitch) * distance,
    Math.sin(pitch) * distance + 2.2,
    Math.cos(yaw) * Math.cos(pitch) * distance,
  );
  const desired = target.clone().add(offset);
  camera.position.lerp(desired, 1 - Math.pow(0.001, dt));
  camera.lookAt(target);
}

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  elapsed += dt;
  if (state === "playing") {
    timeLeft = Math.max(0, timeLeft - dt);
    invulnerable = Math.max(0, invulnerable - dt);
    player.visible =
      invulnerable <= 0 || Math.floor(invulnerable * 10) % 2 === 0;
    updatePlayer(dt);
    updateHazards(dt);
    updatePickups();
    updateHUD();
    updateAtmosphere();
    updateFogZones(dt);
    if (timeLeft <= 0) endGame("time");
  } else {
    pickupObjects.forEach((g, i) => {
      if (!g.userData.collected) {
        g.position.y = g.userData.baseY + Math.sin(elapsed * 2 + i) * 0.2;
        g.rotation.y += 0.008;
      }
    });
  }
  updateCamera(dt);
  renderer.render(scene, camera);
}

ui["start-button"].addEventListener("click", resetGame);
ui["retry-button"].addEventListener("click", resetGame);
ui["replay-button"].addEventListener("click", () => {
  ui.slides.classList.remove("visible");
  resetGame();
});
ui["close-manuscript"].addEventListener("click", () => {
  ui["manuscript-modal"].classList.remove("visible");
  if (collected.size === 6) {
    showSlides();
  } else {
    setState("playing");
    renderer.domElement.requestPointerLock?.();
    showToast(`${collected.size}/6 原稿を発見`);
  }
});
ui["prev-slide"].addEventListener("click", () => {
  slideIndex = Math.max(0, slideIndex - 1);
  renderSlide();
});
ui["next-slide"].addEventListener("click", () => {
  if (slideIndex === 6) {
    resetGame();
  } else {
    slideIndex++;
    renderSlide();
  }
});
ui["sound-toggle"].addEventListener("click", () => {
  audioMuted = !audioMuted;
  ui["sound-toggle"].classList.toggle("muted", audioMuted);
  ui["sound-toggle"].textContent = audioMuted ? "×" : "♪";
  ui["sound-toggle"].ariaLabel = audioMuted ? "音をオン" : "音をミュート";
  if (!audioMuted) tone(660, 0.1);
});

addEventListener("keydown", (e) => {
  keys[e.code] = true;
  if (state === "playing" && e.code.startsWith("Arrow")) e.preventDefault();
  if (e.code === "KeyE" && state === "playing" && nearby) collectPickup(nearby);
  if (state === "slides" && (e.code === "ArrowRight" || e.code === "Space")) {
    e.preventDefault();
    ui["next-slide"].click();
  }
  if (state === "slides" && e.code === "ArrowLeft") ui["prev-slide"].click();
});
addEventListener("keyup", (e) => (keys[e.code] = false));
addEventListener("mousemove", (e) => {
  if (
    document.pointerLockElement === renderer.domElement &&
    state === "playing"
  ) {
    yaw -= e.movementX * 0.0025;
    pitch = THREE.MathUtils.clamp(pitch - e.movementY * 0.0018, -0.05, 0.62);
  }
});
renderer.domElement.addEventListener("click", () => {
  if (
    state === "playing" &&
    document.pointerLockElement !== renderer.domElement
  )
    renderer.domElement.requestPointerLock?.();
});
addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

camera.position.set(-13, 8, 29);
camera.lookAt(player.position);
updateHUD();
updateAtmosphere();
animate();
