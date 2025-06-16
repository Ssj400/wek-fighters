import { Fighter } from "./Fighter";
import chalk from "chalk";
import { typeText } from "../utils/typeText";

export class Defender extends Fighter {
  defense: number;

  constructor(name: string, health: number, strength: number, speed: number, stamina: number, blockFail: number = 0, isBlocking: boolean = false, defense: number,) {
    super(name, health, strength, speed, blockFail, stamina, isBlocking);
    this.defense = defense;
  }
  override async getStats(): Promise<void> {
    await typeText(chalk.bgGreen(`Statistics | fighter: ${this.name}, health: ${this.health}, strength: ${this.strength}, stamina: ${this.stamina} *SPECIAL* defense: ${this.defense}, speed: ${this.speed}\n`), 1);
    }

  override async receiveDamage(damage: number, oponent: Fighter): Promise<void> {
    if (this.stamina < 30) {
      await typeText(chalk.bgRed(`${this.name} completely receives the attack! \n`));
      this.health -= damage * 1.2;
    } else {
      const reducedDamage = Math.max(0, damage - this.defense);
      this.defense = Math.max(0, this.defense - Math.floor(this.defense * 0.2));
      this.health -= reducedDamage;
      await typeText(chalk.bgMagenta(`${this.name} has received ${reducedDamage} damage after defense!\n`));
      await typeText(chalk.bgCyanBright(`${this.name}'s defense is now ${this.defense}\n`));
      this.stamina -= 10; 
    }
    
    if (this.health <= 0) {
      this.health = 0;
      await typeText(chalk.bgGray(`${this.name} has been defeated!\n`));
    } else {
      await typeText(chalk.bgGreen(`${this.name}'s health is now ${this.health}\n`));
    }
  }
}