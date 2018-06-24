import Utils from "../utils.js";
export default class CollidersCollection {
    constructor(width, height) {

        this.base = {
            sprite_size: {
                width: 185,
                height: 185
            },
            //TODO IMPLEMENT change hardcoded width and height like this 185 to property sprite_size.width  and sprite_size.height
            points: [
                { x: Utils.getScaled(-92, 185 / width), y: Utils.getScaled(-92, 185 / height) },
                { x: Utils.getScaled(92, 185 / width), y: Utils.getScaled(-92, 185 / height) },
                { x: Utils.getScaled(92, 185 / width), y: Utils.getScaled(92, 185 / height) },
                { x: Utils.getScaled(-92, 185 / width), y: Utils.getScaled(92, 185 / height) },
                { x: Utils.getScaled(-92, 185 / width), y: Utils.getScaled(-92, 185 / height) }
            ],
        }

        this.zombie = {
            sprite_size: {
                width: 288,
                height: 311
            },
            // for skeleton-move_5.png
            points: [
                { x: Utils.getScaled(-96, 288 / width), y: Utils.getScaled(-5, 311 / height) },
                { x: Utils.getScaled(-59, 288 / width), y: Utils.getScaled(-62, 311 / height) },
                { x: Utils.getScaled(-21, 288 / width), y: Utils.getScaled(-95, 311 / height) },
                { x: Utils.getScaled(11, 288 / width), y: Utils.getScaled(-104, 311 / height) },
                { x: Utils.getScaled(64, 288 / width), y: Utils.getScaled(-78, 311 / height) },
                { x: Utils.getScaled(69, 288 / width), y: Utils.getScaled(-61, 311 / height) },
                { x: Utils.getScaled(53, 288 / width), y: Utils.getScaled(-49, 311 / height) },
                { x: Utils.getScaled(28, 288 / width), y: Utils.getScaled(-63, 311 / height) },
                { x: Utils.getScaled(28, 288 / width), y: Utils.getScaled(-74, 311 / height) },
                { x: Utils.getScaled(1, 288 / width), y: Utils.getScaled(-76, 311 / height) },
                { x: Utils.getScaled(-21, 288 / width), y: Utils.getScaled(-48, 311 / height) },
                { x: Utils.getScaled(26, 288 / width), y: Utils.getScaled(-16, 311 / height) },
                { x: Utils.getScaled(26, 288 / width), y: Utils.getScaled(23, 311 / height) },
                { x: Utils.getScaled(-7, 288 / width), y: Utils.getScaled(49, 311 / height) },
                { x: Utils.getScaled(15, 288 / width), y: Utils.getScaled(67, 311 / height) },
                { x: Utils.getScaled(49, 288 / width), y: Utils.getScaled(68, 311 / height) },
                { x: Utils.getScaled(52, 288 / width), y: Utils.getScaled(55, 311 / height) },
                { x: Utils.getScaled(76, 288 / width), y: Utils.getScaled(45, 311 / height) },
                { x: Utils.getScaled(92, 288 / width), y: Utils.getScaled(60, 311 / height) },
                { x: Utils.getScaled(79, 288 / width), y: Utils.getScaled(81, 311 / height) },
                { x: Utils.getScaled(61, 288 / width), y: Utils.getScaled(81, 311 / height) },
                { x: Utils.getScaled(25, 288 / width), y: Utils.getScaled(96, 311 / height) },
                { x: Utils.getScaled(0, 288 / width), y: Utils.getScaled(94, 311 / height) },
                { x: Utils.getScaled(-74, 288 / width), y: Utils.getScaled(47, 311 / height) },
                { x: Utils.getScaled(-96, 288 / width), y: Utils.getScaled(-5, 311 / height) }
            ],
        }

        this.tank = {
            sprite_size: {
                width: 150,
                height: 100
            },
            points: [
                { x: Utils.getScaled(-75, 150 / width), y: Utils.getScaled(-50, 100 / height) },
                { x: Utils.getScaled(75, 150 / width), y: Utils.getScaled(-50, 100 / height) },
                { x: Utils.getScaled(75, 150 / width), y: Utils.getScaled(50, 100 / height) },
                { x: Utils.getScaled(-75, 150 / width), y: Utils.getScaled(50, 100 / height) },
                { x: Utils.getScaled(-75, 150 / width), y: Utils.getScaled(-50, 100 / height) },
            ],
        }

        this.tank_bullet = {
            sprite_size: {
                width: 18,
                height: 18
            },
            points: [
                { x: Utils.getScaled(-9, 18 / width), y: Utils.getScaled(-9, 18 / height) },
                { x: Utils.getScaled(9, 18 / width), y: Utils.getScaled(-9, 18 / height) },
                { x: Utils.getScaled(9, 18 / width), y: Utils.getScaled(9, 18 / height) },
                { x: Utils.getScaled(-9, 18 / width), y: Utils.getScaled(9, 18 / height) },
                { x: Utils.getScaled(-9, 18 / width), y: Utils.getScaled(-9, 18 / height) },
            ],
        }

    };
}