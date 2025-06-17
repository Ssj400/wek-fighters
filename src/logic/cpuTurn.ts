import { Fighter } from "../classes/Fighter.js";
import { typeText } from "../utils/typeText.js";

export async function cpuTurn(cpu: Fighter, player: Fighter): Promise<void> {
  await typeText(`\n${cpu.name}'s turn!\n`, 1);

  const lifeRatio = cpu.getHealth() / 100;
  const shouldBlock = Math.random() < 0.4 || lifeRatio < 0.5; 
  const shouldRecover = Math.random() < 0.2 || lifeRatio < 0.2; 

  if (shouldBlock && cpu.getBlockFail() < 0.7) {
    await cpu.block();
  } else if (shouldRecover) {
    await cpu.recoverHealth();
  } else {
    await cpu.normalAttack(player);
  }
}