import { Fighter } from "../classes/Fighter.js";
import { FightScene } from "../scenes/FightScene.js";
import { type Difficulty } from "../types/types.js";

export async function cpuTurn(
  cpu: Fighter,
  player: Fighter,
  scene: FightScene,
  difficulty: Difficulty,
): Promise<void> {
  switch (difficulty) {
    case "easy":
      await easyCpu(cpu, player, scene);
      break;
    case "normal":
      await normalCpu(cpu, player, scene);
      break;
    case "hard":
      await hardCpu(cpu, player, scene);
      break;
    default:
      await easyCpu(cpu, player, scene);
      break;
  }
}

export async function easyCpu(
  cpu: Fighter,
  player: Fighter,
  scene: FightScene,
): Promise<void> {
  await cpu.log(`${cpu.name}'s turn!`);

  if (cpu.getHealth() > 30 && cpu.getStamina() > 10) {
    await scene.animateAttackOponent(scene.opponentSprite);
    await cpu.useAttack("Jab", player);
    return;
  }

  await scene.animateBlock(scene.opponentSprite);
  cpu.block();
  return;
}

export async function normalCpu(
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

export async function hardCpu(
  cpu: Fighter,
  player: Fighter,
  scene: FightScene,
): Promise<void> {
  await cpu.log(`${cpu.name}'s turn!`);

  const attacks = cpu.getAttackNames();
  const cpuHealth = cpu.getHealth();
  const cpuStamina = cpu.getStamina();
  const playerStamina = player.getStamina();
  const playerLastMove = player.getLastMove();

  const jab = attacks.find((a) => a.name === "Jab");
  const strongestAttack = attacks
    .filter((a) => a.staminaCost <= cpuStamina)
    .sort((a, b) => b.basePower - a.basePower)[0];

  if (playerLastMove === "block" && cpuStamina >= 10 && cpuHealth > 20) {
    await scene.animateAttackOponent(scene.opponentSprite);
    await cpu.useAttack("Jab", player);
    return;
  }

  if (cpuStamina < 10 || cpuHealth < 30) {
    await scene.animateRecoverHealth(scene.opponentSprite);
    await cpu.recoverHealth();
    scene.updateStats();
    return;
  }

  if (playerStamina < 10 && cpuStamina >= strongestAttack.staminaCost + 10) {
    await scene.animateAttackOponent(scene.opponentSprite);
    await cpu.useAttack(strongestAttack.name, player);
    return;
  }

  if (!strongestAttack && jab && cpuStamina >= jab.staminaCost) {
    await scene.animateAttackOponent(scene.opponentSprite);
    await cpu.useAttack(jab.name, player);
    return;
  }

  if (strongestAttack) {
    await scene.animateAttackOponent(scene.opponentSprite);
    await cpu.useAttack(strongestAttack.name, player);
    return;
  }

  await cpu.block();
  await scene.animateBlock(scene.opponentSprite);
}
