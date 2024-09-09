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
      const sortedLeaderboard = Object.entries(data)
        .map(([name, details]) => ({
          name,
          score: details.score,
          avatarUrl: details.avatar_url,
        }))
        .sort((a, b) => b.score - a.score);
      setLeaderboard(sortedLeaderboard);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const LeaderboardRow = ({ rank, name, score, avatarUrl }) => (
    <tr className="border-b">
      <td className="py-2 px-4 font-medium text-center">{rank}</td>
      <td className="py-2 px-4 flex flex-row text-center items-center justify-center"><img src={avatarUrl} alt="Profile" className="w-8 h-8 rounded-full mx-4" />{name}</td>
      <td className="py-2 px-4 text-center">{score}</td>
    </tr>
  );

  LeaderboardRow.propTypes = {
    rank: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
    avatarUrl: PropTypes.string.isRequired,
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
              <th className="py-2 px-4 text-center">Name</th>
              <th className="py-2 px-4 text-center">Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((participant, index) => (
              <LeaderboardRow
                key={participant.name}
                rank={index + 1}
                name={participant.name}
                score={participant.score}
                avatarUrl={participant.avatarUrl}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HacktoberfestLeaderboard;
