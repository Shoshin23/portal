'use client'

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

export default function WebXR() {
  const canvasRef = useRef(null);

  useEffect(() => {
    let camera, scene, renderer, sphere, spheresmall, clock;

    init();
    animate();

    function init() {
        clock = new THREE.Clock();
        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0x101010 );

        const light = new THREE.AmbientLight( 0xffffff, 3 );

        scene.add( light );
        camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 2000 );
        scene.add( camera );

        const panoSphereGeo = new THREE.SphereGeometry( 6, 256, 256 );
        // Create the panoramic sphere material
        const panoSphereMat = new THREE.MeshStandardMaterial( {
            side: THREE.BackSide,
            displacementScale: - 4.0,
        } );
 
        sphere = new THREE.Mesh( panoSphereGeo, panoSphereMat );

        const manager = new THREE.LoadingManager();
        const loader = new THREE.TextureLoader( manager );

        loader.load( '/env3.jpg', function ( texture ) {
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.minFilter = THREE.NearestFilter;
            texture.generateMipmaps = false;
            sphere.material.map = texture;
        } );

        loader.load( '/depth3.jpg', function ( depth ) {
            depth.minFilter = THREE.NearestFilter;
            depth.generateMipmaps = false;
            sphere.material.displacementMap = depth;
            sphere.material.displacementScale = 4	; // Adjust this value as needed
        } );

        manager.onLoad = function () {
            scene.add( sphere );
        };
        
        renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvasRef.current });
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.xr.enabled = true;
        renderer.xr.setReferenceSpaceType( 'local' );
        document.body.appendChild( VRButton.createButton( renderer ) );
        window.addEventListener( 'resize', onWindowResize );
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }

    function animate() {
        renderer.setAnimationLoop( render );
    }

    function render() {
        if ( renderer.xr.isPresenting === false ) {
            const time = clock.getElapsedTime();
            sphere.rotation.y += 0.001;
            sphere.position.x = Math.sin( time ) * 0.2;
            sphere.position.z = Math.cos( time ) * 0.2;
        }

        renderer.render( scene, camera );
    }

    return () => {
      if (renderer) {
        renderer.setAnimationLoop(null);
      }
    };
  }, []);

  return <canvas ref={canvasRef} />;
}