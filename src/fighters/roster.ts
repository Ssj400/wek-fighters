import { Fighter } from "../classes/Fighter";
import { Puncher } from "../classes/Puncher";
import { CounterPuncher } from "../classes/CounterPuncher";
import { Defender } from "../classes/Defender";
import { OutBoxer } from "../classes/OutBoxer";
import {
  divineUppercut,
  jab,
  llamaLeftHook,
  rightOverhand,
  sabuesoKiller,
  strongCross,
} from "../common/attacks";

export const jefte = new Defender("inca", 100, 20, 10, 0, false, 10);
jefte.setAttack({
  Jab: jab,
  "Llama Left Hook": llamaLeftHook,
});

export const mati = new Puncher("theBeast", 100, 30, 10, 0, false, 1.2, true);
mati.setAttack({
  Jab: jab,
  "Right Overhand": rightOverhand,
  "Divine Uppercut": divineUppercut,
});

export const alan = new Puncher("babyTank", 100, 20, 20, 0, false, 1.5);
alan.setAttack({
  Jab: jab,
  "Sabueso Killer": sabuesoKiller,
});

export const juan = new CounterPuncher(
  "The lizard",
  100,
  10,
  50,
  0,
  false,
  0.7,
);
juan.setAttack({
  Jab: jab,
  "Strong Cross": strongCross,
});

export const gaspar = new OutBoxer("Bunny", 100, 5, 55, 0, false);
gaspar.setAttack({
  Jab: jab,
  "Strong Cross": strongCross,
});

export const fighters: Fighter[] = [jefte, mati, alan, juan, gaspar];
