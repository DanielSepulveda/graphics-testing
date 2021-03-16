import { PrimitiveModel } from "../../types/models";

const triangulo: PrimitiveModel = {
  // prettier-ignore
  vertices: [
    -0.5,0,0.5,
    0.5,0,0.5,
    0,0,-1,
    -0.5,1,0.5,
    0.5,1,0.5,
    0,1,-1
  ],
  // prettier-ignore
  indices: [
    0,1,2,
    3,4,5,
    0,3,4,
    0,4,1,
    1,3,4,
    1,2,4,
    2,4,5,
    0,3,5,
    2,3,5
  ],
};

export default triangulo;
