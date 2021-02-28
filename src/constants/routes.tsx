import * as React from "react";

import Basic from "../pages/Basic";
import Rtf from "../pages/ReactThreeFiber";
import DatGui from "../pages/DatGui";
import Tweakpane from "../pages/Tweakpane";
import RtfGui from "../pages/ReactThreeGui";

export type Page = {
  route: string;
  label: string;
  pageComponent: JSX.Element;
};

export const pages: Page[] = [
  { route: "/", label: "ThreeJS Hello World", pageComponent: <Basic /> },
  { route: "/rtf", label: "HW #1 - Demo", pageComponent: <Rtf /> },
  { route: "/datgui", label: "datGUI Demo", pageComponent: <DatGui /> },
  {
    route: "/tweakpane",
    label: "Tweakpane Demo",
    pageComponent: <Tweakpane />,
  },
  {
    route: "/rtfGui",
    label: "RTF Gui Demo",
    pageComponent: <RtfGui />,
  },
];
