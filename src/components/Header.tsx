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
import { BsHouseFill } from "react-icons/bs";

import { pages } from "../constants/pages";

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
        <Flex w="100%" h="100%" px="6" align="center" justify="space-between">
          <Flex>
            <IconButton
              as={Link}
              icon={<BsHouseFill />}
              aria-label="Go home"
              variant="outline"
              to="/"
            />
          </Flex>
          <Flex w="100%" align="center" justify="flex-end">
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
                    {page.menuLabel}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </chakra.div>
    </chakra.header>
  );
};

export default Header;
