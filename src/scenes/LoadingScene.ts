import Phaser from "phaser";

export class LoadingScene extends Phaser.Scene {
  constructor() {
    super("LoadingScene");
  }

  preload() {
    const { width, height } = this.scale;

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    const loadingText = this.add
      .text(width / 2, height / 2 - 50, "Loading...", {
        fontSize: "20px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.load.on("progress", (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });

    this.load.once("complete", () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      this.scene.start("FightScene", this.scene.settings.data);
    });

    this.load.image("background-ring", "assets/ringBackground.jpg");

    this.load.image("mati", "assets/mati.png");
    this.load.image("juan", "assets/juan.png");
    this.load.image("alan", "assets/alan.png");
    this.load.image("jefte", "assets/jefte.png");
    this.load.image("sound-icon", "assets/sound-icon.png");
    this.load.image("mute-icon", "assets/mute-icon.png");

    this.load.image("blood", "assets/blood.png");

    this.load.audio("punch", "assets/sfx/punch.mp3");
    this.load.audio("ready", "assets/sfx/ready.mp3");
    this.load.audio(
      "fight-song",
      `assets/sfx/fight-song-${Math.floor(Math.random() * 2) + 1}.mp3`,
    );
    this.load.audio("crowd", "assets/sfx/crowd.mp3");
    this.load.audio("heal", "assets/sfx/heal.mp3");
    this.load.audio("recover-stamina", "assets/sfx/recover-stamina.mp3");
    this.load.audio("block", "assets/sfx/block.mp3");
    this.load.audio("dodge", "assets/sfx/dodge.mp3");
    this.load.audio("action-sound", "assets/sfx/action-sound.mp3");
  }
}
