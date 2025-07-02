import { Fighter } from "../classes/Fighter";

export interface FightSceneData {
  player: Fighter;
  opponent: Fighter;
  difficulty: Difficulty;
}

export type Difficulty = "easy" | "normal";
