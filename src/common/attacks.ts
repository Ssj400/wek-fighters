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

async function baseDamage(
  attack: Attack,
  attacker: Fighter,
  basePower: number,
): Promise<number> {
  return await calculateCrit(
    basePower * (attacker.getStrength() / 100 + 1),
    attack.criticChance,
  );
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
    let damage = await baseDamage(jab, attacker, 10);
    damage = await applyClassModifiers(damage, attacker, target, jab);

    await typeText(
      `${attacker.name} jab gets through ${target.name}'s guard!\n`,
    );
    await target.receiveDamage(damage, attacker);
    target.updateVulnerabilityIndex(0.07);
  },
};

export const strongCross: Attack = {
  name: "Strong Cross",
  staminaCost: 20,
  criticChance: 0.1,
  description: "A powerful right hand.\n",
  execute: async (attacker, target) => {
    await typeText(`${attacker.name} throws a strong cross!`);
    let damage = await baseDamage(strongCross, attacker, 20);
    damage = await applyClassModifiers(damage, attacker, target, strongCross);
    await target.receiveDamage(damage, attacker);
    target.updateVulnerabilityIndex(0.09);
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
      await target.receiveDamage(1000, attacker);
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
    let damage = await baseDamage(sabuesoKiller, attacker, 15);
    damage = await applyClassModifiers(damage, attacker, target, sabuesoKiller);
    await target.receiveDamage(damage, attacker);
    target.updateVulnerabilityIndex(0.07);
  },
};

export const rightOverhand: Attack = {
  name: "Right Overhand",
  staminaCost: 25,
  criticChance: 0.15,
  description:
    "A powerful right hand that takes counter punchers by surprise because it comes from who knows where, on the other hand, it lets you vulnerable after throwing it. *SPECIAL* Super effective against counter punchers",
  classDamageModifiers: {
    Puncher: 1.5,
  },
  targetClassDamageModifiers: {
    CounterPuncher: 1.2,
  },
  execute: async (attacker, target) => {
    await typeText(`${attacker.name} throws a powerful right overhand!!!\n`);
    let damage = await baseDamage(rightOverhand, attacker, 20);
    damage = await applyClassModifiers(damage, attacker, target, rightOverhand);
    await target.receiveDamage(damage, attacker);
    target.updateVulnerabilityIndex(0.3);
  },
};

export const llamaLeftHook: Attack = {
  name: "Llama Left Hook",
  staminaCost: 20,
  criticChance: 0.3,
  description:
    "With this hook, peruvian fighters can invoque the llama powers, they enhance the probability of a critical hit.",
  execute: async (attacker, target) => {
    await typeText(`${attacker.name} throws a left hook!\n`);
    await sleep(2000);
    await typeText(`A llama sound vibrates the ring!!\n`);
    await sleep(1000);
    let damage = await baseDamage(llamaLeftHook, attacker, 20);
    damage = await applyClassModifiers(damage, attacker, target, llamaLeftHook);
    await target.receiveDamage(damage, attacker);
    target.updateVulnerabilityIndex(0.05);
  },
};
