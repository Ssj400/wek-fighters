import { Fighter } from "../classes/Fighter";
import { calculateCrit } from "../utils/crit";
import { OutBoxer } from "../classes/OutBoxer";

type FighterClass =
  | "Puncher"
  | "CounterPuncher"
  | "Fighter"
  | "OutBoxer"
  | string;

export interface Attack {
  name: string;
  staminaCost: number;
  description: string;
  basePower: number;
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
    attacker.log(`It's super effective against ${target.getFighterClass()}s!`);
  }
  return base * attackerMod * targetMod;
}

async function baseDamage(
  attack: Attack,
  attacker: Fighter,
  basePower: number,
): Promise<number> {
  if (attacker instanceof OutBoxer && (await attacker.checkDistanceControl())) {
    basePower *= 2;
  }
  const newDamage = await calculateCrit(
    attacker,
    basePower * (attacker.getStrength() / 100 + 1),
    attack.criticChance,
  );
  if (newDamage > basePower * (attacker.getStrength() / 100 + 1)) {
    await attacker.log(`A critical hit!`);
  }
  return newDamage;
}

export const jab: Attack = {
  name: "Jab",
  staminaCost: 10,
  basePower: 10,
  criticChance: 0.2,
  description: "A quick, powerful strike.\n*SPECIAL* Breaks opponent\nguard.",
  classDamageModifiers: {
    Puncher: 1.3,
  },
  execute: async (attacker, target) => {
    if (attacker instanceof OutBoxer) attacker.jabCount++;
    attacker.breakGuard(target);
    await attacker.log(`${attacker.name} jabs!`);
    await attacker.log(
      `${attacker.name} jab gets through ${target.name}'s guard!`,
    );
    let damage = await baseDamage(jab, attacker, jab.basePower);
    damage = await applyClassModifiers(damage, attacker, target, jab);

    await target.receiveDamage(damage, attacker);
    target.updateVulnerabilityIndex(0.07);
  },
};

export const cross: Attack = {
  name: "Cross",
  staminaCost: 20,
  basePower: 20,
  criticChance: 0.1,
  description: "A powerful right hand.",
  execute: async (attacker, target) => {
    await attacker.log(`${attacker.name} throws a cross!`);
    let damage = await baseDamage(cross, attacker, cross.basePower);
    damage = await applyClassModifiers(damage, attacker, target, cross);
    await target.receiveDamage(damage, attacker);
    target.updateVulnerabilityIndex(0.09);
  },
};

export const divineUppercut: Attack = {
  name: "Divine Uppercut",
  staminaCost: 30,
  basePower: 0,
  criticChance: 0,
  description:
    "A god prayer that,\nif successful, will strike\nthe opponent with divine\npower.*SPECIAL* Has a 0.1%\nchance to strike the\nopponent with divine power.",
  execute: async (attacker, target) => {
    await attacker.log(
      `${attacker.name} sends a punch to the sky! He seems to be waiting for something`,
    );

    if (Math.random() <= 0.01) {
      await attacker.log(`The sky starts turning black!`);
      await attacker.log(`A lightning strikes ${target.name}!!!!!!`);
      await target.receiveDamage(divineUppercut.basePower + 1000, attacker);
    } else {
      await attacker.log(`Nothing happens...`);
    }
  },
};

export const sabuesoKiller: Attack = {
  name: "Sabueso Killer",
  staminaCost: 30,
  basePower: 15,
  criticChance: 0.1,
  description:
    "Baby tank created this\nmove during his first\nfight with Sabueso. If\nmastered, it is devastating\nagainst uncontrolled punchers. *SPECIAL*\nSuper effective against punchers.",
  classDamageModifiers: {
    Puncher: 1.5,
  },
  targetClassDamageModifiers: {
    Puncher: 1.5,
  },
  execute: async (attacker, target) => {
    await attacker.log(`${attacker.name} rolls and throws the Sabueso Killer!`);
    let damage = await baseDamage(
      sabuesoKiller,
      attacker,
      sabuesoKiller.basePower,
    );
    damage = await applyClassModifiers(damage, attacker, target, sabuesoKiller);
    await target.receiveDamage(damage, attacker);
    target.updateVulnerabilityIndex(0.07);
  },
};

export const rightOverhand: Attack = {
  name: "Right Overhand",
  staminaCost: 50,
  basePower: 20,
  criticChance: 0.15,
  description:
    "A powerful right hand\nthat takes counter punchers\nby surprise because it\ncomes from who knows\nwhere, on the other\nhand, it lets you\nvulnerable after throwing\nit. *SPECIAL* Super effective\nagainst counter punchers",
  classDamageModifiers: {
    Puncher: 1.5,
  },
  targetClassDamageModifiers: {
    CounterPuncher: 1.2,
  },
  execute: async (attacker, target) => {
    await attacker.log(`${attacker.name} throws a powerful right overhand!!!`);
    let damage = await baseDamage(
      rightOverhand,
      attacker,
      rightOverhand.basePower,
    );
    damage = await applyClassModifiers(damage, attacker, target, rightOverhand);
    await target.receiveDamage(damage, attacker);
    target.updateVulnerabilityIndex(0.3);
  },
};

export const llamaLeftHook: Attack = {
  name: "Llama left hook",
  staminaCost: 20,
  basePower: 20,
  criticChance: 0.3,
  description:
    "With this hook,\nperuvian fighters can invoque\nthe llama powers,\nthey enhance the probability\nof a critical hit.",
  execute: async (attacker, target) => {
    await attacker.log(`${attacker.name} throws a left hook!`);
    await attacker.log(`A llama sound vibrates the ring!!`);
    let damage = await baseDamage(
      llamaLeftHook,
      attacker,
      llamaLeftHook.basePower,
    );
    damage = await applyClassModifiers(damage, attacker, target, llamaLeftHook);
    await target.receiveDamage(damage, attacker);
    target.updateVulnerabilityIndex(0.05);
  },
};

export const bunnyHop: Attack = {
  name: "Bunny Hop",
  staminaCost: 20,
  basePower: 0,
  criticChance: 0,
  description:
    "A defensive move that\nallows the fighter to increase\ndodge capabilities and and recover some\nhealth.\n*SPECIAL* If successful,\nrecovers some health points.",
  execute: async (attacker, _target) => {
    await attacker.log(`${attacker.name} hops like a bunny!`);
    await attacker.increaseDodgePotenciator(2);
    attacker.increaseHealth(5);
    attacker.updateVulnerabilityIndex(0.1);
  },
};

export const lastResource: Attack = {
  name: "Last Resource",
  staminaCost: 0,
  basePower: 10,
  criticChance: 0.1,
  description:
    "The more desperate are your conditions, the more damage it deals (Leaves you with 0 stamina)",
  execute: async (attacker, target) => {
    await attacker.log(`${attacker.name} uses his last resource!`);
    await attacker.setStamina(0);
    if (attacker.getHealth() > 50) {
      await attacker.log(
        `${attacker.name} is not desperate enough to use this move!`,
      );
      return;
    } else if (attacker.getHealth() > 20) {
      await attacker.log(`${attacker.name} is a little desperate!`);
      attacker.updateVulnerabilityIndex(-0.2);
      await target.receiveDamage(
        lastResource.basePower + attacker.getStrength(),
        attacker,
      );
    } else if (attacker.getHealth() > 5) {
      await attacker.log(`${attacker.name} is desperate!`);
      attacker.updateVulnerabilityIndex(-0.3);
      await target.receiveDamage(
        (lastResource.basePower + attacker.getStrength()) * 1.2,
        attacker,
      );
    } else {
      await attacker.log(
        `Anything matters anymore for ${attacker.name}! He is completely desperate!`,
      );
      attacker.updateVulnerabilityIndex(-0.4);
      await target.receiveDamage(
        (lastResource.basePower + attacker.getStrength()) * 1.6,
        attacker,
      );
    }
  },
};

export const swarm: Attack = {
  name: "Swarm",
  basePower: 20,
  criticChance: 0,
  description:
    "A series of punches that\ncan overwhelm the opponent.\n*SPECIAL* Throws between one and 4 punches.",
  staminaCost: 30,
  execute: async (attacker, target) => {
    await attacker.log(`${attacker.name} throws a lot of punches`);
    const damage = await baseDamage(swarm, attacker, swarm.basePower);
    const amount = Math.floor(Math.random() * 3);
    await attacker.log(`${attacker.name} throws ${amount} punches!`);
    for (let i = 4 - amount; i < 4; i++) {
      await target.receiveDamage(damage, attacker);
    }
    target.updateVulnerabilityIndex(0.05);
  },
};
