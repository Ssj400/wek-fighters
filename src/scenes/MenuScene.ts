import Phaser from "phaser";

export class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  preload() {
    this.load.image("background", "../assets/title-background.jpg");
    this.load.image("logo", "../assets/title.png");
    this.load.image("fire", "../assets/fire.png");

    this.load.audio("click", "../assets/sfx/click.wav");
  }

  create() {
    this.add.image(500, 300, "background").setOrigin(0.5).setScale(0.3);
    this.add.image(500, 250, "logo").setOrigin(0.5).setScale(0.4).setDepth(2);

    const clickSound = this.sound.add("click");

    this.add.particles(500, 300, "fire", {
      speed: { min: 50, max: 150 },
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
      this.scene.start("CharacterSelectScene");
      if (!clickSound.isPlaying) clickSound.play();
    });
  }
}
