export class Gameboard {
    constructor() {
        this.board = this.createBoard(10, 10);
        this.ships = [];
        this.attacks = [];
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
        if (!this.isValidPlacement(ship, row, column, isHorizontal)) {
            return false;
        }
        if (isHorizontal) {
            for (let i = 0; i < ship.length; i++) {
                this.board[row][column + i] = {
                    ship: ship,
                };
            }
        } else {
            for (let i = 0; i < ship.length; i++) {
                this.board[row + i][column] = {
                    ship: ship,
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

        const alreadyAttacked = this.attacks.some((attack) => attack.row === row && attack.column === column);

        if (alreadyAttacked) {
            return false;
        }

        if (this.board[row][column] !== null) {
            const ship = this.board[row][column]['ship'];
            ship.hit();
            this.attacks.push({ row: row, column: column, hitTarget: true });
            return true;
        } else {
            this.attacks.push({ row: row, column: column, hitTarget: false });
            return false;
        }
    }

    get missedAttacks() {
        return this.attacks
            .filter((attack) => attack.hitTarget === false)
            .map((attack) => {
                return { row: attack.row, column: attack.column };
            });
    }

    allShipsSunk() {
        return this.ships.length > 0 && this.ships.every((ship) => ship.isSunk());
    }
}
