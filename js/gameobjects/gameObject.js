export default class GameObject {
    constructor(name, startPos_x, startPos_y, width, height) {
        this.gameObject = {
            name: name,
            position: {
                x: startPos_x,
                y: startPos_y
            },
            rotation: 0,
            size: {
                width: width,
                height: height
            }
        };
    }
}