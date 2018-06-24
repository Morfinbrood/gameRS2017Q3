import Sound_Module from "./sound.js";
import Utils from "./utils.js";
import Game from "./game.js";
export default class GameInterface {
    constructor() {
        this.intro = new Audio();
        Sound_Module.playTrack(this.intro, "audio/music/intro.mp3");
        this.game;
        this.musicPlaylist;
    }

    startGameButton() {
        document.getElementById("gameMenuID").setAttribute("style", "display:none");

        this.game = new Game(1600, 900, '#686C5E');

        this.init_game_control_input();

        // stop intro
        Sound_Module.pausePlay(this.intro);
        this.intro = null;
        // start backround music
        this.startNewPlaylist(true);

        this.game.startGame();
    }

    restartGame() {
        var gameCanvas = document.getElementsByTagName("canvas");
        gameCanvas[0].parentNode.removeChild(gameCanvas[0]);
        this.game = new Game(1600, 900, '#686C5E');
        this.game.startGame();
    }

    randomTrack() {
        this.stopPlayList();
        this.startNewPlaylist();
    }

    stopPlayList() {
        Sound_Module.pausePlay(this.musicPlaylist);
        this.musicPlaylist = null;
    }

    startNewPlaylist(paused = false) {
        const playlist = ["audio/music/Sick Bubblegum (minus).mp3", "audio/music/Living Dead Girl (minus).mp3", "audio/music/Dragula.mp3", "audio/music/Superbeast.mp3"];
        Utils.shuffleCollection(playlist);
        this.musicPlaylist = Sound_Module.playBackGroundPlaylist(playlist, paused);
    }

    init_game_control_input() {
        const that = this;
        let keyMap = {
            68: 'right',
            65: 'left',
            87: 'up',
            83: 'down',
            37: 'tower_left',
            39: 'tower_right',
            32: 'fire',
            55: 'random_track',
            56: 'decreaseVol',
            57: 'increaseVol',
            48: 'musicOff_On',
            38: 'fire_machinegun'
        };

        function keydown(event) {
            switch (keyMap[event.keyCode]) {
                case "decreaseVol":
                    Sound_Module.decreaseMusicVol(that.musicPlaylist, 0.05);
                    break;
                case "increaseVol":
                    Sound_Module.increaseMusicVol(that.musicPlaylist, 0.05);
                    break;
            }
            that.game.keydown(keyMap[event.keyCode]);
        }
        function keyup(event) {
            switch (keyMap[event.keyCode]) {
                case "musicOff_On":
                    Sound_Module.musicPause_Unpause(that.musicPlaylist);
                    break;
                case "random_track":
                    that.randomTrack();
                    break;
            }
            that.game.keyup(keyMap[event.keyCode]);
        }

        window.addEventListener("keydown", keydown, false);
        window.addEventListener("keyup", keyup, false);
    }
}