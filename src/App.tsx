import { useEffect, useMemo, useState } from "react";
import "./App.css";

import GraphCanvas from "./components/GraphCanvas";
import DistanceMatrix from "./components/DistanceMatrix";
import PatternMatcher from "./components/PatternMatcher";

import { generatePrimSteps } from "./algorithms/prim";
import { generateDijkstraSteps } from "./algorithms/dijkstra";
import { generateFloydSteps } from "./algorithms/floydWarshall";
import { generateBoyerMooreSteps } from "./algorithms/boyerMoore";

import type {
  GraphEdge,
  GraphNode,
} from "./types/graph";

type Algorithm =
  | "prim"
  | "dijkstra"
  | "floyd"
  | "boyer";

type Speed =
  | "slow"
  | "normal"
  | "fast";

/* =========================================================
   GRAPH DATA
========================================================= */

const nodes: GraphNode[] = [
  {
    id: "A",
    x: 100,
    y: 120,
  },
  {
    id: "B",
    x: 330,
    y: 70,
  },
  {
    id: "C",
    x: 250,
    y: 260,
  },
  {
    id: "D",
    x: 500,
    y: 230,
  },
  {
    id: "E",
    x: 660,
    y: 120,
  },
];

const edges: GraphEdge[] = [
  {
    id: "A-B",
    source: "A",
    target: "B",
    weight: 4,
  },
  {
    id: "A-C",
    source: "A",
    target: "C",
    weight: 2,
  },
  {
    id: "B-C",
    source: "B",
    target: "C",
    weight: 1,
  },
  {
    id: "B-D",
    source: "B",
    target: "D",
    weight: 5,
  },
  {
    id: "C-D",
    source: "C",
    target: "D",
    weight: 8,
  },
  {
    id: "C-E",
    source: "C",
    target: "E",
    weight: 10,
  },
  {
    id: "D-E",
    source: "D",
    target: "E",
    weight: 2,
  },
  {
    id: "B-E",
    source: "B",
    target: "E",
    weight: 7,
  },
];

/* =========================================================
   PLAYBACK SPEED
========================================================= */

const SPEED_DELAY: Record<Speed, number> = {
  slow: 6000,
  normal: 3500,
  fast: 1200,
};

/* =========================================================
   ALGORITHM INFORMATION
========================================================= */

const algorithmInfo: Record<
  Algorithm,
  {
    name: string;
    description: string;
    purpose: string;
    howItWorks: string[];
    time: string;
    space: string;
    applications: string[];
  }
> = {
  prim: {
    name: "Prim's Algorithm",

    description:
      "A greedy algorithm used to construct a Minimum Spanning Tree from a weighted, connected graph.",

    purpose:
      "Connect every vertex using the minimum possible total edge weight without creating cycles.",

    howItWorks: [
      "Start with a selected vertex.",
      "Look at all edges leaving the vertices already in the tree.",
      "Choose the cheapest edge that connects to a new vertex.",
      "Add that edge and vertex to the tree.",
      "Repeat until every vertex is connected.",
    ],

    time: "O(E log V)",

    space: "O(V + E)",

    applications: [
      "Network cable design",
      "Computer network planning",
      "Electrical grid design",
      "Road and pipeline planning",
    ],
  },

  dijkstra: {
    name: "Dijkstra's Algorithm",

    description:
      "A shortest-path algorithm that finds the minimum distance from one source vertex to every other reachable vertex.",

    purpose:
      "Determine the shortest route from a starting point to all other vertices in a graph with non-negative edge weights.",

    howItWorks: [
      "Set the source distance to 0 and all other distances to infinity.",
      "Choose the unvisited vertex with the smallest known distance.",
      "Check its neighboring vertices.",
      "Relax an edge if going through the current vertex produces a shorter path.",
      "Mark the current vertex as processed and continue.",
    ],

    time: "O(E log V)",

    space: "O(V + E)",

    applications: [
      "GPS navigation",
      "Network routing",
      "Delivery route optimization",
      "Game pathfinding",
    ],
  },

  floyd: {
    name: "Floyd-Warshall Algorithm",

    description:
      "A dynamic programming algorithm that computes shortest paths between every pair of vertices.",

    purpose:
      "Find the shortest distance between every possible pair of vertices in a weighted graph.",

    howItWorks: [
      "Create a distance matrix containing the direct edge weights.",
      "Treat each vertex as a possible intermediate vertex.",
      "For every pair (i, j), check whether going through k is shorter.",
      "Update the matrix when a shorter route is found.",
      "After all intermediate vertices are processed, the matrix contains all-pairs shortest paths.",
    ],

    time: "O(V³)",

    space: "O(V²)",

    applications: [
      "All-pairs network routing",
      "Transportation analysis",
      "Graph analysis",
      "Finding shortest connections between cities",
    ],
  },

  boyer: {
    name: "Horspool String Matching",

    description:
      "A pattern-matching algorithm from the Boyer-Moore family that uses a bad-character shift table to skip unnecessary comparisons.",

    purpose:
      "Search for a pattern inside a larger text while avoiding comparisons that cannot lead to a match.",

    howItWorks: [
      "Build a shift table from the pattern.",
      "Align the pattern against the text.",
      "Compare characters from right to left.",
      "If a mismatch occurs, use the character under the pattern's last position to determine the shift.",
      "Jump forward instead of moving the pattern by only one position.",
      "Continue until the pattern is found or the text is exhausted.",
    ],

    time: "Worst case: O(nm)",

    space: "O(m + Σ)",

    applications: [
      "Text searching",
      "Document processing",
      "Search utilities",
      "Pattern matching in strings",
    ],
  },
};

/* =========================================================
   TEXT-BASED TEACHING
========================================================= */

function getTeachingText(
  algorithm: Algorithm,
  message: string
): string {
  const lower = message.toLowerCase();

  /* ---------------- PRIM ---------------- */

  if (algorithm === "prim") {
    if (
      lower.includes("start") ||
      lower.includes("starting") ||
      lower.includes("source")
    ) {
      return (
        `${message} ` +
        "Prim starts from the selected vertex and gradually grows one connected tree. " +
        "At every step, it looks for the cheapest edge that can safely connect a new vertex."
      );
    }

    if (
      lower.includes("select") ||
      lower.includes("choose") ||
      lower.includes("add")
    ) {
      return (
        `${message} ` +
        "The selected edge is the cheapest available connection from the current tree " +
        "to a vertex that has not been included yet. This greedy choice keeps the tree cheap."
      );
    }

    if (
      lower.includes("cycle") ||
      lower.includes("reject") ||
      lower.includes("skip")
    ) {
      return (
        `${message} ` +
        "This edge is not selected because using it would create a cycle. " +
        "A spanning tree must connect all vertices without forming loops."
      );
    }

    if (
      lower.includes("complete") ||
      lower.includes("finished") ||
      lower.includes("mst")
    ) {
      return (
        `${message} ` +
        "Every vertex is connected and the selected edges form the Minimum Spanning Tree. " +
        "The goal is to connect the graph with the minimum total edge weight."
      );
    }

    return (
      `${message} ` +
      "Prim repeatedly chooses the cheapest safe connection to grow the Minimum Spanning Tree."
    );
  }

  /* ---------------- DIJKSTRA ---------------- */

  if (algorithm === "dijkstra") {
    if (
      lower.includes("start") ||
      lower.includes("source") ||
      lower.includes("initialize")
    ) {
      return (
        `${message} ` +
        "The source vertex begins with distance 0 because it is already there. " +
        "Every other vertex starts with an unknown distance represented by infinity."
      );
    }

    if (
      lower.includes("visit") ||
      lower.includes("process") ||
      lower.includes("select")
    ) {
      return (
        `${message} ` +
        "Dijkstra selects the unvisited vertex with the smallest known distance. " +
        "With non-negative edge weights, that distance is now guaranteed to be shortest."
      );
    }

    if (
      lower.includes("update") ||
      lower.includes("relax") ||
      lower.includes("shorter")
    ) {
      return (
        `${message} ` +
        "Dijkstra is performing relaxation. It checks whether reaching this neighbor " +
        "through the current vertex produces a shorter distance."
      );
    }

    if (
      lower.includes("complete") ||
      lower.includes("finished")
    ) {
      return (
        `${message} ` +
        "All reachable vertices now have their shortest distances from the source."
      );
    }

    return (
      `${message} ` +
      "Dijkstra repeatedly chooses the closest unvisited vertex and uses it to improve the distances of its neighbors."
    );
  }

  /* ---------------- FLOYD-WARSHALL ---------------- */

  if (algorithm === "floyd") {
    if (
      lower.includes("initial") ||
      lower.includes("initialize") ||
      lower.includes("matrix")
    ) {
      return (
        `${message} ` +
        "The matrix starts with 0 on the diagonal, direct edge weights where an edge exists, " +
        "and infinity where no direct connection is known."
      );
    }

    if (
      lower.includes("intermediate") ||
      lower.includes("through") ||
      lower.includes("vertex")
    ) {
      return (
        `${message} ` +
        "Floyd-Warshall is considering a vertex as an intermediate point. " +
        "For every pair of vertices, it checks whether going through this vertex produces a shorter route."
      );
    }

    if (
      lower.includes("update") ||
      lower.includes("shorter") ||
      lower.includes("minimum")
    ) {
      return (
        `${message} ` +
        "The new distance is shorter than the old distance, so the matrix is updated. " +
        "We compare the current route with a route that passes through the intermediate vertex."
      );
    }

    if (
      lower.includes("complete") ||
      lower.includes("finished")
    ) {
      return (
        `${message} ` +
        "Every vertex has now been considered as an intermediate vertex. " +
        "The final matrix contains the shortest distance between every pair of vertices."
      );
    }

    return (
      `${message} ` +
      "Floyd-Warshall examines possible intermediate vertices and improves the distance matrix whenever a shorter route is discovered."
    );
  }

  /* ---------------- HORSPOOL ---------------- */

  if (
    lower.includes("align") ||
    lower.includes("alignment") ||
    lower.includes("position")
  ) {
    return (
      `${message} ` +
      "The pattern is aligned with a section of the text. " +
      "Horspool compares the pattern from right to left so a mismatch can allow a large jump."
    );
  }

  if (
    lower.includes("compare") ||
    lower.includes("check") ||
    lower.includes("matching")
  ) {
    return (
      `${message} ` +
      "The current characters are compared from right to left. " +
      "Matching characters allow the algorithm to continue toward the beginning of the pattern."
    );
  }

  if (
    lower.includes("mismatch") ||
    lower.includes("different")
  ) {
    return (
      `${message} ` +
      "A mismatch has occurred. Instead of shifting the pattern by one character, " +
      "Horspool uses its shift table to determine how far it can safely jump."
    );
  }

  if (
    lower.includes("shift") ||
    lower.includes("jump")
  ) {
    return (
      `${message} ` +
      "The shift table tells Horspool how far the pattern can move. " +
      "A larger safe jump means fewer unnecessary comparisons."
    );
  }

  if (
    lower.includes("match") ||
    lower.includes("found")
  ) {
    return (
      `${message} ` +
      "The characters matched successfully. If every character in the pattern matches, the pattern has been found."
    );
  }

  if (
    lower.includes("complete") ||
    lower.includes("finished")
  ) {
    return (
      `${message} ` +
      "The search is complete. Horspool either found the pattern or reached the end of the text."
    );
  }

  return (
    `${message} ` +
    "Watch how the pattern moves across the text and how the shift table allows Horspool to skip unnecessary comparisons."
  );
}

/* =========================================================
   APP
========================================================= */

function App() {
  const [algorithm, setAlgorithm] =
    useState<Algorithm>("prim");

  const [currentStep, setCurrentStep] =
    useState(0);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [speed, setSpeed] =
    useState<Speed>("normal");

  const [showLearn, setShowLearn] =
    useState(true);

  /* =======================================================
     GENERATE STEPS
  ======================================================= */

  const primSteps = useMemo(
    () =>
      generatePrimSteps(
        nodes,
        edges,
        "A"
      ),
    []
  );

  const dijkstraSteps = useMemo(
    () =>
      generateDijkstraSteps(
        nodes,
        edges,
        "A"
      ),
    []
  );

  const floydSteps = useMemo(
    () =>
      generateFloydSteps(
        nodes,
        edges
      ),
    []
  );

  const boyerSteps = useMemo(
    () =>
      generateBoyerMooreSteps(
        "JIM_SAW_ME_IN_A_BARBERSHOP",
        "BARBER"
      ),
    []
  );

  /* =======================================================
     CURRENT STEP COLLECTION
  ======================================================= */

  const steps =
    algorithm === "prim"
      ? primSteps
      : algorithm === "dijkstra"
      ? dijkstraSteps
      : algorithm === "floyd"
      ? floydSteps
      : boyerSteps;

  /* =======================================================
     SAFE STEP
  ======================================================= */

  const safeStepIndex =
    Math.min(
      currentStep,
      Math.max(
        steps.length - 1,
        0
      )
    );

  /* =======================================================
     CURRENT MESSAGE
  ======================================================= */

  const currentMessage =
    steps[safeStepIndex]?.message ??
    "Ready to begin.";

  const teachingText =
    getTeachingText(
      algorithm,
      currentMessage
    );

  const info =
    algorithmInfo[algorithm];

  /* =======================================================
     RESET WHEN ALGORITHM CHANGES
  ======================================================= */

  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, [algorithm]);

  /* =======================================================
     AUTOPLAY
  ======================================================= */

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    if (
      safeStepIndex >=
      steps.length - 1
    ) {
      setIsPlaying(false);
      return;
    }

    const timer =
      window.setTimeout(() => {
        setCurrentStep(
          (previous) =>
            Math.min(
              previous + 1,
              steps.length - 1
            )
        );
      }, SPEED_DELAY[speed]);

    return () =>
      window.clearTimeout(timer);
  }, [
    isPlaying,
    safeStepIndex,
    steps.length,
    speed,
  ]);

  /* =======================================================
     CONTROLS
  ======================================================= */

  const reset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const previous = () => {
    setIsPlaying(false);

    setCurrentStep(
      (previousStep) =>
        Math.max(
          previousStep - 1,
          0
        )
    );
  };

  const next = () => {
    setIsPlaying(false);

    setCurrentStep(
      (previousStep) =>
        Math.min(
          previousStep + 1,
          steps.length - 1
        )
    );
  };

  const playPause = () => {
    if (steps.length === 0) {
      return;
    }

    if (
      safeStepIndex >=
      steps.length - 1
    ) {
      setCurrentStep(0);
      setIsPlaying(true);
      return;
    }

    setIsPlaying(
      (previousState) =>
        !previousState
    );
  };

  const changeSpeed = (
    newSpeed: Speed
  ) => {
    setSpeed(newSpeed);
  };

  const changeAlgorithm = (
    newAlgorithm: Algorithm
  ) => {
    setAlgorithm(newAlgorithm);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  /* =======================================================
     PROGRESS
  ======================================================= */

  const progress =
    steps.length > 1
      ? (safeStepIndex /
          (steps.length - 1)) *
        100
      : 0;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="app">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="topbar">

        <div className="brand">

          <div className="brand-mark">
            G
          </div>

          <div>
            <h1>
              Graphora
            </h1>

            <span>
              Interactive Algorithm Visualization
            </span>
          </div>

        </div>

        <div className="topbar-right">
          <div className="project-badge">
            DAA PROJECT
          </div>
        </div>

      </header>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="main-content">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="hero">

          <p className="eyebrow">
            INTERACTIVE ALGORITHM LAB
          </p>

          <h2>
            Understand algorithms
            <br />

            <span>
              step by step.
            </span>
          </h2>

          <p className="hero-description">
            Learn what the algorithm is doing,
            understand why it is doing it,
            and watch the result happen visually.
          </p>

        </section>


        {/* =================================================
            ALGORITHM SELECTOR
        ================================================= */}

        <section className="algorithm-selector">

          <button
            className={
              algorithm === "prim"
                ? "algorithm-tab active"
                : "algorithm-tab"
            }
            onClick={() =>
              changeAlgorithm("prim")
            }
          >
            <span className="algorithm-number">
              01
            </span>

            <span>
              <strong>
                Prim's
              </strong>

              <small>
                Minimum Spanning Tree
              </small>
            </span>
          </button>


          <button
            className={
              algorithm === "dijkstra"
                ? "algorithm-tab active"
                : "algorithm-tab"
            }
            onClick={() =>
              changeAlgorithm("dijkstra")
            }
          >
            <span className="algorithm-number">
              02
            </span>

            <span>
              <strong>
                Dijkstra's
              </strong>

              <small>
                Shortest Path
              </small>
            </span>
          </button>


          <button
            className={
              algorithm === "floyd"
                ? "algorithm-tab active"
                : "algorithm-tab"
            }
            onClick={() =>
              changeAlgorithm("floyd")
            }
          >
            <span className="algorithm-number">
              03
            </span>

            <span>
              <strong>
                Floyd-Warshall
              </strong>

              <small>
                All-Pairs Shortest Path
              </small>
            </span>
          </button>


          <button
            className={
              algorithm === "boyer"
                ? "algorithm-tab active"
                : "algorithm-tab"
            }
            onClick={() =>
              changeAlgorithm("boyer")
            }
          >
            <span className="algorithm-number">
              04
            </span>

            <span>
              <strong>
                Horspool
              </strong>

              <small>
                String Matching
              </small>
            </span>
          </button>

        </section>


        {/* =================================================
            WORKSPACE
        ================================================= */}

        <section className="workspace">

          {/* WORKSPACE HEADER */}

          <div className="workspace-header">

            <div>

              <span className="workspace-label">
                CURRENT ALGORITHM
              </span>

              <h3>
                {info.name}
              </h3>

              <p>
                {info.description}
              </p>

            </div>


            <div className="step-counter">

              <span>
                STEP
              </span>

              <strong>
                {String(
                  safeStepIndex + 1
                ).padStart(2, "0")}
              </strong>

              <span>
                /
                {" "}
                {String(
                  steps.length
                ).padStart(2, "0")}
              </span>

            </div>

          </div>


          {/* PROGRESS */}

          <div className="progress-track">

            <div
              className="progress-value"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>


          {/* =================================================
              VISUALIZER
          ================================================= */}

          <div className="visualizer-area">

            {algorithm === "prim" && (
              <GraphCanvas
                nodes={nodes}
                edges={edges}
                step={
                  primSteps[
                    safeStepIndex
                  ]
                  }
              />
            )}


            {algorithm === "dijkstra" && (
              <GraphCanvas
                nodes={nodes}
                edges={edges}
                step={
                  dijkstraSteps[
                    safeStepIndex
                  ]
                }
              />
            )}


            {algorithm === "floyd" && (
              <DistanceMatrix
                nodes={nodes}
                step={
                  floydSteps[
                    safeStepIndex
                  ]
                }
              />
            )}


            {algorithm === "boyer" && (
              <PatternMatcher
                step={
                  boyerSteps[
                    safeStepIndex
                  ]
                }
              />
            )}

          </div>


          {/* =================================================
              TEXT TEACHING
          ================================================= */}

          <div className="teaching-panel">

            <div className="teaching-icon">
              ?
            </div>

            <div className="teaching-content">

              <div className="teaching-heading">

                <span>
                  HOW THIS STEP WORKS
                </span>

                {isPlaying && (
                  <span className="playing-indicator">
                    AUTO PLAYING
                  </span>
                )}

              </div>

              <p>
                {teachingText}
              </p>

            </div>

          </div>


          {/* =================================================
              CONTROLS
          ================================================= */}

          <div className="controls">

            <div className="control-group">

              <button
                className="control-button secondary"
                onClick={reset}
              >
                ↺ Reset
              </button>


              <button
                className="control-button secondary"
                onClick={previous}
                disabled={
                  safeStepIndex === 0
                }
              >
                ← Previous
              </button>


              <button
                className="control-button primary"
                onClick={playPause}
              >
                {isPlaying
                  ? "Ⅱ Pause"
                  : "▶ Play"}
              </button>


              <button
                className="control-button secondary"
                onClick={next}
                disabled={
                  safeStepIndex >=
                  steps.length - 1
                }
              >
                Next →
              </button>

            </div>


            <div className="speed-control">

              <span>
                SPEED
              </span>

              <div className="speed-buttons">

                <button
                  className={
                    speed === "slow"
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    changeSpeed("slow")
                  }
                >
                  Slow
                </button>


                <button
                  className={
                    speed === "normal"
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    changeSpeed("normal")
                  }
                >
                  Normal
                </button>


                <button
                  className={
                    speed === "fast"
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    changeSpeed("fast")
                  }
                >
                  Fast
                </button>

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            LEARN SECTION
        ================================================= */}

        <section className="learn-section">

          <div className="learn-header">

            <div>

              <span className="eyebrow">
                ALGORITHM GUIDE
              </span>

              <h2>
                Learn the algorithm
              </h2>

              <p>
                A quick reference for understanding
                what the algorithm does, how it works,
                and where it is used.
              </p>

            </div>


            <button
              className="learn-toggle"
              onClick={() =>
                setShowLearn(
                  (previousState) =>
                    !previousState
                )
              }
            >
              {showLearn
                ? "Hide details ↑"
                : "Show details ↓"}
            </button>

          </div>


          {showLearn && (

            <div className="learn-content">

              {/* PURPOSE */}

              <div className="learn-card purpose-card">

                <div className="learn-card-label">
                  PURPOSE
                </div>

                <h3>
                  {info.name}
                </h3>

                <p>
                  {info.purpose}
                </p>

              </div>


              {/* HOW IT WORKS */}

              <div className="learn-card">

                <div className="learn-card-label">
                  HOW IT WORKS
                </div>

                <div className="how-list">

                  {info.howItWorks.map(
                    (item, index) => (

                      <div
                        className="how-item"
                        key={item}
                      >

                        <span>
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        <p>
                          {item}
                        </p>

                      </div>

                    )
                  )}

                </div>

              </div>


              {/* COMPLEXITY */}

              <div className="learn-card">

                <div className="learn-card-label">
                  COMPLEXITY
                </div>

                <div className="complexity-row">

                  <div>

                    <span>
                      TIME
                    </span>

                    <strong>
                      {info.time}
                    </strong>

                  </div>


                  <div>

                    <span>
                      SPACE
                    </span>

                    <strong>
                      {info.space}
                    </strong>

                  </div>

                </div>

              </div>


              {/* APPLICATIONS */}

              <div className="learn-card">

                <div className="learn-card-label">
                  REAL-WORLD APPLICATIONS
                </div>

                <div className="application-list">

                  {info.applications.map(
                    (application) => (

                      <div
                        className="application-item"
                        key={application}
                      >

                        <span>
                          ✓
                        </span>

                        <p>
                          {application}
                        </p>

                      </div>

                    )
                  )}

                </div>

              </div>

            </div>

          )}

        </section>


        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className="app-footer">

          <div>

            <strong>
              Graphora
            </strong>

            <span>
              Interactive Algorithm Visualization
            </span>

          </div>

          <span>
            Design &amp; Analysis of Algorithms
          </span>

        </footer>

      </main>

    </div>
  );
}

export default App;