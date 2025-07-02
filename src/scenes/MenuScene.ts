import Phaser from "phaser";
import { addFullScreenButton, addMuteButton } from "../common/uiHelpers";
import { playSound } from "../common/sound";

export class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  preload() {
    this.load.image("background", "assets/title-background.jpg");
    this.load.image("logo", "assets/title.png");
    this.load.image("fire", "assets/fire.png");
    this.load.image("sound-icon", "assets/sound-icon.png");
    this.load.image("mute-icon", "assets/mute-icon.png");

    this.load.audio("click", "assets/sfx/click.wav");
    this.load.audio(
      "space",
      `assets/sfx/space-${Math.floor(Math.random() * 2) + 1}.mp3`,
    );
  }

  create() {
    this.add.image(500, 300, "background").setOrigin(0.5).setScale(0.3);
    this.add.image(500, 250, "logo").setOrigin(0.5).setScale(0.4).setDepth(2);

    playSound(this, "space", {
      loop: true,
      volume: 0.5,
    });
    addMuteButton(this, 950, 50);
    addFullScreenButton(this, 50, 50);

    this.add.particles(500, 300, "fire", {
      speed: { min: 100, max: 150 },
      lifespan: 5000,
      scale: { start: 0.0005, end: 0.03 },
      tint: 0xffffff,
      quantity: 1,
      blendMode: "ADD",
    });

    const startText = this.add
      .text(500, 480, "Start Game", {
        fontSize: "32px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setInteractive();

    startText.on("pointerover", () => {
      startText.setStyle({ color: "#ff4d4d" });
    });

    startText.on("pointerout", () => {
      startText.setStyle({ color: "#ffffff" });
    });

    startText.on("pointerdown", () => {
      this.scene.start("SelectDifficultyScene");
      playSound(this, "click", { volume: 0.5 });
    });
  }
}
