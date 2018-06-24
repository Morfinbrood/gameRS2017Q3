import GameMovingObject from "./gameMovingObject.js";
import Utils from "../utils.js";
//TODO need change logic with use name for load sprite src it's not work when i want to add new type enemy like Robots
export default class GameEnemyObject extends GameMovingObject {
    constructor(name, startPos_x, startPos_y, width, height) {
        let crutchName = name + "crutch";
        super(crutchName, startPos_x, startPos_y, width, height);
        this.gameObject.sprite = Utils.setSprite("img/enemies/" + name + "/skeleton-move_0.png");
        this.gameObject.death_sprite = Utils.setSprite("img/bloodsplats/bloodsplats_" + Utils.getRandomInt(1, 8) + ".png");
        this.gameObject.rotation = Utils.getRandomInt(0, 361);
        this.gameObject.entered_damage = 1;
        this.gameObject.acceleration = 0.05;
        this.gameObject.hp = 1;
        this.gameObject.animation = {
            number_start_sprite: Utils.getRandomInt(0, 17),
            total_sprites: 16,
            animator: function animator(obj) {
                let i = Utils.getRandomInt(0, 17);
                const time_between_frames = 100;
                function setNextSprite(i) {
                    if (i > obj.gameObject.animation.total_sprites - 1) { i = 0 }
                    else { i++; }
                    obj.gameObject.sprite = Utils.setSprite("img/enemies/" + name + "/skeleton-move_" + i + ".png");
                    delayedAnimator(i);
                }
                let delayedAnimator = Utils.delay(setNextSprite, time_between_frames);
                if (obj) {
                    delayedAnimator(i);
                }
            }(this),
        };
        this.gameObject.AI = {
            autochangeDirection: function autoChangeDir(obj) {
                const time_between_changes = Utils.getRandomInt(50, 500);
                function setNextDirect() {
                    let new_direction = Utils.getRandomInt(0, 15);
                    obj.gameObject.rotation = obj.gameObject.rotation + new_direction;
                    delayedChange();
                }
                let delayedChange = Utils.delay(setNextDirect, time_between_changes);
                if (obj) {
                    delayedChange();
                }
            }(this)
        }
    };
}