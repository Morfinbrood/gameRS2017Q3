import Sound_Module from "./sound.js";
import Utils from "./utils.js";
import GameStaticObject from "./gameobjects/gameStaticObject.js";
import GamePlayerObject from "./gameobjects/gamePlayerObject.js";
import GameEnemyObject from "./gameobjects/gameEnemyObject.js";
import GameBulletObject from "./gameobjects/gameBulletObject.js";

export default class Engine {
    constructor(width, height, bckClr, bckImg) {
        this.width = width;
        this.height = height;
        this.canvas = document.createElement('canvas');
        this.bckClr = bckClr;
        this.ctx = this.canvas.getContext("2d");
        this.playerObj;
        this.baseObj;
        this.staticObjs = [];
        this.enemyObjs = [];
        this.decorObjs = [];
        this.bulletObjs = [];
        this.left_bots = 5;
        this.sound_tank_moving = Sound_Module.setAudioTrack("audio/sounds/player/tank_moving.mp3");
        this.sound_tank_moving.volume = 0.2;
        this.gameLoopRunning = false;
    }

    createCanvas() {
        this.canvas.setAttribute('width', `${this.width}px`);
        this.canvas.setAttribute('height', `${this.height}px`);
        this.canvas.style.backgroundColor = this.bckClr;
        document.body.appendChild(this.canvas);
    }

    createNewGameObject(name, x, y, width, height, type) {
        let newObj;
        switch (type) {
            case "base":
                newObj = new GameStaticObject(name, x, y, width, height).gameObject;
                this.baseObj = newObj;
                return newObj;
            case "bullet":
                newObj = new GameBulletObject(name, x, y, width, height).gameObject;
                this.bulletObjs.push(newObj);
                return newObj;
            case "player":
                newObj = new GamePlayerObject(name, x, y, width, height).gameObject;
                this.playerObj = newObj;
                return newObj;
            case "child":
                newObj = new GamePlayerObject(name, x, y, width, height).gameObject;
                return newObj;
            case "static":
                newObj = new GameStaticObject(name, x, y, width, height).gameObject;
                this.staticObjs.push(newObj);
                return newObj;
            case "enemy":
                newObj = new GameEnemyObject(name, x, y, width, height).gameObject;
                this.enemyObjs.push(newObj);
                return newObj;
            case "decorate":
                newObj = new GameStaticObject(name, x, y, width, height).gameObject;
                this.decorObjs.push(newObj);
                return newObj;
            default:
                throw "createNewGameObject() type object unknown";
                break
        }
    }

    //TODO FIX  when game collapsed setinterval methods working (animation, spawnZomvies and spawnBoss)
    startGameLoop() {
        const that = this;
        let now;
        let dt = 0;
        let last = timestamp();
        let step = 1 / 60;

        function timestamp() {
            return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
        };

        function frame() {
            if (that.gameLoopRunning) {
                now = timestamp();

                dt = dt + Math.min(1, (now - last) / 1000);
                while (dt > step) {
                    dt = dt - step;
                    that.update();
                }

                that.render();
                last = now;
                requestAnimationFrame(frame);
            }
        };

        this.gameLoopRunning = true;
        requestAnimationFrame(frame);
    }

    update() {
        if (!this.is_gameOver() > 0 && this.left_bots > 0) {
            this.tankSoundMoving();
            this.tryToShoot();
            this.collisionEvents();
            this.chkAllObjsHpAndKill();
            this.updateRotation();
            this.updateMovement();
            this.updatePosition();
            //TODO FIX IMPLEMENT  this.clearOldDecorateObject(); now DecorateObject.lenght increases to infinity
        }
        else {
            this.stopAllContinuousAction();
            if (this.is_gameOver()) {
                this.showLoseWindow();
                this.gameLoopRunning = false;
            }
            else {
                if (this.left_bots < 1) {
                    this.showWinWindow();
                    this.gameLoopRunning = false;
                }
            }
        }
    }

    chkAllObjsHpAndKill() {
        this.chkPlayerHPAndKill();
        this.chkAllBotsHPAndKill();
        this.chkAllBulletsHPAndKill();
    }

    chkPlayerHPAndKill() {
        if (this.playerObj.hp <= 0) {
            this.killPlayerObject(this.playerObj);
            this.baseObj.hp = 0;
        }
    }

    chkAllBotsHPAndKill() {
        for (let i = 0; i < this.enemyObjs.length; i++) {
            const bot = this.enemyObjs[i];
            if (bot.hp <= 0) {
                this.killBot(bot, Utils.getRandomInt(1, 8));
                // i-- need after splice in kill method in this.killBot();
                i--;
            }
        }
    }

    chkAllBulletsHPAndKill() {
        for (let i = 0; i < this.bulletObjs.length; i++) {
            const bullet = this.bulletObjs[i];
            if (bullet.hp <= 0) {
                this.killBullet(bullet);
                i--;
            }
        }
    }

    tankSoundMoving() {
        if (this.playerObj.pressedKeys.up || this.playerObj.pressedKeys.down || this.playerObj.pressedKeys.right || this.playerObj.pressedKeys.left) {
            this.sound_tank_moving.play();
        }
        else {
            this.sound_tank_moving.pause();
        }
    }

    stopAllContinuousAction() {
        this.sound_tank_moving.pause();
    }

    is_gameOver() {
        return this.baseObj.hp <= 0;
    }

    tryToShoot() {
        if (this.playerObj.pressedKeys.fire) {
            if (this.playerObj.guns.big_gun.reloading == false) {
                this.shootBigGun();
            }
        }
        if (this.playerObj.pressedKeys.fire_machinegun) {
            if (this.playerObj.guns.machinegun.reloading == false) {
                this.shootMachineGun();
            }
        }
    }

    shootBigGun() {
        this.instanciateBigGunBullet(this.playerObj, this.playerObj.guns.big_gun.bias_factor);
        this.go_to_reload(this.playerObj.guns.big_gun, this.playerObj.guns.big_gun.reloading_time);
        this.playerObj.guns.big_gun.reloading = true;
        Sound_Module.playTrack(new Audio, "audio/sounds/player/tank_shoot.mp3")
    }

    shootMachineGun() {
        this.instanciateMachinegunBullet(this.playerObj, this.playerObj.guns.machinegun.bias_factor);
        this.go_to_reload(this.playerObj.guns.machinegun, this.playerObj.guns.machinegun.reloading_time);
        this.playerObj.guns.machinegun.reloading = true;
        Sound_Module.playTrack(new Audio, "audio/sounds/player/machinegun.mp3")
    }

    go_to_reload(obj, reloadingTime) {
        function enableFire(path) {
            path.reloading = false;
        }
        let delayFunc = Utils.delay(enableFire, reloadingTime);
        delayFunc(obj);
    }

    instanciateBigGunBullet(obj, bias_factor = 0) {
        let force_vector = Utils.get_force_vector(obj.rotation + obj.child.rotation);
        let pos_x = obj.position.x + bias_factor * force_vector.x;
        let pos_y = obj.position.y + bias_factor * force_vector.y;

        let bullet = this.createNewGameObject("tank_bullet", pos_x, pos_y, 25, 25, "bullet");
        bullet.movement.x = force_vector.x * bullet.speed;
        bullet.movement.y = force_vector.y * bullet.speed;
    }

    //TODO FIX shift Oy machinegun bullets to Tank machineGun sprite now bullets swpans in center front side of tank
    instanciateMachinegunBullet(obj, bias_factor = 0) {
        let force_vector = Utils.get_force_vector(obj.rotation);
        let pos_x = obj.position.x + bias_factor * force_vector.x;
        let pos_y = obj.position.y + bias_factor * force_vector.y;

        let bullet = this.createNewGameObject("tank_bullet", pos_x, pos_y, 10, 10, "bullet");
        bullet.damage = 1;
        bullet.range = 25;
        bullet.hp = 1;
        bullet.movement.x = force_vector.x * bullet.speed;
        bullet.movement.y = force_vector.y * bullet.speed;
    }

    moveObjToDecorateLayer(obj, sourceArr) {
        Utils.transferObjToNewArr(obj, sourceArr, this.decorObjs);
    }

    disappearing(obj, sourceArr) {
        Utils.deleteObjFromArr(obj, sourceArr);
    }

    killPlayerObject(obj) {
        this.left_bots--;
        this.reset_movement(obj);
        this.changeSprite(obj, obj.death_sprite);
        //TODO ADD add special tank tower death sprite now it's just crater.png
        this.changeSprite(obj.child, Utils.setSprite("img/empty_sprite.png"));
        //TODO ADD player death sound like Sound_Module.playTrack(new Audio, "audio/sounds/player/tank_death.wav");
        //TODO FIX this.moveObjToDecorateLayer() not used because because this.playerObj is not an element of array and  Utils.transferObjToNewArr work only with arrays
        // when player died his dead sprite place on top layer 
    }

    killBot(obj, deathSound = "") {
        this.left_bots--;
        this.reset_movement(obj);
        this.changeSprite(obj, obj.death_sprite);
        Sound_Module.playTrack(new Audio, "audio/sounds/enemies/" + obj.name + "/death" + deathSound + ".wav");
        this.moveObjToDecorateLayer(obj, this.enemyObjs);
    }

    objEnteredTheBase(obj, sound) {
        this.left_bots--;
        this.disappearing(obj, this.enemyObjs);
        this.baseObj.hp = this.baseObj.hp - obj.entered_damage;
        Sound_Module.playTrack(new Audio, "audio/sounds/events/" + sound);
    }

    killBullet(obj) {
        this.reset_movement(obj);
        this.changeSprite(obj, obj.death_sprite);
        this.moveObjToDecorateLayer(obj, this.bulletObjs);
    }

    shootInBase(bullet, sound) {
        bullet.hp = bullet.hp - 10000;
        this.baseObj.hp = this.baseObj.hp - bullet.damage;
        this.reset_movement(bullet);
        Sound_Module.playTrack(new Audio, "audio/sounds/events/" + sound);
    }

    reflectMovement(obj, k) {
        this.playerObj.position.x = this.playerObj.position.x - this.playerObj.movement.x;
        this.playerObj.position.y = this.playerObj.position.y - this.playerObj.movement.y;
        this.playerObj.movement.x = -this.playerObj.movement.x / k;
        this.playerObj.movement.y = -this.playerObj.movement.y / k;
    }

    // if coef <1 objects was be attracted mb need find better name if this method will used for attracted
    pushObj2FromObj1(obj1, obj2, coef_pushing_force) {
        // The smaller the parameter "value", the smoother is the repulsion, but at a high speed the object will penetrate in object without collision
        //TODO ADD FIX modul who solves this problem, who detect when object to deep collide with other object and push out him with more force like 10x 
        const x1 = obj1.position.x;
        const y1 = obj1.position.y;
        const x2 = obj2.position.x;
        const y2 = obj2.position.y;
        //TODO change on ES7 ** when it's possible
        const dist_1_2 = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
        let k = dist_1_2 / dist_1_2;
        k = k * coef_pushing_force;
        const new_x = x1 + (x2 - x1) * k;
        const new_y = y1 + (y2 - y1) * k;

        obj2.position.x = new_x;
        obj2.position.y = new_y;
    }

    chkCollisionsPlayer_bots() {
        this.enemyObjs.forEach(bot => {
            if (this.is_objects_intersected(this.playerObj, bot)) {
                if (this.playerObj.damage_flatten > bot.damage_flatten) {
                    // when tank flatten bot
                    const damage = this.playerObj.damage_flatten - bot.damage_flatten
                    bot.hp = bot.hp - damage;
                    this.pushObj2FromObj1(this.playerObj, bot, 1.025);
                }
                else {
                    // when bot like boss flatten tank
                    //TODO FIX no hit sounds in FF 57.0.2
                    this.reflectMovement(this.playerObj, 10);
                    const damage = bot.damage_flatten - this.playerObj.damage_flatten;
                    this.playerObj.hp = this.playerObj.hp - damage;
                    Sound_Module.playTrack(new Audio, "audio/sounds/player/metallic_hit.wav");
                    this.pushObj2FromObj1(bot, this.playerObj, 1.025);
                }
            }
        });
    }

    chkCollisionsPlayer_base() {
        if (this.is_objects_intersected(this.playerObj, this.baseObj)) {
            this.pushObj2FromObj1(this.baseObj, this.playerObj, 1.025);
        }
    }

    chkCollisionsBots_base() {
        this.enemyObjs.forEach(bot => {
            if (this.is_objects_intersected(this.baseObj, bot)) {
                this.objEnteredTheBase(bot, "enemy_in_base.wav");
            }
        });
    }

    chkCollisionsBots_bullet() {
        this.enemyObjs.forEach(bot => {
            this.bulletObjs.forEach(bullet => {
                if (this.is_objects_intersected(bullet, bot)) {
                    bot.hp = bot.hp - bullet.damage;
                    bullet.hp = bullet.hp - bot.damage_flatten;
                    this.pushObj2FromObj1(bullet, bot, 1.4);
                }
            });
        });
    }

    //TODO FIX have bug with machinegun bullets  that because is_objects_intersected not working when object already in object
    //TODO ADD chkObjInOtherObj for small objectc like machinegun bullets. Now we have bug when bullets skips collision with base side because small size bulelts and high speed
    chkCollisionsBullets_base() {
        this.bulletObjs.forEach(bullet => {
            if (this.is_objects_intersected(bullet, this.baseObj)) {
                this.shootInBase(bullet, "shoot_in_base.wav");
            }
        });
    }

    collisionEvents() {
        //TODO ADD IMLEMENT this.chkCollisionsPlayer_static(); this.chkCollisionsBullets_static();
        this.chkCollisionsPlayer_bots();
        this.chkCollisionsPlayer_base();
        this.chkCollisionsBots_base();
        this.chkCollisionsBots_bullet();
        //TODO Now work with ~20-30 zombies at screen if more start drags. Need other more optimized method then each bot with each bot, mb use hashmap
        //this.chkCollisionsBots_bots();
        this.chkCollisionsBullets_base();
    }

    // this implemented as tryTo, and not in collisionEvents because tower turning don't have movement and i can't just reflect movement to stop collision
    tryToTurnLeft() {
        this.playerObj.rotation = this.playerObj.rotation - this.playerObj.turning_body_speed;
        // ban rotate to collision direction
        // for base
        if (this.is_objects_intersected(this.playerObj, this.baseObj)) {
            // reflect rotate
            this.playerObj.rotation = this.playerObj.rotation + this.playerObj.turning_body_speed * 1.01;
        }

        //DISABLED static objects not implemented now
        // this.staticObjs.forEach(staticObj => {
        //     if (this.is_objects_intersected(this.playerObj, staticObj)) {
        //         this.playerObj.rotation = this.playerObj.rotation + this.playerObj.turning_body_speed * 1.01;
        //     }
        // });
    }

    tryToTurnRight() {
        this.playerObj.rotation = this.playerObj.rotation + this.playerObj.turning_body_speed;
        //for base
        if (this.is_objects_intersected(this.playerObj, this.baseObj)) {
            // cancel rotate
            this.playerObj.rotation = this.playerObj.rotation - this.playerObj.turning_body_speed * 1.01;
        }

        //DISABLED static objects not implemented now
        // this.staticObjs.forEach(staticObj => {
        //     if (this.is_objects_intersected(this.playerObj, staticObj)) {
        //         this.playerObj.rotation = this.playerObj.rotation - this.playerObj.turning_body_speed * 1.01;
        //     }
        // });
    }

    tryToTurnTowerLeft() {
        this.playerObj.child.rotation = this.playerObj.child.rotation - this.playerObj.turning_tower_speed;
    }

    tryToTurnTowerRight() {
        this.playerObj.child.rotation = this.playerObj.child.rotation + this.playerObj.turning_tower_speed;
    }

    updateRotation() {
        //TODO FIX and test overflow rotation
        // Rotate tank body
        if (this.playerObj.pressedKeys.left) {
            this.tryToTurnLeft();
        }
        else if (this.playerObj.pressedKeys.right) {
            this.tryToTurnRight();
        }

        // Rotate tank tower
        if (this.playerObj.pressedKeys.tower_left) {
            this.tryToTurnTowerLeft();
        }
        else if (this.playerObj.pressedKeys.tower_right) {
            this.tryToTurnTowerRight()
        }
    }

    updateMovementBots() {
        this.enemyObjs.forEach(bot => {
            const force_vector = Utils.get_force_vector(bot.rotation);
            bot.movement.x = bot.movement.x + force_vector.x * bot.acceleration;
            bot.movement.y = bot.movement.y + force_vector.y * bot.acceleration;
            this.limit_max_speed(bot, bot.maxSpeed);
        });
    }

    updateMovementPlayer() {
        // Mathematics for mapping a rotation to it's x, y components
        let force_vector = Utils.get_force_vector(this.playerObj.rotation);

        if (this.playerObj.pressedKeys.up) {
            this.playerObj.movement.x = this.playerObj.movement.x + force_vector.x * this.playerObj.acceleration;
            this.playerObj.movement.y = this.playerObj.movement.y + force_vector.y * this.playerObj.acceleration;
        }
        else if (this.playerObj.pressedKeys.down) {
            this.playerObj.movement.x = this.playerObj.movement.x - force_vector.x * this.playerObj.acceleration;
            this.playerObj.movement.y = this.playerObj.movement.y - force_vector.y * this.playerObj.acceleration;
        }

        // friction resistance
        const friction_ground = 0.97;
        this.playerObj.movement.x = this.playerObj.movement.x * friction_ground;
        this.playerObj.movement.y = this.playerObj.movement.y * friction_ground;

        this.limit_max_speed(this.playerObj, this.playerObj.maxSpeed);
    }

    updateMovement() {
        this.updateMovementBots();
        this.updateMovementPlayer();
    }

    updatePositionBots() {
        this.enemyObjs.forEach(bot => {
            bot.position.x = bot.position.x + bot.movement.x;
            bot.position.y = bot.position.y + bot.movement.y;
            this.detect_boundaries(bot);
        });
    }

    updatePositionPlayer() {
        this.playerObj.position.x = this.playerObj.position.x + this.playerObj.movement.x;
        this.playerObj.position.y = this.playerObj.position.y + this.playerObj.movement.y;
        this.detect_boundaries(this.playerObj);
    }

    updatePositionBullets() {
        this.bulletObjs.forEach(bullet => {
            bullet.position.x = bullet.position.x + bullet.movement.x;
            bullet.position.y = bullet.position.y + bullet.movement.y;
            bullet.range--;
            if (bullet.range < 0) {
                // for increase crater size after exploision
                bullet.size.width = bullet.size.width * 2;
                bullet.size.height = bullet.size.height * 2;
                this.killBullet(bullet);
            }
            this.detect_boundaries(bullet);
        });
    }

    updatePosition() {
        this.updatePositionBots();
        this.updatePositionPlayer();
        this.updatePositionBullets();
    }

    detect_boundaries(obj) {
        if (obj.position.x > this.width) {
            obj.position.x = obj.position.x - this.width;
        }
        else if (obj.position.x < 0) {
            obj.position.x = obj.position.x + this.width;
        }
        if (obj.position.y > this.height) {
            obj.position.y = obj.position.y - this.height;
        }
        else if (obj.position.y < 0) {
            obj.position.y = obj.position.y + this.height;
        }
    }

    limit_max_speed(obj, maxSpeed) {
        if (obj.movement.x > maxSpeed) {
            obj.movement.x = maxSpeed;
        }
        else if (obj.movement.x < -maxSpeed) {
            obj.movement.x = -maxSpeed;
        }
        if (obj.movement.y > maxSpeed) {
            obj.movement.y = maxSpeed;
        }
        else if (obj.movement.y < -maxSpeed) {
            obj.movement.y = -maxSpeed;
        }
    }

    reset_movement(obj) {
        obj.movement.x = 0;
        obj.movement.y = 0;
    }

    changeSprite(obj, sprite) {
        obj.sprite = sprite;
    }

    // draw decorate objects like grass or gound
    drawDecor() {
        this.decorObjs.forEach(element => {
            this.ctx.drawImage(element.sprite, element.position.x - element.size.width / 2, element.position.y - element.size.height / 2, element.size.width, element.size.height);
        });
    }

    drawBullets() {
        this.bulletObjs.forEach(bullet => {
            this.ctx.save();
            this.ctx.translate(bullet.position.x, bullet.position.y);
            this.ctx.drawImage(bullet.sprite, - bullet.size.width / 2, - bullet.size.height / 2, bullet.size.width, bullet.size.height);
            this.ctx.restore();
        });
    }

    //DISABLED TODO IMPLEMENT static objects
    // draw static objects like buildings or rocks
    // drawStatic() {
    //     this.staticObjs.forEach(element => {
    //         this.ctx.drawImage(element.sprite, element.position.x - element.size.width / 2, element.position.y - element.size.height / 2, element.size.width, element.size.height);
    //     });
    // }

    drawEnemies() {
        this.enemyObjs.forEach(element => {
            this.ctx.save();
            this.ctx.translate(element.position.x, element.position.y);
            this.ctx.rotate((Math.PI / 180) * element.rotation);
            this.ctx.drawImage(element.sprite, - element.size.width / 2, - element.size.height / 2, element.size.width, element.size.height);
            this.ctx.restore();
        });
    }

    drawBase() {
        this.ctx.drawImage(this.baseObj.sprite, this.baseObj.position.x - this.baseObj.size.width / 2, this.baseObj.position.y - this.baseObj.size.height / 2, this.baseObj.size.width, this.baseObj.size.height);
        this.draw_HP_on_Base(this.baseObj.hp);
        this.draw_left_zombies(this.left_bots);
    }

    drawPlayer() {
        this.ctx.save();
        this.ctx.translate(this.playerObj.position.x, this.playerObj.position.y);
        this.ctx.rotate((Math.PI / 180) * this.playerObj.rotation);
        this.ctx.drawImage(this.playerObj.sprite, -this.playerObj.size.width / 2, -this.playerObj.size.height / 2, this.playerObj.size.width, this.playerObj.size.height);
        let child = this.playerObj.child;
        this.ctx.rotate((Math.PI / 180) * child.rotation);
        this.ctx.drawImage(child.sprite, -child.size.width / 2, -child.size.height / 2, child.size.width, child.size.height);
        this.ctx.restore();
    }

    render() {
        //TODO IMPLEMENT more performance clear logic when clear only last objects positions with correct redraw titles 
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.drawDecor();
        this.drawEnemies();
        this.drawBullets();
        //TODO IMPLEMENT static
        //this.drawStatic();
        this.drawBase();
        this.drawPlayer();

        // for tests
        //this.drawObjectsColliders();
    }

    //TODO think about architecture mb good idea move this methods to game.js or gameInterface.js or this place is not bad as a gameEnder?
    showLoseWindow() {
        document.getElementById('lose_wind').removeAttribute('style');
    }

    showWinWindow() {
        document.getElementById('win_wind').removeAttribute('style');
    }

    draw_HP_on_Base(val) {
        this.ctx.font = "40px Arial";
        this.ctx.fillStyle = "black";
        let text = val;
        this.ctx.fillText(text, this.baseObj.position.x + 25, this.baseObj.position.y + 75);
    }

    draw_left_zombies(val) {
        this.ctx.font = "40px Arial";
        this.ctx.fillStyle = "black";
        let text = val;
        this.ctx.fillText(text, this.baseObj.position.x - 85, this.baseObj.position.y + 75);
    }

    getArrTurnedPoints(obj) {
        let arrPoints = obj.colliders.points;
        let turningPoint;
        let translatedPoint;
        let arr_result = [];

        arrPoints.forEach(element => {
            translatedPoint = Utils.myTranslate(obj.position.x, obj.position.y, element)
            turningPoint = Utils.turning_point_by_angle(translatedPoint.x, translatedPoint.y, obj.position.x, obj.position.y, obj.rotation);
            arr_result.push({ x: turningPoint.x, y: turningPoint.y })
        });

        return arr_result;
    }

    is_objects_intersected(obj1, obj2) {
        let arr1Points = this.getArrTurnedPoints(obj1);
        let arr2Points = this.getArrTurnedPoints(obj2);

        let is_intersected = false;
        for (let i1 = 0; i1 < arr1Points.length - 1; i1++) {
            let x1 = arr1Points[i1].x;
            let y1 = arr1Points[i1].y;
            let x2 = arr1Points[i1 + 1].x;
            let y2 = arr1Points[i1 + 1].y;
            for (let i2 = 0; i2 < arr2Points.length - 1; i2++) {
                let x3 = arr2Points[i2].x;
                let y3 = arr2Points[i2].y;
                let x4 = arr2Points[i2 + 1].x;
                let y4 = arr2Points[i2 + 1].y;
                if (Utils.is_lines_intersected(x1, y1, x2, y2, x3, y3, x4, y4)) {
                    is_intersected = true;
                    break;
                }
                if (is_intersected) { break };
            }
        }
        return is_intersected;
    }

    // for tests
    drawObjectsColliders() {
        // draw enemies
        this.enemyObjs.forEach(enemyObj => {
            this.drawColliderObj(enemyObj);
        });
        // draw player
        this.drawColliderObj(this.playerObj);
        // draw base
        this.drawColliderObj(this.baseObj);
        // draw bullets
        this.bulletObjs.forEach(bullet => {
            this.drawColliderObj(bullet);
        });
    }

    drawColliderObj(obj) {
        this.ctx.beginPath();
        let arr = this.getArrTurnedPoints(obj);
        this.ctx.moveTo(arr[0].x, arr[0].y);
        this.getArrTurnedPoints(obj).forEach(element => {
            this.ctx.lineTo(element.x, element.y);
        })
        this.ctx.fill();
        //this.ctx.stroke();
    }

}

//TODO IMPLEMENT 
// 1)Method who changed all small size objects (<70) collider to circle for improve performance collisions with this objects
// 2)Disable animation colliders this objects
// 3)Implement collision detect logic who works with cirles and polygons or check it and togle between collision detect methods
// 4)Added static objects and step by step enable disabled code who works with static objects
// 5)To think about test scenes with test objects for automation units tests. Now tests are manual and too uncomfortable.