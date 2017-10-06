import * as SlotMachine from './SlotMachine';
import slotmachine from './slotmachine.config';

const positions = SlotMachine.drawReelsPositions(slotmachine.base.reels);
const wilds = Object.keys(slotmachine.base.wild);
const symbols = SlotMachine.getVisibleReelsSymbols(positions, slotmachine.base.reels, slotmachine.base.rowCount);
const matches = SlotMachine.findSequences(positions, symbols, wilds);
console.log(positions);
console.log(SlotMachine.transpose(symbols));
console.log(matches);
