import { IStrength } from '@civ-clone/core-power/Rules/MilitaryStrength';
import Unit from '@civ-clone/core-unit/Unit';

// What a unit adds to its player's military strength: its attack and defence, as they stand. For a ruleset's
//  `core-power` `MilitaryStrength` rule, which chooses which units count.
export const attackAndDefence = (unit: Unit): IStrength => ({
  attack: unit.attack().value(),
  defence: unit.defence().value(),
});

export default attackAndDefence;
