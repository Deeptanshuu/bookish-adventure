import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const HacktoberfestLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('leaderboard_update', (data) => {
      const sortedLeaderboard = Object.entries(data)
        .map(([name, score]) => ({ name, score }))
        .sort((a, b) => b.score - a.score);
      setLeaderboard(sortedLeaderboard);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const LeaderboardRow = ({ rank, name, score }) => (
    <tr className="border-b">
      <td className="py-2 px-4 font-medium">{rank}</td>
      <td className="py-2 px-4">{name}</td>
      <td className="py-2 px-4">{score}</td>
    </tr>
  );
  

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4">
        <h2 className="text-2xl font-bold text-center text-gray-800">Hacktoberfest Leaderboard</h2>
      </div>
      <div className="px-6 py-4">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Rank</th>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((participant, index) => (
              <LeaderboardRow
                key={participant.id}
                rank={index + 1}
                name={participant.name}
                score={participant.score}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HacktoberfestLeaderboard;