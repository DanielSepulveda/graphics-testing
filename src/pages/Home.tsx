import * as React from "react";
import { Link } from "react-router-dom";
import { SimpleGrid, Box, Image } from "@chakra-ui/react";

import { Layout } from "../components";
import { pages } from "../constants/pages";

function Home() {
  return (
    <Layout>
      <SimpleGrid columns={[1, 2, 3]} spacing={4}>
        {pages.map((page) => (
          <Box
            key={page.route}
            as={Link}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            to={page.route}
            _hover={{
              boxShadow: "md",
              cursor: "pointer",
            }}
          >
            <Image src={page.pageImage} alt={page.cardTitle} />
            <Box p="6">
              <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight">
                {page.cardTitle}
              </Box>
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </Layout>
  );
}

export default Home;
