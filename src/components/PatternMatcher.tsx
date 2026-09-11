import type { CSSProperties } from "react";

import type { BoyerMooreStep } from "../algorithms/boyerMoore";

type Props = {
  step: BoyerMooreStep;
};

export default function PatternMatcher({ step }: Props) {
  const {
    text,
    pattern,
    alignment,
    previousAlignments,
    comparedIndex,
    patternIndex,
    matchedIndices,
    mismatchIndex,
    shift,
    nextAlignment,
    badCharacter,
    tableValue,
    phase,
  } = step;

  const shiftTable: Record<string, number> = {};

  /*
    Build the same Horspool table used by the algorithm.
  */

  for (let i = 0; i < pattern.length - 1; i++) {
    shiftTable[pattern[i]] =
      pattern.length - 1 - i;
  }

  const defaultShift = pattern.length;

  const tableCharacters = [
    ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "_",
  ];

  const getCellClass = (index: number) => {
    const classes = ["bm-text-cell"];

    if (matchedIndices.includes(index)) {
      classes.push("bm-success");
    }

    if (index === mismatchIndex) {
      classes.push("bm-error");
    }

    if (index === comparedIndex) {
      classes.push("bm-current");
    }

    return classes.join(" ");
  };

  const getPatternClass = (index: number) => {
    const classes = ["bm-pattern-cell"];

    if (index === patternIndex) {
      classes.push("bm-pattern-current");
    }

    if (
      phase === "found" &&
      matchedIndices.length === pattern.length
    ) {
      classes.push("bm-pattern-success");
    }

    return classes.join(" ");
  };

  const columns = text.length;

  const patternStyle = {
    transform: `translateX(${alignment * 48}px)`,
  } as CSSProperties;

  const phaseLabel = {
    intro: "GET READY",
    compare: "COMPARE",
    match: "MATCH",
    mismatch: "MISMATCH",
    shift: "SHIFT",
    found: "FOUND",
    complete: "COMPLETE",
  }[phase];

  return (
    <div className="bm-container">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="bm-header">
        <div>
          <p className="bm-eyebrow">
            STRING MATCHING
          </p>

          <h2>Horspool String Matching</h2>

          <p>
            Find a pattern inside a larger text using
            intelligent jumps.
          </p>
        </div>

        <div className="bm-phase">
          {phaseLabel}
        </div>
      </div>


      {/* =====================================================
          SEARCH GOAL
      ===================================================== */}

      <div className="bm-goal-card">

        <div className="bm-goal-label">
          WE ARE LOOKING FOR
        </div>

        <div className="bm-target">
          {pattern.split("").map((char, index) => (
            <span key={`${char}-${index}`}>
              {char}
            </span>
          ))}
        </div>

        <div className="bm-goal-inside">
          inside this text
        </div>

        <div className="bm-full-text">
          {text}
        </div>

      </div>


      {/* =====================================================
          SHIFT TABLE
      ===================================================== */}

      <div className="bm-table-card">

        <div className="bm-card-heading">
          <div>
            <div className="bm-small-label">
              STEP 1
            </div>

            <h3>
              Build the shift table
            </h3>
          </div>

          {badCharacter && tableValue !== null && (
            <div className="bm-table-focus">
              Looking up: <strong>{badCharacter}</strong>
            </div>
          )}
        </div>

        <div className="bm-table-scroll">

          <div className="bm-table-row bm-table-letters">

            <div className="bm-table-first">
              CHAR
            </div>

            {tableCharacters.map((character) => {
              const highlighted =
                badCharacter === character;

              return (
                <div
                  key={character}
                  className={
                    highlighted
                      ? "bm-table-cell bm-highlight"
                      : "bm-table-cell"
                  }
                >
                  {character === "_" ? "␠" : character}
                </div>
              );
            })}

          </div>


          <div className="bm-table-row">

            <div className="bm-table-first">
              SHIFT
            </div>

            {tableCharacters.map((character) => {
              const value =
                shiftTable[character] ??
                defaultShift;

              const highlighted =
                badCharacter === character;

              return (
                <div
                  key={character}
                  className={
                    highlighted
                      ? "bm-table-cell bm-highlight"
                      : "bm-table-cell"
                  }
                >
                  {value}
                </div>
              );
            })}

          </div>

        </div>

        <div className="bm-table-explanation">
          Each character tells us how far the pattern can
          jump when that character appears under the
          pattern's right edge.
        </div>

      </div>


      {/* =====================================================
          MAIN VISUALIZATION
      ===================================================== */}

      <div className="bm-visual-card">

        <div className="bm-card-heading">

          <div>
            <div className="bm-small-label">
              STEP 2
            </div>

            <h3>
              Compare the pattern with the text
            </h3>
          </div>

          <div className="bm-direction-badge">
            RIGHT → LEFT
          </div>

        </div>


        <div className="bm-scroll-area">

          <div
            className="bm-grid"
            style={
              {
                "--bm-columns": columns,
              } as CSSProperties
            }
          >

            {/* INDEX */}

            <div className="bm-index-row">

              {text.split("").map((_, index) => (
                <div
                  className="bm-index"
                  key={index}
                >
                  {index}
                </div>
              ))}

            </div>


            {/* TEXT */}

            <div className="bm-text-row">

              {text.split("").map((character, index) => (
                <div
                  key={`${character}-${index}`}
                  className={getCellClass(index)}
                >
                  {character === " " ? "␠" : character}
                </div>
              ))}

            </div>


            {/* PATTERN */}

            <div className="bm-pattern-layer">

              <div
                className="bm-pattern-row"
                style={patternStyle}
              >

                {pattern.split("").map((character, index) => (
                  <div
                    key={`${character}-${index}`}
                    className={getPatternClass(index)}
                  >
                    {character}
                  </div>
                ))}

              </div>

            </div>


            {/* PREVIOUS ALIGNMENTS */}

            {previousAlignments.length > 0 && (
              <div className="bm-history">

                {previousAlignments.map(
                  (previousAlignment, rowIndex) => (
                    <div
                      className="bm-history-row"
                      key={`${previousAlignment}-${rowIndex}`}
                    >
                      <span>
                        Attempt {rowIndex + 1}
                      </span>

                      <div
                        className="bm-history-pattern"
                        style={{
                          transform:
                            `translateX(${previousAlignment * 48}px)`,
                        }}
                      >
                        {pattern.split("").map(
                          (character, index) => (
                            <div
                              key={`${character}-${index}`}
                              className="bm-history-cell"
                            >
                              {character}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )
                )}

              </div>
            )}

          </div>

        </div>


        {/* ===================================================
            COMPARISON
        =================================================== */}

        {comparedIndex >= 0 &&
          patternIndex >= 0 && (
            <div className="bm-comparison-box">

              <div className="bm-comparison-character">

                <span>TEXT</span>

                <strong>
                  {text[comparedIndex]}
                </strong>

                <small>
                  index {comparedIndex}
                </small>

              </div>


              <div className="bm-comparison-symbol">
                {text[comparedIndex] ===
                pattern[patternIndex]
                  ? "="
                  : "≠"}
              </div>


              <div className="bm-comparison-character">

                <span>PATTERN</span>

                <strong>
                  {pattern[patternIndex]}
                </strong>

                <small>
                  index {patternIndex}
                </small>

              </div>

            </div>
          )}


        {/* ===================================================
            DIRECTION
        =================================================== */}

        {(phase === "compare" ||
          phase === "match") && (
          <div className="bm-direction">

            <span>
              CURRENT ACTION
            </span>

            <div className="bm-direction-line">
              <span>
                Compare from the right
              </span>

              <span className="bm-arrow">
                ←
              </span>

              <span>
                Move left
              </span>
            </div>

            <p>
              Horspool checks the pattern from
              right to left.
            </p>

          </div>
        )}


        {/* ===================================================
            MISMATCH RESULT
        =================================================== */}

        {phase === "mismatch" && (
          <div className="bm-result bm-result-mismatch">

            <div className="bm-result-icon">
              ×
            </div>

            <div>
              <strong>
                Mismatch detected
              </strong>

              <p>
                The compared characters are different,
                so we can use the shift table to jump ahead.
              </p>
            </div>

          </div>
        )}


        {/* ===================================================
            SHIFT CARD
        =================================================== */}

        {phase === "shift" &&
          badCharacter &&
          tableValue !== null &&
          nextAlignment !== null && (
            <div className="bm-jump-card">

              <div className="bm-jump-top">

                <div>
                  <div className="bm-small-label">
                    BAD CHARACTER SHIFT
                  </div>

                  <h3>
                    Look up "{badCharacter}"
                  </h3>
                </div>

                <div className="bm-jump-number">
                  +{shift}
                </div>

              </div>


              <div className="bm-jump-flow">

                <div>
                  <span>
                    CURRENT
                  </span>

                  <strong>
                    {alignment}
                  </strong>
                </div>

                <div className="bm-arrow">
                  →
                </div>

                <div>
                  <span>
                    SHIFT
                  </span>

                  <strong>
                    +{tableValue}
                  </strong>
                </div>

                <div className="bm-arrow">
                  →
                </div>

                <div>
                  <span>
                    NEXT
                  </span>

                  <strong>
                    {nextAlignment}
                  </strong>
                </div>

              </div>


              <div className="bm-jump-explanation">

                The character "{badCharacter}" has a
                shift value of {tableValue}.
                Therefore the pattern jumps
                {tableValue} position
                {tableValue === 1 ? "" : "s"}.

              </div>

            </div>
          )}


        {/* ===================================================
            FOUND
        =================================================== */}

        {phase === "found" && (
          <div className="bm-found-card">

            <div className="bm-found-check">
              ✓
            </div>

            <div>

              <span>
                PATTERN MATCHED
              </span>

              <h3>
                "{pattern}" found!
              </h3>

              <p>
                The pattern starts at text index{" "}
                <strong>{alignment}</strong>.
              </p>

            </div>

          </div>
        )}

      </div>


      {/* =====================================================
          TUTOR
      ===================================================== */}

      <div className="bm-tutor-card">

        <div className="bm-tutor-avatar">
          🎓
        </div>

        <div>

          <div className="bm-tutor-label">
            TUTOR
          </div>

          <div className="bm-tutor-content">
            <p>
              {step.message}
            </p>
          </div>

        </div>

      </div>


      {/* =====================================================
          SIMPLE RULE
      ===================================================== */}

      <div className="bm-rule-card">

        <div className="bm-rule-icon">
          💡
        </div>

        <div>

          <strong>
            Remember the rule
          </strong>

          <p>
            When there is a mismatch, Horspool looks at
            the character under the pattern's rightmost
            position and uses the shift table to decide
            how far the pattern can jump.
          </p>

        </div>

      </div>


      {/* =====================================================
          LEGEND
      ===================================================== */}

      <div className="bm-legend">

        <div>
          <span className="bm-legend-dot bm-green" />
          Matched
        </div>

        <div>
          <span className="bm-legend-dot bm-yellow" />
          Current comparison
        </div>

        <div>
          <span className="bm-legend-dot bm-red" />
          Mismatch
        </div>

      </div>

    </div>
  );
}