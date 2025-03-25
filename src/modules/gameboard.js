export class Gameboard {
    constructor() {
        this.board = this.createBoard(10, 10);
        this.ships = [];
        this.missedAttacks = [];
    }

    createBoard(rows, columns) {
        const boardArray = [];
        for (let i = 0; i < rows; i++) {
            boardArray[i] = [];
            for (let j = 0; j < columns; j++) {
                boardArray[i].push(null);
            }
        }
        return boardArray;
    }

    placeShip(ship, row, column, isHorizontal) {
        if (!this.isValidPlacement(ship, column, row, isHorizontal)) {
            return false;
        }
        if (isHorizontal) {
            for (let i = 0; i < ship.length; i++) {
                this.board[row][column + i] = {
                    ship: ship,
                    index: i,
                };
            }
        } else {
            for (let i = 0; i < ship.length; i++) {
                this.board[row + i][column] = {
                    ship: ship,
                    index: i,
                };
            }
        }
        this.ships.push(ship);
        return true;
    }

    isValidPlacement(ship, row, column, isHorizontal) {
        if (isHorizontal) {
            if (column < 0 || column + ship.length > 10 || row < 0 || row >= 10) {
                return false;
            }
        } else {
            if (column < 0 || column >= 10 || row < 0 || row + ship.length > 10) {
                return false;
            }
        }

        if (isHorizontal) {
            for (let i = 0; i < ship.length; i++) {
                if (this.board[row][column + i] !== null) {
                    return false;
                }
            }
        } else {
            for (let i = 0; i < ship.length; i++) {
                if (this.board[row + i][column] !== null) {
                    return false;
                }
            }
        }

        return true;
    }

    receiveAttack(row, column) {
        if (column < 0 || column >= 10 || row < 0 || row >= 10) {
            return false;
        }

        if (this.board[row][column] !== null) {
            const ship = this.board[row][column]['ship'];
            ship.hit();
            return true;
        } else {
            this.missedAttacks.push({ row, column });
            return false;
        }
    }

    allShipsSunk() {
        return this.ships.length > 0 && this.ships.every((ship) => ship.isSunk());
    }
}
