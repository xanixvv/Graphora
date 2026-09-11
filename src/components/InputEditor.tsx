import { useMemo, useState } from "react";
import type { GraphEdge, GraphNode } from "../types/graph";

type Algorithm = "prim" | "dijkstra" | "floyd" | "boyer";

type Props = {
  algorithm: Algorithm;

  nodes: GraphNode[];
  edges: GraphEdge[];

  startNode: string;

  text: string;
  pattern: string;

  floydMatrix: (number | null)[][];

  onNodesChange: (nodes: GraphNode[]) => void;
  onEdgesChange: (edges: GraphEdge[]) => void;

  onStartNodeChange: (node: string) => void;

  onTextChange: (text: string) => void;
  onPatternChange: (pattern: string) => void;

  onFloydMatrixChange: (matrix: (number | null)[][]) => void;

  onReset: () => void;
};

function InputEditor({
  algorithm,
  nodes,
  edges,
  startNode,
  text,
  pattern,
  floydMatrix,
  onNodesChange,
  onEdgesChange,
  onStartNodeChange,
  onTextChange,
  onPatternChange,
  onFloydMatrixChange,
  onReset,
}: Props) {
  const [newEdgeSource, setNewEdgeSource] = useState(
    nodes[0]?.id ?? ""
  );

  const [newEdgeTarget, setNewEdgeTarget] = useState(
    nodes[1]?.id ?? ""
  );

  const [newEdgeWeight, setNewEdgeWeight] = useState(1);

  const [newNodeName, setNewNodeName] = useState("");

  const nextNodePosition = useMemo(() => {
    const positions = [
      { x: 120, y: 100 },
      { x: 350, y: 80 },
      { x: 250, y: 260 },
      { x: 500, y: 230 },
      { x: 670, y: 120 },
      { x: 700, y: 300 },
      { x: 100, y: 320 },
      { x: 400, y: 350 },
    ];

    return (
      positions[nodes.length] ?? {
        x: 100 + (nodes.length % 5) * 130,
        y: 100 + Math.floor(nodes.length / 5) * 120,
      }
    );
  }, [nodes.length]);

  const updateEdgeWeight = (
    edgeId: string,
    value: number
  ) => {
    onEdgesChange(
      edges.map((edge) =>
        edge.id === edgeId
          ? {
              ...edge,
              weight: Math.max(0, value),
            }
          : edge
      )
    );
  };

  const deleteEdge = (edgeId: string) => {
    onEdgesChange(
      edges.filter(
        (edge) => edge.id !== edgeId
      )
    );
  };

  const deleteNode = (nodeId: string) => {
    if (nodes.length <= 2) {
      return;
    }

    const remainingNodes =
      nodes.filter(
        (node) => node.id !== nodeId
      );

    const remainingEdges =
      edges.filter(
        (edge) =>
          edge.source !== nodeId &&
          edge.target !== nodeId
      );

    onNodesChange(
      remainingNodes
    );

    onEdgesChange(
      remainingEdges
    );

    if (startNode === nodeId) {
      onStartNodeChange(
        remainingNodes[0]?.id ?? ""
      );
    }
  };

  const addNode = () => {
    const trimmed =
      newNodeName.trim().toUpperCase();

    if (!trimmed) {
      return;
    }

    if (
      nodes.some(
        (node) => node.id === trimmed
      )
    ) {
      return;
    }

    if (trimmed.length > 2) {
      return;
    }

    const newNode: GraphNode = {
      id: trimmed,
      x: nextNodePosition.x,
      y: nextNodePosition.y,
    };

    onNodesChange([
      ...nodes,
      newNode,
    ]);

    setNewNodeName("");
  };

  const addEdge = () => {
    if (
      !newEdgeSource ||
      !newEdgeTarget ||
      newEdgeSource === newEdgeTarget
    ) {
      return;
    }

    const exists = edges.some(
      (edge) =>
        (
          edge.source === newEdgeSource &&
          edge.target === newEdgeTarget
        ) ||
        (
          edge.source === newEdgeTarget &&
          edge.target === newEdgeSource
        )
    );

    if (exists) {
      return;
    }

    const newEdge: GraphEdge = {
      id: `${newEdgeSource}-${newEdgeTarget}`,
      source: newEdgeSource,
      target: newEdgeTarget,
      weight: Math.max(
        0,
        newEdgeWeight
      ),
    };

    onEdgesChange([
      ...edges,
      newEdge,
    ]);
  };

  if (algorithm === "boyer") {
    return (
      <div className="input-editor">
        <div className="editor-heading">
          <div>
            <p className="editor-eyebrow">
              CUSTOM INPUT
            </p>

            <h4>
              String Matching Lab
            </h4>

            <p>
              Enter your own text and pattern.
              Graphora will generate the shift
              table and animation automatically.
            </p>
          </div>

          <button
            className="editor-reset"
            onClick={onReset}
          >
            ↻ Reset example
          </button>
        </div>

        <div className="string-editor-grid">
          <label>
            <span>TEXT</span>

            <textarea
              value={text}
              onChange={(event) =>
                onTextChange(
                  event.target.value.toUpperCase()
                )
              }
              placeholder="Enter text..."
            />
          </label>

          <label>
            <span>PATTERN</span>

            <input
              value={pattern}
              onChange={(event) =>
                onPatternChange(
                  event.target.value.toUpperCase()
                )
              }
              placeholder="Enter pattern..."
            />
          </label>
        </div>

        <div className="editor-hint">
          Horspool compares the pattern from
          right to left and uses the shift table
          to skip unnecessary positions.
        </div>
      </div>
    );
  }

  if (algorithm === "floyd") {
    return (
      <div className="input-editor">
        <div className="editor-heading">
          <div>
            <p className="editor-eyebrow">
              CUSTOM INPUT
            </p>

            <h4>
              Distance Matrix Editor
            </h4>

            <p>
              Change the distances directly.
              Leave a cell empty to represent
              infinity.
            </p>
          </div>

          <button
            className="editor-reset"
            onClick={onReset}
          >
            ↻ Reset matrix
          </button>
        </div>

        <div className="custom-matrix-wrapper">
          <table className="custom-matrix">
            <thead>
              <tr>
                <th />
                {nodes.map((node) => (
                  <th key={node.id}>
                    {node.id}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {nodes.map(
                (rowNode, rowIndex) => (
                  <tr key={rowNode.id}>
                    <th>
                      {rowNode.id}
                    </th>

                    {nodes.map(
                      (columnNode, columnIndex) => {
                        const value =
                          floydMatrix[
                            rowIndex
                          ]?.[
                            columnIndex
                          ];

                        const isDiagonal =
                          rowIndex ===
                          columnIndex;

                        return (
                          <td
                            key={
                              columnNode.id
                            }
                          >
                            <input
                              type="number"
                              min="0"
                              value={
                                value === null
                                  ? ""
                                  : value
                              }
                              disabled={
                                isDiagonal
                              }
                              placeholder={
                                isDiagonal
                                  ? "0"
                                  : "∞"
                              }
                              onChange={(
                                event
                              ) => {
                                const raw =
                                  event
                                    .target
                                    .value;

                                const next =
                                  floydMatrix.map(
                                    (
                                      row
                                    ) =>
                                      [...row]
                                  );

                                next[
                                  rowIndex
                                ][
                                  columnIndex
                                ] =
                                  raw === ""
                                    ? null
                                    : Math.max(
                                        0,
                                        Number(
                                          raw
                                        )
                                      );

                                /*
                                 * Our graph algorithms
                                 * use an undirected graph,
                                 * so keep the matrix symmetric.
                                 */
                                if (
                                  !isDiagonal
                                ) {
                                  next[
                                    columnIndex
                                  ][
                                    rowIndex
                                  ] =
                                    next[
                                      rowIndex
                                    ][
                                      columnIndex
                                    ];
                                }

                                onFloydMatrixChange(
                                  next
                                );
                              }}
                            />
                          </td>
                        );
                      }
                    )}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="input-editor">
      <div className="editor-heading">
        <div>
          <p className="editor-eyebrow">
            CUSTOM INPUT
          </p>

          <h4>
            Graph Editor
          </h4>

          <p>
            Build your own weighted graph and
            watch {algorithm === "prim"
              ? "Prim's"
              : "Dijkstra's"}{" "}
            solve it.
          </p>
        </div>

        <button
          className="editor-reset"
          onClick={onReset}
        >
          ↻ Reset graph
        </button>
      </div>

      <div className="editor-section">
        <div className="editor-section-title">
          <span>VERTICES</span>

          <div className="add-node-controls">
            <input
              value={newNodeName}
              onChange={(event) =>
                setNewNodeName(
                  event.target.value
                )
              }
              onKeyDown={(event) => {
                if (
                  event.key === "Enter"
                ) {
                  addNode();
                }
              }}
              placeholder="Name e.g. F"
              maxLength={2}
            />

            <button
              onClick={addNode}
            >
              + Add vertex
            </button>
          </div>
        </div>

        <div className="vertex-list">
          {nodes.map((node) => (
            <div
              className="vertex-chip"
              key={node.id}
            >
              <strong>
                {node.id}
              </strong>

              <button
                onClick={() =>
                  deleteNode(
                    node.id
                  )
                }
                title="Remove vertex"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="editor-section">
        <div className="editor-section-title">
          <span>EDGES</span>

          <div className="add-edge-controls">
            <select
              value={newEdgeSource}
              onChange={(event) =>
                setNewEdgeSource(
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

            <span>—</span>

            <select
              value={newEdgeTarget}
              onChange={(event) =>
                setNewEdgeTarget(
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
              type="number"
              min="0"
              value={newEdgeWeight}
              onChange={(event) =>
                setNewEdgeWeight(
                  Number(
                    event.target.value
                  )
                )
              }
            />

            <button
              onClick={addEdge}
            >
              + Add edge
            </button>
          </div>
        </div>

        <div className="edge-editor-list">
          {edges.map((edge) => (
            <div
              className="edge-editor-row"
              key={edge.id}
            >
              <span className="edge-name">
                {edge.source}
                {" — "}
                {edge.target}
              </span>

              <label>
                Weight
                <input
                  type="number"
                  min="0"
                  value={edge.weight}
                  onChange={(event) =>
                    updateEdgeWeight(
                      edge.id,
                      Number(
                        event.target.value
                      )
                    )
                  }
                />
              </label>

              <button
                className="delete-edge"
                onClick={() =>
                  deleteEdge(
                    edge.id
                  )
                }
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="editor-section start-editor">
        <div>
          <span className="editor-small-label">
            STARTING VERTEX
          </span>

          <p>
            {algorithm === "prim"
              ? "Prim's algorithm grows the MST from this vertex."
              : "Dijkstra calculates shortest paths from this source."}
          </p>
        </div>

        <select
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
              {node.id}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default InputEditor;