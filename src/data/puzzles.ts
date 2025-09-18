import { Puzzle } from '@/types/game';

export const puzzles: Puzzle[] = [
  // Level 1 - Foundations (Easy)
  {
    id: 'puzzle-a',
    level: 1,
    title: 'The Random Draw',
    type: 'decode',
    description: 'Decode this simple verifiable randomness seed to reveal the hidden phrase.',
    encodedText: 'cmFuZG9tbmVzcw==', // Base64 for "randomness"
    expectedAnswer: 'randomness',
    hints: ['This looks like Base64 encoding', 'Try decoding from Base64'],
    points: 100
  },
  {
    id: 'puzzle-b',
    level: 1,
    title: 'The Timelock',
    type: 'riddle',
    description: 'Solve this riddle to unlock the next challenge.',
    question: 'I unlock not by key, but by time. What am I?',
    expectedAnswer: 'timelock',
    hints: ['Think about blockchain mechanisms', 'Time-based unlocking'],
    points: 100
  },
  {
    id: 'puzzle-c',
    level: 1,
    title: 'Community Check',
    type: 'statement',
    description: 'Submit the exact statement that represents our core principle.',
    question: 'What is the fabric we weave?',
    expectedAnswer: 'The fabric we weave is trustless',
    hints: ['Think about trust in decentralized systems', 'The exact phrase matters'],
    points: 100
  },

  // Level 2 - Conditions (Medium)
  {
    id: 'puzzle-d',
    level: 2,
    title: 'Conditional Logic',
    type: 'decode',
    description: 'Analyze this code snippet: if (A && B) then sign. What type of signing is this?',
    question: 'if (A && B) then sign - What am I?',
    expectedAnswer: 'conditional signing',
    hints: ['Look at the logical structure', 'Signing based on conditions'],
    points: 200
  },
  {
    id: 'puzzle-e',
    level: 2,
    title: 'Committee Puzzle',
    type: 'multiple-choice',
    description: 'When decisions must be made fairly in a decentralized system, who decides?',
    question: 'When decisions must be made fairly, who decides?',
    options: ['The leader', 'The majority', 'Committee', 'The founder'],
    expectedAnswer: 'committee',
    hints: ['Think about governance structures', 'Group decision making'],
    points: 200
  },
  {
    id: 'puzzle-f',
    level: 2,
    title: 'Encryption Flow',
    type: 'encrypted',
    description: 'Decrypt this message to reveal the process.',
    encodedText: 'er-rapelcgvba', // ROT13 for "re-encryption"
    expectedAnswer: 're-encryption',
    hints: ['Try ROT13 decryption', 'Caesar cipher with shift 13'],
    points: 200
  },

  // Level 3 - Advanced (Hard)
  {
    id: 'puzzle-g',
    level: 3,
    title: 'Consensus Test',
    type: 'multi-step',
    description: 'Multi-step decoding challenge. Follow the steps carefully.',
    encodedText: 'WTI5dWMyVnVjM1Z6', // Base64 of "Y29uc2Vuc3Vz" which is Base64 of "consensus"
    steps: ['First decode from Base64', 'Then decode the result from Base64 again'],
    expectedAnswer: 'consensus',
    hints: ['Double encoding', 'Base64 twice'],
    points: 300
  },
  {
    id: 'puzzle-h',
    level: 3,
    title: 'Threshold Test',
    type: 'riddle',
    description: 'Solve this cryptographic riddle.',
    question: 'One voice is noise, two is trust, three is certainty. What am I?',
    expectedAnswer: 'threshold',
    hints: ['Think about cryptographic thresholds', 'Multiple signatures needed'],
    points: 300
  },
  {
    id: 'puzzle-i',
    level: 3,
    title: 'Decision Fabric',
    type: 'scramble',
    description: 'Unscramble these words to reveal the final phrase.',
    encodedText: 'noisiced cirfab',
    expectedAnswer: 'decision fabric',
    hints: ['Two words scrambled', 'Related to governance'],
    points: 300
  },

  // Level 4 - Extremely Hard
  {
    id: 'puzzle-j',
    level: 4,
    title: 'Multi-Condition Cipher',
    type: 'multi-step',
    description: '3-layer transform: ASCII → Base64 → ROT13. Decode carefully.',
    encodedText: 'cebtenzznoyr gehfg', // Final ROT13 result
    steps: ['Decode from ROT13', 'Then decode from Base64', 'Then convert from ASCII if needed'],
    expectedAnswer: 'programmable trust',
    hints: ['Three layers of encoding', 'Work backwards: ROT13 first'],
    points: 500
  },
  {
    id: 'puzzle-k',
    level: 4,
    title: 'Fabric Logic',
    type: 'riddle',
    description: 'A complex logic puzzle about distributed systems.',
    question: 'If 5 voices speak, but only 3 agree, what binds them into one decision?',
    expectedAnswer: 'partial signatures',
    hints: ['Not all signatures needed', 'Threshold signatures'],
    points: 500
  },
  {
    id: 'puzzle-l',
    level: 4,
    title: 'Cross-Chain Puzzle',
    type: 'riddle',
    description: 'A scenario about cross-chain operations.',
    question: 'Funds leave Chain A only if goods delivered on Chain B. What is this flow called?',
    expectedAnswer: 'delivery versus payment',
    hints: ['Cross-chain conditional transfers', 'DvP mechanism'],
    points: 500
  },

  // Level 5 - Legendary
  {
    id: 'puzzle-m',
    level: 5,
    title: 'Infinite Weave',
    type: 'multi-step',
    description: 'The ultimate puzzle. Combine fragments revealed across steps.',
    encodedText: 'decision|fabric|is|infinite',
    steps: ['Split by delimiter', 'Combine with spaces', 'Add the final word'],
    expectedAnswer: 'decision fabric is infinite',
    hints: ['Fragment assembly', 'Multiple parts to combine'],
    points: 750
  },
  {
    id: 'puzzle-n',
    level: 5,
    title: "Oracle's Secret",
    type: 'decode',
    description: "Decipher the oracle's message about our ethos.",
    encodedText: 'dHJ1c3Qubm8ub25l', // Base64 for "trust.no.one"
    expectedAnswer: 'trust.no.one',
    hints: ['Base64 encoding', 'Our core ethos'],
    points: 750
  },
  {
    id: 'puzzle-o',
    level: 5,
    title: 'Legendary Test',
    type: 'riddle',
    description: 'The final riddle. Only the worthy shall pass.',
    question: 'I am not a chain, not an oracle, not a key. I am the loom that binds truth across domains. Builders summon me with one rule, and I execute with certainty. Who am I?',
    expectedAnswer: 'dcipher',
    hints: ['The platform itself', 'Binding truth across domains'],
    points: 1000
  }
];