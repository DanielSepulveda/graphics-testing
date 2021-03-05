export const radiansToDegrees = (radians: number) => {
  return (radians * 180) / Math.PI;
};

export const degreesToRadians = (degrees: number) => {
  return (degrees * Math.PI) / 180;
};

export const scaleRGB = (
  rgb: { r: number; g: number; b: number },
  scale: "up" | "down" = "up"
) => {
  if (scale === "up") {
    return {
      r: rgb.r * 255,
      g: rgb.g * 255,
      b: rgb.b * 255,
    };
  }
  return {
    r: rgb.r / 255,
    g: rgb.g / 255,
    b: rgb.b / 255,
  };
};
