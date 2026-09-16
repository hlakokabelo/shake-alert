export const soundAlarm = async () => {
  const alarm = new Audio("/alarm.wav");
  alarm.loop = true;
  const vibrationPattern = Array(6).fill([500, 250]).flat();

  navigator.vibrate?.(vibrationPattern);
  await alarm.play();

  setTimeout(() => {
    if (alarm) {
      alarm.pause();
      alarm.currentTime = 0;
    }
  }, 5000);
};
