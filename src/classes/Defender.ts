import { Fighter } from "./Fighter";
import chalk from "chalk";
import { typeText } from "../utils/typeText";

export class Defender extends Fighter {
  defense: number;

  constructor(name: string, health: number, strength: number, speed: number, blockFail: number = 0, isBlocking: boolean = false, defense: number,) {
    super(name, health, strength, speed, blockFail, isBlocking);
    this.defense = defense;
  }
  override async getStats(): Promise<void> {
    await typeText(chalk.bgGreen(`Statistics | fighter: ${this.name}, health: ${this.health}, strength: ${this.strength}, *SPECIAL* defense: ${this.defense}, speed: ${this.speed}\n`));
    }

  override async receiveDamage(damage: number, oponent: Fighter): Promise<void> {
    const reducedDamage = Math.max(0, damage - this.defense);
    this.defense = Math.max(0, this.defense - Math.floor(this.defense * 0.2));
    this.health -= reducedDamage;
    await typeText(chalk.bgMagenta(`${this.name} has received ${reducedDamage} damage after defense!\n`));
    await typeText(chalk.bgCyanBright(`${this.name}'s defense is now ${this.defense}\n`));

    if (this.health <= 0) {
      this.health = 0;
      await typeText(chalk.bgGray(`${this.name} has been defeated!\n`));
    } else {
      await typeText(chalk.bgGreen(`${this.name}'s health is now ${this.health}\n`));
    }
  }
}