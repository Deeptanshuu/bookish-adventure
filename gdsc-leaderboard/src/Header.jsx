import { Box, Flex, Text, Image, useColorModeValue } from '@chakra-ui/react';

const Header = () => {
  const bgColor = useColorModeValue('rgba(255, 255, 255, 0.3)', 'rgba(26, 32, 44, 0.3)');

  return (
    <Box 
      as="header" 
      bg={bgColor}
      borderBottom={'3px solid #ff8433'} 
      py={2} // Adjust padding for better spacing
      position="sticky"
      top={0}
      zIndex="sticky"
      backdropFilter="blur(10px)"
    >
      <Flex 
        maxW="container.xl" 
        mx="auto" 
        px={{ base: 4, md: 6 }} // Responsive padding
        justifyContent="space-between" 
        alignItems="center" 
        flexDir={{ base: 'column', md: 'row' }} // Stack items vertically on mobile
      >
        <Box mb={{ base: 2, md: 0 }}>
          <Image
            src="./logo-gray.png"
            alt="Your Logo"
            maxH={{ base: '80px', md: '100px' }} // Responsive height
            p={2}
          />
        </Box>
        <Text fontSize={{ base: 'sm', md: 'sm' }} textAlign={{ base: 'center', md: 'left' }}>
          Made by Deeptanshu Lal
        </Text>
      </Flex>
    </Box>
  );
};

export default Header;
