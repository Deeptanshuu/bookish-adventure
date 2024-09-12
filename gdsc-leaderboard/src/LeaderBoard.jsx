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
} from '@chakra-ui/react';
import Header from './Header.jsx';
import './App.css';

const LeaderBoard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const bgColor = useColorModeValue('white', 'gray.800');
  const itemBgColor = useColorModeValue('gray.100', 'gray.800');
  const hoverBgColor = useColorModeValue('gray.100', 'gray.500');

  useEffect(() => {
    const socket = io('http://localhost:5000');
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

  const LeaderboardItem = ({
    rank,
    name,
    score,
    teamMembers,
    easySolved,
    mediumSolved,
    hardSolved,
    githubUsername,
  }) => {
    const badgeColor = (() => {
      switch (rank) {
        case 1:
          return 'yellow'; // Gold for 1st place
        case 2:
          return 'gray'; // Silver for 2nd place
        case 3:
          return 'orange'; // Bronze for 3rd place
        default:
          return 'blue'; // Blue for other ranks
      }
    })();

    return (
      <AccordionItem mb={2} border={0}>
        <AccordionButton
          _expanded={{ bg: itemBgColor, color: 'orange.500' }}
          _hover={{ bg: hoverBgColor }}
          borderRadius="base"
          padding={3}
        >
          <Flex flex="1" justifyContent="space-between" alignItems="center">
            <Flex alignItems="center">
              <Badge
                fontSize="xl"
                mr={3}
                colorScheme={badgeColor}
                bg={badgeColor === 'blue' ? 'transparent' : `${badgeColor}.100`}
                color={badgeColor === 'blue' ? 'black' : `${badgeColor}.500`}
              >
                #{rank}
              </Badge>
              <Text fontSize="xl" fontWeight="semibold" color="black">
                {name}
              </Text>
            </Flex>
            <Flex alignItems="center">
              <AvatarGroup size="sm" max={4} mr={4}>
                {teamMembers.map((member, index) => (
                  <Avatar name={member.name} key={index} />
                ))}
              </AvatarGroup>
              <Text fontSize="xl" fontWeight="semibold" color="black" ml={5} mr={8}>
                Score: {score}
              </Text>
            </Flex>
          </Flex>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={4} bg={itemBgColor} borderRadius="none">
          <SimpleGrid columns={[1, null, 2]} spacing={4}>
            <Box>
              <Text fontSize="lg" fontWeight="bold" ml={5} mb={2}>
                Team Members:
              </Text>
              <List spacing={3} listStyleType="none" ml={6}>
                {teamMembers.map((member, index) => (
                  <ListItem key={index} display="flex" alignItems="center">
                    <Avatar name={member.name} size="sm" mr={3} />
                    <Text fontSize="md">{member.name}</Text>
                  </ListItem>
                ))}
              </List>
            </Box>
            <Box>
              <Text fontSize="lg" fontWeight="bold" mb={2}>
                Problems Solved:
              </Text>
              <SimpleGrid columns={3} spacing={4}>
                <Box
                  bg="green.100"
                  p={2}
                  borderRadius="md"
                  border="1px"
                  borderColor="green.500"
                  textAlign="center"
                >
                  <Text fontSize="sm" fontWeight="semibold">
                    Easy
                  </Text>
                  <Text fontSize="xl" fontWeight="bold">
                    {easySolved}
                  </Text>
                </Box>
                <Box
                  bg="yellow.100"
                  p={2}
                  borderRadius="md"
                  border="1px"
                  borderColor="yellow.500"
                  textAlign="center"
                >
                  <Text fontSize="sm" fontWeight="semibold">
                    Medium
                  </Text>
                  <Text fontSize="xl" fontWeight="bold">
                    {mediumSolved}
                  </Text>
                </Box>
                <Box
                  bg="red.100"
                  p={2}
                  borderRadius="md"
                  border="1px"
                  borderColor="red.500"
                  textAlign="center"
                >
                  <Text fontSize="sm" fontWeight="semibold">
                    Hard
                  </Text>
                  <Text fontSize="xl" fontWeight="bold">
                    {hardSolved}
                  </Text>
                </Box>
              </SimpleGrid>
              <Text fontSize="lg" fontWeight="bold" mt={4} mb={2}>
                Github Username:
              </Text>
              <Text fontSize="md" fontWeight="semibold">
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

  return (
    <>
      <Header />
      <div className="py-8">
        <Box
          maxW="4xl"
          mx="auto"
          bg={bgColor}
          boxShadow="20px 20px rgba(255, 102, 0, 0.8), 0 1px 3px rgba(255, 102, 0, 0.8)"
          border="3px solid #ff6600"
          borderRadius="lg"
          overflow="hidden"
        >
          <Box px={6} py={6} bg="white" color="white" borderBottom="3px solid #ff6600" borderRadius="none">
            <Text
              as="h1"
              fontWeight="bold"
              fontSize="5xl"
              textAlign="center"
              textShadow="5px 5px 0 #ff6600, -1px -1px 0 #ff6600, 1px -1px 0 #ff6600, -1px 1px 0 #ff6600"
            >
              Hacktoberfest Leaderboard
            </Text>
          </Box>

          <Box p={6}>
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

              <Text textAlign="center" fontSize="xl" fontStyle={'bold'} mt={4} mb={4}>
                . . . . . 
              </Text>

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
