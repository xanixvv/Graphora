import { useMemo, useState } from "react";
import type { GraphEdge, GraphNode } from "../types/graph";

type Algorithm = "prim" | "dijkstra" | "floyd" | "boyer";

type CustomInputLabProps = {
  algorithm: Algorithm;

  nodes: GraphNode[];
  edges: GraphEdge[];

  startNode: string;

  text: string;
  pattern: string;

  onNodesChange: (nodes: GraphNode[]) => void;
  onEdgesChange: (edges: GraphEdge[]) => void;

  onStartNodeChange: (node: string) => void;

  onTextChange: (text: string) => void;
  onPatternChange: (pattern: string) => void;

  onReset: () => void;
};

const MAX_NODES = 8;

const positions = [
  { x: 100, y: 120 },
  { x: 330, y: 70 },
  { x: 250, y: 260 },
  { x: 500, y: 230 },
  { x: 660, y: 120 },
  { x: 100, y: 300 },
  { x: 500, y: 70 },
  { x: 680, y: 280 },
];

function CustomInputLab({
  algorithm,
  nodes,
  edges,
  startNode,
  text,
  pattern,
  onNodesChange,
  onEdgesChange,
  onStartNodeChange,
  onTextChange,
  onPatternChange,
  onReset,
}: CustomInputLabProps) {
  const [edgeSource, setEdgeSource] = useState(
    nodes[0]?.id ?? ""
  );

  const [edgeTarget, setEdgeTarget] = useState(
    nodes[1]?.id ?? ""
  );

  const [edgeWeight, setEdgeWeight] = useState("1");

  const [showGraphEditor, setShowGraphEditor] =
    useState(true);

  const [showTextEditor, setShowTextEditor] =
    useState(true);

  const isGraphAlgorithm =
    algorithm === "prim" ||
    algorithm === "dijkstra" ||
    algorithm === "floyd";

  const nextNodeId = useMemo(() => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (const letter of alphabet) {
      if (!nodes.some((node) => node.id === letter)) {
        return letter;
      }
    }

    return null;
  }, [nodes]);

  /* =========================================================
     ADD NODE
  ========================================================= */

  const addNode = () => {
    if (!nextNodeId) {
      return;
    }

    const position =
      positions[nodes.length] ??
      {
        x: 100 + nodes.length * 70,
        y: 100,
      };

    const newNode: GraphNode = {
      id: nextNodeId,
      x: position.x,
      y: position.y,
    };

    const updatedNodes = [
      ...nodes,
      newNode,
    ];

    onNodesChange(updatedNodes);

    if (!startNode) {
      onStartNodeChange(nextNodeId);
    }

    if (updatedNodes.length >= 2) {
      setEdgeSource(updatedNodes[0].id);
      setEdgeTarget(updatedNodes[1].id);
    }
  };

  /* =========================================================
     DELETE NODE
  ========================================================= */

  const deleteNode = (nodeId: string) => {
    if (nodes.length <= 2) {
      return;
    }

    const updatedNodes =
      nodes.filter(
        (node) =>
          node.id !== nodeId
      );

    const updatedEdges =
      edges.filter(
        (edge) =>
          edge.source !== nodeId &&
          edge.target !== nodeId
      );

    onNodesChange(updatedNodes);
    onEdgesChange(updatedEdges);

    if (startNode === nodeId) {
      onStartNodeChange(
        updatedNodes[0]?.id ?? ""
      );
    }

    setEdgeSource(
      updatedNodes[0]?.id ?? ""
    );

    setEdgeTarget(
      updatedNodes[1]?.id ??
        updatedNodes[0]?.id ??
        ""
    );
  };

  /* =========================================================
     ADD EDGE
  ========================================================= */

  const addEdge = () => {
    if (
      !edgeSource ||
      !edgeTarget ||
      edgeSource === edgeTarget
    ) {
      return;
    }

    const weight =
      Number(edgeWeight);

    if (
      !Number.isFinite(weight) ||
      weight <= 0
    ) {
      return;
    }

    const exists =
      edges.some(
        (edge) =>
          (
            edge.source === edgeSource &&
            edge.target === edgeTarget
          ) ||
          (
            edge.source === edgeTarget &&
            edge.target === edgeSource
          )
      );

    if (exists) {
      return;
    }

    const newEdge: GraphEdge = {
      id: `${edgeSource}-${edgeTarget}`,
      source: edgeSource,
      target: edgeTarget,
      weight,
    };

    onEdgesChange([
      ...edges,
      newEdge,
    ]);
  };

  /* =========================================================
     DELETE EDGE
  ========================================================= */

  const deleteEdge = (edgeId: string) => {
    onEdgesChange(
      edges.filter(
        (edge) =>
          edge.id !== edgeId
      )
    );
  };

  /* =========================================================
     CHANGE EDGE WEIGHT
  ========================================================= */

  const changeWeight = (
    edgeId: string,
    value: string
  ) => {
    const weight =
      Number(value);

    onEdgesChange(
      edges.map((edge) =>
        edge.id === edgeId
          ? {
              ...edge,
              weight:
                Number.isFinite(weight)
                  ? weight
                  : edge.weight,
            }
          : edge
      )
    );
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section className="custom-lab">

      <div className="custom-lab-header">

        <div>
          <p className="eyebrow">
            CUSTOM INPUT LAB
          </p>

          <h3>
            Experiment with your own data
          </h3>

          <p>
            Change the graph, weights, starting
            point, or string and watch the
            algorithm solve your input.
          </p>
        </div>

        <button
          className="custom-reset-button"
          onClick={onReset}
        >
          ↻ Reset demo
        </button>

      </div>

      {/* =====================================================
          GRAPH EDITOR
      ===================================================== */}

      {isGraphAlgorithm && (
        <div className="custom-editor">

          <button
            className="custom-editor-title"
            onClick={() =>
              setShowGraphEditor(
                (previous) =>
                  !previous
              )
            }
          >
            <span>
              Graph Editor
            </span>

            <span>
              {showGraphEditor
                ? "−"
                : "+"}
            </span>
          </button>

          {showGraphEditor && (
            <div className="custom-editor-content">

              {/* NODES */}

              <div className="custom-section">

                <div className="custom-section-heading">
                  <div>
                    <strong>
                      Vertices
                    </strong>

                    <span>
                      {nodes.length} / {MAX_NODES}
                    </span>
                  </div>

                  <button
                    className="custom-small-button"
                    onClick={addNode}
                    disabled={
                      !nextNodeId
                    }
                  >
                    + Add vertex
                  </button>
                </div>

                <div className="custom-node-list">

                  {nodes.map((node) => (
                    <div
                      className="custom-node-row"
                      key={node.id}
                    >

                      <div className="custom-node-badge">
                        {node.id}
                      </div>

                      <span>
                        Vertex {node.id}
                      </span>

                      <button
                        onClick={() =>
                          deleteNode(
                            node.id
                          )
                        }
                        disabled={
                          nodes.length <= 2
                        }
                        className="custom-delete"
                      >
                        ×
                      </button>

                    </div>
                  ))}

                </div>

              </div>

              {/* STARTING POINT */}

              {(algorithm === "prim" ||
                algorithm === "dijkstra") && (

                <div className="custom-section">

                  <label className="custom-label">
                    Starting vertex
                  </label>

                  <select
                    className="custom-select"
                    value={startNode}
                    onChange={(event) =>
                      onStartNodeChange(
                        event.target.value
                      )
                    }
                  >
                    {nodes.map((node) => (
                      <option
                        key={node.id}
                        value={node.id}
                      >
                        Vertex {node.id}
                      </option>
                    ))}
                  </select>

                  <p className="custom-help">
                    {algorithm === "prim"
                      ? "Prim's algorithm will begin growing the MST from this vertex."
                      : "Dijkstra will calculate shortest paths starting from this vertex."}
                  </p>

                </div>
              )}

              {/* EDGES */}

              <div className="custom-section">

                <div className="custom-section-heading">
                  <strong>
                    Edges
                  </strong>

                  <span>
                    {edges.length} connections
                  </span>
                </div>

                <div className="custom-edge-add">

                  <select
                    className="custom-select"
                    value={edgeSource}
                    onChange={(event) =>
                      setEdgeSource(
                        event.target.value
                      )
                    }
                  >
                    {nodes.map((node) => (
                      <option
                        key={node.id}
                        value={node.id}
                      >
                        {node.id}
                      </option>
                    ))}
                  </select>

                  <span className="custom-arrow">
                    →
                  </span>

                  <select
                    className="custom-select"
                    value={edgeTarget}
                    onChange={(event) =>
                      setEdgeTarget(
                        event.target.value
                      )
                    }
                  >
                    {nodes.map((node) => (
                      <option
                        key={node.id}
                        value={node.id}
                      >
                        {node.id}
                      </option>
                    ))}
                  </select>

                  <input
                    className="custom-number-input"
                    type="number"
                    min="1"
                    value={edgeWeight}
                    onChange={(event) =>
                      setEdgeWeight(
                        event.target.value
                      )
                    }
                    placeholder="Weight"
                  />

                  <button
                    className="custom-small-button"
                    onClick={addEdge}
                  >
                    + Add edge
                  </button>

                </div>

                <div className="custom-edge-list">

                  {edges.map((edge) => (
                    <div
                      className="custom-edge-row"
                      key={edge.id}
                    >

                      <span className="custom-edge-name">
                        {edge.source}
                        {" — "}
                        {edge.target}
                      </span>

                      <input
                        type="number"
                        min="1"
                        value={edge.weight}
                        onChange={(event) =>
                          changeWeight(
                            edge.id,
                            event.target.value
                          )
                        }
                      />

                      <button
                        className="custom-delete"
                        onClick={() =>
                          deleteEdge(
                            edge.id
                          )
                        }
                      >
                        ×
                      </button>

                    </div>
                  ))}

                </div>

              </div>

            </div>
          )}

        </div>
      )}

      {/* =====================================================
          STRING EDITOR
      ===================================================== */}

      {algorithm === "boyer" && (
        <div className="custom-editor">

          <button
            className="custom-editor-title"
            onClick={() =>
              setShowTextEditor(
                (previous) =>
                  !previous
              )
            }
          >
            <span>
              String Matching Input
            </span>

            <span>
              {showTextEditor
                ? "−"
                : "+"}
            </span>
          </button>

          {showTextEditor && (
            <div className="custom-editor-content">

              <div className="custom-section">

                <label className="custom-label">
                  Text
                </label>

                <textarea
                  className="custom-textarea"
                  value={text}
                  onChange={(event) =>
                    onTextChange(
                      event.target.value
                    )
                  }
                  placeholder="Enter the text to search..."
                  rows={4}
                />

              </div>

              <div className="custom-section">

                <label className="custom-label">
                  Pattern
                </label>

                <input
                  className="custom-text-input"
                  value={pattern}
                  onChange={(event) =>
                    onPatternChange(
                      event.target.value
                    )
                  }
                  placeholder="Enter the pattern..."
                />

              </div>

              <div className="custom-string-preview">

                <div>
                  <span>
                    Text length
                  </span>

                  <strong>
                    {text.length}
                  </strong>
                </div>

                <div>
                  <span>
                    Pattern length
                  </span>

                  <strong>
                    {pattern.length}
                  </strong>
                </div>

                <div>
                  <span>
                    Comparisons
                  </span>

                  <strong>
                    Horspool
                  </strong>
                </div>

              </div>

            </div>
          )}

        </div>
      )}

    </section>
  );
}

export default CustomInputLab;