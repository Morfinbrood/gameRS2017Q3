import GameMovingObject from "./gameMovingObject.js";
import Utils from "../utils.js";
export default class GameBulletObject extends GameMovingObject {
    constructor(name, startPos_x, startPos_y, width, height) {
        let crutchName = name + "crutch";
        super(crutchName, startPos_x, startPos_y, width, height);
        this.gameObject.sprite = Utils.setSprite("img/bullets/" + name + ".png");
        this.gameObject.death_sprite = Utils.setSprite("img/statics/crater_" + Utils.getRandomInt(1, 4) + ".png");
        this.gameObject.hp = 50;
        // in game ticks
        this.gameObject.range = 35;
        this.gameObject.speed = 20;
        this.gameObject.damage = 10;
    };
}