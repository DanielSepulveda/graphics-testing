import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";

const Providers: React.FC = ({ children }) => {
  return (
    <Router>
      <ScrollToTop />
      <ChakraProvider>{children}</ChakraProvider>
    </Router>
  );
};

export default Providers;
