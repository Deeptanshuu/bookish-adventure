/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import {
  Box,
  Text,
  Flex,
  List,
  ListItem,
  SimpleGrid,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Badge,
  Avatar,
  AvatarGroup,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react';
import Header from './Header.jsx';
import './App.css';

const LeaderBoard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const bgColor = useColorModeValue('white', 'gray.800');
  const hoverBgColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('black', 'white');
  const titleBgColor = useColorModeValue('white', 'gray.900');
  const titleTextColor = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('#ff6600', '#ff6600');

  useEffect(() => {
    const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
    const socket = io(`${apiEndpoint}`);
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });
    socket.on('leaderboard_update', (data) => {
      const sortedLeaderboard = data
        .map((team) => ({
          name: team.team_name,
          score: team.score,
          teamMembers: team.team_members.map((member) => ({ name: member.name })),
          easySolved: team.problems_solved.easy || 0,
          mediumSolved: team.problems_solved.medium || 0,
          hardSolved: team.problems_solved.hard || 0,
          githubUsername: team.github_username,
        }))
        .sort((a, b) => b.score - a.score);

      setLeaderboard(sortedLeaderboard);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const LeaderboardItem = ({ rank, name, score, teamMembers, easySolved, mediumSolved, hardSolved, githubUsername, isBottomThree }) => {
    const badgeColor = (() => {
      if (isBottomThree) return 'red';
      switch (rank) {
        case 1: return 'yellow';
        case 2: return 'gray';
        case 3: return 'orange';
        default: return 'blue';
      }
    })();
    
    const badgeBgColor = useColorModeValue(
      badgeColor === 'blue' ? 'transparent' : `${badgeColor}.100`,
      badgeColor === 'blue' ? 'transparent' : `${badgeColor}.700`
    );
    const badgeTextColor = useColorModeValue(
      badgeColor === 'blue' ? 'black' : `${badgeColor}.600`,
      badgeColor === 'blue' ? 'white' : `${badgeColor}.100`
    );
    
    const expandedBgColor = useColorModeValue(
      isBottomThree ? 'red.100' : 'gray.100',
      isBottomThree ? 'red.900' : 'gray.700'
    );
    
    const panelBgColor = useColorModeValue(
      isBottomThree ? 'red.50' : 'gray.100',
      isBottomThree ? 'red.900' : 'gray.700'
    );

    const borderColor = useColorModeValue('red.500', 'red.300');

    return (
      <AccordionItem mb={2} border={0}>
      <AccordionButton 
        _expanded={{ bg: expandedBgColor, color: 'orange.500' }}
        _hover={{ bg: hoverBgColor }}
        borderRadius="base"
        padding={3}
        border={isBottomThree ? `1px solid ${borderColor}` : 'none'}
      >
          <Flex flex="1" justifyContent="space-between" alignItems="center" flexDirection={{ base: 'column', md: 'row' }}>
            <Flex alignItems="center" mb={{ base: 2, md: 0 }}>
              <Badge
                fontSize={{ base: 'lg', md: 'xl' }}
                mr={3}
                colorScheme={badgeColor}
                bg={badgeBgColor}
                color={badgeTextColor}
              >
                #{rank}
              </Badge>
              <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="semibold" color={textColor}>{name}</Text>
            </Flex>
            <Flex alignItems="center" flexDirection={{ base: 'column', md: 'row' }}>
              <AvatarGroup size="sm" max={4} mb={{ base: 2, md: 0 }} mr={4}>
                {teamMembers.map((member, index) => (
                  <Avatar name={member.name} key={index} />
                ))}
              </AvatarGroup>
              <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="semibold" color={textColor} ml={{ base: 0, md: 5 }} mr={{ base: 0, md: 8 }}>
                Score: {score}
              </Text>
            </Flex>
          </Flex>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={4} bg={panelBgColor} borderRadius="none">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Box>
              <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold" ml={{ base: 4, md: 5 }} mb={2} color={textColor}>
                Team Members:
              </Text>
              <List spacing={3} listStyleType="none" ml={{ base: 4, md: 6 }}>
                {teamMembers.map((member, index) => (
                  <ListItem key={index} display="flex" alignItems="center">
                    <Avatar name={member.name} size="sm" mr={3} />
                    <Text fontSize={{ base: 'sm', md: 'md' }} color={textColor}>{member.name}</Text>
                  </ListItem>
                ))}
              </List>
            </Box>
            <Box>
              <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold" mb={2} color={textColor}>
                Problems Solved:
              </Text>
              <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
                <Box
                  bg={useColorModeValue('green.100', 'green.800')}
                  p={2}
                  borderRadius="md"
                  border="1px"
                  borderColor={useColorModeValue('green.500', 'green.200')}
                  textAlign="center"
                >
                  <Text fontSize={{ base: 'sm', md: 'sm' }} fontWeight="semibold" color={textColor}>
                    Easy
                  </Text>
                  <Text fontSize={{ base: 'md', md: 'xl' }} fontWeight="bold" color={textColor}>
                    {easySolved}
                  </Text>
                </Box>
                <Box
                  bg={useColorModeValue('yellow.100', 'yellow.800')}
                  p={2}
                  borderRadius="md"
                  border="1px"
                  borderColor={useColorModeValue('yellow.500', 'yellow.200')}
                  textAlign="center"
                >
                  <Text fontSize={{ base: 'sm', md: 'sm' }} fontWeight="semibold" color={textColor}>
                    Medium
                  </Text>
                  <Text fontSize={{ base: 'md', md: 'xl' }} fontWeight="bold" color={textColor}>
                    {mediumSolved}
                  </Text>
                </Box>
                <Box
                  bg={useColorModeValue('red.100', 'red.800')}
                  p={2}
                  borderRadius="md"
                  border="1px"
                  borderColor={useColorModeValue('red.500', 'red.200')}
                  textAlign="center"
                >
                  <Text fontSize={{ base: 'sm', md: 'sm' }} fontWeight="semibold" color={textColor}>
                    Hard
                  </Text>
                  <Text fontSize={{ base: 'md', md: 'xl' }} fontWeight="bold" color={textColor}>
                    {hardSolved}
                  </Text>
                </Box>
              </SimpleGrid>
              <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold" mt={4} mb={2} color={textColor}>
                Github Username:
              </Text>
              <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="semibold" color={textColor}>
                @{githubUsername}
              </Text>
            </Box>
          </SimpleGrid>
        </AccordionPanel>
      </AccordionItem>
    );
  };

  const top3 = leaderboard.slice(0, 5);
  const bottom3 = leaderboard.slice(-3);
  const isBottomThree = true;

  return (
    <>
      <Header />
      <div className="py-8">
        <Box
          maxW={{ base: '90%', sm: '100%', md: '4xl' }}
          mx="auto"
          bg={bgColor}
          boxShadow={`20px 20px ${useColorModeValue('rgba(255, 102, 0, 0.8)', 'rgba(255, 140, 0, 0.8)')}, 0 1px 3px ${useColorModeValue('rgba(255, 102, 0, 0.8)', 'rgba(255, 140, 0, 0.8)')}`}
          border={`3px solid ${borderColor}`}
          borderRadius="lg"
          overflow="hidden"
        >
          <Box px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }} bg={titleBgColor} borderBottom={`3px solid ${borderColor}`} borderRadius="none">
            <Text
              as="h1"
              fontWeight="bold"
              fontSize={{ base: '3xl', md: '5xl' }}
              textAlign="center"
              color={titleTextColor}
              textShadow={`5px 5px 0 ${useColorModeValue('#ff6600', '#ff8c00')}, -1px -1px 0 ${useColorModeValue('#ff6600', '#ff8c00')}, 1px -1px 0 ${useColorModeValue('#ff6600', '#ff8c00')}, -1px 1px 0 ${useColorModeValue('#ff6600', '#ff8c00')}`}
            >
              Hacktoberfest <br/> Leaderboard
            </Text>
          </Box>

          <Box p={{ base: 4, md: 6 }}>
            <Accordion allowToggle>
              {top3.map((participant, index) => (
                <LeaderboardItem
                  key={`${participant.name}-top-${index}`}
                  rank={index + 1}
                  name={participant.name}
                  score={participant.score}
                  teamMembers={participant.teamMembers}
                  easySolved={participant.easySolved}
                  mediumSolved={participant.mediumSolved}
                  hardSolved={participant.hardSolved}
                  githubUsername={participant.githubUsername}
                />
              ))}

              <Divider/>
              <Text textAlign="center" fontSize={{ base: '2xl', md: '3xl' }} color={titleTextColor} fontStyle={'bold'} mt={4} mb={4}>
                . . . . . 
              </Text>
              <Divider/>

              {bottom3.map((participant, index) => (
                <LeaderboardItem
                  key={`${participant.name}-bottom-${index}`}
                  rank={leaderboard.length - 3 + index + 1}
                  name={participant.name}
                  score={participant.score}
                  teamMembers={participant.teamMembers}
                  easySolved={participant.easySolved}
                  mediumSolved={participant.mediumSolved}
                  hardSolved={participant.hardSolved}
                  githubUsername={participant.githubUsername}
                  isBottomThree={isBottomThree}
                />
              ))}
            </Accordion>
          </Box>
        </Box>
      </div>
    </>
  );
};
export default LeaderBoard;