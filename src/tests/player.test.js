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
