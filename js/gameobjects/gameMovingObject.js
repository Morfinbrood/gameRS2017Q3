import GameStaticObject from "./gameStaticObject.js";
export default class GameMovingObject extends GameStaticObject {
    constructor(name, startPos_x, startPos_y, width, height) {
        super(name, startPos_x, startPos_y, width, height);
        this.gameObject.movement = {
            x: 0,
            y: 0
        };
        this.gameObject.maxSpeed = 1;
        this.gameObject.damage_flatten = 1;
        this.gameObject.acceleration = 1;
        this.gameObject.turning_body_speed = 1;
    }
}