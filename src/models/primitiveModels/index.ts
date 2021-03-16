import { PrimitiveModel } from "../../types/models";

import { default as casa } from "./casa";
import { default as cubo } from "./cubo";
import { default as doblePiramide } from "./doblePiramide";
import { default as estrella } from "./estrella";
import { default as piramide } from "./piramide";
import { default as piramideTrapezoidal } from "./piramideTrapezoidal";
import { default as rectangulo } from "./rectangulo";
import { default as romboide } from "./romboide";
import { default as trapezoide } from "./trapezoide";
import { default as triangulo } from "./triangulo";

const _all = {
  casa,
  cubo,
  doblePiramide,
  estrella,
  piramide,
  piramideTrapezoidal,
  rectangulo,
  romboide,
  trapezoide,
  triangulo,
};

export type PrimitiveModelType = keyof typeof _all;

const all: Record<PrimitiveModelType, PrimitiveModel> = _all;

export default all;
