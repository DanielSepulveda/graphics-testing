import * as React from "react";

import Basic from "../pages/Basic";
import Rtf from "../pages/ReactThreeFiber";
import DatGui from "../pages/DatGui";
import Tweakpane from "../pages/Tweakpane";
import RtfGui from "../pages/ReactThreeGui";
import SwitchModels from "../pages/SwitchModel";
import Reto1 from "../pages/Reto1";
import Camera from "../pages/Camera";
import OrbitCamera from "../pages/OrbitCamera";
import MultiViewports from "../pages/MultiViewports";
import MaterialLight from "../pages/MaterialLight";
import ShaderDemo from "../pages/ShaderDemo";

export type Page = {
  route: string;
  menuLabel: string;
  component: JSX.Element;
  pageImage: string;
  cardTitle: string;
};

export const pages: Page[] = [
  {
    route: "/helloworld",
    menuLabel: "ThreeJS Hello World",
    component: <Basic />,
    pageImage: "https://i.imgur.com/XjqrRY5.png",
    cardTitle: "ThreeJS hello world",
  },
  {
    route: "/r3f",
    menuLabel: "HW #1 - Demo",
    component: <Rtf />,
    pageImage: "https://i.imgur.com/AGVEwMD.png",
    cardTitle: "R3F Hello World",
  },
  {
    route: "/datgui",
    menuLabel: "datGUI Demo",
    component: <DatGui />,
    pageImage: "https://i.imgur.com/HSEsUaI.png",
    cardTitle: "ThreeJS dat gui demo",
  },
  {
    route: "/tweakpane",
    menuLabel: "Tweakpane Demo",
    component: <Tweakpane />,
    pageImage: "https://i.imgur.com/E6eESer.png",
    cardTitle: "ThreeJS Tweakpane gui demo",
  },
  {
    route: "/r3fGui",
    menuLabel: "R3F Gui Demo",
    component: <RtfGui />,
    pageImage: "https://i.imgur.com/iJ2J57M.png",
    cardTitle: "R3F gui demo",
  },
  {
    route: "/switchmodels",
    menuLabel: "HW #2 - Switch models",
    component: <SwitchModels />,
    pageImage: "https://i.imgur.com/dnWkB5m.png",
    cardTitle: "HW #2 - Switch models",
  },
  {
    route: "/reto1",
    menuLabel: "Reto 1 - Paint",
    component: <Reto1 />,
    pageImage: "https://i.imgur.com/GtD68cD.png",
    cardTitle: "Reto 1 - Paint",
  },
  {
    route: "/camera",
    menuLabel: "Camera exercise",
    component: <Camera />,
    pageImage: "https://i.imgur.com/BhvYrLK.png",
    cardTitle: "Camera exercise",
  },
  {
    route: "/orbit-camera",
    menuLabel: "HW Orbit Camera",
    component: <OrbitCamera />,
    pageImage: "https://i.imgur.com/il2wrTi.png",
    cardTitle: "HW Orbit Camera",
  },
  {
    route: "/multiviewports",
    menuLabel: "HW multi viewports",
    component: <MultiViewports />,
    pageImage: "https://i.imgur.com/il2wrTi.png",
    cardTitle: "HW multi viewports",
  },
  {
    route: "/materiallight",
    menuLabel: "HW material light",
    component: <MaterialLight />,
    pageImage: "https://i.imgur.com/xZJ7iuX.png",
    cardTitle: "HW material light",
  },
  {
    route: "/shaderDemo",
    menuLabel: "HW Shader demo",
    component: <ShaderDemo />,
    pageImage: "https://i.imgur.com/xZJ7iuX.png",
    cardTitle: "HW Shader demo",
  },
];
