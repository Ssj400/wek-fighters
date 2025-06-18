import chalk from "chalk";
import { Fighter } from "../classes/Fighter";
import { validateLife } from "./validateLife";
import { playerTurn } from "./playerTurn";
import { typeText } from "../utils/typeText";
import { cpuTurn } from "./cpuTurn";

export async function fight(
  fighter1: Fighter,
  fighter2: Fighter,
): Promise<void> {
  await typeText("=============The fight has started!============\n");

  await fighter1.getStats();
  await fighter2.getStats();

  while (fighter1.getHealth() > 0 && fighter2.getHealth() > 0) {
    if (!validateLife(fighter1)) break;
    if (!validateLife(fighter2)) break;

    if (fighter1.getSpeed() > fighter2.getSpeed()) {
      await typeText(
        chalk.bgBlue.bold(`${fighter1.name} is faster, he attacks first!\n`),
      );

      await playerTurn(fighter1, fighter2);
      if (!validateLife(fighter2)) break;
      await cpuTurn(fighter2, fighter1);
      if (!validateLife(fighter1)) break;
    } else if (fighter2.getSpeed() > fighter1.getSpeed()) {
      await typeText(
        chalk.bgBlue.bold(`${fighter2.name} is faster, attacks first!\n`),
      );

      await cpuTurn(fighter2, fighter1);
      if (!validateLife(fighter1)) break;
      await playerTurn(fighter1, fighter2);
      if (!validateLife(fighter2)) break;
    } else {
      await typeText(chalk.bgBlue.bold(`Both fighters are equal in speed!\n`));
      if (Math.random() < 0.5) {
        await playerTurn(fighter1, fighter2);
        if (!validateLife(fighter2)) break;
        await cpuTurn(fighter2, fighter1);
        if (!validateLife(fighter1)) break;
      } else {
        await cpuTurn(fighter2, fighter1);
        if (!validateLife(fighter1)) break;
        await playerTurn(fighter1, fighter2);
        if (!validateLife(fighter2)) break;
      }
    }
    if (!validateLife(fighter1)) break;
    if (!validateLife(fighter2)) break;
    await fighter1.recoverStamina();
    await fighter2.recoverStamina();
    await typeText(
      "===================The turn has ended!=====================\n",
    );
  }
}
