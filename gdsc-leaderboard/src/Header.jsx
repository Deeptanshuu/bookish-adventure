//Header.jsx
import { Box, Flex, Text, Image, useColorMode, Button, useColorModeValue } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('rgba(255, 255, 255, 0.3)', 'rgba(26, 32, 44, 0.3)');
  const borderColor = useColorModeValue('#ff8433', '#ff6600');
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <Box
      as="header"
      bg={bgColor}
      borderBottom={`3px solid ${borderColor}`}
      py={2}
      position="sticky"
      top={0}
      zIndex="sticky"
      backdropFilter="blur(10px)"
    >
      <Flex
        maxW="container.xl"
        mx="auto"
        px={{ base: 4, md: 6 }}
        justifyContent="space-between"
        alignItems="center"
        flexDir={{ base: 'row', md: 'row' }}
      >
        <Box mb={{ base: 0, md: 0 }}>
          <Image
            src={colorMode === 'light' ? "./logo-gray.png" : "./logo-gray.png"}
            alt="Your Logo"
            maxH={{ base: '70px', md: '100px' }}
            p={2}
          />
        </Box>
        <Flex alignItems="center">
          <Text fontSize={{ base: '0.6rem', md: 'md' }} textAlign={{ base: 'center', md: 'left' }} color={textColor} mr={4}>
            Made by Deeptanshu Lal
          </Text>
          <Button onClick={toggleColorMode} size="xs">
            {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;