import { playSound } from "../common/sound";
import { type Difficulty } from "../types/types";
import { addFullScreenButton, addMuteButton } from "../common/uiHelpers";

export class SelectDifficultyScene extends Phaser.Scene {
  private difficulty: Difficulty = "easy";

  constructor() {
    super("SelectDifficultyScene");
  }

  preload() {
    this.load.image("background", "assets/title-background.jpg");
    this.load.audio(
      "space",
      `assets/sfx/space-${Math.floor(Math.random() * 2) + 1}.mp3`,
    );
    this.load.audio("click", "assets/sfx/click.wav");
  }

  create() {
    this.add.image(500, 300, "background").setOrigin(0.5).setScale(0.3);
    addMuteButton(this, 950, 50);
    addFullScreenButton(this, 50, 50);

    this.add
      .text(500, 150, "Select Difficulty", {
        fontSize: "36px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    const easyButton = this.add
      .text(500, 250, "Easy", {
        fontSize: "32px",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.difficulty = "easy";
        playSound(this, "click", { volume: 0.5 });
        this.scene.start("CharacterSelectScene", {
          difficulty: this.difficulty,
        });
      });
    easyButton.on("pointerover", () => {
      easyButton.setStyle({ fill: "#ff0" });
    });
    easyButton.on("pointerout", () => {
      easyButton.setStyle({ fill: "#ffffff" });
    });

    const normalButton = this.add
      .text(500, 350, "Normal", {
        fontSize: "32px",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.difficulty = "normal";
        playSound(this, "click", { volume: 0.5 });
        this.scene.start("CharacterSelectScene", {
          difficulty: this.difficulty,
        });
      });
    normalButton.on("pointerover", () => {
      normalButton.setStyle({ fill: "#ff0" });
    });
    normalButton.on("pointerout", () => {
      normalButton.setStyle({ fill: "#ffffff" });
    });

    const hardButton = this.add
      .text(500, 450, "Hard", {
        fontSize: "32px",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.difficulty = "hard";
        playSound(this, "click", { volume: 0.5 });
        this.scene.start("CharacterSelectScene", {
          difficulty: this.difficulty,
        });
      });
    hardButton.on("pointerover", () => {
      hardButton.setStyle({ fill: "#ff0" });
    });
    hardButton.on("pointerout", () => {
      hardButton.setStyle({ fill: "#ffffff" });
    });
  }

  update() {
    return;
  }
}
