# base-power

The terms a ruleset builds its `core-power` rules from. Each is a plain function, so the ruleset keeps its own rule
ids, numbers and registration:

- `lib/rank`: `treasuryTerm(YieldType, divisor)`, `citizensTerm(perCitizen)`, `advancesTerm()` and
  `unitCostTerm(divisor)`, each a `(player) => number` for a `Rank` rule's effect.
- `lib/strength`: `attackAndDefence(unit)`, a unit's attack and defence for a `MilitaryStrength` rule's effect.

A library: it registers no rules. See `civ1-power` for Civilization's terms.
