import chalk from 'chalk';
import { Fighter } from './Fighter';
import { typeText } from '../utils/typeText.js';

export class Puncher extends Fighter {
  damageMultiplicator: number;

  constructor(name: string, health: number, strength: number, speed: number, blockFail: number = 0, isBlocking: boolean = false, damageMultiplicator: number) {
    super(name, health, strength, speed, blockFail, isBlocking);
    this.damageMultiplicator = damageMultiplicator;
  }

    override async getStats(): Promise<void> {
      await typeText(chalk.bgGreen(`Statistics | fighter: ${this.name}, health: ${this.health}, strength: ${this.strength}, *SPECIAL* Multiplicator: ${this.damageMultiplicator}, speed: ${this.speed}\n`));
    }

  override async attack(target: Fighter): Promise<void> {
    const damage = Math.floor(this.strength * (0.8 + Math.random() * 0.4)) * this.damageMultiplicator;
    await typeText(chalk.bgGray.bold(`${this.name} has attacked ${target.name}!\n`));
  this.isBlocking = false;

  if (target.isBlocking) {
      await typeText(chalk.bgGreen(`${target.name} successfully blocked the attack!\n`));
  } else {
    await typeText(chalk.bgRed(`${target.name} failed to block the attack!\n`));
    await target.receiveDamage(damage, this);
   }
  }
}
