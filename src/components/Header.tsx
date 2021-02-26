import * as React from "react";
import { Link } from "react-router-dom";
import {
  chakra,
  Flex,
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

import { pages } from "../constants/routes";

const Header = () => {
  return (
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
              {pages.map((page) => (
                <MenuItem key={page.route} as={Link} to={page.route}>
                  {page.label}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Flex>
      </chakra.div>
    </chakra.header>
  );
};

export default Header;
