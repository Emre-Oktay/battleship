import { Ship } from '../modules/ship';

describe('Ship', () => {
    let ship;

    beforeEach(() => {
        ship = new Ship(3);
    });

    test('should be initialized with the correct length', () => {
        expect(ship.length).toBe(3);
    });

    test('should initialize as not sunk', () => {
        expect(ship.isSunk()).toBe(false);
    });

    describe('hit()', () => {
        test('should update sunk status when hits equal length', () => {
            ship.hit();
            ship.hit();
            expect(ship.isSunk()).toBe(false);
            ship.hit();
            expect(ship.isSunk()).toBe(true);
        });
    });

    describe('isSunk()', () => {
        test('should return false when hits are less than length', () => {
            ship.hit();
            expect(ship.isSunk()).toBe(false);
        });

        test('should return true when hits equal length', () => {
            ship.hit();
            ship.hit();
            ship.hit();
            expect(ship.isSunk()).toBe(true);
        });

        test('should return true when hits exceed length', () => {
            ship.hit();
            ship.hit();
            ship.hit();
            ship.hit();
            expect(ship.isSunk()).toBe(true);
        });
    });

    describe('ships of different lengths', () => {
        test('small ship (length 1) should sink after one hit', () => {
            const smallShip = new Ship(1);
            smallShip.hit();
            expect(smallShip.isSunk()).toBe(true);
        });

        test('large ship (length 5) should sink after five hits', () => {
            const largeShip = new Ship(5);
            largeShip.hit();
            largeShip.hit();
            largeShip.hit();
            largeShip.hit();
            expect(largeShip.isSunk()).toBe(false);
            largeShip.hit();
            expect(largeShip.isSunk()).toBe(true);
        });
    });
});
