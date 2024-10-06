/* eslint-disable no-unused-vars */
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
  Input,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import './App.css';
import Header from './Header';
import data from './FINAL-LIST.json';

const App = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const bgColor = useColorModeValue('white', 'black');
  const itemBgColor = useColorModeValue('gray.100', 'gray.900');
  const hoverBgColor = useColorModeValue('gray.200', 'gray.800');
  const textColor = useColorModeValue('black', 'gray.100');
  const titleTextColor = useColorModeValue('white', 'black');

  useEffect(() => {
    // const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
    // const socket = io(`${apiEndpoint}`);
    // socket.on('connect', () => {
    //   console.log('Connected to WebSocket server');
    // });
    // socket.on('leaderboard_update', (data) => {
    //   const sortedLeaderboard = data
    //     .map((team) => ({
    //       name: team.team_name,
    //       score: team.score,
    //       teamMembers: team.team_members.map((member) => ({ name: member.name })),
    //       easySolved: team.problems_solved.easy || 0,
    //       mediumSolved: team.problems_solved.medium || 0,
    //       hardSolved: team.problems_solved.hard || 0,
    //       githubUsername: team.github_username,
    //     }))
    //     .sort((a, b) => b.score - a.score)
    //     .map((team, index) => ({
    //       ...team,
    //       rank: index + 1, // Assign rank based on the sorted leaderboard
    //     }));

    //   setLeaderboard(sortedLeaderboard);
    // });
    // return () => {
    //   socket.disconnect();
    // };

    const updatedLeaderboard = data.map(team => {
      // Calculate the score based on hard problems solved (7 points per hard problem)
      const hardProblemScore = (team.problems_solved.hard || 0) * 7;

      // Apply penalty logic: if penalty is negative, it's treated as a bonus (positive)
      const adjustedPenalty = team.penalty < 0 ? Math.abs(team.penalty) : team.penalty;

      // Add hard problem score and adjust the final score
      const totalScore = hardProblemScore + (team.score || 0) + adjustedPenalty;

      // Return updated team object
      return {
        ...team,
        totalScore, // Add the calculated total score
      };
    });

    // Sort by total score
    const sortedLeaderboard = updatedLeaderboard
      .filter(team => team.disqualified === false)
      .map(team => ({
        name: team.team_name,
        score: team.totalScore, // Use the new total score
        teamMembers: team.team_members.map(member => ({ name: member.name })),
        easySolved: team.problems_solved.easy || 0,
        mediumSolved: team.problems_solved.medium || 0,
        hardSolved: team.problems_solved.hard || 0,
        githubUsername: team.github_username,
      }))
      .sort((a, b) => b.score - a.score)
      .map((team, index) => ({
        ...team,
        rank: index + 1,
      }));

    setLeaderboard(sortedLeaderboard);

  }, []);

  const filteredLeaderboard = leaderboard.filter((team) => {
    const nameMatches = team.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const memberMatches = team.teamMembers?.some((member) =>
      member.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const githubUsernameMatches = team.githubUsername?.toLowerCase().includes(searchQuery.toLowerCase());

    return nameMatches || memberMatches || githubUsernameMatches;
  });


  const LeaderboardItem = ({ rank, name, score, teamMembers, easySolved, mediumSolved, hardSolved, githubUsername }) => {
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

    const badgeBgColor = useColorModeValue(
      badgeColor === 'blue' ? 'transparent' : `${badgeColor}.100`,
      badgeColor === 'blue' ? 'transparent' : `${badgeColor}.700`
    );
    const badgeTextColor = useColorModeValue(
      badgeColor === 'blue' ? 'black' : `${badgeColor}.600`,
      badgeColor === 'blue' ? 'white' : `${badgeColor}.100`
    );

    return (
      <AccordionItem mb={4} border={0}>
        <AccordionButton
          _expanded={{ bg: itemBgColor, color: '#ff8c00' }}
          _hover={{ bg: hoverBgColor }}
          borderRadius="md"
          padding={4}
          flexDir={{ base: 'row', md: 'row' }} // Adjusts layout direction for different screen sizes
        >
          <Flex flex="1" justifyContent="space-between" alignItems="center">
            <Flex alignItems="center" flexDir={{ base: 'row', md: 'row' }}>
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
            <Flex alignItems="center" flexDir={{ base: 'column', md: 'row' }} mt={{ base: 4, md: 0 }}>
              <AvatarGroup size="sm" max={4} mr={4}>
                {teamMembers.map((member, index) => (
                  <Avatar name={member.name} key={index} />
                ))}
              </AvatarGroup>
              <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="semibold" color={textColor} ml={5} mr={8}>
                Score: {score}
              </Text>
            </Flex>
          </Flex>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={4} bg={itemBgColor} borderRadius="none">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Box>
              <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold" mb={2} color={textColor}>
                Team Members:
              </Text>
              <List spacing={3} listStyleType="none">
                {teamMembers.map((member, index) => (
                  <ListItem key={index} display="flex" alignItems="center">
                    <Avatar name={member.name} size="sm" mr={3} />
                    <Text fontSize={{ base: 'sm', md: 'md' }} color={textColor}>
                      {member.name}
                    </Text>
                  </ListItem>
                ))}
              </List>
            </Box>
            <Box align="center" justifyContent="center">
              <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold" mb={2} color={textColor}>
                Problems Solved:
              </Text>
              <SimpleGrid columns={1} spacing={0} maxWidth="200px" mx="auto">
                <Box
                  bg={useColorModeValue('red.100', 'red.800')}
                  p={2}
                  borderRadius="md"
                  border="1px"
                  borderColor={useColorModeValue('red.500', 'red.200')}
                  textAlign="center"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
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

  return (
    <>
      <Header />
      <div className="py-10">
        <Box
          maxW="4xl"
          mx="auto"
          bg={bgColor}
          boxShadow={{ base: 'none', md: "20px 20px rgba(255, 102, 0, 0.8), 0 1px 3px rgba(255, 102, 0, 0.8)" }}
          border={{ base: 'none', md: '3px solid #ff6600' }}
          borderTop={{ base: '3px solid #ff6600', md: '3px solid #ff6600' }}
          borderBottom={{ base: '3px solid #ff6600', md: '3px solid #ff6600' }}
          borderRadius={{ base: 'none', md: '10px' }}
          overflow="hidden"
        >
          <Box px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }} bg={bgColor} borderBottom="3px solid #ff6600" borderRadius="none">
            <Text
              as="h1"
              fontWeight="bold"
              fontSize={{ base: '3xl', md: '5xl' }}
              textAlign="center"
              color={titleTextColor}
              textShadow={`5px 5px 0 ${useColorModeValue('#ff6600', '#ff8c00')}, -1px -1px 0 ${useColorModeValue('#ff6600', '#ff8c00')}, 1px -1px 0 ${useColorModeValue('#ff6600', '#ff8c00')}, -1px 1px 0 ${useColorModeValue('#ff6600', '#ff8c00')}`}
            >
              Hacktoberfest <br /> Leaderboard
            </Text>
            <Flex
              align="center"
              justify="center"
              mt={4}
              mb={8}
              px={{ base: 2, md: 4 }}
              py={2}
              border="1px solid"
              borderColor={useColorModeValue('#ff6600', '#ff8c00')}
              bg={useColorModeValue('gray.100', 'gray.700')}
              borderRadius="md"
            >
              <SearchIcon color={textColor} m={2} />
              <Input
                placeholder=""
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="unstyled"
                ml={2}
                py={2}
                color={textColor}
              />
            </Flex>
            <Accordion allowMultiple>
              {filteredLeaderboard.map((team, index) => (
                <LeaderboardItem
                  key={index}
                  rank={team.rank}
                  name={team.name}
                  score={team.score}
                  teamMembers={team.teamMembers}
                  easySolved={team.easySolved}
                  mediumSolved={team.mediumSolved}
                  hardSolved={team.hardSolved}
                  githubUsername={team.githubUsername}
                />
              ))}
            </Accordion>
          </Box>
        </Box>
      </div>
    </>
  );
};

export default App;
