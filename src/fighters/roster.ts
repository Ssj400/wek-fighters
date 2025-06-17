import { Fighter } from "../classes/Fighter";
import { Puncher } from "../classes/Puncher";
import { CounterPuncher } from "../classes/CounterPuncher";
import { Defender } from "../classes/Defender";
import { divineUppercut, jab, strongCross } from "../common/attacks"

export const jefte = new Defender("inca", 100, 35, 10, 0, false, 10);
jefte.setAttack({ "jab": jab });

export const mati = new Puncher("theBeast", 100, 30, 10, 0, false, 1.2, true);
mati.setAttack({ "jab": jab, 
    "Divine Uppercut": divineUppercut 
});

export const alan = new Puncher("babyTank", 100, 20, 20, 0, false, 1.5);
alan.setAttack({ "jab": jab })

export const juan = new CounterPuncher("The lizard", 100, 10, 50, 0, false, 0.7);
juan.setAttack({
    "jab": jab, 
    "Strong Cross": strongCross 
});

export const fighters: Fighter[] = [jefte, mati, alan, juan];