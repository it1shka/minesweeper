function getRandomIndex(array) {
    const index = Math.floor(Math.random() * array.length);
    return index;
}
export function getRandomAndRemove(array) {
    const index = getRandomIndex(array);
    const item = array[index];
    array.splice(index, 1);
    return item;
}
export function initMatrix(size, value) {
    const matrix = Array(size);
    for (let i = 0; i < size; i++) {
        const row = Array(size).fill(value);
        matrix[i] = row;
    }
    return matrix;
}
export function positionsContain(positions, [r, c]) {
    return positions.some(([row, col]) => {
        return r === row && c === col;
    });
}
export function removePosition(positions, [r, c]) {
    const index = positions.findIndex(([row, col]) => {
        return r === row && c === col;
    });
    if (index > -1) {
        positions.splice(index, 1);
    }
}
