export const enableMotion = async () => {
  const DeviceMotion =
    DeviceMotionEvent as typeof DeviceMotionEvent & {
      requestPermission?: () => Promise<
        "granted" | "denied"
      >;
    };

  if (typeof DeviceMotion.requestPermission === "function") {
    const permission =
      await DeviceMotion.requestPermission();

    if (permission !== "granted") {
      console.log("Motion permission denied");
    }
  }
};