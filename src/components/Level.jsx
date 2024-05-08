import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const boxGeometry = new THREE.BoxGeometry(1, 1, 1); //
const floor1Material = new THREE.MeshStandardMaterial({
  color: getRandomColor(),
});
const floor2Material = [
  new THREE.MeshStandardMaterial({
    color: getRandomColor(),
  }),
  new THREE.MeshStandardMaterial({
    color: getRandomColor(),
  }),
  new THREE.MeshStandardMaterial({
    color: getRandomColor(),
  }),
  new THREE.MeshStandardMaterial({
    color: getRandomColor(),
  }),
  new THREE.MeshStandardMaterial({
    color: getRandomColor(),
  }),
];
const obstacleMaterials = [
  new THREE.MeshStandardMaterial({ color: getRandomColor() }),
  new THREE.MeshStandardMaterial({ color: getRandomColor() }),
  new THREE.MeshStandardMaterial({ color: getRandomColor() }),
  new THREE.MeshStandardMaterial({ color: getRandomColor() }),
  new THREE.MeshStandardMaterial({ color: getRandomColor() }),
];
const wallMaterial = new THREE.MeshStandardMaterial({
  color: getRandomColor(),
});

function getRandomMaterial() {
  return obstacleMaterials[
    Math.floor(Math.random() * obstacleMaterials.length)
  ];
}
function getRandomFloorMaterial() {
  return floor2Material[Math.floor(Math.random() * floor2Material.length)];
}

function BlockStart({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Floor */}
      <mesh
        geometry={boxGeometry}
        material={floor1Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
    </group>
  );
}
export function BlockSpinner({ position = [0, 0, 0] }) {
  const obstacleRef = useRef();
  const [speed] = useState(
    () => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1)
  );

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    const rotation = new THREE.Quaternion();
    rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
    obstacleRef.current.setNextKinematicRotation(rotation);
  });

  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={getRandomFloorMaterial()}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      <RigidBody
        ref={obstacleRef}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={getRandomMaterial()}
          scale={[3.5, 0.3, 0.3]}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  );
}

function BlockLimbo({ position = [0, 0, 0] }) {
  const obstacleRef = useRef();
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2);
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const y = Math.sin(time * timeOffset) + 1.15;
    obstacleRef.current.setNextKinematicTranslation({
      x: 0,
      y: y,
      z: position[2],
    });
  });
  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={getRandomFloorMaterial()}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      <RigidBody
        ref={obstacleRef}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={getRandomMaterial()}
          scale={[3.5, 0.3, 0.3]}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  );
}

export default function Level() {
  return (
    <>
      <BlockStart position={[0, 0, 8]} />
      <BlockSpinner position={[0, 0, 4]} />
      <BlockLimbo position={[0, 0, 0]} />
    </>
  );
}
