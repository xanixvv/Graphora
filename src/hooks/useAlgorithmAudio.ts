import { useCallback, useRef, useState } from "react";

export function useAlgorithmAudio() {
  const audioContext =
    useRef<AudioContext | null>(null);

  const [muted, setMuted] = useState(false);

  const getContext = () => {
    if (!audioContext.current) {
      audioContext.current =
        new AudioContext();
    }

    return audioContext.current;
  };

  const tone = useCallback(
    (
      frequency: number,
      duration: number,
      volume: number = 0.035
    ) => {
      if (muted) return;

      const context = getContext();

      const oscillator =
        context.createOscillator();

      const gain =
        context.createGain();

      oscillator.type = "sine";

      oscillator.frequency.value =
        frequency;

      gain.gain.setValueAtTime(
        volume,
        context.currentTime
      );

      gain.gain.exponentialRampToValueAtTime(
        0.001,
        context.currentTime + duration
      );

      oscillator.connect(gain);
      gain.connect(context.destination);

      oscillator.start();

      oscillator.stop(
        context.currentTime + duration
      );
    },
    [muted]
  );

  const playStep = useCallback(
    (message: string) => {
      const lower =
        message.toLowerCase();

      if (
        lower.includes("completed") ||
        lower.includes("found")
      ) {
        tone(523, 0.12, 0.045);

        setTimeout(
          () => tone(659, 0.12, 0.045),
          100
        );

        setTimeout(
          () => tone(784, 0.18, 0.05),
          200
        );

        return;
      }

      if (
        lower.includes("mismatch") ||
        lower.includes("no update")
      ) {
        tone(180, 0.08, 0.025);
        return;
      }

      if (
        lower.includes("selected") ||
        lower.includes("updated") ||
        lower.includes("match:")
      ) {
        tone(620, 0.08, 0.035);
        return;
      }

      tone(320, 0.035, 0.015);
    },
    [tone]
  );

  const toggleMute = () => {
    setMuted((prev) => !prev);
  };

  return {
    muted,
    toggleMute,
    playStep,
  };
}