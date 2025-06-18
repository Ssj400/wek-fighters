import { Fighter } from "../classes/Fighter";

export function validateLife(fighter: Fighter): boolean {
  return fighter.getHealth() > 0;
}
