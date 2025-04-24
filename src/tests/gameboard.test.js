import { Gameboard } from '../modules/gameboard';
import { Ship } from '../modules/ship';

describe('Gameboard', () => {
    let gameboard;
    let ship;

    beforeEach(() => {
        gameboard = new Gameboard();
        ship = new Ship(3);
    });

    test('should be initialized with empty 10x10 board', () => {
        expect(gameboard.board.length).toBe(10);

        for (let row of gameboard.board) {
            expect(row.length).toBe(10);
            for (let cell of row) {
                expect(cell).toBe(null);
            }
        }
    });

    describe('placeShip', () => {
        test('should place a ship horizontally', () => {
            expect(gameboard.placeShip(ship, 0, 0, true)).toBe(true);
            expect(gameboard.board[0][0]).toHaveProperty('ship', ship);
            expect(gameboard.board[0][1]).toHaveProperty('ship', ship);
            expect(gameboard.board[0][2]).toHaveProperty('ship', ship);
        });

        test('should place a ship vertically', () => {
            expect(gameboard.placeShip(ship, 0, 0, false)).toBe(true);
            expect(gameboard.board[0][0]).toHaveProperty('ship', ship);
            expect(gameboard.board[1][0]).toHaveProperty('ship', ship);
            expect(gameboard.board[2][0]).toHaveProperty('ship', ship);
        });

        test('should store ship index with each cell', () => {
            gameboard.placeShip(ship, 3, 2, true);
            expect(gameboard.board[3][2].index).toBe(0);
            expect(gameboard.board[3][3].index).toBe(1);
            expect(gameboard.board[3][4].index).toBe(2);
        });

        test('should not place ship outside horizontal bounds', () => {
            expect(gameboard.placeShip(ship, 0, 8, true)).toBe(false);
        });

        test('should not place ship outside vertical bounds', () => {
            expect(gameboard.placeShip(ship, 8, 0, false)).toBe(false);
        });

        test('should not place ship at negative coordinates', () => {
            expect(gameboard.placeShip(ship, -1, 0, true)).toBe(false);
            expect(gameboard.placeShip(ship, 0, -1, true)).toBe(false);
        });

        test('should not allow ships to overlap', () => {
            gameboard.placeShip(ship, 0, 0, true);
            const ship2 = new Ship(2);
            expect(gameboard.placeShip(ship2, 0, 0, true)).toBe(false);
            expect(gameboard.ships.length).toBe(1);
        });
    });

    describe('receiveAttack', () => {
        beforeEach(() => {
            gameboard.placeShip(ship, 3, 4, true);
        });

        test('should register a hit on a ship', () => {
            expect(gameboard.receiveAttack(3, 4)).toBe(true);
            expect(ship.hits).toBe(1);
        });

        test('should register a miss', () => {
            expect(gameboard.receiveAttack(0, 0)).toBe(false);
            expect(gameboard.missedAttacks).toContainEqual({ row: 0, column: 0 });
        });

        test('should record all missed attacks', () => {
            gameboard.receiveAttack(0, 0);
            gameboard.receiveAttack(1, 1);
            expect(gameboard.missedAttacks.length).toBe(2);
            expect(gameboard.missedAttacks).toContainEqual({ row: 0, column: 0 });
            expect(gameboard.missedAttacks).toContainEqual({ row: 1, column: 1 });
        });

        test('should reject attacks outside the board', () => {
            expect(gameboard.receiveAttack(-1, 5)).toBe(false);
            expect(gameboard.receiveAttack(10, 5)).toBe(false);
            expect(gameboard.receiveAttack(5, -1)).toBe(false);
            expect(gameboard.receiveAttack(5, 10)).toBe(false);
            expect(gameboard.missedAttacks.length).toBe(0);
        });

        test('should hit the correct ship when multiple ships are present', () => {
            const ship2 = new Ship(2);
            gameboard.placeShip(ship2, 0, 0, true);

            gameboard.receiveAttack(3, 4);
            expect(ship.hits).toBe(1);
            expect(ship2.hits).toBe(0);

            gameboard.receiveAttack(0, 0);
            expect(ship.hits).toBe(1);
            expect(ship2.hits).toBe(1);
        });
    });

    describe('allShipsSunk', () => {
        test('should return false when no ships are placed', () => {
            expect(gameboard.allShipsSunk()).toBe(false);
        });

        test('should return false when not all ships are sunk', () => {
            gameboard.placeShip(ship, 0, 0, true);
            gameboard.receiveAttack(0, 0);
            expect(gameboard.allShipsSunk()).toBe(false);
        });

        test('should return true when all ships are sunk', () => {
            gameboard.placeShip(ship, 0, 0, true);
            gameboard.receiveAttack(0, 0);
            gameboard.receiveAttack(0, 1);
            gameboard.receiveAttack(0, 2);
            expect(gameboard.allShipsSunk()).toBe(true);
        });

        test('should return true when multiple ships are all sunk', () => {
            gameboard.placeShip(ship, 0, 0, true);
            const ship2 = new Ship(2);
            gameboard.placeShip(ship2, 3, 3, true);

            gameboard.receiveAttack(0, 0);
            gameboard.receiveAttack(0, 1);
            gameboard.receiveAttack(0, 2);

            gameboard.receiveAttack(3, 3);
            gameboard.receiveAttack(3, 4);

            expect(gameboard.allShipsSunk()).toBe(true);
        });

        test('should return false when only some ships are sunk', () => {
            gameboard.placeShip(ship, 0, 0, true);
            const ship2 = new Ship(2);
            gameboard.placeShip(ship2, 3, 3, true);

            gameboard.receiveAttack(0, 0);
            gameboard.receiveAttack(0, 1);
            gameboard.receiveAttack(0, 2);

            expect(gameboard.allShipsSunk()).toBe(false);
        });
    });
});
