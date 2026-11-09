import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { chess, files, position } from "../game/board.js";
import { monster } from "../game/pieces.js";

const holder = document.getElementById("game");

// ===== المشهد =====
export const scene = new THREE.Scene();
scene.background = new THREE.Color(0x151126);

export const camera = new THREE.PerspectiveCamera(45, 1, .1, 100);
camera.position.set(7, 9, 11);

export const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
renderer.setShadowMapType = THREE.PCFSoftShadowMap;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;

holder.appendChild(renderer.domElement);

export const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 8;
controls.maxDistance = 16;
controls.maxPolarAngle = Math.PI / 2.15;

scene.add(new THREE.HemisphereLight(0xffffff, 0x303040, 2));

const sun = new THREE.DirectionalLight(0xffffff, 3);
sun.position.set(5, 10, 7);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
scene.add(sun);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshStandardMaterial({ color: 0x101020 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -.7;
scene.add(floor);

const base = new THREE.Mesh(
  new THREE.BoxGeometry(8.7, .65, 8.7),
  new THREE.MeshStandardMaterial({ color: 0x29213e, metalness: .5, roughness: .35 })
);
base.position.y = -.4;
base.receiveShadow = true;
scene.add(base);

export const board = new THREE.Group();
scene.add(board);

export const pieces = new THREE.Group();
scene.add(pieces);

export const squares = [];

// ===== إنشاء الرقعة (يُستدعى مرة واحدة) =====
export function makeBoard() {
  for (let rank = 8; rank >= 1; rank--) {
    for (let f = 0; f < 8; f++) {
      const s = files[f] + rank;
      const p = position(s);

      const mat = new THREE.MeshStandardMaterial({
        color: (rank + f) % 2 ? 0x936343 : 0xe9d2a5,
        roughness: .8
      });

      const mesh = new THREE.Mesh(new THREE.BoxGeometry(.99, .15, .99), mat);
      mesh.position.set(p.x, -.035, p.z);
      mesh.receiveShadow = true;
      mesh.userData.square = s;

      board.add(mesh);
      squares.push(mesh);
    }
  }
}

// ===== إعادة رسم كل القطع =====
export function draw() {
  pieces.clear();

  const state = chess.board();

  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const p = state[r][f];
      if (!p) continue;

      const s = files[f] + (8 - r);
      const pos = position(s);

      const obj = monster(p.type, p.color);

      obj.position.set(pos.x, .05, pos.z);
      obj.userData.square = s;
      obj.userData.color = p.color;

      pieces.add(obj);
    }
  }

  pieces.updateMatrixWorld(true);
}

// ===== إعادة ألوان الرقعة =====
export function resetColors() {
  squares.forEach(s => {
    const rank = Number(s.userData.square[1]);
    const f = files.indexOf(s.userData.square[0]);
    s.material.color.setHex((rank + f) % 2 ? 0x936343 : 0xe9d2a5);
  });
}

// ===== إظهار الحركات الممكنة =====
export function showMoves(from) {
  resetColors();
  if (!from) return;

  const moves = chess.moves({ square: from, verbose: true });
  moves.forEach(m => {
    const sq = squares.find(x => x.userData.square === m.to);
    if (sq) sq.material.color.setHex(0x39dc83);
  });
}

// ===== اكتشاف المربع المنقور بالإحداثيات =====
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

export function getClickedSquare(clientX, clientY) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);

  const pieceHits = raycaster.intersectObjects(pieces.children, true);
  if (pieceHits.length > 0) {
    let obj = pieceHits[0].object;
    while (obj && !obj.userData.square) obj = obj.parent;
    if (obj) return obj.userData.square;
  }

  const squareHits = raycaster.intersectObjects(squares, false);
  if (squareHits.length > 0) {
    return squareHits[0].object.userData.square;
  }

  return null;
}

// ===== الحجم =====
export function onResize() {
  const w = holder.clientWidth;
  const h = holder.clientHeight;

  if (w === 0 || h === 0) {
    renderer.setSize(800, 500);
    camera.aspect = 800 / 500;
    camera.updateProjectionMatrix();
    return;
  }

  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

// ===== حلقة العرض =====
export function startAnimation() {
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}

// تهيئة أولية للحجم
renderer.setSize(800, 500);
