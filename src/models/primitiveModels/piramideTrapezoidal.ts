import { PrimitiveModel } from "../../types/models";

const piramideTrapezoidal: PrimitiveModel = {
  // prettier-ignore
  vertices: [
    -1,0,1,
    1,0,1,
    -.2,0,-.2,
    .2,0,-.2,
    0,2,0.5
  ],
  // prettier-ignore
  indices: [
    0,2,3,
    0,1,3,
    0,1,4,
    1,3,4,
    3,2,4,
    2,0,4
  ],
};

export default piramideTrapezoidal;
