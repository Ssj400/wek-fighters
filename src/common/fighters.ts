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
} from "../common/attacks";

const dummyLogger = async (_msg: string): Promise<void> => {
  return;
};

const baseFighters: Record<string, Fighter> = (() => {
  const mati = new Puncher(
    "Mati",
    100,
    50,
    10,
    0.1,
    false,
    1.2,
    true,
    0.7,
    dummyLogger,
  );
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
    dummyLogger,
  );
  juan.setAttack({
    Jab: jab,
    Cross: cross,
  });

  const alan = new Puncher(
    "Alan",
    100,
    40,
    20,
    0.1,
    false,
    1.5,
    false,
    0.7,
    dummyLogger,
  );
  alan.setAttack({
    Jab: jab,
    "Sabueso Killer": sabuesoKiller,
  });

  const jefte = new Defender(
    "Jefte",
    100,
    35,
    35,
    0.1,
    false,
    10,
    false,
    0.7,
    dummyLogger,
  );
  jefte.setAttack({
    Jab: jab,
    "Llama left hook": llamaLeftHook,
  });

  const gaspar = new OutBoxer(
    "Gaspar",
    100,
    10,
    50,
    0.1,
    false,
    false,
    1.1,
    dummyLogger,
  );
  gaspar.setAttack({
    Jab: jab,
    Cross: cross,
    "Bunny Hop": bunnyHop,
  });

  const jose = new Fighter(
    "Jose",
    100,
    60,
    50,
    0.1,
    false,
    false,
    1,
    dummyLogger,
  );
  jose.setAttack({
    Jab: jab,
    Cross: cross,
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
