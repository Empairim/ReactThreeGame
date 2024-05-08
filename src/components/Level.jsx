import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
////////
//Geometry and Materials
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
////////
// functions to randomize colors
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getRandomMaterial() {
  return obstacleMaterials[
    Math.floor(Math.random() * obstacleMaterials.length)
  ];
}
function getRandomFloorMaterial() {
  return floor2Material[Math.floor(Math.random() * floor2Material.length)];
}
///////////
//Game blocks
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
    obstacleRef.current?.setNextKinematicRotation(rotation);
  });

  return (
    <group position={position}>
      {/* Floor */}
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
    obstacleRef.current?.setNextKinematicTranslation({
      x: position[0],
      y: position[1] + y,
      z: position[2],
    });
  });
  return (
    <group position={position}>
      {/* Floor */}
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

function BlockAxe({ position = [0, 0, 0] }) {
  const obstacleRef = useRef();
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2);
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const x = Math.sin(time * timeOffset) * 1.25;
    obstacleRef.current?.setNextKinematicTranslation({
      x: position[0] + x,
      y: position[1] + 0.75,
      z: position[2],
    });
  });
  return (
    <group position={position}>
      {/* Floor */}
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
          scale={[1.5, 1.5, 0.3]}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  );
}

function BlockEnd({ position = [0, 0, 0] }) {
  const goal = useGLTF("./goalGold.glb");
  console.log(goal);
  useEffect(() => {
    goal.scene.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
  }, [goal.scene]);

  const goalRef = useRef();
  useFrame(({ clock }) => {
    goalRef.current?.setNextKinematicTranslation({
      x: position[0],
      y:
        position[1] +
        1 +
        Math.sin(clock.getElapsedTime()) *
          Math.cos(clock.getElapsedTime()) *
          0.5,
      z: position[2],
    });
  });

  return (
    <group position={position}>
      {/* Floor */}
      <mesh
        geometry={boxGeometry}
        material={floor1Material}
        position={[0, 0, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      {/* Goal */}
      <RigidBody ref={goalRef} type="kinematicPosition" position={[0, 2.5, 0]}>
        <primitive object={goal.scene} />
      </RigidBody>
    </group>
  );
}
////////
// Level component
export default function Level() {
  return (
    <>
      <BlockStart position={[0, 0, 16]} />
      <BlockSpinner position={[0, 0, 12]} />
      <BlockLimbo position={[0, 0, 8]} />
      <BlockAxe position={[0, 0, 4]} />
      <BlockEnd position={[0, 0, 0]} />
    </>
  );
}
