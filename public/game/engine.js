'use strict';

class PuzzleState {
  constructor(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    const total = cols * rows;
    this.tiles = Array.from({ length: total }, (_, index) => ({
      correctIndex: index,
      currentIndex: index,
    }));
  }

  currentGridOf(tileIndex) {
    const currentIndex = this.tiles[tileIndex].currentIndex;
    return { col: currentIndex % this.cols, row: Math.floor(currentIndex / this.cols) };
  }

  correctGridOf(tileIndex) {
    const correctIndex = this.tiles[tileIndex].correctIndex;
    return { col: correctIndex % this.cols, row: Math.floor(correctIndex / this.cols) };
  }

  tileAtGrid(col, row) {
    if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) {
      return -1;
    }

    const target = row * this.cols + col;
    return this.tiles.findIndex((tile) => tile.currentIndex === target);
  }

  pixelOf(tileIndex, tileW, tileH) {
    const grid = this.currentGridOf(tileIndex);
    return { x: grid.col * tileW, y: grid.row * tileH };
  }
}

function isSolved(state) {
  return state.tiles.every((tile) => tile.currentIndex === tile.correctIndex);
}

const Shuffle = {
  shuffle(state) {
    const positions = state.tiles.map((tile) => tile.currentIndex);

    for (let index = positions.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [positions[index], positions[swapIndex]] = [positions[swapIndex], positions[index]];
    }

    state.tiles.forEach((tile, index) => {
      tile.currentIndex = positions[index];
    });

    if (isSolved(state) && state.tiles.length > 1) {
      [state.tiles[0].currentIndex, state.tiles[1].currentIndex] = [state.tiles[1].currentIndex, state.tiles[0].currentIndex];
    }
  },
};

const DIRECTIONS = [
  { dc: 0, dr: -1 },
  { dc: 1, dr: 0 },
  { dc: 0, dr: 1 },
  { dc: -1, dr: 0 },
];

const GroupEngine = {
  areRelativeNeighbors(state, tileA, tileB) {
    const currentA = state.currentGridOf(tileA);
    const currentB = state.currentGridOf(tileB);
    const correctA = state.correctGridOf(tileA);
    const correctB = state.correctGridOf(tileB);

    const currentDeltaCol = currentB.col - currentA.col;
    const currentDeltaRow = currentB.row - currentA.row;

    if (Math.abs(currentDeltaCol) + Math.abs(currentDeltaRow) !== 1) {
      return false;
    }

    return currentDeltaCol === (correctB.col - correctA.col) && currentDeltaRow === (correctB.row - correctA.row);
  },

  computeGroups(state) {
    const groups = [];
    const visited = new Set();

    for (let index = 0; index < state.tiles.length; index += 1) {
      if (visited.has(index)) {
        continue;
      }

      const group = new Set([index]);
      const queue = [index];
      visited.add(index);

      while (queue.length > 0) {
        const current = queue.shift();
        const grid = state.currentGridOf(current);

        DIRECTIONS.forEach(({ dc, dr }) => {
          const neighborIndex = state.tileAtGrid(grid.col + dc, grid.row + dr);
          if (neighborIndex === -1 || visited.has(neighborIndex)) {
            return;
          }

          if (GroupEngine.areRelativeNeighbors(state, current, neighborIndex)) {
            visited.add(neighborIndex);
            group.add(neighborIndex);
            queue.push(neighborIndex);
          }
        });
      }

      if (group.size >= 2) {
        groups.push(group);
      }
    }

    return groups;
  },

  groupOf(groups, tileIndex) {
    return groups.find((group) => group.has(tileIndex)) || null;
  },

  dragGroup(groups, tileIndex) {
    const group = GroupEngine.groupOf(groups, tileIndex);
    return group ? Array.from(group) : [tileIndex];
  },
};

const MoveEngine = {
  swapTwo(state, tileIndex, targetGridIndex) {
    const otherIndex = state.tiles.findIndex((tile) => tile.currentIndex === targetGridIndex);
    if (otherIndex === -1 || otherIndex === tileIndex) {
      return false;
    }

    [state.tiles[tileIndex].currentIndex, state.tiles[otherIndex].currentIndex] = [state.tiles[otherIndex].currentIndex, state.tiles[tileIndex].currentIndex];
    return true;
  },

  moveGroup(state, groupIndices, colOffset, rowOffset) {
    if (colOffset === 0 && rowOffset === 0) {
      return false;
    }

    const dragSet = new Set(groupIndices);
    const moves = [];

    for (const tileIndex of groupIndices) {
      const oldIndex = state.tiles[tileIndex].currentIndex;
      const oldCol = oldIndex % state.cols;
      const oldRow = Math.floor(oldIndex / state.cols);
      const newCol = oldCol + colOffset;
      const newRow = oldRow + rowOffset;

      if (newCol < 0 || newCol >= state.cols || newRow < 0 || newRow >= state.rows) {
        return false;
      }

      moves.push({ tileIndex, oldIndex, newIndex: newRow * state.cols + newCol });
    }

    const newIndexSet = new Set(moves.map((move) => move.newIndex));
    const displaced = moves
      .map((move) => state.tiles.findIndex((tile) => tile.currentIndex === move.newIndex))
      .filter((index) => index !== -1 && !dragSet.has(index));

    const freed = moves
      .map((move) => move.oldIndex)
      .filter((index) => !newIndexSet.has(index));

    if (displaced.length !== freed.length) {
      return false;
    }

    moves.forEach((move) => {
      state.tiles[move.tileIndex].currentIndex = move.newIndex;
    });

    displaced.forEach((tileIndex, index) => {
      state.tiles[tileIndex].currentIndex = freed[index];
    });

    return true;
  },
};

class DragController {
  constructor(canvas, state, cellSize, callbacks = {}) {
    this.canvas = canvas;
    this.state = state;
    this.cellSize = cellSize;
    this.callbacks = callbacks;
    this._drag = null;
    this._x = 0;
    this._y = 0;
    this._groups = [];

    this._onDown = this._onDown.bind(this);
    this._onMove = this._onMove.bind(this);
    this._onUp = this._onUp.bind(this);
  }

  updateGroups(groups) {
    this._groups = groups;
  }

  attach() {
    this.canvas.addEventListener('mousedown', this._onDown);
    this.canvas.addEventListener('mousemove', this._onMove);
    this.canvas.addEventListener('mouseup', this._onUp);
    this.canvas.addEventListener('mouseleave', this._onUp);
    this.canvas.addEventListener('touchstart', this._onDown, { passive: false });
    this.canvas.addEventListener('touchmove', this._onMove, { passive: false });
    this.canvas.addEventListener('touchend', this._onUp, { passive: false });
  }

  detach() {
    this.canvas.removeEventListener('mousedown', this._onDown);
    this.canvas.removeEventListener('mousemove', this._onMove);
    this.canvas.removeEventListener('mouseup', this._onUp);
    this.canvas.removeEventListener('mouseleave', this._onUp);
    this.canvas.removeEventListener('touchstart', this._onDown);
    this.canvas.removeEventListener('touchmove', this._onMove);
    this.canvas.removeEventListener('touchend', this._onUp);
  }

  get dragSnapshot() {
    if (!this._drag) {
      return null;
    }

    return {
      groupIndices: this._drag.groupIndices,
      anchorTileIdx: this._drag.anchorTileIdx,
      x: this._x,
      y: this._y,
      offsetX: this._drag.offsetX,
      offsetY: this._drag.offsetY,
    };
  }

  _getPointerPos(event) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    const source = event.touches ? event.touches[0] : event;
    return {
      x: (source.clientX - rect.left) * scaleX,
      y: (source.clientY - rect.top) * scaleY,
    };
  }

  _tileAtPixel(x, y) {
    const col = Math.floor(x / this.cellSize.tileW);
    const row = Math.floor(y / this.cellSize.tileH);
    return this.state.tileAtGrid(col, row);
  }

  _onDown(event) {
    event.preventDefault();
    const position = this._getPointerPos(event);
    const tileIndex = this._tileAtPixel(position.x, position.y);
    if (tileIndex === -1) {
      return;
    }

    const groupIndices = GroupEngine.dragGroup(this._groups, tileIndex);
    const anchor = this.state.pixelOf(tileIndex, this.cellSize.tileW, this.cellSize.tileH);
    this._drag = {
      groupIndices,
      anchorTileIdx: tileIndex,
      offsetX: position.x - anchor.x,
      offsetY: position.y - anchor.y,
    };
    this._x = position.x;
    this._y = position.y;
    this.callbacks.onDragStart && this.callbacks.onDragStart(tileIndex, groupIndices);
    this.callbacks.onRedraw && this.callbacks.onRedraw();
  }

  _onMove(event) {
    if (!this._drag) {
      return;
    }

    event.preventDefault();
    const position = this._getPointerPos(event);
    this._x = position.x;
    this._y = position.y;
    this.callbacks.onDragMove && this.callbacks.onDragMove(position.x, position.y, this._drag.groupIndices);
    this.callbacks.onRedraw && this.callbacks.onRedraw();
  }

  _onUp(event) {
    if (!this._drag) {
      return;
    }

    event.preventDefault();

    const { tileW, tileH } = this.cellSize;
    const anchor = this.state.pixelOf(this._drag.anchorTileIdx, tileW, tileH);
    const dx = this._x - this._drag.offsetX - anchor.x;
    const dy = this._y - this._drag.offsetY - anchor.y;

    if (this._drag.groupIndices.length === 1) {
      const centerX = anchor.x + dx + tileW / 2;
      const centerY = anchor.y + dy + tileH / 2;
      const col = Math.floor(centerX / tileW);
      const row = Math.floor(centerY / tileH);
      if (col >= 0 && col < this.state.cols && row >= 0 && row < this.state.rows) {
        const targetGridIndex = row * this.state.cols + col;
        if (targetGridIndex !== this.state.tiles[this._drag.anchorTileIdx].currentIndex) {
          this.callbacks.onDrop && this.callbacks.onDrop(this._drag.groupIndices, 0, 0, targetGridIndex);
        }
      }
    } else {
      const colOffset = Math.round(dx / tileW);
      const rowOffset = Math.round(dy / tileH);
      this.callbacks.onDrop && this.callbacks.onDrop(this._drag.groupIndices, colOffset, rowOffset, null);
    }

    this._drag = null;
    this.callbacks.onRedraw && this.callbacks.onRedraw();
  }
}

const ImageSplitter = {
  load(url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error(`ImageSplitter failed to load ${url}`));
      image.src = url;
    });
  },

  split(image, cols, rows, maxBoardW, maxBoardH) {
    const naturalW = image.naturalWidth || image.width;
    const naturalH = image.naturalHeight || image.height;
    const containScale = Math.min(maxBoardW / naturalW, maxBoardH / naturalH);

    let boardW = naturalW * containScale;
    let boardH = naturalH * containScale;
    const tileW = Math.max(1, Math.floor(boardW / cols));
    const tileH = Math.max(1, Math.floor(boardH / rows));
    boardW = tileW * cols;
    boardH = tileH * rows;

    const scaleBackX = naturalW / boardW;
    const scaleBackY = naturalH / boardH;
    const tiles = [];

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        tiles.push({
          tileIndex: row * cols + col,
          col,
          row,
          srcX: col * tileW * scaleBackX,
          srcY: row * tileH * scaleBackY,
          srcW: tileW * scaleBackX,
          srcH: tileH * scaleBackY,
          bgSize: `${boardW}px ${boardH}px`,
          bgPosition: `-${col * tileW}px -${row * tileH}px`,
        });
      }
    }

    return { boardW, boardH, tileW, tileH, tiles };
  },

  async loadAndSplit(url, cols, rows, maxBoardW, maxBoardH) {
    const image = await this.load(url);
    const result = this.split(image, cols, rows, maxBoardW, maxBoardH);
    return { image, ...result };
  },
};

window.PuzzleState = PuzzleState;
window.Shuffle = Shuffle;
window.GroupEngine = GroupEngine;
window.MoveEngine = MoveEngine;
window.DragController = DragController;
window.isSolved = isSolved;
window.ImageSplitter = ImageSplitter;
