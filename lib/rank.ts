import {
  CityGrowthRegistry,
  instance as cityGrowthRegistryInstance,
} from '@civ-clone/core-city-growth/CityGrowthRegistry';
import {
  CityRegistry,
  instance as cityRegistryInstance,
} from '@civ-clone/core-city/CityRegistry';
import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import {
  PlayerTreasuryRegistry,
  instance as playerTreasuryRegistryInstance,
} from '@civ-clone/core-treasury/PlayerTreasuryRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  UnitRegistry,
  instance as unitRegistryInstance,
} from '@civ-clone/core-unit/UnitRegistry';
import BuildCost from '@civ-clone/core-city-build/Rules/BuildCost';
import BuildItem from '@civ-clone/core-city-build/BuildItem';
import City from '@civ-clone/core-city/City';
import Player from '@civ-clone/core-player/Player';
import Unit from '@civ-clone/core-unit/Unit';
import Yield from '@civ-clone/core-yield/Yield';

// Terms of a player's ranking score, for a ruleset to wrap in `core-power`'s `Rank` rules with its own ids and
//  numbers. Each is a function of the player that returns a whole number.
export type RankTerm = (player: Player) => number;

// The player's treasury of `YieldType`, divided by `divisor` and truncated. A player with no such treasury (yet)
//  scores 0.
export const treasuryTerm = (
  YieldType: typeof Yield,
  divisor: number,
  playerTreasuryRegistry: PlayerTreasuryRegistry = playerTreasuryRegistryInstance
): RankTerm => {
  return (player: Player): number => {
    try {
      return Math.trunc(
        playerTreasuryRegistry.getByPlayerAndType(player, YieldType).value() /
          divisor
      );
    } catch (e) {
      return 0;
    }
  };
};

// `perCitizen` for every citizen in every one of the player's cities.
export const citizensTerm = (
  perCitizen: number,
  cityRegistry: CityRegistry = cityRegistryInstance,
  cityGrowthRegistry: CityGrowthRegistry = cityGrowthRegistryInstance
): RankTerm => {
  return (player: Player): number =>
    perCitizen *
    cityRegistry
      .getByPlayer(player)
      .reduce(
        (total: number, city: City): number =>
          total + cityGrowthRegistry.getByCity(city).size(),
        0
      );
};

// The number of advances the player knows. A player with no research (yet) scores 0.
export const advancesTerm = (
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance
): RankTerm => {
  return (player: Player): number => {
    try {
      return playerResearchRegistry.getByPlayer(player).complete().length;
    } catch (e) {
      return 0;
    }
  };
};

// Each of the player's units' build cost, divided by `divisor` and rounded down, added together.
//
// A unit type's cost is asked of the `BuildCost` rules once per type for the life of the term (they only read a
//  `BuildItem`'s `item()`), so a cost rule that changes during a game isn't seen.
export const unitCostTerm = (
  divisor: number,
  unitRegistry: UnitRegistry = unitRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance
): RankTerm => {
  const unitValues = new Map<typeof Unit, number>(),
    unitValue = (UnitType: typeof Unit): number => {
      if (!unitValues.has(UnitType)) {
        const standIn = { item: () => UnitType } as unknown as BuildItem,
          [cost] = ruleRegistry.process(BuildCost, standIn, null);

        unitValues.set(UnitType, Math.floor((cost?.value() ?? 0) / divisor));
      }

      return unitValues.get(UnitType)!;
    };

  return (player: Player): number =>
    unitRegistry
      .getByPlayer(player)
      .reduce(
        (total: number, unit: Unit): number =>
          total + unitValue(unit.constructor as typeof Unit),
        0
      );
};
