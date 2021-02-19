import * as React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Box } from "@chakra-ui/react";

import Basic from "./components/Basic";
import ReactThreeFiber from "./components/ReactThreeFiber";

function App() {
  return (
    <Box height="100vh" maxWidth="100vw">
      <Router>
        <Switch>
          <Route path="/rtf">
            <ReactThreeFiber />
          </Route>
          <Route path="/">
            <Basic />
          </Route>
        </Switch>
      </Router>
    </Box>
  );
}

export default App;
