import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

function Visualization3D({ data }) {
  const mountRef = useRef(null);

  useEffect(() => {
    // Set up scene, camera, and renderer
    const scene = new THREE.Scene();
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Create camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    // Add light
    const light = new THREE.AmbientLight(0xffffff);
    scene.add(light);

    // Create points geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(data.length * 3);
    data.forEach((point, i) => {
      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y;
      positions[i * 3 + 2] = point.z;
    });
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Create points material
    const material = new THREE.PointsMaterial({ color: 0x007bff, size: 0.05 });

    // Create points mesh
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Animation loop
    const animate = function () {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Clean up on unmount
    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [data]);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
}

export default Visualization3D;