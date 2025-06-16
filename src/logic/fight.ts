import chalk from "chalk";
import { Fighter } from "../classes/Fighter";
import { validateLife } from "./validateLife";
import { playerTurn } from "./playerTurn";
import { typeText } from "../utils/typeText";
import { cpuTurn } from "./cpuTurn";

export async function fight(fighter1: Fighter, fighter2: Fighter): Promise<void> {
  await typeText("=============The fight has started!============\n");

  await fighter1.getStats();
  await fighter2.getStats();

  for (let i = 0; i < 10; i++) {
    if (!validateLife(fighter1)) break;
    if (!validateLife(fighter2)) break;

    if (fighter1.speed > fighter2.speed) {
      await typeText(chalk.bgBlue.bold(`${fighter1.name} is faster, he attacks first!\n`));
      
      await playerTurn(fighter1, fighter2);
      if (!validateLife(fighter2)) break;
      await cpuTurn(fighter2, fighter1);
      if (!validateLife(fighter1)) break;

    } else if (fighter2.speed > fighter1.speed) {
      await typeText(chalk.bgBlue.bold(`${fighter2.name} is faster, attacks first!\n`));
      
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
    await typeText("===================The turn has ended!=====================\n");
  }
}