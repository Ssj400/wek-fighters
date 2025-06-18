import { Fighter } from "../classes/Fighter";
import { typeText } from "../utils/typeText";
import readlineSync from "readline-sync";
import { playerTurn } from "./playerTurn";

export async function chooseAttack(
  player: Fighter,
  opponent: Fighter
): Promise<void> {
  const attackNames = Object.values(player.getAttackNames());
  if (attackNames.length === 0) {
    await typeText("This fighter has no attacks!\n");
    return await playerTurn(player, opponent);
  }

  await typeText("Choose an attack or type 0 to cancel:\n");

  attackNames.forEach((atk, index) => {
    console.log(
      `${index + 1}.${atk.name}: ${atk.description} (Cost: ${
        atk.staminaCost
      })\n`
    );
  });

  const index = parseInt(readlineSync.question(">"), 10) - 1;
  if (Number.isNaN(index) || index >= attackNames.length) {
    await typeText("Invalid attack selection.\n");
    return await playerTurn(player, opponent);
  } else if (index + 1 === 0) return await playerTurn(player, opponent);

  const chosenAttack = attackNames[index].name;

  if (!chosenAttack) {
    await typeText("Invalid attack selection.\n");
    return await playerTurn(player, opponent);
  }

  await player.useAttack(chosenAttack, opponent);
}
