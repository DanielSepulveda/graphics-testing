import * as React from "react";
import { Switch, Route } from "react-router-dom";

import Home from "./pages/Home";
import { pages } from "./constants/pages";

function App() {
  return (
    <Switch>
      {pages.map((page) => (
        <Route key={page.route} path={page.route}>
          {page.component}
        </Route>
      ))}
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  );
}

export default App;
