import { useEffect, useRef, useState } from "react";
import { ShakeIcon } from "../components/ShakeIcon";
import toast from "react-hot-toast";

type DeviceMotionEventWithPermission = typeof DeviceMotionEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

function Home() {
  const [shakeEnabled, setShakeEnabled] = useState(false);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [message, setMessage] = useState("Shake detection is disabled.");
 
  const alarmRef = useRef<HTMLAudioElement | null>(null);


  const shakeCount = useRef(0);
  const shakeWindowStart = useRef(0);
  const lastTrigger = useRef(0);

  const requestMotionPermission = async () => {
    try {
      const DeviceMotion =
        DeviceMotionEvent as DeviceMotionEventWithPermission;

      // iOS Safari
      if (typeof DeviceMotion.requestPermission === "function") {
        const permission = await DeviceMotion.requestPermission();

        if (permission !== "granted") {
          setMessage("Motion permission was denied.");
          return false;
        }
      }

      setMotionAllowed(true);
      setMessage("Motion access enabled.");

      return true;
    } catch (error) {
      console.error(error);
      setMessage("Could not enable motion sensors.");

      return false;
    }
  };

  const handleToggle = async () => {
    // Turning it off
    if (shakeEnabled) {
      setShakeEnabled(false);
      setMessage("Shake detection is disabled.");
      return;
    }

    // Turning it on
    if (!motionAllowed) {
      const allowed = await requestMotionPermission();

      if (!allowed) return;
    }

    setShakeEnabled(true);
    setMessage("Shake detection enabled. Shake your phone.");
  };

  const triggerEmergency = async() => {
    setMessage("🚨 SHAKE DETECTED");

   toast.error("🚨 Emergency triggered", {
                 duration: 5000,
                 position: "top-center",}
   );

  alarmRef.current = new Audio("/alarm.wav");
  navigator.vibrate?.([300, 200, 300, 200, 500]);
  
  await alarmRef.current.play();

  alarmRef.current.pause();
  alarmRef.current.currentTime = 0;

    //
    // fetch("/api/emergency", {
    //   method: "POST",
    // });
  };

  useEffect(() => {
    if (!shakeEnabled) return;

    const handleMotion = (event: DeviceMotionEvent) => {
      const acceleration = event.accelerationIncludingGravity;

      if (!acceleration) return;

      const x = acceleration.x ?? 0;
      const y = acceleration.y ?? 0;
      const z = acceleration.z ?? 0;

      const force = Math.sqrt(
        x * x +
        y * y +
        z * z
      );

      const now = Date.now();

      const SHAKE_THRESHOLD = 20;
      const SHAKE_WINDOW = 1000;
      const REQUIRED_SHAKES = 3;
      const COOLDOWN = 5000;

      if (force < SHAKE_THRESHOLD) return;

      // Stop repeated triggers
      if (now - lastTrigger.current < COOLDOWN) {
        return;
      }

      // Start a new shake window
      if (
        shakeWindowStart.current === 0 ||
        now - shakeWindowStart.current > SHAKE_WINDOW
      ) {
        shakeWindowStart.current = now;
        shakeCount.current = 1;

        return;
      }

      shakeCount.current++;

      console.log("Shake count:", shakeCount.current);

      if (shakeCount.current >= REQUIRED_SHAKES) {
        lastTrigger.current = now;

        shakeCount.current = 0;
        shakeWindowStart.current = 0;

        triggerEmergency();
      }
    };

    window.addEventListener("devicemotion", handleMotion);

    return () => {
      window.removeEventListener(
        "devicemotion",
        handleMotion
      );
    };
  }, [shakeEnabled]);

return (
  <main className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
    <div className="w-full max-w-md p-8 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700/50">
      <h1 className="text-2xl font-bold mb-3 text-center tracking-tight">
        Emergency Shake
      </h1>

      <p className="text-slate-300 text-center leading-relaxed">
        Shake your phone several times to trigger the emergency action.
      </p>

      <button
  onClick={handleToggle}
  className={`w-full mt-6 py-3.5 px-4 rounded-xl font-semibold text-base cursor-pointer transition-all duration-200 shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 ${
    shakeEnabled
      ? "bg-red-500 hover:bg-red-600 shadow-red-500/30"
      : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30"
  }`}
>
  <ShakeIcon className="w-5 h-5" />
  {shakeEnabled
    ? "Disable Shake Detection"
    : "Enable Shake Detection"}
</button>

      <p className="mt-6 font-bold text-center text-lg text-slate-100">
        {message}
      </p>
    </div>
  </main>
);
}

export default Home;