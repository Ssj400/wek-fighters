import { Fighter } from "../classes/Fighter";
import { validateLife } from "./validateLife";
import { cpuTurn } from "./cpuTurn";
import { playerTurn } from "./playerTurn";
import { FightScene } from "../scenes/FightScene";

export async function fight(
  fighter1: Fighter,
  fighter2: Fighter,
  scene: FightScene,
): Promise<void> {
  await fighter1.log(`The fight begins!`);

  await fighter1.log(fighter1.getStats());
  await fighter2.log(fighter2.getStats());

  while (fighter1.getHealth() > 0 && fighter2.getHealth() > 0) {
    if (!validateLife(fighter1)) break;
    if (!validateLife(fighter2)) break;

    if (fighter1.getSpeed() > fighter2.getSpeed()) {
      await fighter1.log(`${fighter1.name} is faster, he attacks first!`);

      await playerTurn(fighter1, fighter2, scene);
      if (!validateLife(fighter2)) break;

      await cpuTurn(fighter2, fighter1, scene);
      if (!validateLife(fighter1)) break;
    } else if (fighter2.getSpeed() > fighter1.getSpeed()) {
      await fighter2.log(`${fighter2.name} is faster, attacks first!`);

      await cpuTurn(fighter2, fighter1, scene);
      if (!validateLife(fighter1)) break;
      await playerTurn(fighter1, fighter2, scene);
      if (!validateLife(fighter2)) break;
    } else {
      await fighter1.log(`Both fighters are equal in speed!`);
      if (Math.random() < 0.5) {
        await playerTurn(fighter1, fighter2, scene);
        if (!validateLife(fighter2)) break;

        await cpuTurn(fighter2, fighter1, scene);
        if (!validateLife(fighter1)) break;
      } else {
        await cpuTurn(fighter2, fighter1, scene);
        if (!validateLife(fighter1)) break;

        await playerTurn(fighter1, fighter2, scene);
        if (!validateLife(fighter2)) break;
      }
    }
    if (!validateLife(fighter1)) break;
    if (!validateLife(fighter2)) break;
    await fighter1.recoverStamina();
    await scene.animateRecoverStamina(scene.playerSprite);
    scene.updateStats();
    await fighter2.recoverStamina();
    await scene.animateRecoverStamina(scene.opponentSprite);
    scene.updateStats();
    await fighter1.log("The turn has ended!");
  }

  scene.cameras.main.fadeOut(1500, 0, 0, 0);

  scene.time.delayedCall(1600, () => {
    scene.sound.stopAll();
    scene.scene.start("CharacterSelectScene");
  });
}
