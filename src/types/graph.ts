export type GraphNode = {
  id: string;
  x: number;
  y: number;
};

export type GraphEdge = {
  id: string;
  source: string;
  target: string;
  weight: number;
};

export type PrimStep = {
  visited: string[];
  selectedEdges: string[];
  activeEdge: string | null;
  message: string;
};

export type DijkstraStep = {
  visited: string[];
  selectedEdges: string[];
  activeEdge: string | null;
  currentNode: string | null;
  distances: Record<string, number>;
  message: string;
};