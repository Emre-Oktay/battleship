import { Player } from '../modules/player';
import { Gameboard } from '../modules/gameboard';
import { Ship } from '../modules/ship';

describe('Player', () => {
    let humanPlayer;
    let computerPlayer;
    let enemyGameboard;

    beforeEach(() => {
        humanPlayer = new Player(false);
        computerPlayer = new Player(true);
        enemyGameboard = new Gameboard();
    });

    describe('initialization', () => {
        test('should create a human player', () => {
            expect(humanPlayer.isComputer).toBe(false);
            expect(humanPlayer.gameboard).toBeInstanceOf(Gameboard);
        });

        test('should create a computer player', () => {
            expect(computerPlayer.isComputer).toBe(true);
            expect(computerPlayer.gameboard).toBeInstanceOf(Gameboard);
        });
    });

    describe('manual ship placement', () => {
        test('should place a ship', () => {
            expect(humanPlayer.manualPlaceShip(3, 4, true)).toBe(true);
            expect(humanPlayer.gameboard.board[3][4]).toHaveProperty('ship');
            expect(humanPlayer.gameboard.board[3][5]).toHaveProperty('ship');
            expect(humanPlayer.gameboard.board[3][6]).toHaveProperty('ship');
            expect(humanPlayer.gameboard.board[3][7]).toHaveProperty('ship');
            expect(humanPlayer.gameboard.board[3][8]).toHaveProperty('ship');
            expect(humanPlayer.gameboard.ships.length).toBe(1);
        });

        test('should place all 5 ships', () => {
            expect(humanPlayer.manualPlaceShip(0, 0, true)).toBe(true);
            expect(humanPlayer.gameboard.board[0][0]).toHaveProperty('ship');
            expect(humanPlayer.gameboard.board[0][1]).toHaveProperty('ship');
            expect(humanPlayer.gameboard.board[0][2]).toHaveProperty('ship');
            expect(humanPlayer.gameboard.board[0][3]).toHaveProperty('ship');
            expect(humanPlayer.gameboard.board[0][4]).toHaveProperty('ship');
            expect(humanPlayer.gameboard.ships.length).toBe(1);

            expect(humanPlayer.manualPlaceShip(1, 0, true)).toBe(true);
            expect(humanPlayer.gameboard.board[1][0]).toHaveProperty('ship');
            expect(humanPlayer.gameboard.board[1][1]).toHaveProperty('ship');
            expect(humanPlayer.gameboard.board[1][2]).toHaveProperty('ship');
            expect(humanPlayer.gameboard.board[1][3]).toHaveProperty('ship');
            expect(humanPlayer.gameboard.ships.length).toBe(2);

            expect(humanPlayer.manualPlaceShip(2, 0, true)).toBe(true);
            expect(humanPlayer.gameboard.board[2][0]).toHaveProperty('ship');
            expect(humanPlayer.gameboard.board[2][1]).toHaveProperty('ship');
            expect(humanPlayer.gameboard.board[2][2]).toHaveProperty('ship');
            expect(humanPlayer.gameboard.ships.length).toBe(3);

            expect(humanPlayer.manualPlaceShip(3, 0, true)).toBe(true);
            expect(humanPlayer.gameboard.board[3][0]).toHaveProperty('ship');
            expect(humanPlayer.gameboard.board[3][1]).toHaveProperty('ship');
            expect(humanPlayer.gameboard.board[3][2]).toHaveProperty('ship');
            expect(humanPlayer.gameboard.ships.length).toBe(4);

            expect(humanPlayer.manualPlaceShip(4, 0, true)).toBe(true);
            expect(humanPlayer.gameboard.board[4][0]).toHaveProperty('ship');
            expect(humanPlayer.gameboard.board[4][1]).toHaveProperty('ship');
            expect(humanPlayer.gameboard.ships.length).toBe(5);
        });

        test('should not place more than 5 ships', () => {
            expect(humanPlayer.manualPlaceShip(0, 0, true)).toBe(true);
            expect(humanPlayer.manualPlaceShip(1, 0, true)).toBe(true);
            expect(humanPlayer.manualPlaceShip(2, 0, true)).toBe(true);
            expect(humanPlayer.manualPlaceShip(3, 0, true)).toBe(true);
            expect(humanPlayer.manualPlaceShip(4, 0, true)).toBe(true);
            expect(humanPlayer.manualPlaceShip(5, 0, true)).toBe(false);
            expect(humanPlayer.gameboard.ships.length).toBe(5);
        });
    });

    describe('random ship placement', () => {
        test('should place all ships randomly', () => {
            computerPlayer.randomPlaceAllShips();
            expect(computerPlayer.gameboard.ships.length).toBe(5);
        });

        test('should not place any ships if called again', () => {
            computerPlayer.randomPlaceAllShips();
            expect(computerPlayer.gameboard.ships.length).toBe(5);
            computerPlayer.randomPlaceAllShips();
            expect(computerPlayer.gameboard.ships.length).toBe(5);
        });
    });

    describe('manual attack', () => {
        beforeEach(() => {
            const ship = new Ship(3);
            enemyGameboard.placeShip(ship, 3, 4, true);
        });

        test('should successfully attack a coordinate', () => {
            expect(humanPlayer.manualAttack(enemyGameboard, 3, 4)).toBe(true);
        });

        test('should throw error when computer tries manual attack', () => {
            expect(() => {
                computerPlayer.manualAttack(enemyGameboard, 3, 4);
            }).toThrow('Computer players cannot make manual attacks');
        });

        test('should throw error for out-of-bounds coordinates', () => {
            expect(() => {
                humanPlayer.manualAttack(enemyGameboard, -1, 10);
            }).toThrow('Invalid attack coordinates');

            expect(() => {
                humanPlayer.manualAttack(enemyGameboard, 10, -1);
            }).toThrow('Invalid attack coordinates');
        });
    });

    describe('random attack', () => {
        beforeEach(() => {
            const ship = new Ship(3);
            enemyGameboard.placeShip(ship, 3, 4, true);
        });

        test('should successfully make a random attack', () => {
            const result = computerPlayer.randomAttack(enemyGameboard);
            expect(typeof result).toBe('boolean');

            const totalMisses = enemyGameboard.missedAttacks.length;
            const totalHits = enemyGameboard.ships.reduce((acc, ship) => acc + ship.hits, 0);

            expect(totalMisses + totalHits).toBe(1);
        });

        test('should throw error when human player tries random attack', () => {
            expect(() => {
                humanPlayer.randomAttack(enemyGameboard);
            }).toThrow('Only computer players can make random attacks');
        });

        test('should not attack same coordinate twice', () => {
            const attackedCoords = new Set();

            for (let i = 0; i < 100; i++) {
                const result = computerPlayer.randomAttack(enemyGameboard);
                expect(result === true || result === false).toBe(true);

                const lastMiss = enemyGameboard.missedAttacks.at(-1);
                if (lastMiss && !result) {
                    const key = `${lastMiss.row},${lastMiss.column}`;
                    expect(attackedCoords.has(key)).toBe(false);
                    attackedCoords.add(key);
                }
            }

            expect(computerPlayer.randomAttack(enemyGameboard)).toBeNull();
        });

        test('should return null when all coordinates are attacked', () => {
            for (let y = 0; y < 10; y++) {
                for (let x = 0; x < 10; x++) {
                    enemyGameboard.receiveAttack(x, y);
                }
            }

            const result = computerPlayer.randomAttack(enemyGameboard);
            expect(result).toBeNull();
        });
    });
});
