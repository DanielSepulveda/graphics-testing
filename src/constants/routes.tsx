import * as React from "react";

import Basic from "../pages/Basic";
import Rtf from "../pages/ReactThreeFiber";
import DatGui from "../pages/DatGui";

export type Page = {
  route: string;
  label: string;
  pageComponent: JSX.Element;
};

export const pages: Page[] = [
  { route: "/", label: "ThreeJS Hello World", pageComponent: <Basic /> },
  { route: "/rtf", label: "HW #1 - Demo", pageComponent: <Rtf /> },
  { route: "/datgui", label: "datGUI Demo", pageComponent: <DatGui /> },
];
