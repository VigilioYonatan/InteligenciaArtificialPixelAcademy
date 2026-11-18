import { useEffect, useRef, useState } from 'preact/hooks';
import * as THREE from 'three';
import { Button, Card, Icon } from '../../shared/ui/primitives';

type NodeKind = 'safe' | 'hr_exec' | 'cross_tenant' | 'deleted' | 'injection';

type VectorNodeSpec = {
  id: string;
  label: string;
  tenant: 't1' | 't2';
  kind: NodeKind;
  pos: [number, number, number];
  similarity: number;
};

type ArenaWave = {
  id: string;
  title: string;
  brief: string;
  question: string;
  options: Array<{ id: string; label: string; correct: boolean }>;
  nodes: VectorNodeSpec[];
};

const ARENA_WAVES: ArenaWave[] = [
  {
    id: 'wave-acl',
    title: 'Wave 1 · Multi-Tenant ACL Shield',
    brief:
      'Haz clic en los nodos 3D rojos/ámbar para ponerlos en cuarentena (o activa el filtro ACL + Iterative Scan) sin perder los chunks t1 · public.',
    question: '¿Cómo garantizas Recall@K alto sin fuga cross-tenant en pgvector HNSW?',
    options: [
      { id: 'post', label: 'Post-filtrar Top-K en Python/Node tras buscar HNSW', correct: false },
      { id: 'pre', label: 'Filtrar tenant_id + allowed_principals antes de Top-K con iterative_scan', correct: true },
      { id: 'cache', label: 'Compartir cache vectorial global sin tenant_id', correct: false },
    ],
    nodes: [
      { id: 'c1', label: 'DOC-101 (t1 · public)', tenant: 't1', kind: 'safe', pos: [1.5, 0.7, 0.4], similarity: 0.94 },
      { id: 'c2', label: 'DOC-102 (t1 · public)', tenant: 't1', kind: 'safe', pos: [-1.3, 0.9, -0.5], similarity: 0.89 },
      { id: 'c3', label: 'SALARIES (t1 · hr_exec)', tenant: 't1', kind: 'hr_exec', pos: [0.7, -0.8, 0.9], similarity: 0.96 },
      { id: 'c4', label: 'MERGER (t2 · cross-tenant)', tenant: 't2', kind: 'cross_tenant', pos: [-0.7, -0.5, 1.2], similarity: 0.95 },
      { id: 'c5', label: 'ERASED-44 (t1 · deleted)', tenant: 't1', kind: 'deleted', pos: [0.9, 1.1, -1.0], similarity: 0.91 },
      { id: 'c6', label: 'DOC-108 (t1 · public)', tenant: 't1', kind: 'safe', pos: [-1.6, -0.9, -0.8], similarity: 0.84 },
    ],
  },
  {
    id: 'wave-injection',
    title: 'Wave 2 · Prompt Injection Firewall',
    brief:
      'Un PDF externo contiene instrucciones ocultas. Cuarentena los nodos [INJECT] antes de que envíen contexto al Query Core.',
    question: '¿Cuál es la defensa correcta frente a un chunk RAG con instrucciones maliciosas?',
    options: [
      { id: 'trust', label: 'Concatenar el chunk directo en el system prompt', correct: false },
      { id: 'delimit', label: 'Aislar con <untrusted_context> + allowlist estricta de tools MCP', correct: true },
      { id: 'retry', label: 'Reintentar 3 veces con temperatura 1.0', correct: false },
    ],
    nodes: [
      { id: 'i1', label: 'SPEC-201 (t1 · verified)', tenant: 't1', kind: 'safe', pos: [1.4, 0.5, -0.4], similarity: 0.93 },
      { id: 'i2', label: 'PDF-TRAP ([INJECT] exfiltrate)', tenant: 't1', kind: 'injection', pos: [-0.8, 0.9, 1.0], similarity: 0.97 },
      { id: 'i3', label: 'EMAIL-HOOK ([INJECT] override)', tenant: 't1', kind: 'injection', pos: [0.8, -0.9, 0.7], similarity: 0.95 },
      { id: 'i4', label: 'SLA-204 (t1 · verified)', tenant: 't1', kind: 'safe', pos: [-1.4, -0.6, -0.7], similarity: 0.88 },
    ],
  },
  {
    id: 'wave-gdpr',
    title: 'Wave 3 · GDPR Erasure & FinOps Cache',
    brief:
      'Un cliente ejecutó derecho al olvido. Purga los tombstones y bloquea claves de caché de otro tenant para evitar fugas.',
    question: '¿Qué debe ocurrir cuando un documento es eliminado por GDPR en un sistema RAG?',
    options: [
      { id: 'keep', label: 'Dejar el vector en caché semántica 7 días por ahorro FinOps', correct: false },
      { id: 'purge', label: 'Borrar chunks + embeddings + invalidar entradas de caché del tenant/doc', correct: true },
      { id: 'rename', label: 'Cambiar solo el título en PostgreSQL sin tocar pgvector', correct: false },
    ],
    nodes: [
      { id: 'g1', label: 'POLICY-01 (t1 · active)', tenant: 't1', kind: 'safe', pos: [1.2, 0.8, 0.6], similarity: 0.92 },
      { id: 'g2', label: 'GDPR-TOMB-09 (deleted)', tenant: 't1', kind: 'deleted', pos: [-1.1, 0.7, 0.9], similarity: 0.96 },
      { id: 'g3', label: 'CACHE-LEAK (t2 · shared key)', tenant: 't2', kind: 'cross_tenant', pos: [0.9, -0.7, -1.0], similarity: 0.94 },
      { id: 'g4', label: 'POLICY-02 (t1 · active)', tenant: 't1', kind: 'safe', pos: [-1.3, -0.8, -0.5], similarity: 0.86 },
    ],
  },
];

export function RagVectorArena3D({
  reducedMotion = false,
  onCompleteArena,
}: {
  reducedMotion?: boolean;
  onCompleteArena: () => void;
}) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [waveIdx, setWaveIdx] = useState(0);
  const [aclEnabled, setAclEnabled] = useState(false);
  const [iterativeScan, setIterativeScan] = useState(false);
  const [quarantinedIds, setQuarantinedIds] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [webglReady, setWebglReady] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const pulseBoostRef = useRef(0);

  const wave = ARENA_WAVES[waveIdx] || ARENA_WAVES[0];

  const isThreat = (node: VectorNodeSpec) => node.kind !== 'safe';
  const isNodeBlocked = (node: VectorNodeSpec) =>
    quarantinedIds.includes(node.id) || (aclEnabled && isThreat(node));

  const activeThreats = wave.nodes.filter((n) => isThreat(n) && !isNodeBlocked(n)).length;
  const blockedSafe = wave.nodes.filter((n) => !isThreat(n) && quarantinedIds.includes(n.id)).length;
  const totalSafe = wave.nodes.filter((n) => !isThreat(n)).length;
  const activeSafe = totalSafe - blockedSafe;

  const effectiveRecall =
    totalSafe === 0
      ? 0
      : activeThreats > 0
        ? Math.round((activeSafe / totalSafe) * (aclEnabled ? 33 : 40))
        : iterativeScan || waveIdx > 0
          ? Math.round((activeSafe / totalSafe) * 100)
          : Math.round((activeSafe / totalSafe) * 55);

  const leakageRisk = Math.round((activeThreats / Math.max(1, wave.nodes.length)) * 100);

  const toggleQuarantine = (node: VectorNodeSpec) => {
    setFeedback(null);
    setQuarantinedIds((prev) => {
      const exists = prev.includes(node.id);
      if (exists) return prev.filter((id) => id !== node.id);
      if (isThreat(node)) {
        setScore((s) => s + 120);
      } else {
        setScore((s) => Math.max(0, s - 60));
      }
      return [...prev, node.id];
    });
  };

  const switchWave = (nextIdx: number) => {
    setWaveIdx(nextIdx);
    setQuarantinedIds([]);
    setSelectedAnswer(null);
    setFeedback(null);
    setHoveredNode(null);
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let rafId = 0;

    try {
      const width = container.clientWidth || 560;
      const height = 290;
      const scene = new THREE.Scene();
      scene.background = new THREE.Color('#050505');

      const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 50);
      camera.position.set(0, 1.35, 4.7);
      camera.lookAt(0, 0, 0);

      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'low-power' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      container.innerHTML = '';
      container.appendChild(renderer.domElement);

      const group = new THREE.Group();
      scene.add(group);

      const grid = new THREE.GridHelper(6.4, 14, 0x262626, 0x161616);
      grid.position.y = -1.6;
      scene.add(grid);

      // Query Core (Octahedron) + Pulse Ring
      const queryGeo = new THREE.OctahedronGeometry(0.3, 0);
      const queryColor = activeThreats === 0 ? 0x10b981 : 0x3291ff;
      const queryMat = new THREE.MeshBasicMaterial({ color: queryColor, wireframe: false });
      const queryMesh = new THREE.Mesh(queryGeo, queryMat);
      group.add(queryMesh);

      const ringGeo = new THREE.RingGeometry(0.45, 0.52, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: activeThreats === 0 ? 0x10b981 : 0x3291ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.55,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      group.add(ringMesh);

      const disposables: Array<{ dispose: () => void }> = [queryGeo, queryMat, ringGeo, ringMat];
      const interactiveMeshes: THREE.Mesh[] = [];

      for (const node of wave.nodes) {
        const blocked = isNodeBlocked(node);
        const threat = isThreat(node);

        const color = blocked
          ? 0x52525b
          : !threat
            ? 0x10b981
            : node.kind === 'hr_exec'
              ? 0xf5a623
              : 0xff4d4f;

        const geo = threat ? new THREE.BoxGeometry(0.3, 0.3, 0.3) : new THREE.SphereGeometry(0.18, 16, 16);
        const mat = new THREE.MeshBasicMaterial({
          color,
          wireframe: blocked,
          transparent: blocked,
          opacity: blocked ? 0.35 : 1,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(...node.pos);
        mesh.userData = { nodeId: node.id };
        group.add(mesh);
        interactiveMeshes.push(mesh);

        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(...node.pos),
        ]);
        const lineMat = new THREE.LineBasicMaterial({
          color,
          transparent: true,
          opacity: blocked ? 0.12 : 0.55,
        });
        const line = new THREE.Line(lineGeo, lineMat);
        group.add(line);

        disposables.push(geo, mat, lineGeo, lineMat);
      }

      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();
      let dragging = false;
      let prevX = 0;
      let downX = 0;
      let downY = 0;

      const canvas = renderer.domElement;
      canvas.style.cursor = 'grab';

      const onPointerDown = (e: PointerEvent) => {
        dragging = true;
        prevX = e.clientX;
        downX = e.clientX;
        downY = e.clientY;
        canvas.style.cursor = 'grabbing';
      };

      const onPointerMove = (e: PointerEvent) => {
        if (dragging) {
          const deltaX = e.clientX - prevX;
          group.rotation.y += deltaX * 0.01;
          prevX = e.clientX;
          return;
        }
        const rect = canvas.getBoundingClientRect();
        pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObjects(interactiveMeshes);
        if (hits.length > 0) {
          const hitId = String(hits[0].object.userData?.nodeId || '');
          setHoveredNode(hitId || null);
          canvas.style.cursor = 'pointer';
        } else {
          setHoveredNode(null);
          canvas.style.cursor = 'grab';
        }
      };

      const onPointerUp = (e: PointerEvent) => {
        dragging = false;
        canvas.style.cursor = 'grab';
        const moved = Math.hypot(e.clientX - downX, e.clientY - downY);
        if (moved < 6) {
          const rect = canvas.getBoundingClientRect();
          pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
          raycaster.setFromCamera(pointer, camera);
          const hits = raycaster.intersectObjects(interactiveMeshes);
          if (hits.length > 0) {
            const hitId = String(hits[0].object.userData?.nodeId || '');
            const found = wave.nodes.find((n) => n.id === hitId);
            if (found) toggleQuarantine(found);
          }
        }
      };

      canvas.addEventListener('pointerdown', onPointerDown);
      canvas.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);

      let pulse = 0;
      const renderFrame = () => {
        if (!reducedMotion && !dragging) {
          group.rotation.y += 0.0045;
          const boosted = pulseBoostRef.current > 0;
          pulse += boosted ? 0.14 : 0.04;
          const baseScale = boosted ? 1.55 : 1;
          const s = baseScale + Math.sin(pulse) * 0.28;
          ringMesh.scale.set(s, s, 1);
          queryMesh.rotation.y -= boosted ? 0.045 : 0.012;
        }
        renderer?.render(scene, camera);
        rafId = window.requestAnimationFrame(renderFrame);
      };
      renderFrame();

      return () => {
        window.cancelAnimationFrame(rafId);
        canvas.removeEventListener('pointerdown', onPointerDown);
        canvas.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        for (const item of disposables) item.dispose();
        renderer?.dispose();
      };
    } catch {
      setWebglReady(false);
      return () => {
        window.cancelAnimationFrame(rafId);
        renderer?.dispose();
      };
    }
  }, [waveIdx, aclEnabled, iterativeScan, quarantinedIds, reducedMotion]);

  const validateMission = () => {
    const selectedOpt = wave.options.find((o) => o.id === selectedAnswer);
    const waveSafeAndClean =
      activeThreats === 0 &&
      blockedSafe === 0 &&
      (waveIdx > 0 || (aclEnabled && iterativeScan)) &&
      Boolean(selectedOpt?.correct);

    if (waveSafeAndClean) {
      setFeedback('correct');
      setScore((s) => s + 250);
      setStreak((st) => st + 1);
      onCompleteArena();
    } else {
      setFeedback('incorrect');
      setStreak(0);
    }
  };

  return (
    <Card className="arena-3d-card">
      <div class="arena-3d-head">
        <div>
          <span class="eyebrow small">THREE.JS INTERACTIVE SANDBOX · SENIOR MODE</span>
          <h2>{wave.title}</h2>
          <p>{wave.brief}</p>
        </div>
        <section class="arena-3d-metrics" aria-label="Arena telemetry">
          <span class="tag info tabular-nums">Score: {score}</span>
          <span class="tag info tabular-nums">Streak: {streak}</span>
          <span class={`tag ${effectiveRecall >= 90 ? 'ok' : 'warn'} tabular-nums`}>
            Recall@K: {effectiveRecall}%
          </span>
          <span class={`tag ${leakageRisk === 0 ? 'ok' : 'bad'} tabular-nums`}>
            Leakage Risk: {leakageRisk}%
          </span>
        </section>
      </div>

      <div class="arena-wave-tabs" role="tablist" aria-label="Misiones 3D">
        {ARENA_WAVES.map((w, idx) => (
          <Button
            key={w.id}
            kind={idx === waveIdx ? 'primary' : 'outline'}
            onClick={() => switchWave(idx)}
          >
            {`Wave ${idx + 1}: ${w.title.split('·')[1]?.trim() || w.title}`}
          </Button>
        ))}
      </div>

      <div class="arena-3d-stage">
        {webglReady ? (
          <section
            ref={mountRef}
            class="arena-3d-canvas-wrap"
            aria-label="Espacio vectorial 3D interactivo: arrastra para rotar y haz clic en nodos para cuarentenar"
          />
        ) : (
          <section class="arena-3d-fallback" aria-label="Fallback vectorial 2D">
            <p>
              <strong>Visor 3D (modo accesible):</strong> Haz clic en los nodos abajo para
              cuarentenar amenazas o activa el escudo ACL.
            </p>
          </section>
        )}

        <div class="arena-3d-controls">
          <Button
            kind={aclEnabled ? 'primary' : 'outline'}
            onClick={() => {
              setAclEnabled((v) => !v);
              setFeedback(null);
            }}
          >
            <Icon name="shield" size={16} />
            {aclEnabled ? 'Filtro tenant_id + ACL: ON' : 'Activar Filtro tenant_id + ACL'}
          </Button>
          <Button
            kind={iterativeScan ? 'primary' : 'outline'}
            onClick={() => {
              setIterativeScan((v) => !v);
              setFeedback(null);
            }}
          >
            <Icon name="search" size={16} />
            {iterativeScan ? 'HNSW Iterative Scan: ON' : 'Activar Iterative Scan'}
          </Button>
          <Button
            kind="senior"
            onClick={() => {
              pulseBoostRef.current += 1;
              window.setTimeout(() => {
                pulseBoostRef.current = Math.max(0, pulseBoostRef.current - 1);
              }, 1200);
            }}
          >
            <Icon name="play" size={16} />
            Disparar Query 3D
          </Button>
          {hoveredNode && (
            <span class="tag info">
              Nodo 3D: {wave.nodes.find((n) => n.id === hoveredNode)?.label || hoveredNode}
            </span>
          )}
        </div>
      </div>

      <section class="arena-node-list" aria-label="Nodos vectoriales interactivos">
        {wave.nodes.map((n) => {
          const blocked = isNodeBlocked(n);
          const threat = isThreat(n);
          return (
            <button
              type="button"
              key={n.id}
              onClick={() => toggleQuarantine(n)}
              class={`tag arena-node-btn ${
                blocked ? 'warn' : threat ? 'bad' : 'ok'
              } ${hoveredNode === n.id ? 'hovered' : ''}`}
              title="Clic para alternar cuarentena"
            >
              <span>{blocked ? '🛡 Quarantined · ' : threat ? '⚠ Threat · ' : '✓ Safe · '}</span>
              {n.label} · cos={n.similarity}
            </button>
          );
        })}
      </section>

      <div class="arena-3d-quiz">
        <p>
          <strong>Decisión Senior:</strong> {wave.question}
        </p>
        <div class="options-grid">
          {wave.options.map((opt) => (
            <button
              type="button"
              key={opt.id}
              class={`option-card ${selectedAnswer === opt.id ? 'selected' : ''}`}
              onClick={() => {
                setSelectedAnswer(opt.id);
                setFeedback(null);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div class="editor-actions">
          <Button onClick={validateMission}>
            <Icon name="check" size={16} />
            Comprobar Misión 3D
          </Button>
          {waveIdx < ARENA_WAVES.length - 1 && (
            <Button kind="outline" onClick={() => switchWave(waveIdx + 1)}>
              Siguiente Wave →
            </Button>
          )}
        </div>
        {feedback && (
          <output class={`feedback ${feedback}`}>
            {feedback === 'correct'
              ? `✓ Misión blindada: Recall@K=${effectiveRecall}% y 0% fuga en ${wave.title}.`
              : '○ Bloquea las amenazas (nodos rojos/ámbar o Filtro ACL + Iterative Scan) y elige la decisión Senior correcta.'}
          </output>
        )}
      </div>
    </Card>
  );
}
