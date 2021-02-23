import * as React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import {
  chakra,
  Box,
  Flex,
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

import Basic from "./components/Basic";
import ReactThreeFiber from "./components/ReactThreeFiber";

function App() {
  return (
    <Box height="100vh" maxWidth="100vw">
      <Router>
        <chakra.header
          pos="fixed"
          top="0"
          bg="white"
          zIndex="3"
          left="0"
          right="0"
          width="full"
        >
          <chakra.div height="4.5rem" mx="auto" maxW="1200px">
            <Flex w="100%" h="100%" px="6" align="center" justify="flex-end">
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={<HamburgerIcon />}
                  variant="outline"
                />
                <MenuList>
                  <MenuItem as={Link} to="/">
                    ThreeJS Hello World
                  </MenuItem>
                  <MenuItem as={Link} to="/rtf">
                    HW #1 - Demo
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </chakra.div>
        </chakra.header>
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
