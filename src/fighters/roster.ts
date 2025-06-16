import { Fighter } from "../classes/Fighter";
import { Puncher } from "../classes/Puncher";
import { CounterPuncher } from "../classes/CounterPuncher";
import { Defender } from "../classes/Defender";

export const jefte = new Defender("inca", 100, 35, 10, 100, 0, false, 10);
export const mati = new Puncher("theBeast", 100, 30, 10, 100, 0, false, 1.2);
export const alan = new Puncher("babyTank", 100, 20, 20, 100, 0, false, 1.5);
export const juan = new CounterPuncher("The lizard", 100, 10, 50, 100, 0, false, 0.7);

export const fighters: Fighter[] = [jefte, mati, alan, juan];