import GameObject from "./gameObject.js";
import CollidersCollection from "../collidersCollection/collidersCollection.js";
import Utils from "../utils.js";
export default class GameStaticObject extends GameObject {
    constructor(name, startPos_x, startPos_y, width, height) {
        if (name.indexOf("crutch") !== -1) {
            name = name.slice(0, name.length - 6);
            super(name, startPos_x, startPos_y, width, height);
            this.gameObject.colliders = new CollidersCollection(width, height)[name];
        }
        else {
            super(name, startPos_x, startPos_y, width, height);
            this.gameObject.colliders = new CollidersCollection(width, height)[name];
            this.gameObject.sprite = Utils.setSprite("img/statics/" + name + ".png");
        }
        this.gameObject.hp = 30;
    }
}