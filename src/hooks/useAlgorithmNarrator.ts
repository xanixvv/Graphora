import { useCallback, useRef, useState } from "react";

type Algorithm =
  | "prim"
  | "dijkstra"
  | "floyd"
  | "boyer";

export function useAlgorithmNarrator() {
  const [enabled, setEnabled] = useState(true);

  const introduced = useRef<Record<Algorithm, boolean>>({
    prim: false,
    dijkstra: false,
    floyd: false,
    boyer: false,
  });

  /* =========================================================
     STOP SPEECH
  ========================================================= */

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
  }, []);

  /* =========================================================
     BEGINNER INTRODUCTIONS
  ========================================================= */

  const getIntroduction = useCallback(
    (algorithm: Algorithm): string => {
      switch (algorithm) {
        case "prim":
          return (
            "Before we start, let's understand the basic idea. " +
            "A graph is made of vertices, which are the points you see, " +
            "and edges, which are the lines connecting those points. " +
            "Each edge has a weight, shown as a number. " +
            "Prim's algorithm wants to connect every vertex together using the smallest possible total weight. " +
            "Imagine connecting several houses with cables while spending as little money as possible. " +
            "We will start at one vertex and gradually grow our tree."
          );

        case "dijkstra":
          return (
            "Before we start, let's understand the basic idea. " +
            "Imagine that every vertex is a city and every edge is a road. " +
            "The number on an edge tells us the cost or distance of travelling along that road. " +
            "Dijkstra's algorithm finds the shortest route from one starting vertex to all the other vertices. " +
            "We begin at our starting point, then repeatedly look at the closest vertex we have not finished yet. " +
            "We use it to see whether we can find shorter routes to the vertices around it."
          );

        case "floyd":
          return (
            "Before we start, let's understand the basic idea. " +
            "Floyd-Warshall finds the shortest distance between every pair of vertices. " +
            "The important question is: could going through another vertex give us a shorter route? " +
            "For example, instead of travelling directly from A to C, perhaps A to B and then B to C is cheaper. " +
            "The algorithm systematically checks these possibilities and updates the distance table whenever it finds a better route."
          );

        case "boyer":
          return (
            "Before we start, let's understand what we are trying to do. " +
            "We have a large piece of text and a smaller word called the pattern. " +
            "Our goal is to find where the pattern appears inside the text. " +
            "Here, the text is JIM underscore SAW underscore ME underscore IN underscore A underscore BARBERSHOP, " +
            "and our pattern is BARBER. " +
            "This demonstration uses the Horspool version of the Boyer-Moore family of string matching algorithms. " +
            "The important idea is that we do not compare every character from left to right. " +
            "Instead, we align the pattern with the text and compare characters from the right side of the pattern. " +
            "When a mismatch occurs, we look at the character under the rightmost position of the pattern. " +
            "A shift table tells us how far the pattern can safely jump forward. " +
            "This lets us skip positions that do not need to be checked."
          );
      }
    },
    []
  );

  /* =========================================================
     STEP EXPLANATIONS
  ========================================================= */

  const getExplanation = useCallback(
    (
      algorithm: Algorithm,
      message: string
    ): string => {
      const lower = message.toLowerCase();

      /* =====================================================
         PRIM
      ===================================================== */

      if (algorithm === "prim") {
        if (
          lower.includes("start") ||
          lower.includes("starting")
        ) {
          return (
            `${message}. ` +
            "We need somewhere to begin, so we start with vertex A. " +
            "From here, Prim's algorithm will look at the edges leaving our current tree. " +
            "Our goal is to keep adding the cheapest edge that connects us to a new vertex."
          );
        }

        if (
          lower.includes("exam") ||
          lower.includes("check") ||
          lower.includes("consider")
        ) {
          return (
            `${message}. ` +
            "We're comparing the available edges because Prim's algorithm always wants the cheapest useful connection. " +
            "We are not simply choosing any edge. " +
            "We want one that connects our existing tree to a vertex we have not added yet."
          );
        }

        if (
          lower.includes("select") ||
          lower.includes("selected") ||
          lower.includes("choose") ||
          lower.includes("chosen") ||
          lower.includes("add")
        ) {
          return (
            `${message}. ` +
            "This edge is the cheapest useful connection we currently have. " +
            "So we add it to our tree and bring the new vertex into the tree as well. " +
            "We will repeat this process until every vertex is connected."
          );
        }

        if (
          lower.includes("reject") ||
          lower.includes("cycle")
        ) {
          return (
            `${message}. ` +
            "We are leaving this edge out because using it would create a cycle, which means a loop in our tree. " +
            "We already have another way to connect these vertices, so this extra edge is unnecessary."
          );
        }

        if (
          lower.includes("complete") ||
          lower.includes("finished")
        ) {
          return (
            `${message}. ` +
            "We have now connected every vertex. " +
            "The selected edges form a minimum spanning tree, meaning we connected the entire graph while keeping the total edge weight as small as possible."
          );
        }

        return (
          `${message}. ` +
          "Keep your eye on the highlighted edge. " +
          "Prim's algorithm is gradually building one connected tree by choosing inexpensive connections."
        );
      }

      /* =====================================================
         DIJKSTRA
      ===================================================== */

      if (algorithm === "dijkstra") {
        if (
          lower.includes("start") ||
          lower.includes("source")
        ) {
          return (
            `${message}. ` +
            "We need a starting point because Dijkstra calculates distances from one source. " +
            "The distance from the source to itself is zero. " +
            "At first, we do not know the shortest distances to the other vertices, so those distances begin as infinity."
          );
        }

        if (
          lower.includes("select") ||
          lower.includes("selected") ||
          lower.includes("process") ||
          lower.includes("visit")
        ) {
          return (
            `${message}. ` +
            "Dijkstra now chooses the unvisited vertex with the smallest distance we currently know. " +
            "Because this is the closest unfinished vertex, we can safely treat its shortest distance as confirmed. " +
            "Next, we will use this vertex to check the routes to its neighbours."
          );
        }

        if (
          lower.includes("update") ||
          lower.includes("updated") ||
          lower.includes("shorter")
        ) {
          return (
            `${message}. ` +
            "We found a better route. " +
            "The new route is shorter than the distance we had stored before, so we replace the old value with this smaller distance. " +
            "This is how Dijkstra gradually discovers the shortest paths."
          );
        }

        if (
          lower.includes("check") ||
          lower.includes("exam") ||
          lower.includes("compare")
        ) {
          return (
            `${message}. ` +
            "We are testing a possible route through the current vertex. " +
            "If travelling through this vertex is cheaper than the route we already know, we will update the distance."
          );
        }

        if (
          lower.includes("complete") ||
          lower.includes("finished")
        ) {
          return (
            `${message}. ` +
            "We are done. " +
            "The shortest distances from our starting vertex have been determined."
          );
        }

        return (
          `${message}. ` +
          "Dijkstra is gradually building the shortest paths outward from the starting vertex."
        );
      }

      /* =====================================================
         FLOYD-WARSHALL
      ===================================================== */

      if (algorithm === "floyd") {
        if (
          lower.includes("start") ||
          lower.includes("initial")
        ) {
          return (
            `${message}. ` +
            "This table stores the distances between pairs of vertices. " +
            "A vertex has distance zero from itself. " +
            "If two vertices have a direct edge, we begin with that edge's weight. " +
            "For routes we do not know yet, we use infinity."
          );
        }

        if (
          lower.includes("intermediate") ||
          lower.includes("through")
        ) {
          return (
            `${message}. ` +
            "The vertex we are highlighting is being used as a possible middle point. " +
            "We are asking a simple question: would going from the first vertex to this middle vertex and then to the destination be cheaper than the route we currently know?"
          );
        }

        if (
          lower.includes("update") ||
          lower.includes("updated") ||
          lower.includes("shorter")
        ) {
          return (
            `${message}. ` +
            "We discovered a shorter route by going through the current middle vertex. " +
            "So we replace the old number in the table with the smaller number. " +
            "This is the main operation Floyd-Warshall repeats again and again."
          );
        }

        if (
          lower.includes("check") ||
          lower.includes("compar")
        ) {
          return (
            `${message}. ` +
            "We are comparing two possibilities: the route we already know and a route that goes through the current middle vertex. " +
            "If the new route is shorter, we keep the new value. Otherwise, we leave the table unchanged."
          );
        }

        if (
          lower.includes("complete") ||
          lower.includes("finished")
        ) {
          return (
            `${message}. ` +
            "We have finished checking the possible intermediate vertices. " +
            "The matrix now represents the shortest distances between every pair of vertices."
          );
        }

        return (
          `${message}. ` +
          "Floyd-Warshall is comparing possible routes and keeping the shortest one it finds."
        );
      }

      /* =====================================================
         BOYER-MOORE / HORSPOOL
      ===================================================== */

      if (algorithm === "boyer") {
        if (
          lower.includes("align") ||
          lower.includes("alignment")
        ) {
          return (
            `${message}. ` +
            "We are placing the pattern underneath a section of the text. " +
            "Our pattern is BARBER, while the complete text is JIM underscore SAW underscore ME underscore IN underscore A underscore BARBERSHOP. " +
            "Once they are aligned, we compare characters starting from the rightmost character of the pattern."
          );
        }

        if (
          lower.includes("compar") ||
          lower.includes("check")
        ) {
          return (
            `${message}. ` +
            "We are comparing the characters at this position. " +
            "Notice that we are moving from right to left rather than from left to right. " +
            "This is important because a mismatch can allow us to skip several positions."
          );
        }

        if (
          lower.includes("mismatch") ||
          lower.includes("does not match") ||
          lower.includes("don't match") ||
          lower.includes("different")
        ) {
          return (
            `${message}. ` +
            "These two characters are different, so BARBER cannot occur at this alignment. " +
            "Instead of moving the pattern only one position, we use the shift table. " +
            "The character underneath the rightmost position tells us how far we can safely jump forward."
          );
        }

        if (
          lower.includes("shift") ||
          lower.includes("jump")
        ) {
          return (
            `${message}. ` +
            "The pattern is now shifting forward. " +
            "The shift table tells us how many positions we can safely skip. " +
            "This is the key advantage of the Horspool approach: we avoid checking positions that cannot possibly contain the pattern."
          );
        }

        if (
          lower.includes("match") ||
          lower.includes("found")
        ) {
          return (
            `${message}. ` +
            "These characters match. " +
            "We continue comparing from right to left until either a mismatch occurs or every character in BARBER matches. " +
            "If every character matches, the pattern has been found inside the text."
          );
        }

        if (
          lower.includes("complete") ||
          lower.includes("finished")
        ) {
          return (
            `${message}. ` +
            "We have finished searching the text. " +
            "If the pattern was found, its position is now known. " +
            "The main idea to remember is that Horspool compares from the right and uses the shift table to jump over unnecessary positions."
          );
        }

        return (
          `${message}. ` +
          "Remember: we are searching for BARBER inside JIM underscore SAW underscore ME underscore IN underscore A underscore BARBERSHOP. " +
          "The pattern is compared from right to left, and after a mismatch the shift table helps us jump over unnecessary positions."
        );
      }

      return message;
    },
    []
  );

  /* =========================================================
     SPEAK
  ========================================================= */

  const speak = useCallback(
    (
      algorithm: Algorithm,
      message: string
    ): Promise<void> => {
      return new Promise((resolve) => {
        if (!enabled) {
          resolve();
          return;
        }

        window.speechSynthesis.cancel();

        let text: string;

        if (!introduced.current[algorithm]) {
          text =
            getIntroduction(algorithm) +
            " " +
            getExplanation(
              algorithm,
              message
            );

          introduced.current[algorithm] = true;
        } else {
          text = getExplanation(
            algorithm,
            message
          );
        }

        const utterance =
          new SpeechSynthesisUtterance(text);

        /* =====================================================
           TEACHING VOICE SETTINGS
        ===================================================== */

        utterance.rate = 0.76;
        utterance.pitch = 1;
        utterance.volume = 1;

        const voices =
          window.speechSynthesis.getVoices();

        const voice =
          voices.find(
            (item) =>
              item.lang === "en-US"
          ) ??
          voices.find(
            (item) =>
              item.lang.startsWith("en")
          );

        if (voice) {
          utterance.voice = voice;
        }

        /* =====================================================
           FINISH / ERROR
        ===================================================== */

        utterance.onend = () => {
          resolve();
        };

        utterance.onerror = () => {
          resolve();
        };

        window.speechSynthesis.speak(
          utterance
        );
      });
    },
    [
      enabled,
      getExplanation,
      getIntroduction,
    ]
  );

  /* =========================================================
     TOGGLE
  ========================================================= */

  const toggle = useCallback(() => {
    if (enabled) {
      window.speechSynthesis.cancel();
    }

    setEnabled(
      (previous) => !previous
    );
  }, [enabled]);

  /* =========================================================
     RETURN
  ========================================================= */

  return {
    enabled,
    speak,
    stop,
    toggle,
    getExplanation,
  };
}