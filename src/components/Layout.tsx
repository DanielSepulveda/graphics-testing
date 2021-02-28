import * as React from "react";
import { Box } from "@chakra-ui/react";

import Header from "./Header";

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <Header />
      <Box
        w="full"
        pb="12"
        pt="3"
        maxW={{ base: "xl", md: "7xl" }}
        mx="auto"
        px={{ base: "6", md: "8" }}
      >
        <Box mt="4.5rem" minH="76vh">
          {children}
        </Box>
      </Box>
    </>
  );
};

export default Layout;
