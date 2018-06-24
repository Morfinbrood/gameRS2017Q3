import GameMovingObject from "./gameMovingObject.js";
import Utils from "../utils.js";
export default class GamePlayerObject extends GameMovingObject {
    constructor(name, startPos_x, startPos_y, width, height) {
        let crutchName = name + "crutch";
        super(crutchName, startPos_x, startPos_y, width, height);
        this.gameObject.hp = 100;
        this.gameObject.sprite = Utils.setSprite("img/player/" + name + ".png");
        //TODO ADD create special death sprite to playerTank death
        this.gameObject.death_sprite = Utils.setSprite("img/statics/crater_2.png");
        this.gameObject.child = "";
        this.gameObject.pressedKeys = {
            left: false,
            right: false,
            up: false,
            down: false,
            tower_left: false,
            tower_right: false,
            fire: false,
            fire_machinegun: false
        };
        this.gameObject.guns = {
            big_gun: {
                reloading: false,
                reloading_time: 2000,
                bias_factor: 60
            },
            machinegun: {
                reloading: false,
                reloading_time: 100,
                bias_factor: 20
            }
        };
        this.gameObject.damage_flatten = 50;
        this.gameObject.maxSpeed = 4;
        this.gameObject.acceleration = 0.1;
        this.gameObject.turning_body_speed = 0.8;
        this.gameObject.turning_tower_speed = 1.2;
    }
}