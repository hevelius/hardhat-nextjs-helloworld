//src/components/header.tsx
import NextLink from "next/link";
import {
  Flex,
  Button,
  useColorModeValue,
  Spacer,
  Heading,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";

const siteTitle = "FirstDAPP";
const Header = () => {
  return (
    <Flex
      as="header"
      bg={useColorModeValue("gray.100", "gray.900")}
      p={4}
      alignItems="center"
    >
      <LinkBox>
        <NextLink href={"/"} passHref>
          <Heading size="md">{siteTitle}</Heading>
        </NextLink>
      </LinkBox>
      <Spacer />
      <Button>Button for Account </Button>
    </Flex>
  );
};

export default Header;
