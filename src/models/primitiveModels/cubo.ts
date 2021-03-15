import { PrimitiveModel } from "../../types/models";

const cubo: PrimitiveModel = {
  // prettier-ignore
  vertices: [
    -0.5,0,0.5,
    -0.5,0,-0.5,
    0.5,0,-0.5,
    0.5,0,0.5,
    -0.5,1,0.5,
    -0.5,1,-0.5,
    0.5,1,-0.5,
    0.5,1,0.5,
  ],
  // prettier-ignore
  indices: [
    0,1,2,
    0,2,3,
    4,5,6,
    4,6,7,
    0,1,5,
    0,4,5,
    1,5,6,
    2,5,6,
    2,3,6,
    3,6,7,
    0,3,4,
    3,4,7
  ],
};

export default cubo;
