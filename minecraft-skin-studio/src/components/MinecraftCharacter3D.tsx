/**
 * 3D Minecraft Character Component
 * Renders a 3D Minecraft character with applied skin texture
 */

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';

interface MinecraftCharacter3DProps {
  skinDataURL?: string;
  width?: number;
  height?: number;
  autoRotate?: boolean;
}

export default function MinecraftCharacter3D({ 
  skinDataURL, 
  width = 300, 
  height = 300, 
  autoRotate = true 
}: MinecraftCharacter3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const characterRef = useRef<THREE.Group | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationRef = useRef<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSkinLoading, setIsSkinLoading] = useState(false);
  const textureLoadingRef = useRef(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Sky blue background
    sceneRef.current = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(25, 25, 25);
    camera.lookAt(0, 20, 0);
    cameraRef.current = camera;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Create character
    createMinecraftCharacter(scene);

    // Setup camera controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = false; // Disable panning to keep character centered
    controls.minDistance = 15;
    controls.maxDistance = 50;
    controls.maxPolarAngle = Math.PI - 0.1; // Allow viewing from below but not completely under
    controls.target.set(0, 20, 0); // Focus on character center
    controls.autoRotate = false;
    controls.enableRotate = true; // Explicitly enable rotation
    controlsRef.current = controls;
    
    console.log('✅ OrbitControls initialized:', {
      enableRotate: controls.enableRotate,
      enableZoom: controls.enableZoom,
      target: controls.target
    });

    // Add renderer to DOM
    mountRef.current.appendChild(renderer.domElement);

    // Start animation loop
    animate();

    setIsLoaded(true);

    return () => {
      // Cleanup
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [width, height]);

  // Update skin texture when skinDataURL changes
  useEffect(() => {
    if (skinDataURL && characterRef.current) {
      updateCharacterSkin(skinDataURL);
    }
  }, [skinDataURL]);

  const createMinecraftCharacter = (scene: THREE.Scene) => {
    const character = new THREE.Group();
    characterRef.current = character;

    // Official Minecraft character proportions (1.8 format)
    // Using scale factor for visibility, maintaining exact ratios
    const pixelSize = 1.5; // Each pixel = 1.5 units for good visibility

    // Head (8×8×8 pixels) - positioned at neck joint
    const headGeometry = new THREE.BoxGeometry(8 * pixelSize, 8 * pixelSize, 8 * pixelSize);
    const headMaterial = new THREE.MeshLambertMaterial({ color: 0xF9DCC4 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(0, 4 * pixelSize, 0); // Head center at 4 pixels above body
    head.castShadow = true;
    character.add(head);

    // Body (8×12×4 pixels) - torso
    const bodyGeometry = new THREE.BoxGeometry(8 * pixelSize, 12 * pixelSize, 4 * pixelSize);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x00AAAA });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.set(0, -6 * pixelSize, 0); // Body center 6 pixels below origin
    body.castShadow = true;
    character.add(body);

    // Right Arm (4×12×4 pixels) - attached to shoulder
    const rightArmGeometry = new THREE.BoxGeometry(4 * pixelSize, 12 * pixelSize, 4 * pixelSize);
    const rightArmMaterial = new THREE.MeshLambertMaterial({ color: 0xF9DCC4 });
    const rightArm = new THREE.Mesh(rightArmGeometry, rightArmMaterial);
    rightArm.position.set(-6 * pixelSize, -6 * pixelSize, 0); // 6 pixels from body center
    rightArm.castShadow = true;
    character.add(rightArm);

    // Left Arm (4×12×4 pixels) - attached to shoulder  
    const leftArmGeometry = new THREE.BoxGeometry(4 * pixelSize, 12 * pixelSize, 4 * pixelSize);
    const leftArmMaterial = new THREE.MeshLambertMaterial({ color: 0xF9DCC4 });
    const leftArm = new THREE.Mesh(leftArmGeometry, leftArmMaterial);
    leftArm.position.set(6 * pixelSize, -6 * pixelSize, 0); // 6 pixels from body center
    leftArm.castShadow = true;
    character.add(leftArm);

    // Right Leg (4×12×4 pixels) - attached to hip
    const rightLegGeometry = new THREE.BoxGeometry(4 * pixelSize, 12 * pixelSize, 4 * pixelSize);
    const rightLegMaterial = new THREE.MeshLambertMaterial({ color: 0x3D3DC8 });
    const rightLeg = new THREE.Mesh(rightLegGeometry, rightLegMaterial);
    rightLeg.position.set(-2 * pixelSize, -18 * pixelSize, 0); // 18 pixels below origin (12 body + 6 leg)
    rightLeg.castShadow = true;
    character.add(rightLeg);

    // Left Leg (4×12×4 pixels) - attached to hip
    const leftLegGeometry = new THREE.BoxGeometry(4 * pixelSize, 12 * pixelSize, 4 * pixelSize);
    const leftLegMaterial = new THREE.MeshLambertMaterial({ color: 0x3D3DC8 });
    const leftLeg = new THREE.Mesh(leftLegGeometry, leftLegMaterial);
    leftLeg.position.set(2 * pixelSize, -18 * pixelSize, 0); // 18 pixels below origin
    leftLeg.castShadow = true;
    character.add(leftLeg);

    // Second layer (outer layer) for 1.8 skin format
    // Head Layer 2 (Hat/Hair layer) - 8.5×8.5×8.5 pixels
    const headLayer2Geometry = new THREE.BoxGeometry(9 * pixelSize, 9 * pixelSize, 9 * pixelSize);
    const headLayer2Material = new THREE.MeshLambertMaterial({ 
      color: 0x4A3C28, 
      transparent: true, 
      opacity: 0.8 
    });
    const headLayer2 = new THREE.Mesh(headLayer2Geometry, headLayer2Material);
    headLayer2.position.set(0, 4 * pixelSize, 0);
    headLayer2.castShadow = true;
    character.add(headLayer2);

    // Body Layer 2 - 8.5×12.5×4.5 pixels
    const bodyLayer2Geometry = new THREE.BoxGeometry(8.5 * pixelSize, 12.5 * pixelSize, 4.5 * pixelSize);
    const bodyLayer2Material = new THREE.MeshLambertMaterial({ 
      color: 0x0088AA, 
      transparent: true, 
      opacity: 0.7 
    });
    const bodyLayer2 = new THREE.Mesh(bodyLayer2Geometry, bodyLayer2Material);
    bodyLayer2.position.set(0, -6 * pixelSize, 0);
    bodyLayer2.castShadow = true;
    character.add(bodyLayer2);

    // Position character group properly
    character.position.y = 24 * pixelSize; // Lift character so feet are on ground

    // Add ground plane
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x7CB342 }); // Minecraft grass green
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    scene.add(character);
    
    console.log('✅ Created Minecraft character with official 1.8 proportions');
  };

  const updateCharacterSkin = (dataURL: string) => {
    if (!characterRef.current || textureLoadingRef.current) {
      console.log('🎮 Skipping skin update - character not ready or texture loading');
      return;
    }

    console.log('🎮 Updating 3D character skin with data URL:', dataURL?.substring(0, 50) + '...');
    
    textureLoadingRef.current = true;
    setIsSkinLoading(true);

    const loader = new THREE.TextureLoader();
    loader.load(
      dataURL, 
      (texture) => {
        // Check if component is still mounted and character exists
        if (!characterRef.current) {
          texture.dispose();
          textureLoadingRef.current = false;
          setIsSkinLoading(false);
          return;
        }

        console.log('✅ Texture loaded successfully, size:', texture.image.width, 'x', texture.image.height);
        
        // Configure texture for pixel art
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        texture.flipY = false;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;

        // Apply texture to character parts
        characterRef.current?.children.forEach((child, index) => {
          if (child instanceof THREE.Mesh) {
            // Dispose old material to prevent memory leaks
            if (child.material instanceof THREE.Material) {
              child.material.dispose();
            }

            // Create new material with the texture
            const material = new THREE.MeshLambertMaterial({ 
              map: texture,
              transparent: true,
              alphaTest: 0.1
            });

            // Apply UV coordinates based on official Minecraft 1.8+ skin layout
            // Order: head, body, rightArm, leftArm, rightLeg, leftLeg, headLayer2, bodyLayer2
            switch (index) {
              case 0: // Head (base layer)
                applyHeadUV(child.geometry as THREE.BoxGeometry);
                console.log('Applied head UV mapping');
                break;
              case 1: // Body (base layer)
                applyBodyUV(child.geometry as THREE.BoxGeometry);
                console.log('Applied body UV mapping');
                break;
              case 2: // Right Arm (base layer)
                applyRightArmUV(child.geometry as THREE.BoxGeometry);
                break;
              case 3: // Left Arm (base layer) 
                applyLeftArmUV(child.geometry as THREE.BoxGeometry);
                break;
              case 4: // Right Leg (base layer)
                applyRightLegUV(child.geometry as THREE.BoxGeometry);
                break;
              case 5: // Left Leg (base layer)
                applyLeftLegUV(child.geometry as THREE.BoxGeometry);
                break;
              case 6: // Head Layer 2 (hat/hair overlay)
                applyHeadLayer2UV(child.geometry as THREE.BoxGeometry);
                break;
              case 7: // Body Layer 2 (jacket overlay)
                applyBodyLayer2UV(child.geometry as THREE.BoxGeometry);
                break;
            }
            
            child.material = material;
          }
        });

        console.log('✅ 3D character skin updated successfully');
        textureLoadingRef.current = false;
        setIsSkinLoading(false);
      },
      undefined,
      (error) => {
        console.error('❌ Failed to load texture:', error);
        textureLoadingRef.current = false;
        setIsSkinLoading(false);
      }
    );
  };

  // UV mapping functions for Minecraft skin layout
  const applyHeadUV = (geometry: THREE.BoxGeometry) => {
    const uvAttribute = geometry.attributes.uv;
    const uvArray = uvAttribute.array as Float32Array;

    // Minecraft head UV coordinates (normalized 0-1)
    const headUVs = [
      // Right face (x+)
      16/64, 8/64, 24/64, 8/64, 24/64, 16/64, 16/64, 16/64,
      // Left face (x-)
      0/64, 8/64, 8/64, 8/64, 8/64, 16/64, 0/64, 16/64,
      // Top face (y+)
      8/64, 0/64, 16/64, 0/64, 16/64, 8/64, 8/64, 8/64,
      // Bottom face (y-)
      16/64, 0/64, 24/64, 0/64, 24/64, 8/64, 16/64, 8/64,
      // Front face (z+)
      8/64, 8/64, 16/64, 8/64, 16/64, 16/64, 8/64, 16/64,
      // Back face (z-)
      24/64, 8/64, 32/64, 8/64, 32/64, 16/64, 24/64, 16/64
    ];

    for (let i = 0; i < headUVs.length; i++) {
      uvArray[i] = headUVs[i];
    }

    uvAttribute.needsUpdate = true;
  };

  const applyBodyUV = (geometry: THREE.BoxGeometry) => {
    const uvAttribute = geometry.attributes.uv;
    const uvArray = uvAttribute.array as Float32Array;

    // Minecraft body UV coordinates
    const bodyUVs = [
      // Right face
      28/64, 20/64, 32/64, 20/64, 32/64, 32/64, 28/64, 32/64,
      // Left face
      16/64, 20/64, 20/64, 20/64, 20/64, 32/64, 16/64, 32/64,
      // Top face
      20/64, 16/64, 28/64, 16/64, 28/64, 20/64, 20/64, 20/64,
      // Bottom face
      28/64, 16/64, 36/64, 16/64, 36/64, 20/64, 28/64, 20/64,
      // Front face
      20/64, 20/64, 28/64, 20/64, 28/64, 32/64, 20/64, 32/64,
      // Back face
      32/64, 20/64, 40/64, 20/64, 40/64, 32/64, 32/64, 32/64
    ];

    for (let i = 0; i < bodyUVs.length; i++) {
      uvArray[i] = bodyUVs[i];
    }

    uvAttribute.needsUpdate = true;
  };

  const applyRightArmUV = (geometry: THREE.BoxGeometry) => {
    const uvAttribute = geometry.attributes.uv;
    const uvArray = uvAttribute.array as Float32Array;

    // Right arm UV coordinates
    const armUVs = [
      // Right face
      48/64, 20/64, 52/64, 20/64, 52/64, 32/64, 48/64, 32/64,
      // Left face
      40/64, 20/64, 44/64, 20/64, 44/64, 32/64, 40/64, 32/64,
      // Top face
      44/64, 16/64, 48/64, 16/64, 48/64, 20/64, 44/64, 20/64,
      // Bottom face
      48/64, 16/64, 52/64, 16/64, 52/64, 20/64, 48/64, 20/64,
      // Front face
      44/64, 20/64, 48/64, 20/64, 48/64, 32/64, 44/64, 32/64,
      // Back face
      52/64, 20/64, 56/64, 20/64, 56/64, 32/64, 52/64, 32/64
    ];

    for (let i = 0; i < armUVs.length; i++) {
      uvArray[i] = armUVs[i];
    }

    uvAttribute.needsUpdate = true;
  };

  const applyLeftArmUV = (geometry: THREE.BoxGeometry) => {
    const uvAttribute = geometry.attributes.uv;
    const uvArray = uvAttribute.array as Float32Array;

    // Left arm UV coordinates (mirrored from right arm for new skin format)
    const armUVs = [
      // Right face
      44/64, 52/64, 48/64, 52/64, 48/64, 64/64, 44/64, 64/64,
      // Left face
      36/64, 52/64, 40/64, 52/64, 40/64, 64/64, 36/64, 64/64,
      // Top face
      40/64, 48/64, 44/64, 48/64, 44/64, 52/64, 40/64, 52/64,
      // Bottom face
      44/64, 48/64, 48/64, 48/64, 48/64, 52/64, 44/64, 52/64,
      // Front face
      40/64, 52/64, 44/64, 52/64, 44/64, 64/64, 40/64, 64/64,
      // Back face
      48/64, 52/64, 52/64, 52/64, 52/64, 64/64, 48/64, 64/64
    ];

    for (let i = 0; i < armUVs.length; i++) {
      uvArray[i] = armUVs[i];
    }

    uvAttribute.needsUpdate = true;
  };

  const applyRightLegUV = (geometry: THREE.BoxGeometry) => {
    const uvAttribute = geometry.attributes.uv;
    const uvArray = uvAttribute.array as Float32Array;

    // Right leg UV coordinates
    const legUVs = [
      // Right face
      8/64, 20/64, 12/64, 20/64, 12/64, 32/64, 8/64, 32/64,
      // Left face
      0/64, 20/64, 4/64, 20/64, 4/64, 32/64, 0/64, 32/64,
      // Top face
      4/64, 16/64, 8/64, 16/64, 8/64, 20/64, 4/64, 20/64,
      // Bottom face
      8/64, 16/64, 12/64, 16/64, 12/64, 20/64, 8/64, 20/64,
      // Front face
      4/64, 20/64, 8/64, 20/64, 8/64, 32/64, 4/64, 32/64,
      // Back face
      12/64, 20/64, 16/64, 20/64, 16/64, 32/64, 12/64, 32/64
    ];

    for (let i = 0; i < legUVs.length; i++) {
      uvArray[i] = legUVs[i];
    }

    uvAttribute.needsUpdate = true;
  };

  const applyLeftLegUV = (geometry: THREE.BoxGeometry) => {
    const uvAttribute = geometry.attributes.uv;
    const uvArray = uvAttribute.array as Float32Array;

    // Left leg UV coordinates (mirrored for new skin format)
    const legUVs = [
      // Right face
      24/64, 52/64, 28/64, 52/64, 28/64, 64/64, 24/64, 64/64,
      // Left face
      16/64, 52/64, 20/64, 52/64, 20/64, 64/64, 16/64, 64/64,
      // Top face
      20/64, 48/64, 24/64, 48/64, 24/64, 52/64, 20/64, 52/64,
      // Bottom face
      24/64, 48/64, 28/64, 48/64, 28/64, 52/64, 24/64, 52/64,
      // Front face
      20/64, 52/64, 24/64, 52/64, 24/64, 64/64, 20/64, 64/64,
      // Back face
      28/64, 52/64, 32/64, 52/64, 32/64, 64/64, 28/64, 64/64
    ];

    for (let i = 0; i < legUVs.length; i++) {
      uvArray[i] = legUVs[i];
    }

    uvAttribute.needsUpdate = true;
  };

  const applyHeadLayer2UV = (geometry: THREE.BoxGeometry) => {
    const uvAttribute = geometry.attributes.uv;
    const uvArray = uvAttribute.array as Float32Array;

    // Head Layer 2 (Hat) UV coordinates - offset by 32 pixels
    const hatUVs = [
      // Right face
      48/64, 8/64, 56/64, 8/64, 56/64, 16/64, 48/64, 16/64,
      // Left face
      32/64, 8/64, 40/64, 8/64, 40/64, 16/64, 32/64, 16/64,
      // Top face
      40/64, 0/64, 48/64, 0/64, 48/64, 8/64, 40/64, 8/64,
      // Bottom face
      48/64, 0/64, 56/64, 0/64, 56/64, 8/64, 48/64, 8/64,
      // Front face
      40/64, 8/64, 48/64, 8/64, 48/64, 16/64, 40/64, 16/64,
      // Back face
      56/64, 8/64, 64/64, 8/64, 64/64, 16/64, 56/64, 16/64
    ];

    for (let i = 0; i < hatUVs.length; i++) {
      uvArray[i] = hatUVs[i];
    }

    uvAttribute.needsUpdate = true;
  };

  const applyBodyLayer2UV = (geometry: THREE.BoxGeometry) => {
    const uvAttribute = geometry.attributes.uv;
    const uvArray = uvAttribute.array as Float32Array;

    // Body Layer 2 (Jacket) UV coordinates - offset by 16 pixels vertically
    const jacketUVs = [
      // Right face
      28/64, 36/64, 32/64, 36/64, 32/64, 48/64, 28/64, 48/64,
      // Left face
      16/64, 36/64, 20/64, 36/64, 20/64, 48/64, 16/64, 48/64,
      // Top face
      20/64, 32/64, 28/64, 32/64, 28/64, 36/64, 20/64, 36/64,
      // Bottom face
      28/64, 32/64, 36/64, 32/64, 36/64, 36/64, 28/64, 36/64,
      // Front face
      20/64, 36/64, 28/64, 36/64, 28/64, 48/64, 20/64, 48/64,
      // Back face
      32/64, 36/64, 40/64, 36/64, 40/64, 48/64, 32/64, 48/64
    ];

    for (let i = 0; i < jacketUVs.length; i++) {
      uvArray[i] = jacketUVs[i];
    }

    uvAttribute.needsUpdate = true;
  };

  const animate = () => {
    if (!sceneRef.current || !rendererRef.current || !cameraRef.current) return;

    // Update camera controls
    if (controlsRef.current) {
      controlsRef.current.update();
    }

    // Optional auto-rotation (only if no user interaction)
    if (autoRotate && characterRef.current && controlsRef.current && !controlsRef.current.enabled) {
      characterRef.current.rotation.y += 0.01;
    }

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    animationRef.current = requestAnimationFrame(animate);
  };

  return (
    <div 
      ref={mountRef} 
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        border: '2px solid #555',
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative'
      }}
      aria-label="3D Minecraft character preview"
      title="Click and drag to rotate view, scroll to zoom"
    >
      {!isLoaded && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#888',
          fontSize: '14px',
          textAlign: 'center'
        }}>
          Loading 3D model...
        </div>
      )}
      
      {isLoaded && !isSkinLoading && (
        <div style={{
          position: 'absolute',
          bottom: '5px',
          left: '5px',
          color: '#888',
          fontSize: '10px',
          background: 'rgba(0,0,0,0.5)',
          padding: '2px 6px',
          borderRadius: '3px'
        }}>
          Drag to rotate • Scroll to zoom
        </div>
      )}
      
      {isSkinLoading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#4CAF50',
          fontSize: '12px',
          textAlign: 'center',
          background: 'rgba(0,0,0,0.7)',
          padding: '8px 12px',
          borderRadius: '6px'
        }}>
          🔄 Updating skin...
        </div>
      )}
    </div>
  );
}