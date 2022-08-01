import Dispatcher from "./dispatcher.js";
import Minesweeper from "./minespeeper.js";
function createField(root, size, dispatcher) {
    const val = `repeat(${size}, 1fr)`;
    root.style.gridTemplateRows = val;
    root.style.gridTemplateColumns = val;
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            const cell = document.createElement('div');
            dispatcher.addClickable(cell, row, col);
            root.appendChild(cell);
        }
    }
}
function cleanupField(root) {
    while (root.firstChild) {
        root.removeChild(root.lastChild);
    }
}
function play(boardSize, bombPercentage) {
    const startWindow = document.getElementById('start-window');
    startWindow.style.display = 'none';
    const playWindow = document.getElementById('play-window');
    playWindow.style.display = 'grid';
    const root = document.getElementById('minesweeper');
    const status = document.getElementById('status');
    const checkWin = document.getElementById('check-win');
    const restart = document.getElementById('restart');
    const onGameOver = () => {
        checkWin.style.display = 'none';
        restart.style.display = 'block';
    };
    const minesweeper = new Minesweeper(boardSize, bombPercentage);
    const dispatcher = new Dispatcher(minesweeper, () => {
        minesweeper.renderTo(root);
        if (minesweeper.exploded) {
            status.textContent = 'Dead!🤯';
            onGameOver();
        }
    });
    checkWin.onclick = () => {
        if (minesweeper.defused) {
            status.textContent = 'Defused!🥸';
            onGameOver();
        }
        else {
            alert('Keep defusing!');
        }
    };
    restart.onclick = () => {
        cleanupField(root);
        playWindow.style.display = 'none';
        startWindow.style.display = 'grid';
    };
    status.textContent = '';
    checkWin.style.display = 'block';
    restart.style.display = 'none';
    createField(root, boardSize, dispatcher);
    minesweeper.renderTo(root);
}
function main() {
    const startForm = document.getElementById('start-game-form');
    const sizeInput = startForm.querySelector('input');
    startForm.onsubmit = (event) => {
        event.preventDefault();
        const boardSize = Number(sizeInput.value);
        play(boardSize, 20);
    };
}
main();
