import { Fighter } from "../classes/Fighter";
import { typeText } from "../utils/typeText";
import { sleep } from "../utils/sleep";
import { calculateCrit } from "../utils/crit";

type FighterClass = "Puncher" | "CounterPuncher" | "Fighter" | string;
export interface Attack {
  name: string;
  staminaCost?: number;
  description: string;
  criticChance: number;
  classDamageModifiers?: Record<FighterClass, number>;
  targetClassDamageModifiers?: Record<FighterClass, number>;
  execute: (attacker: Fighter, target: Fighter) => Promise<void>;
}

async function applyClassModifiers(
  base: number,
  attacker: Fighter,
  target: Fighter,
  attack: Attack,
): Promise<number> {
  const attackerMod =
    attack.classDamageModifiers?.[attacker.getFighterClass()] ?? 1;
  const targetMod =
    attack.targetClassDamageModifiers?.[target.getFighterClass()] ?? 1;
  if (targetMod > 1) {
    await typeText(
      `It's super effective against ${target.getFighterClass()}s!\n`,
    );
  }
  return base * attackerMod * targetMod;
}

export const jab: Attack = {
  name: "Jab",
  staminaCost: 10,
  criticChance: 0.2,
  description: "A quick, powerful strike. *SPECIAL* Breaks opponent guard.\n",
  classDamageModifiers: {
    Puncher: 1.3,
  },
  execute: async (attacker, target) => {
    await typeText(`${attacker.name} jabs!\n`);
    attacker.breakGuard(target);
    let damage = await calculateCrit(
      10 * (attacker.getStrength() / 100 + 1),
      jab.criticChance,
    );
    damage = await applyClassModifiers(damage, attacker, target, jab);

    await typeText(
      `${attacker.name} jab gets through ${target.name}'s guard!\n`,
    );
    await target.receiveDamage(damage, target);
  },
};

export const strongCross: Attack = {
  name: "Strong Cross",
  staminaCost: 20,
  criticChance: 0.1,
  description: "A powerful right hand.\n",
  execute: async (attacker, target) => {
    await typeText(`${attacker.name} throws a strong cross!`);
    let damage = await calculateCrit(
      25 * (attacker.getStrength() / 100 + 1),
      strongCross.criticChance,
    );
    damage = await applyClassModifiers(damage, attacker, target, strongCross);
    await target.receiveDamage(damage, target);
  },
};

export const divineUppercut: Attack = {
  name: "Divine Uppercut",
  staminaCost: 30,
  criticChance: 0,
  description:
    "A god prayer that, if successful, will strike the opponent with divine power.*SPECIAL* Has a 0.1% chance to strike the opponent with divine power.",
  execute: async (attacker, target) => {
    await typeText(
      `${attacker.name} sends a punch to the sky! He seems to be waiting for something\n`,
    );
    await sleep(2000);

    if (Math.random() <= 0.001) {
      await typeText(`The sky starts turning black!\n`);
      await sleep(1000);
      await typeText(`A lightning strikes ${target.name}!!!!!!\n`);
      await sleep(1000);
      await target.receiveDamage(1000, target);
    } else {
      await typeText(`Nothing happens...\n`);
    }
  },
};

export const sabuesoKiller: Attack = {
  name: "Sabueso Killer",
  staminaCost: 30,
  criticChance: 0.1,
  description:
    "Baby tank's created this move during his first fight with Sabueso. If mastered, it is devastating against uncontrolled punchers. *SPECIAL* Super effective against punchers.\n",
  classDamageModifiers: {
    Puncher: 1.5,
  },
  targetClassDamageModifiers: {
    Puncher: 1.5,
  },
  execute: async (attacker, target) => {
    await typeText(`${attacker.name} rolls and throws the Sabueso Killer!`);
    let damage = await calculateCrit(
      15 * (attacker.getStrength() / 100 + 1),
      sabuesoKiller.criticChance,
    );
    damage = await applyClassModifiers(damage, attacker, target, sabuesoKiller);
    await target.receiveDamage(damage, target);
  },
};

export const rightOverhand: Attack = {
  name: "Right Overhand",
  staminaCost: 25,
  criticChance: 0.15,
  description:
    "A powerful right hand that takes counter punchers by surprise because it comes from who knows where. *SPECIAL* Super effective against counter punchers",
  classDamageModifiers: {
    Puncher: 1.5,
  },
  targetClassDamageModifiers: {
    CounterPuncher: 1.2,
  },
  execute: async (attacker, target) => {
    await typeText(`${attacker.name} throws a powerful right overhand!!!\n`);
    let damage = await calculateCrit(
      20 * (attacker.getStrength() / 100 + 1),
      rightOverhand.criticChance,
    );
    damage = await applyClassModifiers(damage, attacker, target, rightOverhand);
    await target.receiveDamage(damage, target);
  },
};

export const llamaLeftHook: Attack = {
  name: "Llama Left Hook",
  staminaCost: 20,
  criticChance: 0.5,
  description:
    "With this hook, peruvian fighters can invoque the llama powers, they enhance the probability of a critical hit.",
  execute: async (attacker, target) => {
    await typeText(`${attacker.name} throws a left hook!\n`);
    await sleep(2000);
    await typeText(`A llama sound vibrates the ring!!\n`);
    await sleep(1000);
    let damage = await calculateCrit(
      20 * (attacker.getStrength() / 100 + 1),
      llamaLeftHook.criticChance,
    );
    damage = await applyClassModifiers(damage, attacker, target, llamaLeftHook);
    await target.receiveDamage(damage, target);
  },
};
