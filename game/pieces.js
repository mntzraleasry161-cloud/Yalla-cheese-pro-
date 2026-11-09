import * as THREE from "three";

/** ينشئ مجسّم وحش ثلاثي الأبعاد حسب نوعه ولونه */
export function monster(type, color) {
  const g = new THREE.Group();

  const main = new THREE.MeshStandardMaterial({
    color: color === "w" ? 0x28bca7 : 0x8552c9,
    roughness: .4,
    metalness: .1
  });

  const gold = new THREE.MeshStandardMaterial({
    color: 0xffc857,
    metalness: .6,
    roughness: .3
  });

  const white = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const black = new THREE.MeshStandardMaterial({ color: 0x151515 });

  function sphere(x, y, z, sx, sy, sz, mat) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 16), mat);
    m.position.set(x, y, z);
    m.scale.set(sx, sy, sz);
    m.castShadow = true;
    g.add(m);
  }

  function cone(x, y, z, size, mat) {
    const m = new THREE.Mesh(new THREE.ConeGeometry(size, .4, 12), mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    g.add(m);
  }

  sphere(0, .45, 0, .34, .45, .32, main);
  sphere(0, .92, 0, .34, .35, .32, main);

  for (const x of [-.14, .14]) {
    sphere(x, .99, .28, .105, .12, .06, white);
    sphere(x, 1, .33, .045, .06, .035, black);
  }

  for (const x of [-.38, .38]) {
    sphere(x, .48, 0, .12, .2, .13, main);
  }

  if (type === "k") {
    cone(-.23, 1.35, 0, .16, gold);
    cone(.23, 1.35, 0, .16, gold);
    sphere(0, 1.38, 0, .32, .13, .3, gold);
  }

  if (type === "q") {
    for (let i = -1; i <= 1; i++) cone(i * .2, 1.35, 0, .13, gold);
    sphere(0, 1.35, 0, .3, .1, .3, gold);
  }

  if (type === "r") {
    const crown = new THREE.Mesh(
      new THREE.CylinderGeometry(.3, .38, .25, 8),
      gold
    );
    crown.position.y = 1.3;
    crown.castShadow = true;
    g.add(crown);
  }

  if (type === "b") cone(0, 1.4, 0, .16, gold);

  if (type === "n") {
    sphere(0, 1.05, .3, .15, .2, .3, gold);
    cone(.1, 1.35, 0, .13, gold);
  }

  if (type === "p") sphere(0, 1.3, 0, .15, .16, .15, gold);

  return g;
}
