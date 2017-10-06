
/**
 * Transpose a matrix.
 */
export function transpose(matrix: any[][]) {
  if (! matrix.length || ! matrix[0].length) {
    return matrix;
  }
  return matrix[0].map((_, i) => {
    return matrix.map((row) => { return row[i]; });
  })
}

/**
 * Draw random reels positions.
 */
export function drawReelsPositions(reels: string[][]) {
  return reels.map((reel) => {
    return Math.floor(Math.random() * reel.length);
  });
}

/**
 * Given an array of positions and a rowCount, return the corresponding visible reels.
 */
export function getVisibleReelsSymbols(positions: number[], reels: string[][], rowCount: number) {
  return reels.map((reel, reelIndex) => {
    if (positions[reelIndex] <= reel.length - rowCount) {
      return reel.slice(positions[reelIndex], positions[reelIndex] + rowCount);
    } else {
      return reel.slice(positions[reelIndex]).concat(reel.slice(0, rowCount - reel.length + positions[reelIndex]));
    }
  });
}

class Sequence {
  public symbol: string;
  public line: number[];
  public constructor(symbol: string, line: number[]) {
    this.symbol = symbol;
    this.line = line;
  }
}

/**
 * Given an array of positions and the reels final symbols, find all sequences
 * of symbols.
 */
export function findSequences(positions: number[], reels: string[][], wilds: string[]) {
  const recHelper = (reelIndex: number, positions: number[], sequence: Sequence): Sequence[] => {
    if (! positions.length) {
      if (! sequence) {
        return [];
      } else {
        return [sequence];
      }
    } else {
      let sequences: Sequence[] = [];
      const [position, ...rest] = positions;
      const reel = reels[reelIndex];
      for (let i = 0; i < reel.length; i++) {
        const symbol = reel[i];
        if (! sequence) {
          sequences = sequences.concat(
            recHelper(reelIndex + 1, rest, new Sequence(symbol, [i])));
        } else if (symbol === sequence.symbol) {
          sequences = sequences.concat(
            recHelper(reelIndex + 1, rest, new Sequence(symbol, sequence.line.concat([i]))));
        } else if (wilds.indexOf(symbol) >= 0) {
          sequences = sequences.concat(
            recHelper(reelIndex + 1, rest, new Sequence(symbol, sequence.line.concat([i]))));
        }
      }
      if (! sequences.length) {
        return [sequence];
      } else {
        return sequences;
      }
    }
  };

  return recHelper(0, positions, null);
}
