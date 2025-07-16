import { Fighter } from "./Fighter";
import { Logger } from "../common/Logger";
import { FighterMoves } from "../types/types";
import { defaultValues } from "../common/defaultValues";
import { GameManager } from "../managers/GameManager";

export class CounterPuncher extends Fighter {
  private onCounterCallback?: () => void;
  logger: Logger;
  constructor(
    name: string,
    health: number,
    strength: number,
    speed: number,
    blockFail: number = defaultValues.common.blockFail,
    isBlocking: boolean = defaultValues.common.isBlocking,
    public counterIndex: number,
    rageSuceptibility: boolean = defaultValues.common.rageSuceptibility,
    vulnerabilityIndex: number = defaultValues.counterPuncher
      .vulnerabilityIndex,
  ) {
    super(
      name,
      health,
      strength,
      speed,
      blockFail,
      isBlocking,
      rageSuceptibility,
      vulnerabilityIndex,
    );
    this.logger = GameManager.getInstance().createLogger(this.name);
  }

  override getStats(): string {
    return `Statistics | fighter: ${this.name}, health: ${this.health}, strength: ${this.strength}, stamina: ${this.stamina} *SPECIAL* CounterIndex: ${this.counterIndex}, speed: ${this.speed}`;
  }

  override getFighterClass(): string {
    return "CounterPuncher";
  }

  override async receiveDamage(
    damage: number,
    oponent: Fighter,
  ): Promise<void> {
    if (this.isCurrentlyBlocking()) {
      await this.log(`${this.name} successfully blocked the attack!\n`);
      this.setLastMove(FighterMoves.BLOCK);
      if (this.onBlockCallback) this.onBlockCallback();
      return;
    } else if (await this.dodgeAttack()) {
      oponent.updateVulnerabilityIndex(0.05);
      oponent.updateStamina(-5);
      return;
    }

    if (this.stamina < 30) {
      await this.log(`${this.name} completely receives the attack! \n`);
      this.health -= Number(
        (damage * 1.2 * this.vulnerabilityIndex).toFixed(2),
      );
      this.lastDamage = Number(
        (damage * 1.2 * this.vulnerabilityIndex).toFixed(2),
      );
      await this.log(
        `${this.name} has received ${(damage * 1.2 * this.vulnerabilityIndex).toFixed(2)} damage!\n`,
      );
    } else {
      this.health -= Number((damage * this.vulnerabilityIndex).toFixed(2));
      this.lastDamage = Number((damage * this.vulnerabilityIndex).toFixed(2));
      await this.log(
        `${this.name} has received ${(damage * this.vulnerabilityIndex).toFixed(2)} damage!\n`,
      );
    }

    if (this.onDamageCallback) await this.onDamageCallback();

    if (
      Math.random() < this.counterIndex &&
      this.health > 0 &&
      this.stamina >= 20
    ) {
      await this.log(`${this.name} has counter punched ${oponent.name}!\n`);
      this.setLastMove(FighterMoves.ATTACK);
      if (this.onCounterCallback) this.onCounterCallback();
      await oponent.receiveDamage(
        Number((this.strength * 3 * this.vulnerabilityIndex).toFixed(2)),
        this,
      );
      this.counterIndex -= 0.1;
      this.stamina -= 10;
    }

    if (this.health <= 0) {
      this.health = 0;
      if (this.onDeathCallback) this.onDeathCallback();
      await this.log(`${this.name} has been defeated!\n`);
      return;
    } else {
      await this.log(
        `${this.name}'s health is now ${this.health.toFixed(2)}\n`,
      );
    }
  }

  protected override createInstance(): Fighter {
    return new CounterPuncher(
      this.name,
      this.health,
      this.strength,
      this.speed,
      this.blockFail,
      this.isBlocking,
      this.counterIndex,
      this.rageSuceptibility,
      this.vulnerabilityIndex,
    );
  }

  setOnCounterCallback(cb: () => void): void {
    this.onCounterCallback = cb;
  }
}
