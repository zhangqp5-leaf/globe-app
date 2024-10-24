<script setup>
import { ref, onMounted, reactive } from "vue";
import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import planetData from "./planetData.js"; //导入星球数据
import {
  initUniverse,
  initBackgroundStars,
  initRevolutionTrajectory,
  getPlanetMesh,
  initSun,
  initEarth,
  initVenus,
  initSaturn,
} from './utils';

const solarSystem = ref(null);

let scene = null; //场景(频繁变更的对象放置在vue的data中会导致卡顿)
let camera = null; //相机
let orbitControls = null; //鼠标控件

let renderer = reactive({}); //渲染器
let planetList = reactive(planetData); //星球列表

let isRevolution = ref(true); //公转状态
let isRotation = ref(true); //自转状态
let clickPlanet = ref(''); // 当前点击的星球

let raycaster = reactive({});
let mouse = reactive({});

raycaster = new THREE.Raycaster();
mouse = new THREE.Vector2();

// 改变位置
const changeSet = (data) => {
  if (data.key == "isRevolution") {
    isRevolution.value = data.val;
  }
  if (data.key == "isRotation") {
    isRotation.value = data.val;
  }
};

// 销毁场景
const destroyScene = () => {
  cancelAnimationFrame(anId.value);
  renderer.forceContextLoss(); //强制失去上下文
  renderer.dispose();
  scene.clear();
  scene = null;
  camera = null;
  orbitControls = null;
  // this.dom.innerHTML = null;
  renderer = null;
};

//创建球体
const createSphere = (data) => {
  switch (data.name) {
    case '太阳':
      initSun(data, scene);
      break;
    case '地球':
      initEarth(data, scene);
      break;
    case '金星':
      initVenus(data, scene);
      break;
    case '土星':
      initSaturn(data, scene);
      break;
    default:
      const sphereMesh = getPlanetMesh(data);
      sphereMesh.name = data.name; //网格名字
      sphereMesh.planetMsg = data;
      sphereMesh.isPlanet = true; //标识为星球
      sphereMesh.angle = 0; //添加初始角度
      //球体位置
      sphereMesh.position.set(
        data.position[0],
        data.position[1],
        data.position[2]
      );
      scene.add(sphereMesh); //球体添加到场景中
      break;
  }
};


//球体自转
const sphereRotation = (data) => {
  scene.children.forEach((e) => {
    //过滤出星球
    if (e.isPlanet) {
      let planetData = data.filter((d) => d.name == e.name)[0];
      if (e.name == "土星") {
        e.rotation.x = 0.05 * 2 * Math.PI;
        // return;
      }
      //天王星自转轴特殊
      if (e.name == "天王星") {
        e.rotation.z =
          e.rotation.z + planetData.rotation >= 2 * Math.PI
            ? 0
            : e.rotation.z + planetData.rotation;
        return;
      }
      e.rotation.y =
        e.rotation.y + planetData.rotation >= 2 * Math.PI
          ? 0
          : e.rotation.y + planetData.rotation;
    }
  });
};

//球体公转
const sphereRevolution = (data) => {
  scene.children.forEach((e) => {
    //过滤出星球
    if (e.isPlanet) {
      let planetData = data.filter((d) => d.name == e.name)[0]; //获取球体数据
      e.angle =
        e.angle + planetData.revolution >= 2 * Math.PI
          ? 0
          : e.angle + planetData.revolution;
      e.position.set(
        planetData.position[0] * Math.sin(e.angle),
        0,
        planetData.position[0] * Math.cos(e.angle)
      );
    }
  });
};

//创建鼠标控件
const createOrbitControls = () => {
  orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.enablePan = false; //右键平移拖拽
  orbitControls.enableZoom = true; //鼠标缩放
  orbitControls.enableDamping = true; //滑动阻尼
  orbitControls.dampingFactor = 0.05; //(默认.25)
  orbitControls.minDistance = 100; //相机距离目标最小距离
  orbitControls.maxDistance = 2700; //相机距离目标最大距离
  // orbitControls.maxPolarAngle = (Math.PI / 4) * 3; //y旋转角度范围
  // orbitControls.minPolarAngle = Math.PI / 4;
  orbitControls.autoRotate = true; //自转(相机)
  orbitControls.autoRotateSpeed = 0; //自转速度
};

// 渲染
const pageRender = () => {
  // 请求动画帧，屏幕每刷新一次调用一次，绑定屏幕刷新频率
  requestAnimationFrame(pageRender);
  orbitControls.update(); //鼠标控件实时更新
  renderer.render(scene, camera);
  //控制公转
  if (isRevolution.value) {
    sphereRevolution(planetList); //球体公转
  }
  if (isRotation.value) {
    sphereRotation(planetList); //球体自转
  }
  //监听画布双击事件
  solarSystem.value && solarSystem.value.addEventListener("dblclick", handleDblclick, false);
  TWEEN.update(); //更新动画
};

// 双击事件
const handleDblclick = (e) => {
  console.log('此处发生了双击');
};

// 初始化
const init = () => {
  let width = solarSystem.value.clientWidth;
  let height = solarSystem.value.clientHeight;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, width / height, 1, 50000); // 创建透视相机
  camera.position.set(0, 500, 2700); // 设置相机位置
  camera.lookAt(0, 0, 0);
  //创建渲染器
  renderer = new THREE.WebGLRenderer({
    antialias: true, //抗锯齿
    alpha: true, //透明
  });
  renderer.setClearColor(0x000000, 0); //设置场景透明度
  renderer.setSize(width, height); //设置渲染区域尺寸
  solarSystem.value.appendChild(renderer.domElement); //将渲染器添加到dom中形成canvas
  initUniverse(scene);
  initBackgroundStars(scene);
  //遍历行星数据生成星球及其轨道
  planetList.forEach((planet) => {
    createSphere(planet);
    initRevolutionTrajectory(planet, scene);
  });
  createOrbitControls(); //创建鼠标控制器
  pageRender(); //渲染
};

window.onresize = function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
};

onMounted(() => {
  init();
});

</script>

<template>
  <div class="container">
    <div ref="solarSystem" class="solar-system-style"></div>
    <!--描述组件-->
    <!-- <PlanetText v-if="clickPlanet.planetMsg" :msg="clickPlanet.planetMsg" /> -->
    <!--设置组件-->
    <!-- <SetSolarSystem @changeSet="changeSet" /> -->
  </div>
</template>

<style>
:root {
  /* font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;

  color: #0f0f0f;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%; */
}

body {
  margin: 0;
}

.container {
  margin: 0;
  /* display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center; */
  /* background: #24c8db; */
  height: 100vh;
}
.solar-system-style {
  height: 100%;
  width: 100%;
}

</style>
