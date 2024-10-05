function getDifficultyAndPoints(labels) {
    const difficultyLabels = {
      'easy': { difficulty: 'easy', points: 2 },
      'medium': { difficulty: 'medium', points: 4 },
      'hard': { difficulty: 'hard', points: 7 }
    };

    return difficultyLabels['hard'];
  }
  
  module.exports = { getDifficultyAndPoints };
