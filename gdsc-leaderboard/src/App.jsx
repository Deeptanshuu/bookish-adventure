import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import PropTypes from 'prop-types';

const HacktoberfestLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('leaderboard_update', (data) => {
      const sortedLeaderboard = data.map((team) => ({
        name: team.team_name,
        score: team.score,
        teamMembers: team.team_members.map(member => member.name),
        easySolved: team.problems_solved.easy || 0,
        mediumSolved: team.problems_solved.medium || 0,
        hardSolved: team.problems_solved.hard || 0,
      }))
      .sort((a, b) => b.score - a.score);
      
      setLeaderboard(sortedLeaderboard);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const LeaderboardRow = ({ rank, name, score, teamMembers, easySolved, mediumSolved, hardSolved }) => (
    <tr className="border-b">
      <td className="py-2 px-4 font-medium text-center">{rank}</td>
      <td className="py-2 px-4 text-center">{name}</td>
      <td className="py-2 px-4 text-center">{score}</td>
      <td className="py-2 px-4 text-center">{teamMembers.join(', ')}</td>
      <td className="py-2 px-4 text-center">{easySolved}</td>
      <td className="py-2 px-4 text-center">{mediumSolved}</td>
      <td className="py-2 px-4 text-center">{hardSolved}</td>
    </tr>
  );

  LeaderboardRow.propTypes = {
    rank: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
    teamMembers: PropTypes.arrayOf(PropTypes.string).isRequired,
    easySolved: PropTypes.number.isRequired,
    mediumSolved: PropTypes.number.isRequired,
    hardSolved: PropTypes.number.isRequired,
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4">
        <h2 className="text-2xl font-bold text-center text-gray-800">Hacktoberfest Leaderboard</h2>
      </div>
      <div className="px-6 py-4">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-center">Rank</th>
              <th className="py-2 px-4 text-center">Team Name</th>
              <th className="py-2 px-4 text-center">Score</th>
              <th className="py-2 px-4 text-center">Team Members</th>
              <th className="py-2 px-4 text-center">Easy Solved</th>
              <th className="py-2 px-4 text-center">Medium Solved</th>
              <th className="py-2 px-4 text-center">Hard Solved</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((participant, index) => (
              <LeaderboardRow
                key={participant.name}
                rank={index + 1}
                name={participant.name}
                score={participant.score}
                teamMembers={participant.teamMembers}
                easySolved={participant.easySolved}
                mediumSolved={participant.mediumSolved}
                hardSolved={participant.hardSolved}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HacktoberfestLeaderboard;
