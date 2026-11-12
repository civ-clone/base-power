import {
  advancesTerm,
  citizensTerm,
  treasuryTerm,
  unitCostTerm,
} from '../lib/rank';
import BuildCost from '@civ-clone/core-city-build/Rules/BuildCost';
import BuildItem from '@civ-clone/core-city-build/BuildItem';
import Effect from '@civ-clone/core-rule/Effect';
import Gold from '@civ-clone/base-city-yield-gold/Gold';
import Player from '@civ-clone/core-player/Player';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Unit from '@civ-clone/core-unit/Unit';
import attackAndDefence from '../lib/strength';
import { expect } from 'chai';

class Cheap extends Unit {}
class Dear extends Unit {}

const standInUnit = (UnitType: typeof Unit, attack = 0, defence = 0): Unit =>
    Object.assign(Object.create(UnitType.prototype), {
      attack: () => ({ value: () => attack }),
      defence: () => ({ value: () => defence }),
    }) as Unit,
  throws = () => {
    throw new TypeError('none');
  };

describe('base-power', () => {
  it('divides the treasury and truncates, or scores 0 without one', () => {
    const player = new Player(new RuleRegistry()),
      asked: unknown[] = [];

    expect(
      treasuryTerm(Gold, 32, {
        getByPlayerAndType: (_: Player, YieldType: unknown) => {
          asked.push(YieldType);

          return { value: () => 100 };
        },
      } as any)(player)
    ).equal(3);
    expect(asked).eql([Gold]);
    expect(
      treasuryTerm(Gold, 32, { getByPlayerAndType: throws } as any)(player)
    ).equal(0);
  });

  it('weights every citizen of every city', () => {
    expect(
      citizensTerm(
        8,
        { getByPlayer: () => [{ size: 3 }, { size: 5 }] } as any,
        {
          getByCity: (city: { size: number }) => ({ size: () => city.size }),
        } as any
      )(new Player(new RuleRegistry()))
    ).equal(64);
  });

  it('counts advances known, or scores 0 without research', () => {
    const player = new Player(new RuleRegistry());

    expect(
      advancesTerm({
        getByPlayer: () => ({ complete: () => new Array(7) }),
      } as any)(player)
    ).equal(7);
    expect(advancesTerm({ getByPlayer: throws } as any)(player)).equal(0);
  });

  it('adds up unit costs divided and rounded down, asking each type once', () => {
    const ruleRegistry = new RuleRegistry(),
      costs = new Map<typeof Unit, number>([
        [Cheap, 15],
        [Dear, 160],
      ]),
      asked: unknown[] = [];

    ruleRegistry.register(
      new BuildCost(
        new Effect((item: BuildItem) => {
          asked.push(item.item());

          return { value: () => costs.get(item.item() as typeof Unit) ?? 0 };
        })
      ) as any
    );

    const term = unitCostTerm(
        10,
        {
          getByPlayer: () => [
            standInUnit(Cheap),
            standInUnit(Cheap),
            standInUnit(Dear),
          ],
        } as any,
        ruleRegistry
      ),
      player = new Player(ruleRegistry);

    expect(term(player)).equal(1 + 1 + 16);
    expect(term(player)).equal(18);
    expect(asked).eql([Cheap, Dear]);
  });

  it("reads a unit's attack and defence", () => {
    expect(attackAndDefence(standInUnit(Cheap, 2, 3))).eql({
      attack: 2,
      defence: 3,
    });
  });
});
