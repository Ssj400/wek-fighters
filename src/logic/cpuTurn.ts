import { Fighter } from "../classes/Fighter.js";
import { FightScene } from "../scenes/FightScene.js";

export async function cpuTurn(
  cpu: Fighter,
  player: Fighter,
  scene: FightScene,
): Promise<void> {
  await cpu.log(`${cpu.name}'s turn!`);

  const attacks = cpu.getAttackNames();
  const playerHealth = player.getHealth();
  const cpuHealth = cpu.getHealth();
  const cpuStamina = cpu.getStamina();
  const playerStamina = player.getStamina();

  if (cpuHealth < 30 && playerStamina < 20 && Math.random() < 0.8) {
    await cpu.block();
    await scene.animateBlock(scene.opponentSprite);
    return;
  }

  if (cpuHealth < 40 && cpuStamina > 10 && Math.random() < 0.6) {
    await cpu.recoverHealth();
    await scene.animateRecoverHealth(scene.opponentSprite);
    scene.updateStats();
    return;
  }

  const bestAttack = attacks.reduce((best, current) =>
    current.basePower > best.basePower ? current : best,
  );

  if (playerHealth < 20 && cpuStamina >= bestAttack.staminaCost) {
    await scene.animateAttackOponent(scene.opponentSprite);
    await cpu.useAttack(bestAttack.name, player);
    return;
  }

  if (cpuStamina < 10 && Math.random() < 0.5) {
    await cpu.recoverHealth();
    await scene.animateRecoverHealth(scene.opponentSprite);
    scene.updateStats();
    return;
  }

  const validAttacks = attacks.filter((a) => a.staminaCost <= cpuStamina);
  const chosen = validAttacks[Math.floor(Math.random() * validAttacks.length)];

  if (chosen) {
    await scene.animateAttackOponent(scene.opponentSprite);
    await cpu.useAttack(chosen.name, player);
  } else {
    await cpu.block();
    await scene.animateBlock(scene.opponentSprite);
  }
}
