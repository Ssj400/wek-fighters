import { sleep } from "./sleep";

export async function typeText(
  text: string,
  delay: number = 20,
): Promise<void> {
  for (const char of text) {
    process.stdout.write(char);
    await sleep(delay);
  }
  process.stdout.write("\n");
}
