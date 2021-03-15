import { PrimitiveModel } from "../../types/models";

const casa: PrimitiveModel = {
  // prettier-ignore
  vertices: [
    -1,0,1,
    -1,0,-1,
    2,0,1,
    2,0,-1,
    -1,3,1,
    -1,3,-1,
    2,3,1,
    2,3,-1,
    .5,5,0,
  ],
  // prettier-ignore
  indices: [
    0,2,1,
    2,3,1,
    4,7,5,
    4,6,7,
    0,6,4,
    0,2,6,
    2,7,6,
    2,3,7,
    3,5,7,
    3,1,5,
    1,0,4,
    1,4,5,
    4,6,8,
    6,7,8,
    7,5,8,
    5,4,8
  ],
};

export default casa;
