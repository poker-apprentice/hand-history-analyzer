# Hand History Analyzer

Analyze hand histories from online poker sites in JavaScript & TypeScript. Works in conjunction with [Hand History Parser](https://github.com/poker-apprentice/hand-history-parser).

## Installation

Add `@poker-apprentice/hand-history-analyzer` as a dependency.

- yarn:
  ```bash
  yarn add @poker-apprentice/hand-history-analyzer
  ```
- npm:
  ```bash
  npm install @poker-apprentice/hand-history-analyzer --save
  ```

## Usage

This package exports an `analyzeHand` function that can be used for analyzing hand histories that have been parsed by [Hand History Parser](https://github.com/poker-apprentice/hand-history-parser)'s `parseHand` function. To use it, simply pass a parsed hand history to the function.

```ts
// assumes `handHistory` is an object returned by `parseHand`
const stats = analyzeHand(handHistory);
console.log(handHistory);
```

The value returned is represented as a [`HandHistoryStats`](https://github.com/poker-apprentice/hand-history-analyzer/blob/main/src/types.ts#L87) type object. For example:

```js
{
  "hand": {
    "totalPot": "57.4",
    "totalRake": "0.5",
  },
  "players": {
    "Mike": {
      "aggressiveActionCount": 0,
      "bountiesWon": "0",
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
      "tournamentPlacementPrize": "0",
      "vpip": true,
      "wentToShowdown": true,
    },
  },
}
```

For anonymous poker sites (i.e.: sites that don't display usernames or otherwise obfuscate player information while playing), only the "hero" will be included in the `players` object included in the return value. For all other sites, the `players` object will include all players who were involved in the hand.

For insight into the intention of each key in the return value, refer to the [TypeScript types](https://github.com/poker-apprentice/hand-history-analyzer/blob/main/src/types.ts).

## Contributing

If you'd like to fix a bug, add a feature, improve the documentation, or anything else to better this library, pull requests are welcomed!

1. Clone the repository:
   ```bash
   git clone git@github.com:poker-apprentice/hand-history-analyzer.git
   ```
1. Install dependencies:
   ```bash
   yarn install
   ```
1. Include tests for your changes, and open a pull request.

If you are interested in contributing, but you are stuck or lost at any point in your efforts, please reach out for help!
