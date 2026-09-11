import type { GraphNode, GraphEdge } from "../types/graph";

export type DijkstraStep = {
  visited: string[];
  selectedEdges: string[];
  activeEdge: string | null;
  currentNode: string | null;
  distances: Record<string, number>;
  message: string;
};

export const generateDijkstraSteps = (
  nodes: GraphNode[],
  edges: GraphEdge[],
  startNode: string
): DijkstraStep[] => {
  const steps: DijkstraStep[] = [];

  const distances: Record<string, number> = {};

  nodes.forEach((node) => {
    distances[node.id] = Infinity;
  });

  distances[startNode] = 0;

  const visited = new Set<string>();
  const selectedEdges: string[] = [];

  // Stores which edge currently gives the best path to each node
  const previousEdge: Record<string, string | undefined> = {};

  steps.push({
    visited: [],
    selectedEdges: [],
    activeEdge: null,
    currentNode: null,
    distances: { ...distances },
    message: `Starting Dijkstra's Algorithm from node ${startNode}`,
  });

  while (visited.size < nodes.length) {
    let currentNode: string | null = null;
    let smallestDistance = Infinity;

    // Find unvisited node with smallest distance
    for (const node of nodes) {
      if (
        !visited.has(node.id) &&
        distances[node.id] < smallestDistance
      ) {
        smallestDistance = distances[node.id];
        currentNode = node.id;
      }
    }

    // No reachable nodes remain
    if (currentNode === null) {
      break;
    }

    steps.push({
      visited: [...visited],
      selectedEdges: [...selectedEdges],
      activeEdge: null,
      currentNode,
      distances: { ...distances },
      message: `Visiting node ${currentNode} with distance ${distances[currentNode]}`,
    });

    // Examine every edge connected to current node
    const connectedEdges = edges.filter(
      (edge) =>
        edge.source === currentNode ||
        edge.target === currentNode
    );

    for (const edge of connectedEdges) {
      const neighbor =
        edge.source === currentNode
          ? edge.target
          : edge.source;

      if (visited.has(neighbor)) {
        continue;
      }

      steps.push({
        visited: [...visited],
        selectedEdges: [...selectedEdges],
        activeEdge: edge.id,
        currentNode,
        distances: { ...distances },
        message: `Checking edge ${edge.source} — ${edge.target} with weight ${edge.weight}`,
      });

      const newDistance =
        distances[currentNode] + edge.weight;

      if (newDistance < distances[neighbor]) {
        // Remove old edge for this node if it exists
        if (previousEdge[neighbor]) {
          const oldIndex = selectedEdges.indexOf(
            previousEdge[neighbor]!
          );

          if (oldIndex !== -1) {
            selectedEdges.splice(oldIndex, 1);
          }
        }

        distances[neighbor] = newDistance;

        previousEdge[neighbor] = edge.id;
        selectedEdges.push(edge.id);

        steps.push({
          visited: [...visited],
          selectedEdges: [...selectedEdges],
          activeEdge: edge.id,
          currentNode,
          distances: { ...distances },
          message: `Updated distance of ${neighbor} to ${newDistance}`,
        });
      } else {
        steps.push({
          visited: [...visited],
          selectedEdges: [...selectedEdges],
          activeEdge: edge.id,
          currentNode,
          distances: { ...distances },
          message: `No update needed for ${neighbor}`,
        });
      }
    }

    visited.add(currentNode);

    steps.push({
      visited: [...visited],
      selectedEdges: [...selectedEdges],
      activeEdge: null,
      currentNode,
      distances: { ...distances },
      message: `Finished processing node ${currentNode}`,
    });
  }

  steps.push({
    visited: [...visited],
    selectedEdges: [...selectedEdges],
    activeEdge: null,
    currentNode: null,
    distances: { ...distances },
    message: "Dijkstra's Algorithm completed — shortest paths found!",
  });

  return steps;
};