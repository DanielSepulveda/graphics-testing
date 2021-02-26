import * as React from "react";
import { Switch, Route } from "react-router-dom";

import { pages } from "./constants/routes";

const defaultPage = pages.find((page) => page.route === "/");
const nonDefaultPages = pages.filter((page) => page.route !== "/");

function App() {
  return (
    <Switch>
      {nonDefaultPages.map((page) => (
        <Route key={page.route} path={page.route}>
          {page.pageComponent}
        </Route>
      ))}
      {defaultPage && <Route path="/">{defaultPage.pageComponent}</Route>}
    </Switch>
  );
}

export default App;
