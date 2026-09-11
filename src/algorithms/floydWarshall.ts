import type { GraphEdge, GraphNode } from "../types/graph";

export type FloydStep = {
  matrix: number[][];
  k: number;
  i: number;
  j: number;
  updated: boolean;
  message: string;
};

export const generateFloydSteps = (
  nodes: GraphNode[],
  edges: GraphEdge[]
): FloydStep[] => {
  const n = nodes.length;
  const INF = Infinity;

  const matrix: number[][] = Array.from(
    { length: n },
    () => Array(n).fill(INF)
  );

  // Distance from a node to itself = 0
  for (let i = 0; i < n; i++) {
    matrix[i][i] = 0;
  }

  // Add graph edges
  edges.forEach((edge) => {
    const u = nodes.findIndex(
      (node) => node.id === edge.source
    );

    const v = nodes.findIndex(
      (node) => node.id === edge.target
    );

    if (u !== -1 && v !== -1) {
      matrix[u][v] = edge.weight;
      matrix[v][u] = edge.weight;
    }
  });

  const steps: FloydStep[] = [];

  steps.push({
    matrix: matrix.map((row) => [...row]),
    k: -1,
    i: -1,
    j: -1,
    updated: false,
    message: "Initial distance matrix created.",
  });

  // Floyd-Warshall
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const throughK =
          matrix[i][k] === INF || matrix[k][j] === INF
            ? INF
            : matrix[i][k] + matrix[k][j];

        const current = matrix[i][j];

        if (throughK < current) {
          matrix[i][j] = throughK;

          steps.push({
            matrix: matrix.map((row) => [...row]),
            k,
            i,
            j,
            updated: true,
            message: `Updated ${nodes[i].id} → ${nodes[j].id}: ${current === INF ? "∞" : current} → ${throughK} through ${nodes[k].id}`,
          });
        } else {
          steps.push({
            matrix: matrix.map((row) => [...row]),
            k,
            i,
            j,
            updated: false,
            message: `Checking ${nodes[i].id} → ${nodes[j].id} through ${nodes[k].id}: no update needed.`,
          });
        }
      }
    }
  }

  steps.push({
    matrix: matrix.map((row) => [...row]),
    k: n - 1,
    i: -1,
    j: -1,
    updated: false,
    message:
      "Floyd-Warshall completed — all-pairs shortest paths found!",
  });

  return steps;
};