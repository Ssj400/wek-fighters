import { Fighter } from './Fighter';
import chalk from 'chalk';
import { typeText } from '../utils/typeText';
import { promises } from 'dns';

export class CounterPuncher extends Fighter {
  counterIndex: number;

  constructor(name: string, health: number, strength: number, speed: number, blockFail: number = 0, isBlocking: boolean = false, counterIndex: number) {
    super(name, health, strength, speed, blockFail, isBlocking);
    this.counterIndex = counterIndex;
  }

   override async getStats(): Promise<void> {
      await typeText(chalk.bgGreen(`Statistics | fighter: ${this.name}, health: ${this.health}, strength: ${this.strength}, *SPECIAL* CounterIndex: ${this.counterIndex}, speed: ${this.speed}\n`));
    }


  override async receiveDamage(damage: number, oponent: Fighter): Promise<void> {
    this.health -= damage;
    await typeText(chalk.bgRed(`${this.name} has received ${damage} damage!\n`));

    if (Math.random() < this.counterIndex && this.health > 0) {
      await typeText(chalk.bgYellowBright.bold(`${this.name} has counter punched ${oponent.name}!\n`));
      await this.attack(oponent);
      this.counterIndex -= 0.1; 
    }
    if (this.health <= 0) {
      this.health = 0;
      await typeText(chalk.bgGray(`${this.name} has been defeated!\n`));
    } else {
      await typeText(chalk.bgGreen(`${this.name}'s health is now ${this.health}\n`));
    }
  }
}