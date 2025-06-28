import { Fighter } from "../classes/Fighter";
import { FightScene } from "../scenes/FightScene";

export async function playerTurn(
  player: Fighter,
  _opponent: Fighter,
  scene: FightScene,
): Promise<void> {
  await player.log(`${player.name}'s turn!`);
  await player.log("Choose an action:");

  await scene.displayPlayerAction(player, _opponent);
  await scene.waitForPlayerAction();
}
