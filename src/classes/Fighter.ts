import chalk from "chalk";
import { typeText } from "../utils/typeText.js";

export class Fighter {
  name: string;
  health: number;
  strength: number;
  speed: number;
  stamina: number;
  blockFail: number;
  isBlocking: boolean;
  constructor(name: string, health: number, strength: number, speed: number, stamina: number, blockFail: number = 0, isBlocking: boolean = false) {
    this.name = name;
    this.health = health;
    this.strength = strength;
    this.speed = speed; 
    this.blockFail = blockFail;
    this.isBlocking = isBlocking;
    this.stamina = 100;
  }

  async getStats(): Promise<void> {
    await typeText(chalk.bgGreen(`Statistics | fighter: ${this.name}, health: ${this.health}, strength: ${this.strength} speed: ${this.speed} stamina: ${this.stamina}\n`), 1);
  }

  async attack(target: Fighter): Promise<void> {
    if (this.stamina < 10) {
      await typeText(chalk.bgRed(`${this.name} does not have enough stamina to attack!\n`));
      return;
    } 
    const damage = Math.floor(this.strength / 2 + this.stamina / 5 * (0.8 + Math.random() * 0.4));

    await typeText(chalk.bgBlue.bold(`${this.name} has attacked ${target.name}!\n`));

    this.isBlocking = false; 
    this.stamina -= 10; 

    if (target.isBlocking) {
     await typeText(chalk.bgGreen(`${target.name} successfully blocked the attack!\n`));
    } else {
     await typeText(chalk.bgRed(`${target.name} failed to block the attack!\n`));
      await target.receiveDamage(damage, this);
    }
}

  async receiveDamage(damage: number, oponent: Fighter): Promise<void> {
    if (this.stamina < 30) {
      await typeText(chalk.bgRed(`${this.name} completely receives the attack! \n`));
      this.health -= damage * 1.2;
    } else {
      this.health -= damage;
      await typeText(chalk.bgRed(`${this.name} has received ${damage} damage!\n`));
    }
    
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
    this.stamina -= 5; 
    if (blockChance > this.blockFail) {
      this.isBlocking = true;
    } else {
      this.isBlocking = false;
    }
    this.blockFail += 0.2;
  }

  async recoverHealth(): Promise<void> {
    const recoveryAmount = Math.floor(Math.random() * 20) + 10; 
    this.health += recoveryAmount;
    this.stamina += 10; 
    await typeText(chalk.bgCyan(`${this.name} has recovered ${recoveryAmount} health and gained 10 stamina!\n`));
    if (this.health > 100) {
      this.health = 100; 
    } else if (this.stamina > 100) {
      this.stamina = 100; 
    }
  }

  async recoverStamina(): Promise<void> {
    const recoveryAmount = Math.floor(Math.random() * 7) + 10; 
    this.stamina += recoveryAmount;
    await typeText(chalk.bgMagenta(`${this.name} has recovered ${recoveryAmount} stamina!\n`));
    if (this.stamina > 100) {
      this.stamina = 100; 
    }
  }
}