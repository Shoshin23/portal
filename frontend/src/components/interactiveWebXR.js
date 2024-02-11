'use client'

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

export default function InteractiveWebXR(props) {
  const canvasRef = useRef(null);

  const planets = props.planets;
  console.log(planets);

  useEffect(() => {
    let camera, scene, renderer, raycaster, intersectedSphere, gazeStartTime, gazeDurationThreshold, currentPlanet, originalPosition, particles;
    let spheres = [];
    const clock = new THREE.Clock();

    init();
    animate();

    function init() {
        gazeDurationThreshold = 1000;
        currentPlanet = -1;
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x101010);
        const light = new THREE.AmbientLight(0xffffff, 3);
        scene.add(light);
        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 2000);
        scene.add(camera);
        raycaster = new THREE.Raycaster();
        const manager = new THREE.LoadingManager();
        const loader = new THREE.TextureLoader(manager);

        planets.forEach((planet, index) => {
            const radius = 5;
            const theta = (index / planets.length) * Math.PI * 2;
            const x = Math.sin(theta) * radius;
            const y = 0;
            const z = Math.cos(theta) * radius;

            loader.load(planet.image, function (texture) {
                texture.colorSpace = THREE.SRGBColorSpace;
                texture.minFilter = THREE.NearestFilter;
                texture.generateMipmaps = false;

                loader.load(planet.depth, function (depth) {
                    depth.minFilter = THREE.NearestFilter;
                    depth.generateMipmaps = false;

                    const panoSphereGeo = new THREE.SphereGeometry(0.5, 32, 32);
                    const panoSphereMat = new THREE.MeshStandardMaterial({
                        side: THREE.BackSide,
                        transparent: true,
                        map: texture,
                        displacementMap: depth,
                        displacementScale: 1
                    });

                    const sphere = new THREE.Mesh(panoSphereGeo, panoSphereMat);
                    sphere.position.set(x, y, z);
                    sphere.name = planet.id;

                    scene.add(sphere);
                    spheres.push(sphere);
                });
            });
        });

        const greenSphereGeo = new THREE.SphereGeometry(0.5, 32, 32);
        const greenSphereMat = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            metalness: 1,
            roughness: 0.2,
            emissive: 0xffffff,
            emissiveIntensity: 0.5,
        });
        const greenSphere = new THREE.Mesh(greenSphereGeo, greenSphereMat);
        greenSphere.position.set(0, 0, -5);
        greenSphere.name = '-1';
        spheres.push(greenSphere);
        scene.add(greenSphere);

        const particleGeometry = new THREE.BufferGeometry();
        const particlesCount = 1000;
        const positions = new Float32Array(particlesCount * 3);
        const colors = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount; i++) {
            positions[i * 3] = (Math.random() * 100 - 50);
            positions[i * 3 + 1] = (Math.random() * 100 - 50);
            positions[i * 3 + 2] = (Math.random() * 100 - 50);

            colors[i * 3] = 1;
            colors[i * 3 + 1] = 1;
            colors[i * 3 + 2] = 1;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMaterial = new THREE.ShaderMaterial({
            side: THREE.BackSide,
            transparent: true,
            vertexShader: `
                varying vec3 vColor;
                void main() {
                    vColor = color;
                    gl_PointSize = 2.0;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;
                    gl_FragColor = vec4(vColor, 0.5);
                }
            `,
            vertexColors: true
        });

        particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);

        renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvasRef.current });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.xr.enabled = true;
        renderer.xr.setReferenceSpaceType('local');
        document.body.appendChild(VRButton.createButton(renderer));
        window.addEventListener('resize', onWindowResize);
        window.addEventListener('mousemove', updateRaycaster, false);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        renderer.setAnimationLoop(render);
    }

    function findSphereByName(name) {
        return spheres.find(sphere => sphere.name === name);
    }

    function updateRaycaster(event) {
        const x = (event.clientX / window.innerWidth) * 2 - 1;
        const y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera({ x: x, y: y }, camera);
    }

    function handleIntersection() {
        if (intersectedSphere) {
            if (intersectedSphere.name === currentPlanet && currentPlanet !== '-1') {
                return;
            }

            const currentTime = performance.now();
            if (!gazeStartTime) {
                gazeStartTime = currentTime;
            }
            const gazeDuration = currentTime - gazeStartTime;

            if (gazeDuration >= gazeDurationThreshold) {
                gazeStartTime = undefined;

                if (intersectedSphere.name !== '-1') {
                    if (intersectedSphere.name !== currentPlanet) {
                        console.log("Sphere gazed at for 2 seconds:", intersectedSphere);
                        currentPlanet = intersectedSphere.name;
                        intersectedSphere.scale.set(6, 6, 6);
                        originalPosition = [intersectedSphere.position.x, intersectedSphere.position.y, intersectedSphere.position.z];
                        intersectedSphere.position.set(0, 0, 0);
                        findSphereByName('-1').position.set(0, -2, 0);

                        spheres.forEach(sphere => {
                            if (sphere !== intersectedSphere) {
                                if (sphere.name !== '-1') {
                                    sphere.visible = false;
                                }
                            }
                        });
                    }
                } else {
                    gazeStartTime = undefined;

                    if (currentPlanet !== "-1") {
                        findSphereByName(currentPlanet).position.set(originalPosition[0], originalPosition[1], originalPosition[2]);
                        findSphereByName(currentPlanet).scale.set(1, 1, 1);
                        currentPlanet = '-1';
                    } else {
                        // Start recording
                        //laadt planeten opnieuw in als ie klaar is
                    }

                    spheres.forEach(sphere => {
                        sphere.visible = true;
                        sphere.scale.set(1, 1, 1);
                    });

                    findSphereByName('-1').position.set(0, 0, -5);
                }
            } else {
                const scaleFactor = 1 + gazeDuration / 600;
                intersectedSphere.scale.set(scaleFactor, scaleFactor, scaleFactor);
            }
        } else {
            if (currentPlanet === '-1') {
                spheres.forEach(sphere => {
                    sphere.scale.set(1, 1, 1);
                });
            }
        }
    }

    function render() {
        const time = clock.getElapsedTime();

        particles.position.x = Math.sin(time) * 0.2;
        particles.position.z = Math.cos(time) * 0.2;
        particles.rotation.y += 0.001;

        raycaster.setFromCamera({ x: 0, y: 0 }, camera);
        const intersects = raycaster.intersectObjects(spheres);

        if (intersects.length > 0) {
            const sphere = intersects[0].object;
            if (sphere !== intersectedSphere) {
                intersectedSphere = sphere;
                gazeStartTime = null;
            }
        } else {
            intersectedSphere = null;
            gazeStartTime = null;
        }

        handleIntersection();
        renderer.render(scene, camera);
    }

    return () => {
      if (renderer) {
        renderer.setAnimationLoop(null);
      }
    };
  }, [props.planets]);

  return <canvas ref={canvasRef} />;
}