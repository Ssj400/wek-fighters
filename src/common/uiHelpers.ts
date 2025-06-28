export function addMuteButton(scene: Phaser.Scene, x: number, y: number) {
  let isMuted = scene.sound.mute;

  const soundButton = scene.add
    .image(x, y, isMuted ? "mute-icon" : "sound-icon")
    .setOrigin(0.5)
    .setInteractive()
    .setDepth(10);

  soundButton.on("pointerdown", () => {
    isMuted = !isMuted;
    scene.sound.mute = isMuted;
    soundButton.setTexture(isMuted ? "mute-icon" : "sound-icon");
  });

  soundButton.on("pointerover", () => {
    soundButton.setTint(0xffffaa);
    soundButton.setScale(1.1);
  });

  soundButton.on("pointerout", () => {
    soundButton.clearTint();
    soundButton.setScale(1);
  });

  return soundButton;
}
