import { Fighter } from "../classes/Fighter.js";
import { FightScene } from "../scenes/FightScene.js";

export async function cpuTurn(
  cpu: Fighter,
  player: Fighter,
  scene: FightScene,
): Promise<void> {
  await cpu.log(`${cpu.name}'s turn!`);
  const attackNames = Object.values(cpu.getAttackNames());
  const lifeRatio = cpu.getHealth() / 100;
  const shouldBlock = Math.random() < 0.4 || lifeRatio < 0.5;
  const shouldRecover = Math.random() < 0.2 || lifeRatio < 0.2;

  if (shouldBlock && cpu.getBlockFail() < 0.7) {
    await cpu.block();
    await scene.animateBlock(scene.opponentSprite);
  } else if (shouldRecover) {
    await cpu.recoverHealth();
    await scene.animateRecoverHealth(scene.opponentSprite);
  } else {
    await scene.animateAttackOponent(scene.opponentSprite);
    await cpu.useAttack(
      attackNames[Math.floor(Math.random() * attackNames.length)].name,
      player,
    );
  }
}
