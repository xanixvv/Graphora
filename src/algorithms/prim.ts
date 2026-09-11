import type { GraphNode, GraphEdge, PrimStep } from "../types/graph";

export const generatePrimSteps = (
  nodes: GraphNode[],
  edges: GraphEdge[],
  startNode: string
): PrimStep[] => {
  const steps: PrimStep[] = [];

  const visited = new Set<string>();
  const selectedEdges: string[] = [];

  visited.add(startNode);

  steps.push({
    visited: [...visited],
    selectedEdges: [],
    activeEdge: null,
    message: `Starting Prim's Algorithm from node ${startNode}`,
  });

  while (selectedEdges.length < nodes.length - 1) {
    const possibleEdges = edges.filter((edge) => {
      const sourceVisited = visited.has(edge.source);
      const targetVisited = visited.has(edge.target);

      return sourceVisited !== targetVisited;
    });

    if (possibleEdges.length === 0) {
      break;
    }

    possibleEdges.sort((a, b) => a.weight - b.weight);

    const edge = possibleEdges[0];

    steps.push({
      visited: [...visited],
      selectedEdges: [...selectedEdges],
      activeEdge: edge.id,
      message: `Examining edge ${edge.source} — ${edge.target} with weight ${edge.weight}`,
    });

    selectedEdges.push(edge.id);

    const newNode = visited.has(edge.source)
      ? edge.target
      : edge.source;

    visited.add(newNode);

    steps.push({
      visited: [...visited],
      selectedEdges: [...selectedEdges],
      activeEdge: null,
      message: `Selected ${edge.source} — ${edge.target}. Added node ${newNode} to the MST.`,
    });
  }

  steps.push({
    visited: [...visited],
    selectedEdges: [...selectedEdges],
    activeEdge: null,
    message: "Prim's Algorithm completed — Minimum Spanning Tree found!",
  });

  return steps;
};