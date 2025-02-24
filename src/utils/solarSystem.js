import * as THREE from "three";
import universeImg from "../assets/img/universe.jpg";
import starImg from "../assets/img/star.jpg"; //星辰
import venusAtmosphereImg from "../assets/img/venusAtmosphere.jpg"; //金星大气
import moonImg from "../assets/img/moon.jpg"; //月球
import earthNormalImg from "../assets/img/earthNormal.jpg"; //法线贴图
import earthCloudsImg from "../assets/img/earthClouds.jpg"; //地球云层

/**
 * 初始化宇宙背景
 * @param {THREE.Scene} scene - Three.js场景对象
 */
export const initUniverse = (scene) => {
  let universeGeometry = new THREE.SphereGeometry(7000, 100, 100);
  let texture = new THREE.TextureLoader().load(universeImg);
  let universeMaterial = new THREE.MeshLambertMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });
  let universeMesh = new THREE.Mesh(universeGeometry, universeMaterial);
  scene.add(universeMesh);

  // 环境光
  let ambientLight = new THREE.AmbientLight();
  // scene.add(ambientLight);

  // 创建中心太阳点光源
  let pointLight = new THREE.PointLight(0xffffff, 1.2, 0);
  pointLight.position.set(0, 0, 0);
  scene.add(pointLight);
};

// 背景星辰mesh
export const initBackgroundStars = (scene) => {
  const positions = new Float32Array(8000 * 3);
  //星辰几何体
  const starsGeometry = new THREE.BufferGeometry();
  //添加星辰的颜色与位置
  Array.from(positions).forEach((position, i) => {
    positions[i] = Math.random() * 2 - 1;
  });
  starsGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  //星辰材质
  let starsMaterial = new THREE.PointsMaterial({
    map: new THREE.TextureLoader().load(starImg),
    size: 6,
    blending: THREE.AdditiveBlending,
    depthTest: false,
  });
  //星辰的集合
  let starsMesh = new THREE.Points(starsGeometry, starsMaterial);
  starsMesh.scale.set(7000, 7000, 7000); //设置集合体范围
  scene.add(starsMesh);
};

// 公转轨迹
export const initRevolutionTrajectory = (data, scene) => {
  if (data.name == "太阳") {
    return;
  }
  let trackGeometry = new THREE.RingGeometry(
    data.position[0],
    data.position[0] + 2,
    1000
  );
  let trackMaterial = new THREE.LineBasicMaterial({
    color: '#f8f8f8',
    linewidth: 0.5,
    side: THREE.DoubleSide,
  });
  let trackMesh = new THREE.Mesh(trackGeometry, trackMaterial);
  trackMesh.position.set(0, 0, 0); //轨道位置
  trackMesh.rotation.set(0.5 * Math.PI, 0, 0); //旋转轨道至水平
  scene.add(trackMesh);
};

// 获取普通星球本体mesh
export const getPlanetMesh = (data, material, materialParam={}) => {
  const planetGeometry = new THREE.SphereGeometry(data.size, 100, 100);
  const planetMaterial = new THREE[material]({
    map: new THREE.TextureLoader().load(data.mapImg),
    ...materialParam,
  });
  return new THREE.Mesh(planetGeometry, planetMaterial);
};

// 日冕mesh
const getSunAtmosphereMesh = (data) => {
  const sunAtmosphereGeometry = new THREE.SphereGeometry(data.size + 8, 100, 100);
  const sunAtmosphereMaterial = new THREE.MeshLambertMaterial({
    color: '#FFC607',
    transparent: true,
    opacity: 0.2,
  });
  return new THREE.Mesh(sunAtmosphereGeometry, sunAtmosphereMaterial);
};

// 太阳
export const initSun = (data, scene) => {
  let sunGroup = new THREE.Group(); //太阳的组
  sunGroup.add(getPlanetMesh(data, 'MeshBasicMaterial', { transparent: true, opacity: 1.0 }));
  
  // sunGroup.add(getSunAtmosphereMesh(data));
  Object.assign(sunGroup, {
    name: data.name,
    planetMsg: data,
    isPlanet: true,
    angle: 0,
  });
  //球体位置
  sunGroup.position.set(data.position);
  scene.add(sunGroup);
};

// 地球云层mesh
const getEarthClouds = (data) => {
  const earthCloudsGeometry = new THREE.SphereGeometry(data.size + 2, 100, 100);
  const earthCloudsMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.1,
    map: new THREE.TextureLoader().load(earthCloudsImg),
  });
  return new THREE.Mesh(earthCloudsGeometry, earthCloudsMaterial);
};
// 月球轨道mesh
const getMoonTrack = (data) => {
  const moonTrackGeometry = new THREE.RingGeometry(data.size + 40, data.size + 40.2, 100);
  const moonTrackMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
  });
  const moonTrackMesh = new THREE.Mesh(moonTrackGeometry, moonTrackMaterial);
  moonTrackMesh.rotation.set(0.5 * Math.PI, 0, 0);
  return moonTrackMesh;
};
// 月球mesh
const getMoon = (data) => {
  const moonGeometry = new THREE.SphereGeometry(10, 100, 100);
  const moonMaterial = new THREE.MeshPhysicalMaterial({
    map: new THREE.TextureLoader().load(moonImg),
    normalScale: new THREE.Vector2(10, 10), //凹凸深度
  });
  const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
  moonMesh.position.set(data.size + 40, 0, 0);
  return moonMesh;
};

// 地球
export const initEarth = (data, scene) => {
  const earthGroup = new THREE.Group();
  earthGroup.add(getPlanetMesh(data, 'MeshPhysicalMaterial', {
    normalScale: new THREE.Vector2(10, 10),
    normalMap: new THREE.TextureLoader().load(earthNormalImg),
  }));
  earthGroup.add(getEarthClouds(data));
  earthGroup.add(getMoonTrack(data));
  earthGroup.add(getMoon(data));

  Object.assign(earthGroup, {
    name: data.name,
    planetMsg: data,
    isPlanet: true,
    angle: 0,
  });
  //球体位置
  earthGroup.position.set(data.position);
  scene.add(earthGroup);
};

// 金星大气mesh
const getVenusAtmosphere = (data) => {
  const venusAtmosphereGeometry = new THREE.SphereGeometry(data.size + 2, 100, 100);
  const venusAtmosphereMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.5,
    map: new THREE.TextureLoader().load(venusAtmosphereImg),
  });
  return new THREE.Mesh(venusAtmosphereGeometry, venusAtmosphereMaterial);
};

// 金星
export const initVenus = (data, scene) => {
  const venusGroup = new THREE.Group();
  venusGroup.add(getPlanetMesh(data, 'MeshLambertMaterial'));
  
  venusGroup.add(getVenusAtmosphere(data)); //将大气添加到组中
  Object.assign(venusGroup, {
    name: data.name,
    planetMsg: data,
    isPlanet: true,
    angle: 0,
  });
  //球体位置
  venusGroup.position.set(data.position);
  scene.add(venusGroup);
};

// 土星星环mesh
const getSaturnTrack = (data, ringParams, opacity) => {
  const [param1, param2] = ringParams;
  const saturnTrackGeometry = new THREE.RingGeometry(data.size + param1, data.size + param2, 100);
  const saturnTrackMaterial = new THREE.MeshLambertMaterial({
    transparent: true,
    opacity: opacity,
    color: 0xc0ad87,
    side: THREE.DoubleSide,
  });
  const saturnTrackMesh = new THREE.Mesh(saturnTrackGeometry, saturnTrackMaterial);
  saturnTrackMesh.rotation.set(0.5 * Math.PI, 0, 0);
  return saturnTrackMesh;
};

// 土星
export const initSaturn = (data, scene) => {
  const saturnGroup = new THREE.Group();
  saturnGroup.add(getPlanetMesh(data, 'MeshLambertMaterial'));
  saturnGroup.add(getSaturnTrack(data, [10, 25], 0.8)); //将网格添加到组中
  saturnGroup.add(getSaturnTrack(data, [26, 30], 0.5));
  saturnGroup.add(getSaturnTrack(data, [30.1, 32], 0.3));
  Object.assign(saturnGroup, {
    name: data.name,
    planetMsg: data,
    isPlanet: true,
    angle: 0,
  });
  //球体位置
  saturnGroup.position.set(data.position);
  scene.add(saturnGroup);
};
