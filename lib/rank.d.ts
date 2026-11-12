import { CityGrowthRegistry } from '@civ-clone/core-city-growth/CityGrowthRegistry';
import { CityRegistry } from '@civ-clone/core-city/CityRegistry';
import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { PlayerTreasuryRegistry } from '@civ-clone/core-treasury/PlayerTreasuryRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { UnitRegistry } from '@civ-clone/core-unit/UnitRegistry';
import Player from '@civ-clone/core-player/Player';
import Yield from '@civ-clone/core-yield/Yield';
export type RankTerm = (player: Player) => number;
export declare const treasuryTerm: (
  YieldType: typeof Yield,
  divisor: number,
  playerTreasuryRegistry?: PlayerTreasuryRegistry
) => RankTerm;
export declare const citizensTerm: (
  perCitizen: number,
  cityRegistry?: CityRegistry,
  cityGrowthRegistry?: CityGrowthRegistry
) => RankTerm;
export declare const advancesTerm: (
  playerResearchRegistry?: PlayerResearchRegistry
) => RankTerm;
export declare const unitCostTerm: (
  divisor: number,
  unitRegistry?: UnitRegistry,
  ruleRegistry?: RuleRegistry
) => RankTerm;
