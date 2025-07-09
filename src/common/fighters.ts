import { CounterPuncher } from "../classes/CounterPuncher";
import { Defender } from "../classes/Defender";
import { Fighter } from "../classes/Fighter";
import { OutBoxer } from "../classes/OutBoxer";
import { Puncher } from "../classes/Puncher";
import {
  cross,
  divineUppercut,
  jab,
  llamaLeftHook,
  rightOverhand,
  sabuesoKiller,
  bunnyHop,
  lastResource,
  swarm,
} from "../common/attacks";

const baseFighters: Record<string, Fighter> = (() => {
  const mati = new Puncher("Mati", 100, 50, 10, 0.1, false, 1.2, true, 0.7);
  mati.setAttack({
    Jab: jab,
    "Right Overhand": rightOverhand,
    "Divine Uppercut": divineUppercut,
  });

  const juan = new CounterPuncher(
    "Juan",
    100,
    10,
    40,
    0.1,
    false,
    0.5,
    false,
    0.7,
  );
  juan.setAttack({
    Jab: jab,
    Cross: cross,
  });

  const alan = new Puncher("Alan", 100, 40, 20, 0.1, false, 1.5, false, 0.7);
  alan.setAttack({
    Jab: jab,
    "Sabueso Killer": sabuesoKiller,
  });

  const jefte = new Defender("Jefte", 100, 35, 35, 0.1, false, 10, false, 0.7);
  jefte.setAttack({
    Jab: jab,
    "Llama left hook": llamaLeftHook,
  });

  const gaspar = new OutBoxer("Gaspar", 100, 10, 50, 0.1, false, false, 1.1);
  gaspar.setAttack({
    Jab: jab,
    Cross: cross,
    "Bunny Hop": bunnyHop,
  });

  const jose = new Fighter("Jose", 100, 60, 50, 0.1, false, false, 1);
  jose.setAttack({
    Jab: jab,
    Swarm: swarm,
    "Last Resource": lastResource,
  });

  return {
    Mati: mati,
    Juan: juan,
    Alan: alan,
    Jefte: jefte,
    Gaspar: gaspar,
    Jose: jose,
  };
})();

export function createAllFighters(): Record<string, Fighter> {
  return Object.fromEntries(
    Object.entries(baseFighters).map(([key, fighter]) => [
      key,
      fighter.clone(),
    ]),
  );
}
