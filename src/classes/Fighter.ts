import { Logger } from "../common/Logger";
import type { Attack } from "../common/attacks";
import { validateLife } from "../logic/validateLife";
import { FighterMoves } from "../types/types";
import { defaultValues } from "../common/defaultValues";

export class Fighter {
  public readonly name: string;
  protected health: number;
  protected strength: number;
  protected speed: number;
  protected stamina: number;
  protected blockFail: number;
  protected isBlocking: boolean;
  protected rageSuceptibility: boolean;
  protected attacks: Record<string, Attack> = {};
  protected vulnerabilityIndex: number;
  protected dodgePotenciator: number = 0;
  protected logger: Logger;
  protected onDamageCallback?: () => Promise<void>;
  protected onDeathCallback?: () => void;
  protected onDodgeCallback?: () => void;
  protected onBlockCallback?: () => void;
  protected lastDamage: number = 0;
  private lastMove: FighterMoves = FighterMoves.NONE;

  constructor(
    name: string,
    health: number,
    strength: number,
    speed: number,
    blockFail: number = defaultValues.common.blockFail,
    isBlocking: boolean = defaultValues.common.isBlocking,
    rageSuceptibility: boolean = defaultValues.common.rageSuceptibility,
    vulnerabilityIndex: number = defaultValues.fighter.vulnerabilityIndex,
    logger: Logger,
  ) {
    this.name = name;
    this.health = health;
    this.strength = strength;
    this.speed = speed;
    this.blockFail = blockFail;
    this.isBlocking = isBlocking;
    this.stamina = 100;
    this.rageSuceptibility = rageSuceptibility;
    this.vulnerabilityIndex = vulnerabilityIndex;
    this.logger = logger;
  }

  getStats(): string {
    return `${this.name} | Health: ${this.health} Strength: ${this.strength} Speed: ${this.speed} Stamina: ${this.stamina}`;
  }

  getMenuStats(): string {
    return `Strength: ${this.strength}\nSpeed: ${this.speed}`;
  }

  getHud(): string {
    return `${this.name}\nHealth: ${this.health.toFixed(2)}\nStamina: ${this.stamina}`;
  }

  setAttack(attacks: Record<string, Attack>): void {
    this.attacks = attacks;
  }

  async useAttack(name: string, target: Fighter): Promise<void> {
    const attack = this.attacks?.[name];
    if (!attack) {
      await this.log(`${this.name} does not know an attack called "${name}"!`);
      return;
    }

    if (attack.staminaCost && this.stamina < attack.staminaCost) {
      await this.log(
        `${this.name} does not have enough stamina to use "${attack.name}"!`,
      );
      return;
    }

    if (this.rageMode()) {
      await this.log(`${this.name} is getting angry and attacks with rage!`);
      this.rageSuceptibility = false;
      await this.log(
        `${this.name} attacks ${target.name} two times because of his lack of control!`,
      );
      await this.useAttack(name, target);
      if (!validateLife(this)) return;
      await this.useAttack(name, target);
      if (!validateLife(this)) return;
      this.stamina = 0;
      await this.log(`${this.name} is getting tired after rage!`);

      return;
    }

    if (attack.staminaCost)
      this.stamina = Math.max(this.stamina - attack.staminaCost, 0);
    await attack.execute(this, target);
    this.setLastMove(FighterMoves.ATTACK);
    this.isBlocking = false;
  }

  getAttackNames(): Attack[] {
    return Object.values(this.attacks);
  }

  getStrength(): number {
    return this.strength;
  }

  async increaseDodgePotenciator(amount: number): Promise<void> {
    this.dodgePotenciator += amount / 10;
    if (this.dodgePotenciator > 0.3) {
      this.dodgePotenciator = 0.3;
      await this.log(`${this.name} cannot increase evasion anymore!`);
      return;
    }

    await this.log(`${this.name} increases his evasion!`);
    return;
  }

  async receiveDamage(damage: number, oponent: Fighter): Promise<void> {
    if (this.isCurrentlyBlocking()) {
      await this.log(`${this.name} successfully blocked the attack!`);
      this.setLastMove(FighterMoves.BLOCK);
      if (this.onBlockCallback) this.onBlockCallback();
      return;
    } else if (await this.dodgeAttack(this.dodgePotenciator)) {
      oponent.updateVulnerabilityIndex(0.05);
      oponent.updateStamina(-5);
      return;
    }
    await this.log(`${this.name} failed to block the attack!`);

    if (this.stamina < 30) {
      await this.log(`${this.name} completely receives the attack! `);
      this.health -= Number(
        (damage * this.vulnerabilityIndex * 1.2).toFixed(2),
      );
      this.lastDamage = Number(
        (damage * this.vulnerabilityIndex * 1.2).toFixed(2),
      );
      await this.log(
        `${this.name} has received ${(damage * 1.2 * this.vulnerabilityIndex).toFixed(2)} damage!`,
      );
    } else {
      this.health -= Number((damage * this.vulnerabilityIndex).toFixed(2));
      this.lastDamage = Number((damage * this.vulnerabilityIndex).toFixed(2));
      await this.log(
        `${this.name} has received ${(damage * this.vulnerabilityIndex).toFixed(2)} damage!`,
      );
    }

    if (this.onDamageCallback) await this.onDamageCallback();

    if (this.health <= 0) {
      this.health = 0;
      if (this.onDeathCallback) this.onDeathCallback();
      await this.log(`${this.name} has been defeated!`);
      return;
    } else {
      await this.log(`${this.name}'s health is now ${this.health.toFixed(2)}`);
    }
  }

  async block(): Promise<void> {
    const blockChance = Math.random();
    await this.log(`${this.name} covers!`);
    this.setLastMove(FighterMoves.BLOCK);
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
    if (this.health < 100)
      this.health = Math.min(this.health + recoveryAmount, 100);
    if (this.stamina < 100) this.stamina = Math.min(this.stamina + 10, 100);
    await this.log(`${this.name} has recovered health and stamina!`);
    this.setLastMove(FighterMoves.RECOVER);
    if (this.health > 100) this.health = 100;
    if (this.stamina > 100) this.stamina = 100;
  }

  async recoverStamina(): Promise<void> {
    const recoveryAmount = Math.floor(Math.random() * 7) + 3;
    if (this.stamina < 100)
      this.stamina = Math.min(this.stamina + recoveryAmount, 100);
    await this.log(`${this.name} has recovered ${recoveryAmount} stamina!`);
    if (this.stamina > 100) {
      this.stamina = 100;
    }
  }

  async dodgeAttack(chancePotenciator: number = 0): Promise<boolean> {
    const fatiguePenalty = this.stamina < 20 ? -0.3 : 0;
    const chance =
      Math.min(0.6, this.speed / 200 + fatiguePenalty) + chancePotenciator;
    if (Math.random() < chance) {
      await this.log(`${this.name} dodged the attack!!!`);
      if (this.onDodgeCallback) this.onDodgeCallback();
      this.setLastMove(FighterMoves.DODGE);
      return true;
    }
    return false;
  }

  updateStamina(update: number): void {
    this.stamina += update;
    return;
  }

  getHealth(): number {
    return Math.max(this.health, 0);
  }

  increaseHealth(amount: number): void {
    this.health = Math.min(this.health + amount, 100);
    if (this.health > 100) this.health = 100;
  }

  getSpeed(): number {
    return this.speed;
  }

  getBlockFail(): number {
    return this.blockFail;
  }

  getDodgePotenciator(): number {
    return this.dodgePotenciator;
  }

  checkIfTired(): boolean {
    return this.stamina <= 15;
  }

  rageMode(): boolean {
    return this.health <= 30 && this.stamina > 20 && this.rageSuceptibility;
  }

  isCurrentlyBlocking(): boolean {
    return this.isBlocking;
  }

  breakGuard(target: Fighter): void {
    target.isBlocking = false;
  }

  getFighterClass(): string {
    return "Fighter";
  }

  updateVulnerabilityIndex(sum: number): void {
    this.vulnerabilityIndex += sum;
  }

  log(msg: string): Promise<void> {
    return this.logger.info(msg);
  }

  setLogger(logger: Logger): void {
    this.logger = logger;
  }

  getLogger(): Logger {
    return this.logger;
  }

  setStamina(stamina: number): void {
    this.stamina = Math.max(0, Math.min(stamina, 100));
    if (this.stamina > 100) this.stamina = 100;
    if (this.stamina < 0) this.stamina = 0;
  }

  clone(): Fighter {
    const clone = this.createInstance();
    clone.setAttack(
      Object.fromEntries(
        Object.entries(this.attacks).map(([k, v]) => [k, { ...v }]),
      ),
    );

    return clone;
  }

  getStamina(): number {
    return this.stamina;
  }

  setOnDamageCallback(cb: () => Promise<void>) {
    this.onDamageCallback = cb;
  }

  setOnDeathCallback(cb: () => void) {
    this.onDeathCallback = cb;
  }

  setOnDodgeCallback(cb: () => void) {
    this.onDodgeCallback = cb;
  }

  setOnBlockCallback(cb: () => void) {
    this.onBlockCallback = cb;
  }

  getLastMove(): FighterMoves {
    return this.lastMove;
  }

  setLastMove(move: FighterMoves): void {
    this.lastMove = move;
  }

  protected createInstance(): Fighter {
    return new Fighter(
      this.name,
      this.health,
      this.strength,
      this.speed,
      this.blockFail,
      this.isBlocking,
      this.rageSuceptibility,
      this.vulnerabilityIndex,
      this.logger,
    );
  }

  getLastDamage(): number {
    return this.lastDamage;
  }
}
