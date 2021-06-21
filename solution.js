/* exported generateGrid, drawGrid */
/* global placeTile */

function gridCheck(grid, i, j, target, target2) {
    return grid[i][j] == target || grid[i][j] == target2;
}

function gridCode(grid, i, j, target, target2) {
    let northBit = i != 0 && gridCheck(grid, i - 1, j, target, target2);
    let southBit = i != grid.length - 1 && gridCheck(grid, i + 1, j, target, target2);
    let eastBit = j != grid[i].length - 1 && gridCheck(grid, i, j + 1, target, target2);
    let westBit = j != 0 && gridCheck(grid, i, j - 1, target, target2);
    return (northBit << 0) + (southBit << 1) + (eastBit << 2) + (westBit << 3);
}

function drawContext(grid, i, j, target, target2, ti, tj) {
    let code = gridCode(grid, i, j, target, target2);
    if (lookup[code] != null) {
        let [tiOffset, tjOffset] = lookup[code];
        placeTile(i, j, ti + tiOffset, tj + tjOffset);
    }
}

const lookup = [
    [0, 0],
    [3, 0],
    [3, 2],
    null,
    [4, 1],
    [4, 0],
    [4, 2],
    null,
    [2, 1],
    [2, 0],
    [2, 2],
    null,
    null,
    null,
    null,
    null
];

function generateGrid(numCols, numRows) {
    let grid = [];

    // Forrest
    for (let i = 0; i < numRows; i++) {
        let row = [];
        for (let j = 0; j < numCols; j++) {
            row.push("_");
        }
        grid.push(row);
    }

    // Abandoned Buildings
    let istart = random(1, 3) | 0;
    let iend = random(7, 10) | 0;
    let jstart = random(1, 8) | 0;
    let jend = random(12, 19) | 0;
    for (let i = istart; i < iend; i++) {
        for (let j = jstart; j < jend; j++) {
            grid[i][j] = "b";
        }
    }
    let i2start = random(11, 15) | 0;
    let i2end = random(17, 20) | 0;
    let j2start = random(1, 8) | 0;
    let j2end = random(12, 19) | 0;
    for (let i = i2start; i < i2end; i++) {
        for (let j = j2start; j < j2end; j++) {
            grid[i][j] = "b";
        }
    }
    let room1x = random(jstart, jend) | 0;
    let room1y = iend;
    let room2x = random(j2start, j2end) | 0;
    let room2y = i2start;

    // Walkway
    for (let i = room1y; i < room2y; i++) {
        grid[i][room1x] = "w";
    }
    if (room1x < room2x) {
        for (let i = room1x; i < room2x; i++) {
            grid[room2y - 1][i] = "w";
        }
    } else {
        for (let i = room2x; i < room1x; i++) {
            grid[room2y - 1][i] = "w";
        }
    }

    return grid;
}

function drawGrid(grid) {
    background("#086623");
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {

            // Forrest
            if (gridCheck(grid, i, j, "_")) {
                placeTile(i, j, 14, 6);
            }

            // Abandoned Buildings
            if (gridCheck(grid, i, j, "b")) {
                drawContext(grid, i, j, "_", "w", 23, 21);
            }

            // Walkway
            if (grid[i][j] == "w") {
                placeTile(i, j, 0, 24);
            }
        }
    }

    // Rain
    noStroke();
    fill("#0000FF");
    for (let i = 0; i < 100; i++) {
        let r = 5 * random();
        let z = random();
        let y = height * ((millis() / 10000.0 / z) % 1);
        let x = width * random();
        ellipse(x, y, r);
    }
}
