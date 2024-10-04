//Header.jsx
import { Box, Flex, Text, Image, useColorMode, Button, useColorModeValue} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('rgba(255, 255, 255, 0.3)', 'rgba(26, 32, 44, 0.3)');
  const borderColor = useColorModeValue('#ff8433', '#ff6600');
  const textColor = useColorModeValue('gray.800', 'white');

  const logoSize = {
    base: '50px',
    md: '80px',
  };

  const logoPadding = {
    base: '0',
    md: '0',
  };

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
        <Box m={{ base: 2, md: 2 }}>
          <Image
            src={colorMode === 'light' ? "./GDG LOGO BLACK.png" : "./GDG LOGO WHITE.png"}
            alt="Your Logo"
            maxH={logoSize}
            p={logoPadding}
          />
        </Box>
        
        <Box m={{ base: 2, md: 2 }}>
          <Image
            src={colorMode === 'light' ? "./rait 1 logo.png" : "./rait 1 logo-light.png"}
            alt="Your Logo"
            maxH={logoSize}
            p={logoPadding}
          />
        </Box>   

        <Box m={{ base: 2, md: 2 }}>
          <Image
            src={colorMode === 'light' ? "./IIC_LOGO.png" : "./IIC_LOGO.png"}
            alt="Your Logo"
            maxH={logoSize}
            p={logoPadding}
          />
        </Box>

        <Flex alignItems="center">
          <Text display={{ base: 'none', md: 'block' }} fontSize={{ base: '0.6rem', md: 'md' }} textAlign={{ base: 'center', md: 'left' }} color={textColor} mr={4}>
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