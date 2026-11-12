"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unitCostTerm = exports.advancesTerm = exports.citizensTerm = exports.treasuryTerm = void 0;
const CityGrowthRegistry_1 = require("@civ-clone/core-city-growth/CityGrowthRegistry");
const CityRegistry_1 = require("@civ-clone/core-city/CityRegistry");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const PlayerTreasuryRegistry_1 = require("@civ-clone/core-treasury/PlayerTreasuryRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const UnitRegistry_1 = require("@civ-clone/core-unit/UnitRegistry");
const BuildCost_1 = require("@civ-clone/core-city-build/Rules/BuildCost");
// The player's treasury of `YieldType`, divided by `divisor` and truncated. A player with no such treasury (yet)
//  scores 0.
const treasuryTerm = (YieldType, divisor, playerTreasuryRegistry = PlayerTreasuryRegistry_1.instance) => {
    return (player) => {
        try {
            return Math.trunc(playerTreasuryRegistry.getByPlayerAndType(player, YieldType).value() /
                divisor);
        }
        catch (e) {
            return 0;
        }
    };
};
exports.treasuryTerm = treasuryTerm;
// `perCitizen` for every citizen in every one of the player's cities.
const citizensTerm = (perCitizen, cityRegistry = CityRegistry_1.instance, cityGrowthRegistry = CityGrowthRegistry_1.instance) => {
    return (player) => perCitizen *
        cityRegistry
            .getByPlayer(player)
            .reduce((total, city) => total + cityGrowthRegistry.getByCity(city).size(), 0);
};
exports.citizensTerm = citizensTerm;
// The number of advances the player knows. A player with no research (yet) scores 0.
const advancesTerm = (playerResearchRegistry = PlayerResearchRegistry_1.instance) => {
    return (player) => {
        try {
            return playerResearchRegistry.getByPlayer(player).complete().length;
        }
        catch (e) {
            return 0;
        }
    };
};
exports.advancesTerm = advancesTerm;
// Each of the player's units' build cost, divided by `divisor` and rounded down, added together.
//
// A unit type's cost is asked of the `BuildCost` rules once per type for the life of the term (they only read a
//  `BuildItem`'s `item()`), so a cost rule that changes during a game isn't seen.
const unitCostTerm = (divisor, unitRegistry = UnitRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance) => {
    const unitValues = new Map(), unitValue = (UnitType) => {
        var _a;
        if (!unitValues.has(UnitType)) {
            const standIn = { item: () => UnitType }, [cost] = ruleRegistry.process(BuildCost_1.default, standIn, null);
            unitValues.set(UnitType, Math.floor(((_a = cost === null || cost === void 0 ? void 0 : cost.value()) !== null && _a !== void 0 ? _a : 0) / divisor));
        }
        return unitValues.get(UnitType);
    };
    return (player) => unitRegistry
        .getByPlayer(player)
        .reduce((total, unit) => total + unitValue(unit.constructor), 0);
};
exports.unitCostTerm = unitCostTerm;
//# sourceMappingURL=rank.js.map