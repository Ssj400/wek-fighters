var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Fighter = /** @class */ (function () {
    function Fighter(name, health, strength) {
        this.name = name;
        this.health = health;
        this.strength = strength;
    }
    Fighter.prototype.getStats = function () {
        console.log("Statistics | fighter: ".concat(this.name, ", health: ").concat(this.health, ", strength: ").concat(this.strength, " \n"));
    };
    Fighter.prototype.attack = function (target) {
        var damage = Math.floor(this.strength * (0.8 + Math.random() * 0.4));
        console.log("".concat(this.name, " has attacked ").concat(target.name, "!\n"));
        target.receiveDamage(damage, this);
    };
    Fighter.prototype.receiveDamage = function (damage, oponent) {
        this.health -= damage;
        console.log("".concat(this.name, " has received ").concat(damage, " damage!\n"));
        if (this.health <= 0) {
            this.health = 0;
            console.log("".concat(this.name, " has been defeated!\n"));
        }
        else {
            console.log("".concat(this.name, "'s health is now ").concat(this.health, "\n"));
        }
    };
    return Fighter;
}());
var Puncher = /** @class */ (function (_super) {
    __extends(Puncher, _super);
    function Puncher(name, health, strength, damageMultiplicator) {
        var _this = _super.call(this, name, health, strength) || this;
        _this.damageMultiplicator = damageMultiplicator;
        return _this;
    }
    Puncher.prototype.attack = function (target) {
        var damage = Math.floor(this.strength * (0.8 + Math.random() * 0.4)) * this.damageMultiplicator;
        console.log("".concat(this.name, " has punched ").concat(target.name, "!\n"));
        target.receiveDamage(damage, this);
    };
    return Puncher;
}(Fighter));
var CounterPuncher = /** @class */ (function (_super) {
    __extends(CounterPuncher, _super);
    function CounterPuncher(name, health, strength, counterIndex) {
        var _this = _super.call(this, name, health, strength) || this;
        _this.counterIndex = counterIndex;
        return _this;
    }
    CounterPuncher.prototype.receiveDamage = function (damage, oponent) {
        this.health -= damage;
        console.log("".concat(this.name, " has received ").concat(damage, " damage!\n"));
        if (Math.random() < this.counterIndex && this.health > 0) {
            console.log("".concat(this.name, " has counter punched ").concat(oponent.name, "!\n"));
            this.attack(oponent);
            this.counterIndex -= 0.1;
        }
        if (this.health <= 0) {
            this.health = 0;
            console.log("".concat(this.name, " has been defeated!\n"));
        }
        else {
            console.log("".concat(this.name, "'s health is now ").concat(this.health, "\n"));
        }
    };
    return CounterPuncher;
}(Fighter));
function whoStarts(fighterA, fighterB) {
    return Math.random() < 0.5 ? [fighterA, fighterB] : [fighterB, fighterA];
}
function fight(fighter1, fighter2) {
    console.log("The fight has started!\n");
    fighter1.getStats();
    fighter2.getStats();
    for (var i = 0; i < 10; i++) {
        if (fighter1.health <= 0) {
            console.log("".concat(fighter1.name, " is dead, ").concat(fighter2.name, " wins"));
            break;
        }
        else if (fighter2.health <= 0) {
            console.log("".concat(fighter2.name, " is dead, ").concat(fighter1.name, " wins"));
            break;
        }
        if (i % 2 === 0) {
            fighter1.attack(fighter2);
        }
        else {
            fighter2.attack(fighter1);
        }
        console.log("The turn has ended!\n");
    }
}
var mati = new CounterPuncher("theBeast", 100, 30, 0.5);
var alan = new Puncher("babyTank", 100, 25, 1.5);
var _a = whoStarts(mati, alan), starter = _a[0], opponent = _a[1];
fight(starter, opponent);
