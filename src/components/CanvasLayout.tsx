import * as React from "react";
import { Box } from "@chakra-ui/react";

import Header from "./Header";

const CanvasLayout: React.FC = ({ children }) => {
  return (
    <>
      <Header />
      <Box as="main" width="100%">
        <Box mt="4.5rem" minH="90vh" position="relative">
          {children}
        </Box>
      </Box>
    </>
  );
};

export default CanvasLayout;
