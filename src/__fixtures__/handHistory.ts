import { HandHistory, HandStrength } from '@poker-apprentice/hand-history-parser';

export const bovadaHandHistory: HandHistory = {
  info: {
    blinds: ['0.5', '1'],
    currency: 'USD',
    game: 'holdem',
    handNumber: '12345',
    isFastFold: false,
    limit: 'no limit',
    site: 'bovada',
    timestamp: new Date(),
  },
  players: [
    {
      name: 'John',
      seatNumber: 1,
      position: 'BTN',
      chipStack: '49.50',
      isHero: false,
      isAnonymous: true,
    },
    {
      name: 'Carl',
      seatNumber: 2,
      position: 'SB',
      chipStack: '27.45',
      isHero: false,
      isAnonymous: true,
    },
    {
      name: 'Mike',
      seatNumber: 3,
      position: 'BB',
      chipStack: '87.25',
      isHero: true,
      isAnonymous: false,
    },
  ],
  actions: [
    { type: 'deal-board', street: 'preflop', cards: [] },
    { type: 'post', postType: 'blind', playerName: 'Carl', amount: '0.5' },
    { type: 'post', postType: 'blind', playerName: 'Mike', amount: '1' },
    { type: 'deal-hand', playerName: 'Carl', cards: ['As', 'Qd'] },
    { type: 'deal-hand', playerName: 'Mike', cards: ['7c', '5c'] },
    { type: 'deal-hand', playerName: 'John', cards: ['Jh', '9d'] },
    { type: 'raise', playerName: 'John', amount: '2.5', totalBet: '2.5', isAllIn: false },
    { type: 'call', playerName: 'Carl', amount: '2', isAllIn: false },
    { type: 'raise', playerName: 'Mike', amount: '9', totalBet: '10', isAllIn: false },
    { type: 'fold', playerName: 'John' },
    { type: 'call', playerName: 'Carl', amount: '7.5', isAllIn: false },
    { type: 'deal-board', street: 'flop', cards: ['Qc', 'Tc', '6h'] },
    { type: 'check', playerName: 'Carl' },
    { type: 'bet', playerName: 'Mike', amount: '7.5', isAllIn: false },
    { type: 'call', playerName: 'Carl', amount: '7.5', isAllIn: false },
    { type: 'deal-board', street: 'turn', cards: ['2d'] },
    { type: 'check', playerName: 'Carl' },
    { type: 'bet', playerName: 'Mike', amount: '20', isAllIn: false },
    { type: 'call', playerName: 'Carl', amount: '9.95', isAllIn: true },
    { type: 'return-bet', playerName: 'Mike', amount: '10.05' },
    { type: 'deal-board', street: 'river', cards: ['7s'] },
    { type: 'showdown', playerName: 'Mike', handStrength: HandStrength.OnePair },
    { type: 'muck', playerName: 'Carl' },
    { type: 'award-pot', playerName: 'Mike', amount: '56.9', isSidePot: false },
  ],
};
