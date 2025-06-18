import { Fighter } from "../classes/Fighter";
import { typeText } from "../utils/typeText";
import readlineSync from "readline-sync";

export async function chooseFighter(fighters: Fighter[]): Promise<Fighter[]> {
  const fightersChosen: Fighter[] = [];

  await typeText("Choose your fighter:\n");

  for (let i = 0; i < fighters.length; i++) {
    const fighter = fighters[i];
    await typeText(`${i + 1}. ${fighter.name}\n`);
    await fighter.getStats();
  }

  await typeText("Enter the number of your fighter: ");
  const choice = readlineSync.question("> ");
  if (
    isNaN(parseInt(choice)) ||
    parseInt(choice) < 1 ||
    parseInt(choice) > fighters.length
  ) {
    await typeText("Invalid choice. Please enter a valid number.\n");
    return chooseFighter(fighters);
  }
  const fighterIndex = parseInt(choice) - 1;

  fightersChosen.push(fighters[fighterIndex]);

  await typeText(`\nYou have chosen: ${fighters[fighterIndex].name}\n\n`);

  await typeText("Choose your opponent:\n");

  for (let i = 0; i < fighters.length; i++) {
    const fighter = fighters[i];
    await typeText(`${i + 1}. ${fighter.name}\n`);
    await fighter.getStats();
  }

  await typeText("Enter the number of your opponent: ");
  const opponentChoice = readlineSync.question("> ");
  if (
    isNaN(parseInt(opponentChoice)) ||
    parseInt(opponentChoice) < 1 ||
    parseInt(opponentChoice) > fighters.length
  ) {
    await typeText("Invalid choice. Please enter a valid number.\n");
    return chooseFighter(fighters);
  }
  const opponentIndex = parseInt(opponentChoice) - 1;

  fightersChosen.push(fighters[opponentIndex]);

  await typeText(`\nYou will fight against: ${fighters[opponentIndex].name}\n`);

  return fightersChosen;
}
