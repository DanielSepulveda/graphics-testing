import { PrimitiveModel } from "../../types/models";

const romboide: PrimitiveModel = {
  // prettier-ignore
  vertices: [
    0,0,0.5,
    0,0,-0.5,
    1,0,0,
    -1,0,0,
    0,1,0.5,
    0,1,-0.5,
    1,1,0,
    -1,1,0
  ],
  // prettier-ignore
  indices: [
    0,1,2,
    0,1,3,
    4,5,7,
    4,5,6,
    0,2,4,
    2,4,6,
    0,3,4,
    7,3,0,
    7,0,4,
    1,7,3,
    1,5,6,
    2,5,6,
    3,5,7,
    1,5,7
  ],
};

export default romboide;
