import type {
  GraphNode,
  GraphEdge,
  PrimStep,
  DijkstraStep,
} from "../types/graph";

type Props = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  step: PrimStep | DijkstraStep;
};

export default function GraphCanvas({
  nodes,
  edges,
  step,
}: Props) {
  const getNode = (id: string) =>
    nodes.find((node) => node.id === id);

  return (
    <div className="graph-container">
      <svg
        viewBox="0 0 760 430"
        className="graph-svg"
      >
        {/* EDGES */}
        {edges.map((edge) => {
          const source = getNode(edge.source);
          const target = getNode(edge.target);

          if (!source || !target) return null;

          const isSelected =
            step.selectedEdges.includes(edge.id);

          const isActive =
            step.activeEdge === edge.id;

          return (
            <g key={edge.id}>
              <line
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                className={
                  isSelected
                    ? "edge edge-selected"
                    : isActive
                    ? "edge edge-active"
                    : "edge"
                }
              />

              <text
                x={(source.x + target.x) / 2}
                y={(source.y + target.y) / 2 - 8}
                className="edge-weight"
              >
                {edge.weight}
              </text>
            </g>
          );
        })}

        {/* NODES */}
        {nodes.map((node) => {
          const isVisited =
  step.visited.includes(node.id);

          const isCurrent =
             "currentNode" in step &&
  step.currentNode === node.id;

          return (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r="28"
                className={
  isCurrent
    ? "graph-node node-current"
    : isVisited
    ? "graph-node node-visited"
    : "graph-node"
}
              />

              <text
                x={node.x}
                y={node.y}
                className="node-label"
              >
                {node.id}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}