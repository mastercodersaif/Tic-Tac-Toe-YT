const moveElements = document.querySelectorAll('.js-move');
const turnElement = document.querySelector('.js-turn');

const tileManipulators = {
  incrementColumn: moveTile => {
    return `r${Number(moveTile[1])}c${Number(moveTile[3])+1}`;
  },
  incrementRow: moveTile => {
    return `r${Number(moveTile[1])+1}c${Number(moveTile[3])}`;
  },
  decrementColumn: moveTile => {
    return `r${Number(moveTile[1])}c${Number(moveTile[3])-1}`;
  },
  decrementRow: moveTile => {
    return `r${Number(moveTile[1])-1}c${Number(moveTile[3])}`;
  },
  incrementBoth: moveTile => {
    return `r${Number(moveTile[1])+1}c${Number(moveTile[3])+1}`;
  },
  decrementBoth: moveTile => {
    return `r${Number(moveTile[1])-1}c${Number(moveTile[3])-1}`;
  },
  incrementDecrementBoth: moveTile => {
    return `r${Number(moveTile[1])+1}c${Number(moveTile[3])-1}`;
  },
  decrementIncrementBoth: moveTile => {
    return `r${Number(moveTile[1])-1}c${Number(moveTile[3])+1}`;
  }
}

let renderWin = false;

moveElements.forEach(moveElement => {
  moveElement.addEventListener('click', () => {
    if (!renderWin) {
      moveRender(moveElement);
      updateTurnElement();
    }
  })
})

let turnO = Math.random() < 0.5 ? true : false;
let turnX = turnO ? false : true;

updateTurnElement();

const tiles = initTiles();
addTileData();

const movesArray = [];

let winningManipulator = undefined;
const winningArray = [];

const tileMethods = {
  verifyTile: tileName => {
    if (Number(tileName[1])>3 || Number(tileName[3]>3) ||
      Number(tileName[1])<1 || Number(tileName[3]<1)) {
        return undefined;
      }
    else {
      return tileName;
    }
  },
  findTile: tileName => {
    theTile = undefined;
    tiles.forEach(tile => {
      if (tile.name === tileName) {
        theTile = tile;
      }
    })
    return theTile;
  }
}

function initTiles() {
  const workingTiles = [];
  for (let r = 1; r < 4; r ++) {
    for (let c = 1; c < 4; c ++) {
      const tile = {
        name: `r${r}c${c}`,
        move: undefined
      }
      workingTiles.push(tile);
    }
  }
  for (let i = 0; i < 9; i ++) {
    workingTiles[i].tileElement = moveElements[i];
  }
  return workingTiles;
}

function addTileData() {
  for (let i = 0; i < 9; i ++) {
    moveElements[i].dataset.name = tiles[i].name;
  }
}

function updateTileMove() {
  movesArray.forEach(move => {
    const moveType = move[0];
    const moveTile = move.substring(2);

    tiles.forEach(tile => {
      if (tile.name === moveTile) {
        tile.move = moveType;
      }
    })
  })
}

function moveRender(moveElement) {
  if (moveElement.innerHTML) {
    return;
  }
  
  if (turnO) {
    const html = '<img src="images/O.png" class="move-icon">';
    moveElement.innerHTML = html;

    movesArray.push(`o-${moveElement.dataset.name}`);
    updateTileMove();

    turnO = false;
    turnX = true;
  }

  else if (turnX) {
    const html = '<img src="images/X.png" class="move-icon">';
    moveElement.innerHTML = html;

    movesArray.push(`x-${moveElement.dataset.name}`);
    updateTileMove();

    turnO = true;
    turnX = false;
  }

  winMaker();
}

function updateTurnElement() {
  if (renderWin) {return};
  if (turnO) {
    turnElement.style.backgroundColor = 'rgb(91, 198, 234)';
    turnElement.innerText = 'Turn: O';
  }
  else if (turnX) {
    turnElement.style.backgroundColor = 'rgb(244, 81, 81)';
    turnElement.innerText = 'Turn: X';
  }
}

function winMaker() {
  movesArray.forEach(move => {
    const moveType = move[0];
    const moveTile = move.substring(2);

    Object.entries(tileManipulators).forEach(([manipulatorName, manipulator]) => {
      const potentialFirstMove = tileMethods.verifyTile(manipulator(moveTile));
      const potentialSecondMove = potentialFirstMove ? tileMethods.verifyTile(manipulator(potentialFirstMove)) : undefined;

      if (potentialFirstMove && potentialSecondMove) {
        if (tileMethods.findTile(potentialFirstMove).move === moveType && 
          tileMethods.findTile(potentialSecondMove).move === moveType) {
            if (!renderWin) {
              renderWin = true;
              turnElement.innerText = `${moveType.toUpperCase()} won!`;

              winningManipulator = manipulatorName;
              winningArray.push(moveTile, potentialFirstMove, potentialSecondMove);
              renderStrike();
            } 
          }
      }
    }) 
  })
}

function renderStrike() {
  let lowestMove = undefined;
  let lowestIndex = undefined;

  winningArray.forEach(move => {
    const i = tiles.indexOf(tileMethods.findTile(move));
    if (!lowestMove || i < lowestIndex) {
      lowestMove = move;
      lowestIndex = i;
    }
  })

  const tileElement = tileMethods.findTile(lowestMove).tileElement;

  if (['incrementColumn', 'decrementColumn'].includes(winningManipulator)) {
    tileElement.innerHTML += 
      '<div id="horizontal-strike">&nbsp;</div>';
  }
  else if (['incrementRow', 'decrementRow'].includes(winningManipulator)) {
    tileElement.innerHTML += 
      '<div id="vertical-strike">&nbsp;</div>';
  }
  else if (['incrementBoth', 'decrementBoth'].includes(winningManipulator)) {
    tileElement.innerHTML += 
      '<div id="diagonal-strike">&nbsp;</div>';
  }
  else if (['incrementDecrementBoth', 'decrementIncrementBoth'].includes(winningManipulator)) {
    tileElement.innerHTML += 
      '<div id="diagonal-flipped-strike">&nbsp;</div>';
  }
}