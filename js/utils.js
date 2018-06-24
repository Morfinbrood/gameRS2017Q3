export default class Utils {
    static setSprite(src) {
        let img = document.createElement('img');
        img.setAttribute("src", src);
        return img;
    }

    static getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    static delay(f, ms) {
        return function () {
            var savedThis = this;
            var savedArgs = arguments;

            setTimeout(function () {
                f.apply(savedThis, savedArgs);
            }, ms);
        };
    }

    static get_force_vector(rotation) {
        let force_vector = {
            x: Math.cos(rotation * (Math.PI / 180)),
            y: Math.sin(rotation * (Math.PI / 180))
        }
        return force_vector;
    }

    static turning_point_by_angle(x, y, x_turn, y_turn, angle) {
        let result = {
            x: x_turn + (x - x_turn) * Math.cos(angle * Math.PI / 180) + (y_turn - y) * Math.sin(angle * Math.PI / 180),
            y: y_turn + (x - x_turn) * Math.sin(angle * Math.PI / 180) + (y - y_turn) * Math.cos(angle * Math.PI / 180)
        }
        return result;
    }

    static is_lines_intersected(x1, y1, x2, y2, x3, y3, x4, y4) {
        let is_intersected = true;
        let Z1 = (x3 - x1) * (y2 - y1) - (y3 - y1) * (x2 - x1);
        let Z2 = (x4 - x1) * (y2 - y1) - (y4 - y1) * (x2 - x1);
        if (Z1 * Z2 > 0) {
            is_intersected = false;
        }
        let Z3 = (x1 - x3) * (y4 - y3) - (y1 - y3) * (x4 - x3);
        let Z4 = (x2 - x3) * (y4 - y3) - (y2 - y3) * (x4 - x3);
        if (Z3 * Z4 > 0) {
            is_intersected = false;
        }
        if (is_intersected) {
        }
        return is_intersected;
    }

    static shuffleCollection(arrCollection) {
        function compareRandom(a, b) { return Math.random() - 0.5; }
        for (let i = 0; i < 100; i++) {
            arrCollection.sort(compareRandom);
        }
    }

    // only for objects
    static transferObjToNewArr(obj, arr1, arr2) {
        let index = 0;
        let i = 0;
        arr1.forEach(element => {
            if (obj === element) {
                index = i;
            }
            i++;
        });
        let copyObj = Object.assign({}, obj);
        arr1[index] = null;
        arr2.push(copyObj);
        arr1.splice(index, 1);
    }

    static deleteObjFromArr(obj, arr1) {
        let index = 0;
        let i = 0;
        arr1.forEach(element => {
            if (obj === element) {
                index = i;
            }
            i++;
        });
        arr1[index] = null;
        arr1.splice(index, 1);
    }

    static getScaled(coord, k) {
        return 0 - (0 - coord) / k;
    }

    static myTranslate(x, y, point) {
        return { x: point.x + x, y: point.y + y };
    }

}