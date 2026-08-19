import React from 'react';
import { forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation, SimulationNodeDatum } from 'd3-force';
import { NetworkEdge, NetworkNode } from '../../types';

interface PositionedNode extends SimulationNodeDatum {
  id: string;
  type: NetworkNode['type'];
  label: string;
  roleTag?: NetworkNode['roleTag'];
}

interface PositionedEdge {
  id: string;
  source: string | PositionedNode;
  target: string | PositionedNode;
  relation: NetworkEdge['relation'];
}

interface NetworkGraphProps {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
}

const NODE_COLORS: Record<NetworkNode['type'], string> = {
  pessoa: '#163A63',
  interesse: '#12B8AE',
  grupo: '#0A988F',
  unidade: '#4B6A88',
  localizacao: '#8FA3B8',
};

export const NetworkGraph: React.FC<NetworkGraphProps> = ({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
}) => {
  const [positions, setPositions] = React.useState<PositionedNode[]>([]);
  const [zoom, setZoom] = React.useState(1);
  const [pan, setPan] = React.useState({ x: 0, y: 0 });
  const dragRef = React.useRef<{ x: number; y: number } | null>(null);

  React.useEffect(() => {
    const simNodes: PositionedNode[] = nodes.map((n) => ({ ...n }));
    const simEdges: PositionedEdge[] = edges.map((e) => ({ ...e }));

    const simulation = forceSimulation(simNodes)
      .force('charge', forceManyBody().strength(-190))
      .force('center', forceCenter(460, 290))
      .force('collide', forceCollide(26))
      .force(
        'link',
        forceLink(simEdges)
          .id((d: any) => d.id)
          .distance(90)
          .strength(0.5)
      )
      .alpha(1)
      .alphaDecay(0.045)
      .on('tick', () => {
        setPositions([...simNodes]);
      });

    return () => {
      simulation.stop();
    };
  }, [nodes, edges]);

  const byId = React.useMemo(() => {
    const map = new Map<string, PositionedNode>();
    positions.forEach((node) => map.set(node.id, node));
    return map;
  }, [positions]);

  const relationSet = React.useMemo(() => {
    if (!selectedNodeId) return new Set<string>();
    const set = new Set<string>([selectedNodeId]);
    edges.forEach((e) => {
      if (e.source === selectedNodeId) set.add(e.target);
      if (e.target === selectedNodeId) set.add(e.source);
    });
    return set;
  }, [selectedNodeId, edges]);

  const opacityOf = (nodeId: string) => {
    if (!selectedNodeId) return 1;
    return relationSet.has(nodeId) ? 1 : 0.22;
  };

  return (
    <div className="bg-white rounded-2xl border border-[#D9E4EE] overflow-hidden">
      <div className="px-4 py-3 border-b border-[#EEF3F7] flex items-center justify-between gap-2">
        <p className="text-xs font-bold text-[#163A63]">Minha Constelacao</p>
        <div className="flex items-center gap-2">
          <button
            className="px-2 py-1 text-[11px] rounded-lg border border-[#D9E4EE] text-[#163A63]"
            onClick={() => setZoom((z) => Math.max(0.6, z - 0.1))}
            aria-label="Reduzir zoom"
          >
            -
          </button>
          <button
            className="px-2 py-1 text-[11px] rounded-lg border border-[#D9E4EE] text-[#163A63]"
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            aria-label="Resetar visao"
          >
            Reset
          </button>
          <button
            className="px-2 py-1 text-[11px] rounded-lg border border-[#D9E4EE] text-[#163A63]"
            onClick={() => setZoom((z) => Math.min(2.2, z + 0.1))}
            aria-label="Aumentar zoom"
          >
            +
          </button>
        </div>
      </div>

      <div
        className="relative h-[520px] bg-[#F9FBFC]"
        onMouseDown={(e) => {
          dragRef.current = { x: e.clientX, y: e.clientY };
        }}
        onMouseMove={(e) => {
          if (!dragRef.current) return;
          setPan((prev) => ({
            x: prev.x + (e.clientX - dragRef.current!.x),
            y: prev.y + (e.clientY - dragRef.current!.y),
          }));
          dragRef.current = { x: e.clientX, y: e.clientY };
        }}
        onMouseUp={() => {
          dragRef.current = null;
        }}
        onMouseLeave={() => {
          dragRef.current = null;
        }}
      >
        <svg className="w-full h-full" role="img" aria-label="Grafo de conexoes da sua rede">
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {edges.map((edge) => {
              const source = byId.get(edge.source);
              const target = byId.get(edge.target);
              if (!source || !target) return null;
              const muted =
                selectedNodeId &&
                edge.source !== selectedNodeId &&
                edge.target !== selectedNodeId;
              return (
                <line
                  key={edge.id}
                  x1={source.x || 0}
                  y1={source.y || 0}
                  x2={target.x || 0}
                  y2={target.y || 0}
                  stroke={muted ? '#D9E4EE' : '#8AA7C2'}
                  strokeWidth={muted ? 1 : 1.8}
                  opacity={muted ? 0.35 : 0.9}
                />
              );
            })}

            {positions.map((node) => {
              const isSelected = selectedNodeId === node.id;
              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x || 0}, ${node.y || 0})`}
                  onClick={() => onSelectNode(node.id)}
                  style={{ cursor: 'pointer' }}
                  opacity={opacityOf(node.id)}
                >
                  <circle
                    r={isSelected ? 16 : 12}
                    fill={NODE_COLORS[node.type]}
                    stroke={isSelected ? '#12B8AE' : '#FFFFFF'}
                    strokeWidth={isSelected ? 4 : 2}
                  />
                  <text
                    y={24}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#163A63"
                    fontWeight={isSelected ? '700' : '600'}
                  >
                    {node.label.length > 22 ? `${node.label.slice(0, 20)}..` : node.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
};
