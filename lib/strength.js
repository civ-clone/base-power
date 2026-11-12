"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attackAndDefence = void 0;
// What a unit adds to its player's military strength: its attack and defence, as they stand. For a ruleset's
//  `core-power` `MilitaryStrength` rule, which chooses which units count.
const attackAndDefence = (unit) => ({
    attack: unit.attack().value(),
    defence: unit.defence().value(),
});
exports.attackAndDefence = attackAndDefence;
exports.default = exports.attackAndDefence;
//# sourceMappingURL=strength.js.map