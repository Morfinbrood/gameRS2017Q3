import GameInterface from "./gameInterface.js";


var interface2;

window.onload = function () {
    document.getElementById('loadingBut').style.display = 'none';
    const starBut = document.getElementById('startBut');
    starBut.style.display = 'none';
    interface2 = new GameInterface();
    starBut.addEventListener('click', () => { interface2.startGameButton() })

    document.getElementById("startBut").removeAttribute('style');
};
