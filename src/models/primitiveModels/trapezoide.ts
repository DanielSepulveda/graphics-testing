import { PrimitiveModel } from "../../types/models";

const trapezoide: PrimitiveModel = {
  // prettier-ignore
  vertices: [
    -1,0,1,
    1,0,1,
    -.2,0,-.2,
    .2,0,-.2,
    -1,1,1,
    1,1,1,
    -.2,1,-.2,
    .2,1,-.2,
  ],
  // prettier-ignore
  indices: [
    0,2,3,
    0,1,3,
    4,6,7,
    4,7,5,
    0,5,4,
    0,1,5,
    1,4,5,
    1,5,7,
    1,3,5,
    3,7,5,
    2,3,7,
    2,3,6,
    0,4,6,
    2,0,6
  ],
};

export default trapezoide;
