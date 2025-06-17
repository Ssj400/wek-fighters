import { CounterPuncher } from "../classes/CounterPuncher";
import { Fighter } from "../classes/Fighter";
import { typeText } from "../utils/typeText";
import { sleep } from "../utils/sleep";
import { Puncher } from "../classes/Puncher";
import { calculateCrit } from "../utils/crit";

export interface Attack {
    name: string;
    staminaCost?: number;
    description: string;
    criticChance: number;
    execute: (attacker: Fighter, target: Fighter) => Promise<void>;
}

export const jab: Attack = {
        name: "Jab",
        staminaCost: 10,
        criticChance: 0.2,
        description: "A quick, powerful strike. *SPECIAL* Breaks opponent guard.\n",
        execute: async (attacker, target) => {
        await typeText(`${attacker.name} jabs!\n`);
        attacker.breakGuard(target);
        let damage = await calculateCrit(10, jab.criticChance)
       
        await typeText(`${attacker.name} jab gets through ${target.name}'s guard!\n`);
        await target.receiveDamage(damage, attacker);
    }
}

export const strongCross: Attack = {
    name: "Strong Cross",
    staminaCost: 20,
    criticChance: 0.1,
    description: "A powerful right hand.\n",
    execute: async (attacker, target) => {
        await typeText(`${attacker.name} throws a strong cross!`);
         let damage = await calculateCrit(25, strongCross.criticChance);
        await target.receiveDamage(damage, attacker);
    }
}

export const divineUppercut: Attack = {
    name: "Divine Uppercut",
    staminaCost: 30,
    criticChance: 0,
    description: "A god prayer that, if successful, will strike the opponent with divine power.*SPECIAL* Has a 0.1% chance to strike the opponent with divine power.",
    execute: async (attacker, target) => {
        await typeText(`${attacker.name} sends a punch to the sky! He seems to be waiting for something\n`);
        await sleep(2000)

        if (Math.random() <= 0.001) {
            await typeText(`The sky starts turning black!\n`);
            await sleep(1000);
            await typeText(`A lightning strikes ${target.name}!!!!!!\n`);
            await sleep(1000);
            await target.receiveDamage(1000, attacker);
        } else {
            await typeText(`Nothing happens...\n`);
        } 
    }
}

export const sabuesoKiller: Attack = {
    name: "Sabueso Killer",
    staminaCost: 30,
    criticChance: 0.1,
    description: "Baby tank's created this move during his first fight with Sabueso. If mastered, it is devastating against uncontrolled punchers. *SPECIAL* Super effective against punchers.\n",
    execute: async (attacker, target) => {
        await typeText(`${attacker.name} rolls and throws the Sabueso Killer!`);

        let damage = await calculateCrit(10, sabuesoKiller.criticChance)

        if (target instanceof Puncher) {
            await typeText(`${target.name} is a puncher, the attack is super effective!\n`);
            await target.receiveDamage(damage + 15, attacker);
        } else {
            await target.receiveDamage(damage, attacker);
        }
    }
}

export const rightOverhand: Attack = {
    name: "Right Overhand",
    staminaCost: 25,
    criticChance: 0.15,
    description: "A powerful right hand that takes counter punchers by surprise because it comes from who knows where. *SPECIAL* Super effective against counter punchers",
    execute: async (attacker, target) => {
        await typeText(`${attacker.name} throws a powerful right overhand!!!\n`);
        let damage = await calculateCrit(30, rightOverhand.criticChance)
        if (target instanceof CounterPuncher) {
            await typeText(`${target.name} is a Counter Puncher, the attack is super efective!\n`);
            await target.receiveDamage(damage + 15, attacker);
        } else {
            await target.receiveDamage(damage, attacker);
        }
    }
}

export const llamaLeftHook: Attack = {
    name: "Llama Left Hook",
    staminaCost: 20,
    criticChance: 0.5,
    description: "With this hook, peruvian fighters can invoque the llama powers, they enhance the probability of a critical hit.",
    execute: async (attacker, target) => {
        await typeText(`${attacker.name} throws a left hook!\n`);
        await sleep(2000);
        await typeText(`A llama sound vibrates the ring!!\n`);
        await sleep(1000);
        let damage = await calculateCrit(20, llamaLeftHook.criticChance);
        await target.receiveDamage(damage, attacker);
    }
}