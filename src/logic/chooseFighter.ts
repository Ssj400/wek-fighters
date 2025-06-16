import { Fighter } from "../classes/Fighter";
import { typeText } from "../utils/typeText";
import readlineSync from 'readline-sync';

export async function chooseFighter(fighters: Fighter[]): Promise<Fighter[]> {
  let fightersChosen: Fighter[] = [];

  await typeText("Choose your fighter:\n");

  for (let i = 0; i < fighters.length; i++) {
    const fighter = fighters[i];
    await typeText(`${i + 1}. ${fighter.name}\n`);
    await fighter.getStats();
  }

  await typeText("Enter the number of your fighter: ");
  const choice = readlineSync.question('> ');
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
  const opponentChoice = readlineSync.question('> ');
  const opponentIndex = parseInt(opponentChoice) - 1;

  fightersChosen.push(fighters[opponentIndex]);

  await typeText(`\nYou will fight against: ${fighters[opponentIndex].name}\n`);

  return fightersChosen;
}
