import { typeText } from "./typeText";

export async function calculateCrit (baseDamage: number, chance: number): Promise<number> {
    if (Math.random() < chance) {
        await typeText(`A critical hit!!\n`)
        return baseDamage * 2;
    } else {
        return baseDamage;
    }
}