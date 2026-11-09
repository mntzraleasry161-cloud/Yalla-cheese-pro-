import { Chess } from "chess";

export const chess = new Chess();
export const files = "abcdefgh";

/** يحوّل اسم المربع (مثل "e4") إلى إحداثيات 3D */
export function position(square) {
  return {
    x: files.indexOf(square[0]) - 3.5,
    z: Number(square[1]) - 4.5
  };
}
