import { HandHistory } from '@poker-apprentice/hand-history-parser';
import { bovadaHandHistory } from './__fixtures__/handHistory';
import { analyzeHand } from './analyzeHand';

describe('analyzeHand', () => {
  const makeHero = (handHistory: HandHistory, playerName: string): HandHistory => ({
    ...handHistory,
    players: handHistory.players.map((player) => ({
      ...player,
      isHero: player.name === playerName,
      isAnonymous: player.name !== playerName,
    })),
  });

  describe('anonymous poker site', () => {
    it('includes player stats for the hero only', () => {
      expect(analyzeHand(makeHero(bovadaHandHistory, 'Mike'))).toMatchInlineSnapshot(`
        {
          "hand": {
            "totalPot": "57.4",
            "totalRake": "0.5",
          },
          "players": {
            "Mike": {
              "aggressiveActionCount": 0,
              "streets": {
                "flop": {
                  "betCount": 1,
                  "bets": {},
                  "callCount": 0,
                  "checkCount": 0,
                  "foldCount": 0,
                  "raiseCount": 0,
                },
                "preflop": {
                  "betCount": 0,
                  "bets": {
                    "2": 1,
                  },
                  "callCount": 0,
                  "checkCount": 0,
                  "foldCount": 0,
                  "raiseCount": 1,
                },
                "turn": {
                  "betCount": 1,
                  "bets": {},
                  "callCount": 0,
                  "checkCount": 0,
                  "foldCount": 0,
                  "raiseCount": 0,
                },
              },
              "totalActionCount": 3,
              "totalAwarded": "56.9",
              "totalContributed": "27.45",
              "totalRakeContributed": "0.5",
              "totalWon": "29.45",
              "vpip": true,
              "wentToShowdown": true,
            },
          },
        }
      `);

      expect(analyzeHand(makeHero(bovadaHandHistory, 'John'))).toMatchInlineSnapshot(`
        {
          "hand": {
            "totalPot": "57.4",
            "totalRake": "0.5",
          },
          "players": {
            "John": {
              "aggressiveActionCount": 0,
              "streets": {
                "preflop": {
                  "betCount": 0,
                  "bets": {
                    "1": 1,
                  },
                  "callCount": 0,
                  "checkCount": 0,
                  "foldCount": 1,
                  "raiseCount": 1,
                },
              },
              "totalActionCount": 2,
              "totalAwarded": "0",
              "totalContributed": "2.5",
              "totalRakeContributed": "0",
              "totalWon": "-2.5",
              "vpip": true,
              "wentToShowdown": false,
            },
          },
        }
      `);

      expect(analyzeHand(makeHero(bovadaHandHistory, 'Carl'))).toMatchInlineSnapshot(`
        {
          "hand": {
            "totalPot": "57.4",
            "totalRake": "0.5",
          },
          "players": {
            "Carl": {
              "aggressiveActionCount": 0,
              "streets": {
                "flop": {
                  "betCount": 0,
                  "bets": {},
                  "callCount": 1,
                  "checkCount": 1,
                  "foldCount": 0,
                  "raiseCount": 0,
                },
                "preflop": {
                  "betCount": 0,
                  "bets": {},
                  "callCount": 2,
                  "checkCount": 0,
                  "foldCount": 0,
                  "raiseCount": 0,
                },
                "turn": {
                  "betCount": 0,
                  "bets": {},
                  "callCount": 1,
                  "checkCount": 1,
                  "foldCount": 0,
                  "raiseCount": 0,
                },
              },
              "totalActionCount": 6,
              "totalAwarded": "0",
              "totalContributed": "27.45",
              "totalRakeContributed": "0",
              "totalWon": "-27.45",
              "vpip": true,
              "wentToShowdown": true,
            },
          },
        }
      `);
    });
  });
});
