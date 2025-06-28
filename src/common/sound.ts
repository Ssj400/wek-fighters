export function playSound(
  scene: Phaser.Scene,
  key: string,
  config: Phaser.Types.Sound.SoundConfig = {},
) {
  if (key && !scene.sound.get(key)?.isPlaying) {
    scene.sound.play(key, config);
  } else if (key === "recover-stamina" || key === "click") {
    scene.sound.play(key, config);
  } else {
    console.warn(
      `Sound with key "${key}" is not available or already playing.`,
    );
  }
}
