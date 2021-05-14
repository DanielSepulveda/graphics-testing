import * as React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import tweakpane from "tweakpane";
// import { cloneDeep as _clone } from "lodash";
import Stats from "three/examples/jsm/libs/stats.module";
import { CanvasLayout } from "../components";
// import { scaleRGB } from "../utils/helpers";

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 5);
camera.position.z = 2;

const cameraControls = new OrbitControls(camera, renderer.domElement);

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1, 1, 1);

const fragmentShader = `
  #include <common>

  uniform vec3 iResolution;
  uniform float iTime;
  uniform sampler2D iChannel0;

  // By Daedelus: https://www.shadertoy.com/user/Daedelus
  // license: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
  #define TIMESCALE 0.25 
  #define TILES 8
  #define COLOR 0.7, 1.6, 2.8

  void mainImage( out vec4 fragColor, in vec2 fragCoord )
  {
    vec2 uv = fragCoord.xy / iResolution.xy;
    uv.x *= iResolution.x / iResolution.y;
    
    vec4 noise = texture2D(iChannel0, floor(uv * float(TILES)) / float(TILES));
    float p = 1.0 - mod(noise.r + noise.g + noise.b + iTime * float(TIMESCALE), 1.0);
    p = min(max(p * 3.0 - 1.8, 0.1), 2.0);
    
    vec2 r = mod(uv * float(TILES), 1.0);
    r = vec2(pow(r.x - 0.5, 2.0), pow(r.y - 0.5, 2.0));
    p *= 1.0 - pow(min(1.0, 12.0 * dot(r, r)), 2.0);
    
    fragColor = vec4(COLOR, 1.0) * p;
  }

  varying vec2 vUv;

  void main() {
    mainImage(gl_FragColor, vUv * iResolution.xy);
  }
`;

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`;

const loader = new THREE.TextureLoader();
const texture = loader.load(
  "https://threejsfundamentals.org/threejs/resources/images/bayer.png"
);
texture.minFilter = THREE.NearestFilter;
texture.magFilter = THREE.NearestFilter;
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;

const uniforms = {
  iTime: { value: 0 },
  iResolution: { value: new THREE.Vector3(1, 1, 1) },
  iChannel0: { value: texture },
};

const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms,
});

const cube = new THREE.Mesh(geometry, material);
cube.position.x = 0;

scene.add(cube);

/* -------------------------------------------------------------------------- */
/*                                   RENDER                                   */
/* -------------------------------------------------------------------------- */

const stats = Stats();
stats.domElement.style.cssText =
  "position:fixed;top:5rem;left:16px;cursor:pointer;opacity:0.9;z-index:10000";

const renderLoop = (time: any) => {
  let s = (time *= 0.001);

  const speed = 2 * 0.1;
  const rot = time * speed;
  cube.rotation.x = rot;
  cube.rotation.y = rot;

  uniforms.iTime.value = s;

  renderer.render(scene, camera);
  stats.update();
  cameraControls.update();
  requestAnimationFrame(renderLoop);
};

const handleResize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};

function ShaderDemo() {
  const refCanvas = React.useRef<HTMLDivElement>(null);
  const refStats = React.useRef<HTMLDivElement>(null);

  /**
   * Initial Listeners
   */

  React.useEffect(() => {
    const canvasNode = refCanvas.current;
    const statsNode = refStats.current;

    canvasNode?.appendChild(renderer.domElement);
    statsNode?.appendChild(stats.dom);

    return () => {
      statsNode?.removeChild(stats.dom);
      canvasNode?.removeChild(renderer.domElement);
    };
  }, []);

  React.useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    requestAnimationFrame(renderLoop);
  }, []);

  return (
    <CanvasLayout>
      <div id="threejs-stats" ref={refStats} />
      <div id="threejs-canvas" ref={refCanvas} />
    </CanvasLayout>
  );
}

export default ShaderDemo;
