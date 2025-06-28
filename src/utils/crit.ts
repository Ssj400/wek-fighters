import type { Fighter } from "../classes/Fighter";

export async function calculateCrit(
  _attacker: Fighter,
  baseDamage: number,
  chance: number,
): Promise<number> {
  if (Math.random() < chance) {
    return baseDamage * 2;
  } else {
    return baseDamage;
  }
}
