import { Box, Flex, Text, Image, useColorModeValue } from '@chakra-ui/react';

const Header = () => {
  const bgColor = useColorModeValue('rgba(255, 255, 255, 0.3)', 'rgba(26, 32, 44, 0.3)');

  return (
    <Box 
      as="header" 
      bg={bgColor}
      borderBottom={'3px solid #ff8433'} 
      py={0}
      position="sticky"
      top={0}
      zIndex="sticky"
      backdropFilter="blur(10px)"
    >
      <Flex maxW="container.xl" mx="auto" px={0} justifyContent="space-between" alignItems="center">
        <Box>
          <Image
            src="./logo-gray.png"
            alt="Your Logo"
            maxH="120px"
          />
        </Box>
        <Text fontSize="sm">
          Made by Deeptanshu Lal
        </Text>
      </Flex>
    </Box>
  );
};

export default Header;