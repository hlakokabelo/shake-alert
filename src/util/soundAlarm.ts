import { useRef } from "react";

  const alarmRef = useRef<HTMLAudioElement | null>(null);

export const soundAlarm = async() => {
alarmRef.current = new Audio("/alarm.wav");

const vibrationPattern = Array(6).fill([500, 250]).flat();

navigator.vibrate?.(vibrationPattern);
await alarmRef.current.play();

setTimeout(() => {
  if (alarmRef.current) {
    alarmRef.current.pause();
    alarmRef.current.currentTime = 0;
  }
}, 5000);
}