import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

// Materials and Geometries
// 1. Floor
// 2. Obstacle
// 3. Wall
// Creating one BoxGeometry and reusing it for all the meshes in the scene is a good practice. This way, we can save memory and improve performance.
const boxGeometry = new THREE.BoxGeometry(1, 1, 1); //
const floor1Material = new THREE.MeshStandardMaterial({ color: "green" });
const floor2Material = new THREE.MeshStandardMaterial({ color: "blue" });
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: "red" });
const wallMaterial = new THREE.MeshStandardMaterial({ color: "slategrey" });

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

function BlockSpinner({ position = [0, 0, 0] }) {
  const obstacleRef = useRef();
  // Rotating the obstacle using useFrame This hook is used to rotate the obstacle around the Y-axis. The rotation is calculated using the clock from the useFrame hook. The obstacle is rotated by setting the quaternion of the obstacleRef. The rotation is calculated using the setFromEuler method of the Quaternion class. The rotation is applied to the Y-axis using the Euler class. The rotation is applied to the obstacle using the copy method.
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const rotation = new THREE.Quaternion();
    rotation.setFromEuler(new THREE.Euler(0, time, 0));
    obstacleRef.current.quaternion.copy(rotation);
  });
  return (
    <group position={position}>
      {/* Floor */}
      <mesh
        geometry={boxGeometry}
        material={floor2Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      {/* Obstacle */}
      <mesh
        ref={obstacleRef}
        geometry={boxGeometry}
        material={obstacleMaterial}
        position={[0, 0.5, 0]}
        scale={[3.5, 0.3, 0.3]}
        castShadow
        receiveShadow
      />
    </group>
  );
}

export default function Level() {
  return (
    <>
      <RigidBody
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <BlockStart position={[0, 0, 4]} />
        <BlockSpinner position={[0, 0, 0]} />
      </RigidBody>
    </>
  );
}
