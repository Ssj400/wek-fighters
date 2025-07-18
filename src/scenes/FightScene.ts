import Phaser from "phaser";
import { Fighter } from "../classes/Fighter";
import { fight } from "../logic/fight";
import { playerTurn } from "../logic/playerTurn";
import { CounterPuncher } from "../classes/CounterPuncher";
import { addMuteButton, addFullScreenButton } from "../common/uiHelpers";
import { playSound } from "../common/sound";
import type { Difficulty, FightSceneData } from "../types/types";
import { GameManager } from "../managers/GameManager";

export class FightScene extends Phaser.Scene {
  private fightMessages: string[] = [];
  private currentMessageIndex: number = 0;
  private fightText!: Phaser.GameObjects.Text;
  private messageQueue: { message: string; resolve: () => void }[] = [];
  private isShowingMessage = false;
  private isWaitingForInput = false;
  private pendingActionResolve?: () => void;
  private continueArrow!: Phaser.GameObjects.Text;
  private player!: Fighter;
  private opponent!: Fighter;
  private difficulty!: Difficulty;
  private playerHealthBar!: Phaser.GameObjects.Graphics;
  private opponentHealthBar!: Phaser.GameObjects.Graphics;
  private playerDisplayedHealth: number = 100;
  private opponentDisplayedHealth: number = 100;
  private playerStaminaBar!: Phaser.GameObjects.Graphics;
  private opponentStaminaBar!: Phaser.GameObjects.Graphics;
  private playerStaminaDisplayed: number = 100;
  private opponentStaminaDisplayed: number = 100;
  private playerHudText!: Phaser.GameObjects.Text;
  private opponentHudText!: Phaser.GameObjects.Text;
  private initialData!: FightSceneData;
  public playerSprite!: Phaser.GameObjects.Image;
  public opponentSprite!: Phaser.GameObjects.Image;

  constructor() {
    super("FightScene");
  }

  init(data: FightSceneData) {
    this.initialData = data;
    this.difficulty = data.difficulty;

    this.fightMessages = [];
    this.currentMessageIndex = 0;
    this.messageQueue = [];
    this.isShowingMessage = false;
    this.pendingActionResolve = undefined;
  }

  getInitialData(): FightSceneData {
    return this.initialData;
  }

  addFightMessages(messages: string[]) {
    this.fightMessages.push(...messages);
    this.currentMessageIndex = 0;
    this.updateFightText();
  }

  updateFightText() {
    if (this.currentMessageIndex < this.fightMessages.length) {
      this.fightText.setText(this.fightMessages[this.currentMessageIndex]);
    } else {
      this.fightText.setText("");
    }
  }

  async logToFightText(message: string): Promise<void> {
    return new Promise((resolve) => {
      this.messageQueue.push({ message, resolve });
      if (!this.isShowingMessage) this.showNextMessage();
    });
  }

  async typeText(text: string): Promise<void> {
    return new Promise((resolve) => {
      let i = 0;
      let isSkipping = false;
      this.fightText.setText("");

      const interval = this.time.addEvent({
        delay: 20,
        callback: () => {
          if (i < text.length && !isSkipping) {
            this.fightText.setText(this.fightText.text + text[i]);
            i++;
          } else {
            interval.remove(false);
            this.fightText.setText(text);
            this.continueArrow.setVisible(true);
            this.tweens.add({
              targets: this.continueArrow,
              alpha: { from: 1, to: 0 },
              duration: 1000,
              yoyo: true,
              repeat: -1,
            });
            resolve();
          }
        },
        loop: true,
      });

      this.input.once("pointerdown", () => {
        isSkipping = true;
      });
    });
  }

  async showNextMessage() {
    if (this.messageQueue.length === 0) {
      this.isShowingMessage = false;
      return;
    }

    this.isShowingMessage = true;
    const next = this.messageQueue.shift();
    if (!next) {
      this.isShowingMessage = false;
      return;
    }
    const { message, resolve } = next;
    await this.typeText(message);

    if (this.isWaitingForInput) return;
    this.isWaitingForInput = true;

    this.input.once("pointerdown", () => {
      resolve();
      this.isWaitingForInput = false;
      this.showNextMessage();
    });
  }

  waitForPlayerAction(): Promise<void> {
    return new Promise((resolve) => {
      this.pendingActionResolve = resolve;
    });
  }

  notifyPlayerActionResolved() {
    if (this.pendingActionResolve) {
      this.pendingActionResolve();
      this.pendingActionResolve = undefined;
    }
  }

  async displayPlayerAction(player: Fighter, opponent: Fighter): Promise<void> {
    this.fightText.setText("");
    const options: Phaser.GameObjects.Text[] = [
      this.add
        .text(40, 535, `Attack`, {
          fontSize: "20px",
          backgroundColor: "#000",
          color: "#fff",
          padding: { x: 10, y: 5 },
        })
        .setInteractive()
        .on("pointerdown", async () => {
          playSound(this, "action-sound", { volume: 0.4 });
          options.forEach((option) => option.destroy());
          await this.chooseAttack(player, opponent);
        })
        .setDepth(12),
      this.add
        .text(200, 535, `Block`, {
          fontSize: "20px",
          backgroundColor: "#000",
          color: "#fff",
          padding: { x: 10, y: 5 },
        })
        .setInteractive()
        .on("pointerdown", async () => {
          playSound(this, "action-sound", { volume: 0.4 });
          options.forEach((option) => option.destroy());
          if (this.isShowingMessage) return;
          await player.block();
          await this.animateBlock(this.playerSprite);
          this.updateStats();
          this.notifyPlayerActionResolved();
        })
        .setDepth(12),
      this.add
        .text(360, 535, `Recover`, {
          fontSize: "20px",
          backgroundColor: "#000",
          color: "#fff",
          padding: { x: 10, y: 5 },
        })
        .setInteractive()
        .on("pointerdown", async () => {
          playSound(this, "action-sound", { volume: 0.4 });
          options.forEach((option) => option.destroy());
          if (this.isShowingMessage) return;
          await player.recoverHealth();
          await this.animateRecoverHealth(this.playerSprite);
          this.updateStats();
          this.notifyPlayerActionResolved();
        })
        .setDepth(12),
      this.add
        .text(520, 535, `See stats`, {
          fontSize: "20px",
          backgroundColor: "#000",
          color: "#fff",
          padding: { x: 10, y: 5 },
        })
        .setInteractive()
        .on("pointerdown", async () => {
          playSound(this, "action-sound", { volume: 0.4 });
          options.forEach((option) => option.destroy());
          if (this.isShowingMessage) return;
          await player.log(player.getStats());
          await opponent.log(opponent.getStats());
          await playerTurn(player, opponent, this);
        })
        .setDepth(12),
    ];
    options.forEach((option) => {
      option.on("pointerover", () => {
        option.setStyle({ color: "#ff4d4d" });
      });
      option.on("pointerout", () => {
        option.setStyle({ color: "#fff" });
      });
    });
  }

  async chooseAttack(player: Fighter, opponent: Fighter): Promise<void> {
    const attackOptions = await player.getAttackNames();

    let descriptionText: Phaser.GameObjects.Text | undefined;
    const positions = [40, 200, 500, 620];
    const attackTexts: Phaser.GameObjects.Text[] = attackOptions.map(
      (attack, index) => {
        const attackText = this.add
          .text(positions[index] ?? 130, 535, `${attack.name}`, {
            fontSize: "20px",
            backgroundColor: "#000",
            color: "#fff",
            padding: { x: 10, y: 5 },
          })
          .setInteractive()
          .on("pointerdown", async () => {
            playSound(this, "action-sound", { volume: 0.4 });
            attackTexts.forEach((text) => text.destroy());
            returnText.destroy();
            if (this.isShowingMessage) return;
            descriptionText?.destroy();
            await this.animateAttackPlayer(this.playerSprite);
            await player.useAttack(attack.name, opponent);
            this.notifyPlayerActionResolved();
          })
          .on("pointerover", () => {
            attackText.setStyle({ color: "#ff4d4d" });
            descriptionText = this.add
              .text(
                30,
                320,
                `${attack.description}\nStamina Cost: ${attack.staminaCost}`,
                {
                  fontSize: "16px",
                  color: "#fff",
                  backgroundColor: "#000",
                  padding: { x: 10, y: 5 },
                },
              )
              .setDepth(12);
          })
          .on("pointerout", () => {
            attackText.setStyle({ color: "#fff" });
            descriptionText?.destroy();
          })
          .setDepth(12);

        return attackText;
      },
    );

    const returnText = this.add
      .text(850, 560, "Go back", {
        fontSize: "16px",
        color: "#fff",
        backgroundColor: "#000",
        padding: { x: 10, y: 5 },
      })
      .setInteractive()
      .setDepth(12)
      .on("pointerdown", async () => {
        attackTexts.forEach((text) => text.destroy());
        returnText.destroy();
        descriptionText?.destroy();
        await this.displayPlayerAction(player, opponent);
      })
      .on("pointerover", () => {
        returnText.setStyle({ color: "#ff4d4d" });
      })
      .on("pointerout", () => {
        returnText.setStyle({ color: "#fff" });
      });
  }

  public updateStats() {
    const endHealthPlayer = Math.max(this.player.getHealth(), 0);
    const endHealthOpponent = Math.max(this.opponent.getHealth(), 0);

    const endStaminaPlayer = Math.max(this.player.getStamina(), 0);
    const endStaminaOpponent = Math.max(this.opponent.getStamina(), 0);

    this.tweens.add({
      targets: this,
      playerDisplayedHealth: endHealthPlayer,
      opponentDisplayedHealth: endHealthOpponent,
      duration: 500,
      ease: "linear",
      onUpdate: () => {
        this.updateHealthBars();
      },
    });

    this.tweens.add({
      targets: this,
      playerStaminaDisplayed: endStaminaPlayer,
      opponentStaminaDisplayed: endStaminaOpponent,
      duration: 500,
      ease: "linear",
      onUpdate: () => {
        this.updateStaminaBars();
      },
    });

    this.playerHudText.setText(
      `${this.player.name} | HP: ${this.player.getHealth().toFixed(1)} | STA: ${this.player.getStamina()}`,
    );

    this.opponentHudText.setText(
      `${this.opponent.name} | HP: ${this.opponent.getHealth().toFixed(1)} | STA: ${this.opponent.getStamina()}`,
    );
  }

  private updateHealthBars() {
    this.playerHealthBar.clear();
    this.opponentHealthBar.clear();

    const pHealthRatio = this.playerDisplayedHealth / 100;
    const oHealthRatio = this.opponentDisplayedHealth / 100;

    const getColor = (ratio: number): number => {
      if (ratio > 0.6) return 0x00ff00;
      if (ratio > 0.3) return 0xffff00;
      return 0xff0000;
    };

    this.playerHealthBar.fillStyle(0x000000);
    this.playerHealthBar.fillRoundedRect(8, 8, 404, 19, 9);

    this.playerHealthBar.fillStyle(getColor(pHealthRatio));
    this.playerHealthBar.fillRoundedRect(10, 10, 400 * pHealthRatio, 15, 7);

    this.opponentHealthBar.fillStyle(0x000000);
    this.opponentHealthBar.fillRoundedRect(588, 8, 404, 19, 9);

    this.opponentHealthBar.fillStyle(getColor(oHealthRatio));
    this.opponentHealthBar.fillRoundedRect(590, 10, 400 * oHealthRatio, 15, 7);
  }

  private updateStaminaBars() {
    this.playerStaminaBar.clear();
    this.opponentStaminaBar.clear();

    const pStaminaRatio = this.playerStaminaDisplayed / 100;
    const oStaminaRatio = this.opponentStaminaDisplayed / 100;

    this.playerStaminaBar.fillStyle(0x000000);
    this.playerStaminaBar.fillRoundedRect(8, 28, 404, 12, 6);

    this.playerStaminaBar.fillStyle(0x34a4f3);
    this.playerStaminaBar.fillRoundedRect(10, 30, 400 * pStaminaRatio, 8, 4);

    this.opponentStaminaBar.fillStyle(0x000000);
    this.opponentStaminaBar.fillRoundedRect(588, 28, 404, 12, 6);

    this.opponentStaminaBar.fillStyle(0x34a4f3);
    this.opponentStaminaBar.fillRoundedRect(590, 30, 400 * oStaminaRatio, 8, 4);
  }

  public async animateAttackPlayer(
    targetImage: Phaser.GameObjects.Image,
  ): Promise<void> {
    return new Promise((resolve) => {
      this.tweens.add({
        targets: targetImage,
        x: targetImage.x + 100,
        duration: 100,
        yoyo: true,
        onComplete: () => {
          resolve();
        },
      });
    });
  }

  public animateAttackOponent(
    targetImage: Phaser.GameObjects.Image,
  ): Promise<void> {
    return new Promise((resolve) => {
      this.tweens.add({
        targets: targetImage,
        x: targetImage.x - 100,
        duration: 100,
        yoyo: true,
        onComplete: () => {
          resolve();
        },
      });
    });
  }

  private showDamageText(damage: number, x: number, y: number) {
    const size = 2 * damage;
    const damageText = this.add
      .text(x, y, `${Math.floor(damage)}`, {
        fontSize: `${size}px`,
        color: "#ff0000",
        padding: { x: 10, y: 5 },
      })
      .setDepth(20)
      .setOrigin(0.5, 0.5);

    this.tweens.add({
      targets: damageText,
      y: damageText.y - 50,
      alpha: 0,
      duration: 1000,
      onComplete: () => {
        damageText.destroy();
      },
    });
  }

  private async animateDamage(sprite: Phaser.GameObjects.Image): Promise<void> {
    await new Promise((resolve) => {
      sprite.setTint(0xff0000);

      playSound(this, "punch", {
        volume: 0.4,
      });

      const x = sprite.x;
      const y = sprite.y - 50;

      if (x < 500) {
        const lastDamage = this.player.getLastDamage();
        this.showDamageText(lastDamage, x, y);
      } else {
        const lastDamage = this.opponent.getLastDamage();
        this.showDamageText(lastDamage, x, y);
      }

      this.add
        .particles(sprite.x, sprite.y - 200, "blood", {
          speed: { min: -300, max: 300 },
          lifespan: 300,
          scale: { start: 0.09, end: 0 },
          tint: 0xff0000,
          gravityY: 200,
          blendMode: "ADD",
          emitting: false,
        })
        .setDepth(20)
        .explode(16);

      this.tweens.add({
        targets: sprite,
        angle: { from: -1, to: 0 },
        x: { from: sprite.x - 1, to: sprite.x },
        duration: 50,
        yoyo: true,
        repeat: 2,
        onComplete: () => {
          this.updateStats();
          sprite.clearTint();
          sprite.setAngle(0);
          sprite.setX(sprite.x);
          resolve(void 0);
        },
      });
    });
  }

  private async animateCounter(
    sprite: Phaser.GameObjects.Image,
  ): Promise<void> {
    await new Promise((resolve) => {
      this.add.tween({
        targets: sprite,
        x: sprite.x + 50,
        duration: 200,
        yoyo: true,
        onComplete: () => {
          resolve(void 0);
        },
      });
    });
  }

  private async animateDeath(sprite: Phaser.GameObjects.Image): Promise<void> {
    await new Promise((resolve) => {
      sprite.setTint(0x4d4e4e);
      this.tweens.add({
        targets: sprite,
        y: sprite.y + 300,
        duration: 500,
        onComplete: () => {
          sprite.destroy();
          resolve(void 0);
        },
      });
    });
  }

  public async animateRecoverHealth(
    sprite: Phaser.GameObjects.Image,
  ): Promise<void> {
    await new Promise((resolve) => {
      sprite.setTint(0x00ff00);
      playSound(this, "heal", {
        volume: 0.4,
      });
      setTimeout(() => {
        sprite.clearTint();
        resolve(void 0);
      }, 500);
    });
  }

  public async animateRecoverStamina(
    sprite: Phaser.GameObjects.Image,
  ): Promise<void> {
    await new Promise((resolve) => {
      sprite.setTint(0x34a4f3);
      playSound(this, "recover-stamina", {
        volume: 0.4,
      });
      setTimeout(() => {
        sprite.clearTint();
        resolve(void 0);
      }, 500);
    });
  }

  public async animateBlock(sprite: Phaser.GameObjects.Image): Promise<void> {
    await new Promise((resolve) => {
      sprite.setTint(0xffff00);
      setTimeout(() => {
        sprite.clearTint();
        resolve(void 0);
      }, 500);
    });
  }

  public async animateDodge(sprite: Phaser.GameObjects.Image): Promise<void> {
    await new Promise((resolve) => {
      this.tweens.add({
        targets: sprite,
        y: sprite.y + 40,
        duration: 100,
        yoyo: true,
        onComplete: () => {
          sprite.setY(sprite.y);
          resolve(void 0);
        },
      });
    });
  }

  create() {
    const getResponsiveFontSize = (base: number) => {
      return `${Math.round((base * this.scale.width) / 1000)}px`;
    };
    addMuteButton(this, 440, 30);
    addFullScreenButton(this, 535, 26);

    playSound(this, "ready", {
      volume: 1,
    });

    playSound(this, "fight-song", {
      loop: true,
      volume: 0.4,
    });

    playSound(this, "crowd", {
      loop: true,
      volume: 0.3,
    });

    this.add
      .rectangle(420, 5, 160, 50, 0x000000)
      .setOrigin(0, 0)
      .setDepth(5)
      .setStrokeStyle(2, 0xffffff);

    this.add
      .text(990, 90, `${this.difficulty.toUpperCase()}`, {
        fontSize: "20px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(1, 0)
      .setDepth(20);

    const menuText = this.add
      .text(457, 11, "Main menu", {
        fontSize: getResponsiveFontSize(20),
        color: "#fff",
      })
      .setInteractive()
      .setDepth(6)
      .on("pointerdown", () => {
        this.sound.stopAll();
        this.tweens.killAll();
        this.scene.stop("FightScene");
        this.scene.start("MenuScene");
      });

    menuText.on("pointerover", () => {
      menuText.setStyle({ color: "#ffd700" });
    });
    menuText.on("pointerout", () => {
      menuText.setStyle({ color: "#fff" });
    });

    const restartText = this.add
      .text(457, 31, "Restart", {
        fontSize: getResponsiveFontSize(20),
        color: "#fff",
      })
      .setInteractive()
      .setDepth(6)
      .on("pointerdown", () => {
        const fightSceneData = this.getInitialData();
        this.sound.stopAll();
        this.tweens.killAll();
        this.scene.restart(fightSceneData);
      });

    restartText.on("pointerover", () => {
      restartText.setStyle({ color: "#ffd700" });
    });
    restartText.on("pointerout", () => {
      restartText.setStyle({ color: "#fff" });
    });

    //Set up the logger, players and background
    GameManager.getInstance().setCurrentScene(this);

    this.player = this.initialData.player.clone();
    this.opponent = this.initialData.opponent.clone();
    this.add.image(400, 300, "background-ring").setOrigin(0.5, 0.5).setScale(2);

    //Create player and opponent sprites

    this.opponentSprite = this.add
      .image(700, 370, this.opponent.name.toLowerCase())
      .setOrigin(0.5, 0.5)
      .setDepth(1)
      .setDisplaySize(400, 600)
      .setFlipX(true);

    this.playerSprite = this.add
      .image(300, 370, this.player.name.toLowerCase())
      .setOrigin(0.5, 0.5)
      .setDisplaySize(400, 600);

    //Animations

    this.player.setOnDamageCallback(
      async () => await this.animateDamage(this.playerSprite),
    );
    this.opponent.setOnDamageCallback(
      async () => await this.animateDamage(this.opponentSprite),
    );

    this.player.setOnDeathCallback(() => this.animateDeath(this.playerSprite));
    this.opponent.setOnDeathCallback(() =>
      this.animateDeath(this.opponentSprite),
    );

    if (this.player instanceof CounterPuncher) {
      this.player.setOnCounterCallback(() =>
        this.animateCounter(this.playerSprite),
      );
    }

    if (this.opponent instanceof CounterPuncher) {
      this.opponent.setOnCounterCallback(() =>
        this.animateCounter(this.opponentSprite),
      );
    }

    this.player.setOnDodgeCallback(() => this.animateDodge(this.playerSprite));
    this.opponent.setOnDodgeCallback(() => {
      playSound(this, "dodge", {
        volume: 0.4,
      });
      this.animateDodge(this.opponentSprite);
    });

    this.player.setOnBlockCallback(() => this.animateBlock(this.playerSprite));
    this.opponent.setOnBlockCallback(() => {
      this.animateBlock(this.opponentSprite);
      playSound(this, "block", {
        volume: 0.4,
      });
    });

    //Set up fight text and HUD

    this.add
      .rectangle(500, 550, 1000, 100, 0x000000)
      .setOrigin(0.5, 0.5)
      .setStrokeStyle(2, 0xffffff)
      .setDepth(10);

    this.continueArrow = this.add
      .text(950, 565, "▼", {
        fontSize: getResponsiveFontSize(24),
        color: "#fff",
      })
      .setDepth(11)
      .setVisible(false);

    this.fightText = this.add
      .text(50, 525, "", {
        fontSize: getResponsiveFontSize(18),
        color: "#fff",
        wordWrap: { width: 700 },
        lineSpacing: 4,
      })
      .setDepth(11);

    this.playerHudText = this.add
      .text(10, 70, "", {
        fontSize: getResponsiveFontSize(16),
        color: "#ffffff",
        backgroundColor: "#000",
        padding: { x: 6, y: 2 },
      })
      .setDepth(3)
      .setOrigin(0, 0.5);

    this.opponentHudText = this.add
      .text(990, 70, "", {
        fontSize: getResponsiveFontSize(16),
        color: "#ffffff",
        backgroundColor: "#000",
        padding: { x: 6, y: 2 },
      })
      .setOrigin(1, 0.5)
      .setDepth(3);

    this.playerHealthBar = this.add.graphics();

    this.opponentHealthBar = this.add.graphics();

    this.playerHealthBar.setDepth(2);
    this.opponentHealthBar.setDepth(2);

    this.playerStaminaBar = this.add.graphics();
    this.opponentStaminaBar = this.add.graphics();

    this.playerStaminaBar.setDepth(2);
    this.opponentStaminaBar.setDepth(2);

    // Initial stats update

    this.updateStats();
    this.updateHealthBars();
    this.updateStaminaBars();

    // Start the fight

    fight(this.player, this.opponent, this, this.difficulty);
  }

  update() {
    return;
  }
}
