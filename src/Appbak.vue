<script setup>
import { ref, onMounted, reactive } from "vue";
import { invoke } from "@tauri-apps/api/core";
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const container = ref(null);
// let scene = reactive({});

// scene = new THREE.Scene();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor('#000', 0);

const controls = new OrbitControls( camera, renderer.domElement );
// controls.target.set( 0, 0.5, 0 );
controls.update();
controls.enablePan = false;
controls.enableDamping = true;

const texture = new THREE.TextureLoader().load(
    // this.$el.getAttribute('data-map') ||
    'https://res.hc-cdn.com/cpage-pep-home-page/2.0.10/images/global-site-3d/%E5%9C%B0%E5%9B%BE.jpg',
); // 创建纹理贴图
texture.anisotropy = 10;
const geometry = new THREE.SphereGeometry(1, 64, 64);
let material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: texture,
    transparent: true,
});
const cube = new THREE.Mesh( geometry, material );
cube.scale.set(2, 2, 2);
scene.add( cube );

camera.position.z = 5;

function animate() {
	requestAnimationFrame( animate );

	// cube.rotation.x += 0.01;
	// cube.rotation.y += 0.01;
  controls.update();

	renderer.render( scene, camera );
  container.value.appendChild( renderer.domElement );
}

window.onresize = function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
};

onMounted(() => {
  animate();
});

</script>

<template>
  <div ref="container" class="container">
    <!-- <section class="panel">
      <button @click="() => {renderer.setClearColor('#e0dcdc', 0.5)}">11</button>
    </section> -->
  </div>
</template>

<style>
:root {
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;

  color: #0f0f0f;
  /* background-color: #f6f6f6; */

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
}

.container {
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  background: #24c8db;
  height: 100vh;
  /* position: relative;
  width: 100vw;
  height: 100vh;
  background: black;
  overflow: hidden; */
  .panel {
    position: absolute;
    top: 0;
    left: 0;
    background: transparent;
    z-index: 999;
  }
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}

a:hover {
  color: #535bf2;
}

h1 {
  text-align: center;
}

input,
button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  color: #0f0f0f;
  background-color: #ffffff;
  transition: border-color 0.25s;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
}

button {
  cursor: pointer;
}

button:hover {
  border-color: #396cd8;
}
button:active {
  border-color: #396cd8;
  background-color: #e8e8e8;
}

input,
button {
  outline: none;
}

@media (prefers-color-scheme: dark) {
  :root {
    color: #f6f6f6;
    background-color: #2f2f2f;
  }

  a:hover {
    color: #24c8db;
  }

  input,
  button {
    color: #ffffff;
    background-color: #0f0f0f98;
  }
  button:active {
    background-color: #0f0f0f69;
  }
}

</style>
