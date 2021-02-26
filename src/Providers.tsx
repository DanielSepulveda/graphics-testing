import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router } from "react-router-dom";

const Providers: React.FC = ({ children }) => {
  return (
    <Router>
      <ChakraProvider>{children}</ChakraProvider>
    </Router>
  );
};

export default Providers;
