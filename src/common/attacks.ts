import { CounterPuncher } from "../classes/CounterPuncher";
import { Fighter } from "../classes/Fighter";
import { typeText } from "../utils/typeText";
import { sleep } from "../utils/sleep";

export interface Attack {
    name: string;
    staminaCost?: number;
    execute: (attacker: Fighter, target: Fighter) => Promise<void>;
}

export const jab: Attack = {
        name: "jab",
        staminaCost: 10,
        execute: async (attacker, target) => {
        const damage = 10;
        await typeText(`${attacker.name} jabs!`);
        await target.receiveDamage(damage, attacker);
    }
}

export const strongCross: Attack = {
    name: "Strong Cross",
    staminaCost: 20,
    execute: async (attacker, target) => {
        const damage = 25;
        await typeText(`${attacker.name} throws a strong cross!`);
        await target.receiveDamage(damage, attacker);
    }
}

export const divineUppercut: Attack = {
    name: "Divine Uppercut",
    staminaCost: 30,
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