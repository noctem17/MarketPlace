import { useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  PanResponder, Platform,
} from 'react-native';
import { Canvas, useFrame, useThree } from '@react-three/fiber/native';
import * as THREE from 'three';
import { STORES } from '../../constants/stores';
import { useGameStore } from '../../hooks/useGameStore';
import VendorModal from '../../components/VendorModal';

// ── Cámara al hombro ──────────────────────────────────────
function ShoulderCamera({ playerRef }: { playerRef: React.RefObject<THREE.Group> }) {
  const { camera } = useThree();
  useFrame(() => {
    if (!playerRef.current) return;
    const px = playerRef.current.position.x;
    const pz = playerRef.current.position.z;
    camera.position.x += (px - camera.position.x) * 0.10;
    camera.position.y += (2.5 - camera.position.y) * 0.08;
    camera.position.z += (pz + 5 - camera.position.z) * 0.10;
    camera.lookAt(px, 1.0, pz);
  });
  return null;
}

// ── Suelo ─────────────────────────────────────────────────
function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[60, 60]} />
      <meshLambertMaterial color="#111122" />
    </mesh>
  );
}

// ── Plaza central ─────────────────────────────────────────
function Plaza() {
  return (
    <group>
      <mesh position={[0, 0.075, 0]}>
        <cylinderGeometry args={[2.5, 2.5, 0.15, 32]} />
        <meshLambertMaterial color="#e94560" />
      </mesh>
      <mesh position={[0, 1.15, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 2, 8]} />
        <meshLambertMaterial color="#c73652" />
      </mesh>
      <mesh position={[0, 2.3, 0]}>
        <sphereGeometry args={[0.4, 12, 12]} />
        <meshLambertMaterial color="#ff6b88" />
      </mesh>
    </group>
  );
}

// ── Stand de tienda ───────────────────────────────────────
function StoreBooth({ store }: { store: typeof STORES[0] }) {
  const [x, , z] = store.position;
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[4, 0.1, 4]} />
        <meshLambertMaterial color={store.color} transparent opacity={0.3} />
      </mesh>
      <mesh position={[0, 1.6, -1.9]}>
        <boxGeometry args={[4, 3, 0.15]} />
        <meshLambertMaterial color={store.color} transparent opacity={0.6} />
      </mesh>
      <mesh position={[-1.9, 1.6, 0]}>
        <boxGeometry args={[0.15, 3, 4]} />
        <meshLambertMaterial color={store.color} transparent opacity={0.6} />
      </mesh>
      <mesh position={[1.9, 1.6, 0]}>
        <boxGeometry args={[0.15, 3, 4]} />
        <meshLambertMaterial color={store.color} transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, 0.55, 1.5]}>
        <boxGeometry args={[3.4, 0.9, 0.9]} />
        <meshLambertMaterial color="#f0f0f0" />
      </mesh>
      <mesh position={[0, 3.2, 0]}>
        <boxGeometry args={[4.6, 0.12, 4.6]} />
        <meshLambertMaterial color={store.color} />
      </mesh>
    </group>
  );
}

// ── Jugador ───────────────────────────────────────────────
// inputRef contiene dx/dz que se actualizan desde afuera (teclado o joystick)
function Player({
  playerRef,
  inputRef,
}: {
  playerRef: React.RefObject<THREE.Group>;
  inputRef: React.RefObject<{ dx: number; dz: number }>;
}) {
  useFrame((_, delta) => {
    if (!playerRef.current || !inputRef.current) return;
    const { dx, dz } = inputRef.current;
    if (dx === 0 && dz === 0) return;
    const speed = 6;
    playerRef.current.position.x = Math.max(
      -14, Math.min(14, playerRef.current.position.x + dx * speed * delta)
    );
    playerRef.current.position.z = Math.max(
      -14, Math.min(14, playerRef.current.position.z + dz * speed * delta)
    );
    playerRef.current.rotation.y = Math.atan2(dx, dz);
  });

  return (
    <group ref={playerRef} position={[0, 0, 0]}>
      {/* Cuerpo */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.9, 10]} />
        <meshLambertMaterial color="#e94560" />
      </mesh>
      {/* Cabeza */}
      <mesh position={[0, 1.25, 0]}>
        <sphereGeometry args={[0.28, 12, 12]} />
        <meshLambertMaterial color="#ffcc99" />
      </mesh>
    </group>
  );
}

// ── Detector de proximidad ────────────────────────────────
function ProximityDetector({ playerRef }: { playerRef: React.RefObject<THREE.Group> }) {
  const setNearbyStore = useGameStore(s => s.setNearbyStore);
  const lastId = useRef<number | null>(null);

  useFrame(() => {
    if (!playerRef.current) return;
    const px = playerRef.current.position.x;
    const pz = playerRef.current.position.z;
    let closest = null;
    let closestDist = Infinity;
    for (const store of STORES) {
      const dist = Math.hypot(px - store.position[0], pz - store.position[2]);
      if (dist < 4 && dist < closestDist) {
        closestDist = dist;
        closest = store;
      }
    }
    if (closest?.id !== lastId.current) {
      lastId.current = closest?.id ?? null;
      setNearbyStore(closest);
    }
  });
  return null;
}

// ── Luces ─────────────────────────────────────────────────
function Lights() {
  return (
    <>
      <ambientLight intensity={0.9} color="#334466" />
      <directionalLight position={[8, 15, 8]} intensity={1.2} />
      {STORES.map(store => (
        <pointLight
          key={store.id}
          position={[store.position[0], 3, store.position[2]]}
          color={store.color}
          intensity={1.5}
          distance={8}
        />
      ))}
    </>
  );
}


// PANTALLA PRINCIPAL

export default function WorldScreen() {
  const playerRef = useRef<THREE.Group>(null!);

  // inputRef es compartido entre el teclado (web) y el joystick (móvil)
  // dx = izquierda/derecha, dz = adelante/atrás
  const inputRef = useRef({ dx: 0, dz: 0 });

  const nearbyStore = useGameStore(s => s.nearbyStore);
  const activeStore = useGameStore(s => s.activeStore);
  const openStore   = useGameStore(s => s.openStore);
  const closeStore  = useGameStore(s => s.closeStore);

  // ── Teclado para probar en navegador (solo web) ────────
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const keys: Record<string, boolean> = {};

    const onDown = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = true;
      update();
    };
    const onUp = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = false;
      update();
    };
    const update = () => {
      let dx = 0, dz = 0;
      if (keys['a'] || keys['arrowleft'])  dx -= 1;
      if (keys['d'] || keys['arrowright']) dx += 1;
      if (keys['w'] || keys['arrowup'])    dz -= 1;
      if (keys['s'] || keys['arrowdown'])  dz += 1;
      // Normalizar diagonal
      const mag = Math.sqrt(dx * dx + dz * dz);
      inputRef.current = mag > 0 ? { dx: dx / mag, dz: dz / mag } : { dx: 0, dz: 0 };
    };

    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);

  // ── Joystick táctil con PanResponder (móvil) ──────────
  // PanResponder es el sistema nativo de React Native para gestos
  const touchStart = useRef({ x: 0, y: 0 });

  const panResponder = useRef(
    PanResponder.create({
      // ¿Este View debe responder a este toque? Sí siempre
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (e) => {
        // Guarda dónde empezó el toque
        touchStart.current = {
          x: e.nativeEvent.pageX,
          y: e.nativeEvent.pageY,
        };
      },

      onPanResponderMove: (e) => {
        const dx = (e.nativeEvent.pageX - touchStart.current.x) / 60;
        const dz = (e.nativeEvent.pageY - touchStart.current.y) / 60;
        const mag = Math.sqrt(dx * dx + dz * dz);
        // Limita la magnitud a 1 para que no vaya más rápido al arrastrar más
        inputRef.current = mag > 1
          ? { dx: dx / mag, dz: dz / mag }
          : { dx, dz };
      },

      onPanResponderRelease: () => {
        // Al soltar, el personaje se detiene
        inputRef.current = { dx: 0, dz: 0 };
      },

      onPanResponderTerminate: () => {
        inputRef.current = { dx: 0, dz: 0 };
      },
    })
  ).current;

  return (
    <View style={s.container}>

      {/* ── Canvas 3D ── */}
      <Canvas
        shadows
        camera={{ position: [0, 2.5, 5], fov: 60 }}
        style={s.canvas}
      >
        <color attach="background" args={['#0d0d1a']} />
        <fog attach="fog" args={['#0d0d1a', 20, 50]} />
        <Lights />
        <Floor />
        <Plaza />
        {STORES.map(store => (
          <StoreBooth key={store.id} store={store} />
        ))}
        <Player playerRef={playerRef} inputRef={inputRef} />
        <ShoulderCamera playerRef={playerRef} />
        <ProximityDetector playerRef={playerRef} />
      </Canvas>

      {/* ── Overlay táctil (PanResponder) ──
          Cubre toda la pantalla, captura el arrastre del dedo
          pointerEvents="box-only" asegura que este View recibe los toques ── */}
      <View
        style={s.touchOverlay}
        {...panResponder.panHandlers}
      />

      {/* ── HUD superior ── */}
      <View style={s.hud} pointerEvents="none">
        <Text style={s.title}> VirtualMartDistrital</Text>
        <Text style={s.subtitle}>
          {Platform.OS === 'web'
            ? 'WASD o flechas para moverte'
            : 'Arrastra la pantalla para moverte'}
        </Text>
      </View>

      {/* ── Prompt tienda cercana ── */}
      {nearbyStore && !activeStore && (
        <TouchableOpacity
          style={[s.prompt, { borderColor: nearbyStore.color }]}
          onPress={() => openStore(nearbyStore)}
        >
          <Text style={s.promptEmoji}>imagen o algo</Text>
          <View style={s.promptInfo}>
            <Text style={s.promptName}>{nearbyStore.name}</Text>
            <Text style={s.promptSub}>
              {nearbyStore.products.length} productos · {nearbyStore.ownerName}
            </Text>
          </View>
          <View style={[s.promptBtn, { backgroundColor: nearbyStore.color }]}>
            <Text style={s.promptBtnText}>Entrar →</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* ── Modal del vendedor ── */}
      {activeStore && (
        <VendorModal store={activeStore} onClose={closeStore} />
      )}

    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d1a',
  },
  canvas: {
    flex: 1,
  },
  // Overlay invisible que captura TODOS los toques para el joystick
  // Está encima del Canvas pero debajo del HUD y el prompt
  touchOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  hud: {
    position: 'absolute',
    top: 50, left: 16, right: 16,
  },
  title: {
    color: '#e94560',
    fontSize: 22,
    fontWeight: '900',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    marginTop: 2,
  },
  prompt: {
    position: 'absolute',
    bottom: 40, left: 16, right: 16,
    backgroundColor: 'rgba(10,10,20,0.92)',
    borderWidth: 2,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  promptEmoji: { fontSize: 32 },
  promptInfo: { flex: 1 },
  promptName: { color: 'white', fontWeight: '700', fontSize: 16 },
  promptSub: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 2 },
  promptBtn: { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 },
  promptBtnText: { color: 'white', fontWeight: '700', fontSize: 13 },
});