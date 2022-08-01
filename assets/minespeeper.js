import { getRandomAndRemove, initMatrix, positionsContain, removePosition } from './utils.js';
class Minesweeper {
    constructor(size, bombPercentage) {
        this.size = size;
        this.bombPercentage = bombPercentage;
        this.bombs = [];
        this.flags = [];
        this.isDead = false;
        this.won = false;
        this.generateBombs();
        this.countmap = initMatrix(this.size, 0);
        this.setupCountmap();
        this.fog = initMatrix(this.size, true);
    }
    generateAllPositions() {
        const output = [];
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const pos = [row, col];
                output.push(pos);
            }
        }
        return output;
    }
    generateBombs() {
        const mapSize = this.size ** 2;
        const bombsAmount = Math.round(mapSize * this.bombPercentage / 100);
        const freePositions = this.generateAllPositions();
        for (let i = 0; i < bombsAmount; i++) {
            const bomb = getRandomAndRemove(freePositions);
            this.bombs.push(bomb);
        }
    }
    setupCountmap() {
        for (const [brow, bcol] of this.bombs) {
            for (let row = brow - 1; row <= brow + 1; row++) {
                for (let col = bcol - 1; col <= bcol + 1; col++) {
                    if (row < 0 || row >= this.size || col < 0 || col >= this.size)
                        continue;
                    this.countmap[row][col]++;
                }
            }
        }
    }
    toggleFlag(row, column) {
        if (this.isDead || this.won)
            return;
        if (!this.fog[row][column])
            return;
        const pos = [row, column];
        if (positionsContain(this.flags, pos)) {
            removePosition(this.flags, pos);
        }
        else {
            this.flags.push(pos);
        }
    }
    defuse(row, column) {
        if (this.isDead || this.won)
            return;
        if (!this.fog[row][column])
            return;
        if (positionsContain(this.flags, [row, column]))
            return;
        if (positionsContain(this.bombs, [row, column])) {
            this.fog[row][column] = false;
            this.isDead = true;
            return;
        }
        const visited = [[row, column]];
        const queue = [[row, column]];
        while (queue.length > 0) {
            const [row, col] = queue.shift();
            this.fog[row][col] = false;
            if (this.countmap[row][col] > 0)
                continue;
            for (let r = row - 1; r <= row + 1; r++) {
                for (let c = col - 1; c <= col + 1; c++) {
                    if (r < 0 || c < 0 || r >= this.size || c >= this.size)
                        continue;
                    if (positionsContain(visited, [r, c]))
                        continue;
                    visited.push([r, c]);
                    queue.push([r, c]);
                }
            }
        }
    }
    get exploded() {
        return this.isDead;
    }
    get defused() {
        if (this.won)
            return true;
        return (this.won = this.checkWin());
    }
    checkWin() {
        for (const bomb of this.bombs) {
            if (!positionsContain(this.flags, bomb)) {
                return false;
            }
        }
        return this.flags.length === this.bombs.length;
    }
    renderTo(display) {
        const cells = display.children;
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const cell = cells[row * this.size + col];
                const tag = (() => {
                    switch (true) {
                        case positionsContain(this.flags, [row, col]): return 'flag';
                        case this.fog[row][col]: return 'fog';
                        case positionsContain(this.bombs, [row, col]): return 'bomb';
                        default: return this.countmap[row][col];
                    }
                })();
                if (typeof tag === 'string') {
                    cell.className = tag;
                }
                else {
                    cell.classList.remove('fog');
                    if (tag > 0)
                        cell.textContent = String(tag);
                }
            }
        }
    }
}
export default Minesweeper;
