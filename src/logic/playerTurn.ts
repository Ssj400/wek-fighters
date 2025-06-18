import readlineSync from "readline-sync";
import { Fighter } from "../classes/Fighter";
import { typeText } from "../utils/typeText";
import { chooseAttack } from "./chooseAttack";

export async function playerTurn(
  player: Fighter,
  opponent: Fighter,
): Promise<void> {
  await typeText(`\n${player.name}'s turn!`);

  await typeText("Choose an action: \n1.Attack\n2.Block\n3.Recover\n4.Stats\n");
  const action = readlineSync.question("> ");

  if (action === "1") {
    await chooseAttack(player, opponent);
  } else if (action === "2") {
    await player.block();
  } else if (action === "3") {
    await player.recoverHealth();
  } else if (action === "4") {
    await player.getStats();
    await opponent.getStats();
    await playerTurn(player, opponent);
  } else {
    await typeText("Invalid action. Please choose 1, 2, 3 or  4");
    await playerTurn(player, opponent);
  }
}
