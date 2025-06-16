import chalk from "chalk";
import { typeText } from "../utils/typeText.js";

export class Fighter {
  name: string;
  health: number;
  strength: number;
  speed: number;
  blockFail: number;
  isBlocking: boolean;
  constructor(name: string, health: number, strength: number, speed: number, blockFail: number = 0, isBlocking: boolean = false) {
    this.name = name;
    this.health = health;
    this.strength = strength;
    this.speed = speed; 
    this.blockFail = blockFail;
    this.isBlocking = isBlocking;
  }

  async getStats(): Promise<void> {
    await typeText(chalk.bgGreen(`Statistics | fighter: ${this.name}, health: ${this.health}, strength: ${this.strength} speed: ${this.speed} \n`));
  }

  async attack(target: Fighter): Promise<void> {
  const damage = Math.floor(this.strength * (0.8 + Math.random() * 0.4));
  await typeText(chalk.bgBlue.bold(`${this.name} has attacked ${target.name}!\n`));
  this.isBlocking = false; 

  if (target.isBlocking) {
    await typeText(chalk.bgGreen(`${target.name} successfully blocked the attack!\n`));
  } else {
    await typeText(chalk.bgRed(`${target.name} failed to block the attack!\n`));
    await target.receiveDamage(damage, this);
  }
}

  async receiveDamage(damage: number, oponent: Fighter): Promise<void> {
    this.health -= damage;
    await typeText(chalk.bgRed(`${this.name} has received ${damage} damage!\n`));

    if (this.health <= 0) {
      this.health = 0;
      await typeText(chalk.bgGray(`${this.name} has been defeated!\n`));
    } else {
      await typeText(chalk.bgGreen(`${this.name}'s health is now ${this.health}\n`));
    }
  }
  async block(): Promise<void> {
    const blockChance = Math.random();
    await typeText(chalk.bgYellow(`${this.name} covers!\n`));
    if (blockChance > this.blockFail) {
      this.isBlocking = true;
    } else {
      this.isBlocking = false;
    }
    this.blockFail += 0.2;
  }
}