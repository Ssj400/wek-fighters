import { Fighter } from "../classes/Fighter.js";
import { typeText } from "../utils/typeText.js";

export async function cpuTurn(cpu: Fighter, player: Fighter): Promise<void> {
  await typeText(`\n${cpu.name}'s turn!`);

  const lifeRatio = cpu.health / 100;
  const shouldBlock = Math.random() < 0.4 || lifeRatio < 0.3; // Más defensivo si tiene poca vida

  if (shouldBlock && cpu.blockFail < 0.7) {
    await cpu.block();
  } else {
    await cpu.attack(player);
  }
}