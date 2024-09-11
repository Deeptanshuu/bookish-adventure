function getDifficultyAndPoints(labels) {
    const difficultyLabels = {
      'easy': { difficulty: 'easy', points: 2 },
      'medium': { difficulty: 'medium', points: 4 },
      'hard': { difficulty: 'hard', points: 7 }
    };
  
    for (const label of labels) {
      if (difficultyLabels[label.name]) {
        return difficultyLabels[label.name];
      }
    }
    return { difficulty: 'unknown', points: 0 };
  }
  
  module.exports = { getDifficultyAndPoints };
  