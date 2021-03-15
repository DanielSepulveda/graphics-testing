import { PrimitiveModel } from "../../types/models";

const piramide: PrimitiveModel = {
  // prettier-ignore
  vertices: [
    -0.5,0,0.5,
    -0.5,0,-0.5,
    0.5,0,-0.5,
    0.5,0,0.5,
    0,1,0
  ],
  // prettier-ignore
  indices: [
    0,1,4,
    1,4,2,
    2,4,3,
    0,4,3,
    0,1,2,
    0,2,3
  ],
};

export default piramide;
