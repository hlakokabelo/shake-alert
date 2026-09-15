import { useEffect, useRef } from "react";

export function useShake(onShake: () => void) {
  const shakeCount = useRef(0);
  const shakeWindowStart = useRef(0);
  const lastTrigger = useRef(0);

  useEffect(() => {
    const handleMotion = (event: DeviceMotionEvent) => {
      const a = event.accelerationIncludingGravity;

      if (!a) return;

      const x = a.x ?? 0;
      const y = a.y ?? 0;
      const z = a.z ?? 0;

      const force = Math.sqrt(
        x * x +
        y * y +
        z * z,
      );

      const now = Date.now();

      if (force < 20) return;

      // Ignore events shortly after a successful trigger
      if (now - lastTrigger.current < 5000) {
        return;
      }

      // Start a new shake window
      if (now - shakeWindowStart.current > 1000) {
        shakeWindowStart.current = now;
        shakeCount.current = 1;
        return;
      }

      shakeCount.current++;

      if (shakeCount.current >= 3) {
        lastTrigger.current = now;

        shakeCount.current = 0;
        shakeWindowStart.current = 0;

        onShake();
      }
    };

    window.addEventListener(
      "devicemotion",
      handleMotion,
    );

    return () => {
      window.removeEventListener(
        "devicemotion",
        handleMotion,
      );
    };
  }, [onShake]);
}