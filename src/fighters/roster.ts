import { Fighter } from "../classes/Fighter";
import { Puncher } from "../classes/Puncher";
import { CounterPuncher } from "../classes/CounterPuncher";
import { Defender } from "../classes/Defender";

export const jefte = new Defender("inca", 100, 35, 10, 0, false, 10);
export const mati = new CounterPuncher("theBeast", 100, 30, 10, 0, false, 0.5);
export const alan = new Puncher("babyTank", 100, 20, 20, 0, false, 2);
export const juan = new Fighter("The lizard", 100, 10, 50);

export const fighters: Fighter[] = [jefte, mati, alan, juan];