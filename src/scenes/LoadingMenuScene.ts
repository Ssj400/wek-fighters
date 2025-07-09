import Phaser from "phaser";

export class LoadingMenuScene extends Phaser.Scene {
  private loadingDotsTimer?: Phaser.Time.TimerEvent;
  private loadingText?: Phaser.GameObjects.Text;
  private dotCount = 0;

  constructor() {
    super("LoadingMenuScene");
  }

  preload() {
    const { width, height } = this.scale;

    this.add.image(500, 300, "background").setOrigin(0.5).setScale(0.3);
    this.loadingText = this.add
      .text(width / 2, height / 2, "Loading", {
        fontSize: "28px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.loadingDotsTimer = this.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => {
        this.dotCount = (this.dotCount + 1) % 4;
        this.loadingText?.setText("Loading" + ".".repeat(this.dotCount));
      },
    });

    this.load.once("complete", () => {
      this.loadingDotsTimer?.remove();
      this.scene.start("CharacterSelectScene", this.scene.settings.data);
    });

    this.load.image("Mati-selection", "assets/mati-selection.png");
    this.load.image("Juan-selection", "assets/juan-selection.png");
    this.load.image("Alan-selection", "assets/alan-selection.png");
    this.load.image("Jefte-selection", "assets/jefte-selection.png");
    this.load.image("Gaspar-selection", "assets/gaspar-selection.png");
    this.load.image("Jose-selection", "assets/jose-selection.png");
    this.load.image("question-mark", "assets/question-mark.png");
    this.load.image("sound-icon", "assets/sound-icon.png");
    this.load.image("mute-icon", "assets/mute-icon.png");

    this.load.audio("click", "assets/sfx/click.wav");
    this.load.audio("Start fight", "assets/sfx/start-fight.mp3");
    this.load.audio(
      "space",
      `assets/sfx/space-${Math.floor(Math.random() * 2) + 1}.mp3`,
    );
  }
}
