import Engine from "./engine.js";
import Utils from "./utils.js";
import Sound_Module from "./sound.js";
export default class Game {
    constructor(width, height, bckClr) {
        this.width = width;
        this.height = height;
        this.gameEngine = new Engine(width, height, bckClr);
        this.playerObj;
        this.zombie_quantity = 500;
        this.boss_quantity = 3;
    }

    startGame() {
        const engine = this.gameEngine;
        engine.left_bots = this.zombie_quantity;
        engine.createCanvas();
        this.setGameObjects();
        engine.startGameLoop();
    }

    keydown(key) {
        this.playerObj.pressedKeys[key] = true;
    }

    keyup(key) {
        this.playerObj.pressedKeys[key] = false;
    }

    setGameObjects() {
        const engine = this.gameEngine;

        //TODO IMPLEMENT map editor or automapgenerator and also separate 'img/static' folder to 'grases/' 'grounds/' 'roads/' 'decorObjs/' "
        this.build_map(this.width, this.height, 128);

        this.playerObj = engine.createNewGameObject("tank", 650, 580, 75, 50, "player");
        this.playerObj.child = engine.createNewGameObject("tank_tower", this.playerObj.position.x, this.playerObj.position.y, this.playerObj.size.width / 0.53, this.playerObj.size.height / 1.84, "child");

        engine.createNewGameObject("base", this.width / 2, this.height / 2, 200, 200, "base");

        //TODO develop rounds logic  instead  current spawn zombie and boss, when all round creates died, start next round. 
        // for set round enemies need call function like engine.round[0]= list of enemies. List of enemies generate in game.js

        // Zombie spawner
        const zombiesSpawnQuantity = 100;
        const startZombiesFirstTime = 0;
        const intervalZombiesSpawns = 60000;
        const zombieQuantity = this.zombie_quantity;
        this.wavesZombieSpawner(startZombiesFirstTime, intervalZombiesSpawns, zombieQuantity, zombiesSpawnQuantity);

        //TODO it's not realy Boss spawner it;s just spawn more biggest zombie with more HP who can flatten tank and who deal more damage to base.
        //TODO FIX and that is why when spawns next wave this zombies place on more top layer and are drawn over this 'Boss'
        //TODO maybe added to objects new parametr 'layer' and implement layer logic to Engine
        // Boss spawner
        const startBossFirstTime = 30000;
        const intervalBossSpawns = 60000;
        const bossQuantity = this.boss_quantity;
        this.wavesBossSpawner(startBossFirstTime, intervalBossSpawns, bossQuantity);
    }

    //TODO when browser collapsed and game stopped they spawns anyway fix to gameTicks see Engine TODO about it
    // now this ZombieSpawner work only when quantity%spawnQuantity=0
    wavesZombieSpawner(startFirstTime, intervalSpawns, quantity, spawnQuantity) {
        const that = this;
        let timeToNextSpawn = startFirstTime;
        function spawn(quantity) {
            if (!that.gameEngine.is_gameOver()) {
                that.spawnsZombies(quantity);
            }
        }
        while (quantity > 0) {
            let delayFunc = Utils.delay(spawn, timeToNextSpawn);
            delayFunc(spawnQuantity);
            quantity = quantity - spawnQuantity;
            timeToNextSpawn = timeToNextSpawn + intervalSpawns;
        }
    }

    spawnsZombies(quantity) {
        const engine = this.gameEngine;
        const spawnZobies_x = Math.abs(quantity / 1.5);
        const spawnZobies_y = quantity - spawnZobies_x;
        for (let i = 0; i < spawnZobies_x; i++) {
            const newZombie = engine.createNewGameObject("zombie", 0 + i * 25, 0, 58, 63, "enemy");
            newZombie.hp = 2;
        }
        for (let i = 0; i < spawnZobies_y; i++) {
            const newZombie = engine.createNewGameObject("zombie", 0, i * 25, 58, 63, "enemy");
            newZombie.hp = 2;
        }
    }

    wavesBossSpawner(startFirstTime, intervalSpawns, quantity) {
        const that = this;
        let timeToNextSpawn = startFirstTime;
        function spawn() {
            if (!that.gameEngine.is_gameOver()) {
                that.spawnBoss();
            }
        }
        while (quantity > 0) {
            let delayFunc = Utils.delay(spawn, timeToNextSpawn);
            delayFunc();
            quantity = quantity - 1;
            timeToNextSpawn = timeToNextSpawn + intervalSpawns;
        }
    }

    spawnBoss() {
        const engine = this.gameEngine;
        const boss = engine.createNewGameObject("zombie", 0, this.height / 2, 290, 315, "enemy");
        Sound_Module.playTrack(new Audio, "audio/sounds/events/boss_howl.wav");
        boss.hp = 50;
        boss.entered_damage = 10;
        boss.damage_flatten = 51;
    }

    build_map(width, height, title_size) {
        const engine = this.gameEngine;

        build_backg_titles(width, height, title_size);
        build_decorate_titles(width, height, title_size);

        function build_backg_titles(width, height, title_size) {
            const lenghtX = Math.floor(width / title_size);
            const lenghtY = Math.floor(height / title_size);
            for (let iY = 0; iY <= lenghtY; iY++) {
                for (let iX = 0; iX <= lenghtX; iX++) {
                    let posX = title_size / 2 + iX * title_size;
                    let posY = title_size / 2 + iY * title_size;
                    engine.createNewGameObject("sand", posX, posY, title_size, title_size, "decorate");
                }
            }
        };

        //TODO create map Editor now it's just hardcode map from object titles
        function build_decorate_titles(width, height, title_size) {
            function pos(i) {
                return title_size / 2 + i * title_size;
            }

            function addObj(name, x, y) {
                engine.createNewGameObject(name, pos(x), pos(y), title_size, title_size, "decorate");
            }

            // set beach and grass titles
            addObj("beach2_lm_02", 0, 0);
            addObj("beach2_lm_03", 0, 1);
            addObj("lmg_01", 0, 2);
            addObj("beach2_bl", 0, 3);
            addObj("beach2_tl", 0, 4);
            addObj("beach2_lm_01", 0, 5);
            addObj("beach2_bl", 0, 6);

            addObj("grass", 1, 0);
            addObj("grass", 1, 1);
            addObj("grass", 1, 2);
            addObj("beach2_bm_02", 1, 3);
            addObj("beach2_tm_02", 1, 4);
            addObj("grass", 1, 5);
            addObj("beach2_bm_01", 1, 6);

            addObj("grass", 2, 0);
            addObj("grass", 2, 1);
            addObj("grass", 2, 2);
            addObj("bm_01_grass", 2, 3);
            addObj("tr_grass", 2, 4);
            addObj("rm_05_grass", 2, 5);
            addObj("beach2_br", 2, 6);

            addObj("grass", 3, 0);
            addObj("grass", 3, 1);
            addObj("grass", 3, 2);
            addObj("bm_01", 3, 3);
            // addObj("sand", 3, 4);
            // addObj("sand", 3, 5);
            // addObj("sand", 3, 6);

            addObj("grass", 4, 0);
            addObj("grass", 4, 1);
            addObj("grass", 4, 2);
            addObj("bm_02_grass", 4, 3);
            // addObj("sand", 4, 4);
            // addObj("sand", 4, 5);
            // addObj("sand", 4, 6);

            addObj("grass", 5, 0);
            addObj("grass", 5, 1);
            addObj("grass", 5, 2);
            addObj("diagonal_neighbour_grass_rotated", 5, 3);
            addObj("bl_grass", 5, 4);
            // addObj("sand", 5, 5);
            // addObj("sand", 5, 6);

            addObj("grass", 6, 0);
            addObj("grass", 6, 1);
            addObj("grass", 6, 2);
            addObj("grass", 6, 3);
            addObj("bm_02", 6, 4);
            // addObj("sand", 6, 5);
            // addObj("sand", 6, 6);

            addObj("grass", 7, 0);
            addObj("grass", 7, 1);
            addObj("grass", 7, 2);
            addObj("06_grass", 7, 3);
            addObj("r_up_diagonal_grass", 7, 4);
            // addObj("sand", 7, 5);
            // addObj("sand", 7, 6);

            addObj("grass", 8, 0);
            addObj("grass", 8, 1);
            addObj("grass", 8, 2);
            addObj("bm_01_grass", 8, 3);
            addObj("grass_01", 8, 4);
            addObj("bush_big", 8, 5);
            // addObj("sand", 8, 6);

            addObj("grass", 9, 0);
            addObj("grass", 9, 1);
            addObj("grass", 9, 2);
            addObj("bm_02_grass", 9, 3);
            addObj("tl_grass", 9, 4);
            addObj("lm_02", 9, 5);
            addObj("bl_grass", 9, 6);

            addObj("grass", 10, 0);
            addObj("grass", 10, 1);
            addObj("grass", 10, 2);
            addObj("bm_03", 10, 3);
            addObj("tm_01_grass", 10, 4);
            addObj("grass", 10, 5);
            addObj("bm_01_grass", 10, 6);

            addObj("beach2_rm_01", 11, 0);
            addObj("beach2_rm_02", 11, 1);
            addObj("beach2_rm_03", 11, 2);
            addObj("br_grass", 11, 3);
            addObj("down_diagonal_grass", 11, 4);
            addObj("rm_05_grass", 11, 5);
            addObj("br_grass", 11, 6);

            // set asfphalt road
            addObj("road_asphalt_damaged_hor", 0, 4);
            addObj("road_asphalt_damaged_hor", 1, 4);
            addObj("road_asphalt_damaged_to_clean_hor", 2, 4);
            addObj("road_asphalt_clean_hor", 3, 4);
            addObj("road_asphalt_clean_hor", 4, 4);
            addObj("road_asphalt_clean_hor", 5, 4);
            addObj("road_asphalt_clean_hor", 6, 4);
            addObj("road_asphalt_clean_hor", 7, 4);
            addObj("road_asphalt_clean_to_damaged_hor", 8, 4);
            addObj("road_asphalt_damaged_hor", 9, 4);
            addObj("road_asphalt_damaged_hor", 10, 4);
            addObj("road_asphalt_damaged_hor", 11, 4);
            addObj("road_asphalt_damaged_hor", 12, 4);
        };
    }

}