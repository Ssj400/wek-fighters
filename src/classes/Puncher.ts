import chalk from 'chalk';
import { Fighter } from './Fighter';
import { typeText } from '../utils/typeText.js';

export class Puncher extends Fighter {
  damageMultiplicator: number;

  constructor(name: string, health: number, strength: number, speed: number, blockFail: number = 0, isBlocking: boolean = false, damageMultiplicator: number, rageSuceptibility: boolean = false) {
    super(name, health, strength, speed, blockFail, isBlocking, rageSuceptibility);
    this.damageMultiplicator = damageMultiplicator;
  }

  override async getStats(): Promise<void> {
    await typeText(chalk.bgGreen(`Statistics | fighter: ${this.name}, health: ${this.health}, strength: ${this.strength}, stamina: ${this.stamina} *SPECIAL* Multiplicator: ${this.damageMultiplicator}, speed: ${this.speed}\n`), 1);
  }

  override async attack(target: Fighter): Promise<void> {
  if (this.checkIfTired()) {
    await typeText(chalk.bgRed(`${this.name} does not have enough stamina to attack!\n`));
    return;
  } else if (this.rageMode()) {
      await typeText(chalk.bgRed(`${this.name} is getting angry and attacks with rage!\n`));
      this.rageSuceptibility = false;
      await typeText(chalk.bgRed.bold(`${this.name} attacks ${target.name} two times because of his lack of control!\n`));
      await this.attack(target);
      await this.attack(target);
      this.stamina = 0;
      await typeText(chalk.bgRed.bold(`${this.name} is getting tired after rage!\n`));
      return;
  } 
    this.stamina -= 10; 
    const damage = (Math.floor(this.strength / 3 + this.stamina / 10  * (0.8 + Math.random() * 0.4)) * this.damageMultiplicator);
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
