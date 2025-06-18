import { fight } from "./logic/fight";
import { typeText } from "./utils/typeText";
import { chooseFighter } from "./logic/chooseFighter";
import { fighters } from "./fighters/roster";

async function main() {
  await typeText("Welcome to the fight simulator!\n");
  const [player, opponent] = await chooseFighter(fighters);
  await fight(player, opponent);
}

main();
