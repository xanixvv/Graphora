export type BoyerMoorePhase =
  | "intro"
  | "compare"
  | "match"
  | "mismatch"
  | "shift"
  | "found"
  | "complete";

export type BoyerMooreStep = {
  text: string;
  pattern: string;

  // Current position of the pattern inside the text
  alignment: number;

  // Previous positions where the pattern was tested
  previousAlignments: number[];

  // Currently compared characters
  comparedIndex: number;
  patternIndex: number;

  // Text indices that have matched during this alignment
  matchedIndices: number[];

  // Text index containing the mismatch
  mismatchIndex: number | null;

  // Horspool shift information
  shift: number;
  nextAlignment: number | null;
  badCharacter: string | null;
  tableValue: number | null;

  phase: BoyerMoorePhase;

  message: string;
};

/* =========================================================
   BUILD HORSPOOL SHIFT TABLE
========================================================= */

export const buildBadCharacterTable = (
  pattern: string
): Record<string, number> => {
  const table: Record<string, number> = {};

  const m = pattern.length;

  /*
    For Horspool:

    Ignore the final character.

    shift[character] = pattern.length - 1 - index
  */

  for (let i = 0; i < m - 1; i++) {
    table[pattern[i]] = m - 1 - i;
  }

  return table;
};


/* =========================================================
   GENERATE STEPS
========================================================= */

export const generateBoyerMooreSteps = (
  text: string,
  pattern: string
): BoyerMooreStep[] => {
  const steps: BoyerMooreStep[] = [];

  if (!pattern || !text || pattern.length > text.length) {
    return [
      {
        text,
        pattern,
        alignment: 0,
        previousAlignments: [],
        comparedIndex: -1,
        patternIndex: -1,
        matchedIndices: [],
        mismatchIndex: null,
        shift: 0,
        nextAlignment: null,
        badCharacter: null,
        tableValue: null,
        phase: "complete",
        message:
          "The pattern cannot be searched because it is empty or longer than the text.",
      },
    ];
  }

  const m = pattern.length;

  const shiftTable = buildBadCharacterTable(pattern);

  /*
    Any character that is not explicitly inside the table
    receives the default shift = pattern length.
  */

  const defaultShift = m;

  let alignment = 0;

  const previousAlignments: number[] = [];

  /* =======================================================
     INTRODUCTION
  ======================================================= */

  steps.push({
    text,
    pattern,
    alignment: 0,
    previousAlignments: [],
    comparedIndex: -1,
    patternIndex: -1,
    matchedIndices: [],
    mismatchIndex: null,
    shift: 0,
    nextAlignment: null,
    badCharacter: null,
    tableValue: null,
    phase: "intro",
    message:
      `We want to find "${pattern}" inside the text. ` +
      `Horspool starts by comparing characters from right to left.`,
  });

  /* =======================================================
     MAIN SEARCH
  ======================================================= */

  while (alignment <= text.length - m) {
    const matchedIndices: number[] = [];

    /*
      First show the pattern aligned with the text.
    */

    steps.push({
      text,
      pattern,
      alignment,
      previousAlignments: [...previousAlignments],
      comparedIndex: alignment + m - 1,
      patternIndex: m - 1,
      matchedIndices: [],
      mismatchIndex: null,
      shift: 0,
      nextAlignment: null,
      badCharacter: null,
      tableValue: null,
      phase: "compare",
      message:
        `The pattern is aligned at text index ${alignment}. ` +
        `We start comparing from the rightmost character.`,
    });

    let j = m - 1;

    /* =====================================================
       COMPARE RIGHT → LEFT
    ===================================================== */

    while (j >= 0) {
      const textIndex = alignment + j;

      const patternCharacter = pattern[j];
      const textCharacter = text[textIndex];

      /*
        Show the actual comparison.
      */

      steps.push({
        text,
        pattern,
        alignment,
        previousAlignments: [...previousAlignments],
        comparedIndex: textIndex,
        patternIndex: j,
        matchedIndices: [...matchedIndices],
        mismatchIndex: null,
        shift: 0,
        nextAlignment: null,
        badCharacter: null,
        tableValue: null,
        phase: "compare",
        message:
          `Compare pattern[${j}] "${patternCharacter}" ` +
          `with text[${textIndex}] "${textCharacter}".`,
      });

      /* ===================================================
         MATCH
      =================================================== */

      if (patternCharacter === textCharacter) {
        matchedIndices.push(textIndex);

        steps.push({
          text,
          pattern,
          alignment,
          previousAlignments: [...previousAlignments],
          comparedIndex: textIndex,
          patternIndex: j,
          matchedIndices: [...matchedIndices],
          mismatchIndex: null,
          shift: 0,
          nextAlignment: null,
          badCharacter: null,
          tableValue: null,
          phase: "match",
          message:
            `Match! "${patternCharacter}" is equal to "${textCharacter}". ` +
            `Move one position to the left.`,
        });

        j--;

        continue;
      }

      /* ===================================================
         MISMATCH
      =================================================== */

      /*
        THIS is the important Horspool rule.

        We look at the character underneath the
        RIGHTMOST position of the pattern.

        Example:

        TEXT:     ... X
        PATTERN:  BARBER
                       ↑
                  look here

        Then use X in the shift table.
      */

      const badCharacterIndex = alignment + m - 1;

      const badCharacter = text[badCharacterIndex];

      const tableValue =
        shiftTable[badCharacter] ?? defaultShift;

      const nextAlignment = alignment + tableValue;

      steps.push({
        text,
        pattern,
        alignment,
        previousAlignments: [...previousAlignments],
        comparedIndex: textIndex,
        patternIndex: j,
        matchedIndices: [...matchedIndices],
        mismatchIndex: textIndex,
        shift: tableValue,
        nextAlignment,
        badCharacter,
        tableValue,
        phase: "mismatch",
        message:
          `Mismatch! Pattern "${patternCharacter}" does not match ` +
          `text "${textCharacter}". Now Horspool checks the character ` +
          `"${badCharacter}" underneath the pattern's right edge.`,
      });

      /* ===================================================
         SHOW TABLE LOOKUP
      =================================================== */

      steps.push({
        text,
        pattern,
        alignment,
        previousAlignments: [...previousAlignments],
        comparedIndex: badCharacterIndex,
        patternIndex: m - 1,
        matchedIndices: [...matchedIndices],
        mismatchIndex: textIndex,
        shift: tableValue,
        nextAlignment,
        badCharacter,
        tableValue,
        phase: "shift",
        message:
          `The shift table gives "${badCharacter}" a value of ` +
          `${tableValue}. Therefore, move the pattern ${tableValue} ` +
          `position${tableValue === 1 ? "" : "s"} to the right.`,
      });

      previousAlignments.push(alignment);

      alignment = nextAlignment;

      break;
    }

    /* =====================================================
       PATTERN FOUND
    ===================================================== */

    if (j < 0) {
      steps.push({
        text,
        pattern,
        alignment,
        previousAlignments: [...previousAlignments],
        comparedIndex: -1,
        patternIndex: -1,
        matchedIndices: [...matchedIndices],
        mismatchIndex: null,
        shift: 0,
        nextAlignment: null,
        badCharacter: null,
        tableValue: null,
        phase: "found",
        message:
          `Pattern found! "${pattern}" starts at text index ${alignment}. ` +
          `Every character matched from right to left.`,
      });

      steps.push({
        text,
        pattern,
        alignment,
        previousAlignments: [...previousAlignments],
        comparedIndex: -1,
        patternIndex: -1,
        matchedIndices: [...matchedIndices],
        mismatchIndex: null,
        shift: 0,
        nextAlignment: null,
        badCharacter: null,
        tableValue: null,
        phase: "complete",
        message:
          `Search complete. The pattern "${pattern}" was successfully found.`,
      });

      return steps;
    }
  }

  /* =======================================================
     NOT FOUND
  ======================================================= */

  steps.push({
    text,
    pattern,
    alignment: Math.min(
      alignment,
      Math.max(0, text.length - m)
    ),
    previousAlignments: [...previousAlignments],
    comparedIndex: -1,
    patternIndex: -1,
    matchedIndices: [],
    mismatchIndex: null,
    shift: 0,
    nextAlignment: null,
    badCharacter: null,
    tableValue: null,
    phase: "complete",
    message:
      `Search complete. The pattern "${pattern}" was not found in the text.`,
  });

  return steps;
};